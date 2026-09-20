import React, { useState } from 'react';
import { Book, TransactionRecord } from '../../types';
import { INITIAL_BOOKS } from '../../data/portfolioData';
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Calendar,
  User,
  PlusCircle,
  Code2,
  Coins,
  ShieldCheck,
} from 'lucide-react';

export const LibrarySim: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<Book | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'transactions' | 'schema'>('catalog');
  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    {
      id: 'TXN-L1',
      bookTitle: 'MongoDB: The Definitive Guide',
      userName: 'Rohan Sharma (Roll: CS23-041)',
      issueDate: '2026-03-01',
      dueDate: '2026-03-15',
      fineAmount: 20,
      status: 'Issued',
    },
    {
      id: 'TXN-L2',
      bookTitle: "You Don't Know JS Yet: Scope & Closures",
      userName: 'Ananya Mishra (Roll: CS23-019)',
      issueDate: '2026-02-10',
      dueDate: '2026-02-24',
      fineAmount: 115, // 23 days * 5
      status: 'Overdue',
    },
  ]);
  const [notification, setNotification] = useState<string | null>(null);

  const categories = ['All', 'Computer Science', 'Databases', 'Software Engineering', 'JavaScript', 'Web Backend', 'Systems Architecture'];

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForIssue || !studentName.trim() || !studentRoll.trim()) return;

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14);

    const issueDateStr = today.toISOString().split('T')[0];
    const dueDateStr = dueDate.toISOString().split('T')[0];
    const borrower = `${studentName.trim()} (Roll: ${studentRoll.trim()})`;

    setBooks((prev) =>
      prev.map((b) =>
        b.id === selectedBookForIssue.id
          ? {
              ...b,
              available: false,
              issuedTo: borrower,
              issuedDate: issueDateStr,
              dueDate: dueDateStr,
            }
          : b
      )
    );

    const newTxn: TransactionRecord = {
      id: `TXN-L${Date.now().toString().slice(-4)}`,
      bookTitle: selectedBookForIssue.title,
      userName: borrower,
      issueDate: issueDateStr,
      dueDate: dueDateStr,
      fineAmount: 0,
      status: 'Issued',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(`Success! "${selectedBookForIssue.title}" issued to ${studentName}. Due in 14 days.`);
    setSelectedBookForIssue(null);
    setStudentName('');
    setStudentRoll('');
  };

  const handleReturnBook = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    // calculate simulated fine (if overdue)
    let fine = 0;
    if (book.dueDate) {
      const due = new Date(book.dueDate);
      const now = new Date('2026-03-19');
      const diffTime = now.getTime() - due.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        fine = diffDays * 5; // 5 rupees per day
      }
    }

    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? {
              ...b,
              available: true,
              issuedTo: undefined,
              issuedDate: undefined,
              dueDate: undefined,
            }
          : b
      )
    );

    setTransactions((prev) => [
      {
        id: `TXN-R${Date.now().toString().slice(-4)}`,
        bookTitle: book.title,
        userName: book.issuedTo || 'Patron',
        issueDate: book.issuedDate || '2026-03-01',
        dueDate: book.dueDate || '2026-03-15',
        returnDate: '2026-03-19',
        fineAmount: fine,
        status: 'Returned',
      },
      ...prev,
    ]);

    if (fine > 0) {
      showToast(`Book returned! Overdue fine calculated: ₹${fine} (₹5/day). Marked as returned.`);
    } else {
      showToast(`Book "${book.title}" returned successfully with ₹0 fine! Available in inventory.`);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Simulator Top Header */}
      <div className="bg-neutral-950/80 px-6 py-4 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              Library Management System (MERN Stack)
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                Interactive Sandbox
              </span>
            </h4>
            <p className="text-xs text-neutral-400">
              Simulating book issue/return, borrower management, and fine calculation engine.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
          <button
            id="tab-library-catalog"
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Book Catalog ({books.filter((b) => b.available).length} Available)
          </button>
          <button
            id="tab-library-txns"
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Audit Log & Fines
          </button>
          <button
            id="tab-library-schema"
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Mongoose Schema & API
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-950/90 border-b border-emerald-700/50 px-6 py-2.5 text-xs text-emerald-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-emerald-200">
            ✕
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="library-search-input"
                  type="text"
                  placeholder="Search books by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <select
                  id="library-category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {book.category}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          book.available
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {book.available ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Available
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Issued
                          </>
                        )}
                      </span>
                    </div>

                    <h5 className="font-semibold text-neutral-100 text-sm leading-snug line-clamp-2">
                      {book.title}
                    </h5>
                    <p className="text-xs text-neutral-400 mt-1">by {book.author}</p>
                    <p className="text-[11px] font-mono text-neutral-500 mt-1">ISBN: {book.isbn}</p>

                    {!book.available && (
                      <div className="mt-3 p-2 rounded bg-neutral-900 border border-neutral-800/80 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-neutral-300">
                          <span className="text-neutral-400">Issued to:</span>
                          <span className="font-medium truncate max-w-[150px]">{book.issuedTo}</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-400">
                          <span>Due date:</span>
                          <span className="font-mono text-amber-400 font-medium">{book.dueDate}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-end gap-2">
                    {book.available ? (
                      <button
                        id={`btn-issue-${book.id}`}
                        onClick={() => setSelectedBookForIssue(book)}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Issue to Student
                      </button>
                    ) : (
                      <button
                        id={`btn-return-${book.id}`}
                        onClick={() => handleReturnBook(book.id)}
                        className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                        Process Return & Calculate Fine
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Issue Book Modal Dialog */}
            {selectedBookForIssue && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full p-6 shadow-2xl animate-scaleUp">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <h4 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      Issue Book: {selectedBookForIssue.title}
                    </h4>
                    <button
                      onClick={() => setSelectedBookForIssue(null)}
                      className="text-neutral-400 hover:text-neutral-200 text-lg leading-none"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleIssueBook} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Student Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Soumya Ranjan"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Student Roll / ID Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. NMIET-CS-2024-058"
                        value={studentRoll}
                        onChange={(e) => setStudentRoll(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-xs space-y-1 text-neutral-400">
                      <div className="flex justify-between">
                        <span>Lending Period:</span>
                        <span className="text-neutral-200 font-medium">14 Days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Late Fee Policy:</span>
                        <span className="text-amber-400 font-medium">₹5.00 / day overdue</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBookForIssue(null)}
                        className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Issue Record
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audit Log & Fines Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400">
                Live transactional records modeling Mongoose relationships between Users, Books, and Transactions.
              </p>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                {transactions.length} Total Records
              </span>
            </div>

            <div className="overflow-x-auto border border-neutral-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-mono border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Txn ID</th>
                    <th className="py-3 px-4">Book Title</th>
                    <th className="py-3 px-4">Borrower</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Fine (₹5/day)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40 font-mono">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-900/50">
                      <td className="py-3 px-4 text-neutral-400">{t.id}</td>
                      <td className="py-3 px-4 text-neutral-200 font-sans font-medium">{t.bookTitle}</td>
                      <td className="py-3 px-4 text-neutral-300 font-sans">{t.userName}</td>
                      <td className="py-3 px-4 text-neutral-400">{t.issueDate}</td>
                      <td className="py-3 px-4 text-neutral-400">{t.dueDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium ${
                            t.status === 'Issued'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              : t.status === 'Overdue'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {t.fineAmount > 0 ? (
                          <span className="text-amber-400 font-semibold flex items-center justify-end gap-1">
                            <Coins className="w-3 h-3 text-amber-400" /> ₹{t.fineAmount}
                          </span>
                        ) : (
                          <span className="text-neutral-500">₹0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mongoose Schema & API Tab */}
        {activeTab === 'schema' && (
          <div className="space-y-4 text-xs font-mono">
            {/* MongoDB Connection snippet */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-semibold">MongoDB Database:</span>
                <code className="text-neutral-200 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  library_management_db
                </code>
              </div>
              <span className="text-neutral-500 text-[11px]">mongoose.connect(process.env.MONGO_URI)</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
                  <span className="text-emerald-400 font-semibold">models/Book.js (Mongoose Schema)</span>
                  <span className="text-neutral-500">Data Modeling</span>
                </div>
                <pre className="text-neutral-300 overflow-x-auto leading-relaxed">
{`const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  available: { type: Boolean, default: true },
  issuedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  issuedDate: { type: Date },
  dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);`}
                </pre>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
                  <span className="text-cyan-400 font-semibold">routes/transactions.js (Express Controller)</span>
                  <span className="text-neutral-500">REST API</span>
                </div>
                <pre className="text-neutral-300 overflow-x-auto leading-relaxed">
{`// POST /api/transactions/issue
router.post('/issue', async (req, res) => {
  const { bookId, userId } = req.body;
  const book = await Book.findById(bookId);
  if (!book.available) {
    return res.status(400).json({ error: 'Book already issued' });
  }
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  book.available = false;
  book.issuedTo = userId;
  book.dueDate = dueDate;
  await book.save();

  const txn = await Transaction.create({
    book: bookId,
    user: userId,
    dueDate
  });
  res.status(201).json({ success: true, txn });
});`}
                </pre>
              </div>
            </div>

            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg flex items-center justify-between text-neutral-400 font-sans">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                RESTful CRUD endpoints: GET /api/books, POST /api/books, PUT /api/books/:id, POST /api/transactions/return
              </span>
              <a
                href="https://github.com/priyadarshanbaral"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline text-xs"
              >
                View full repository on GitHub →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
