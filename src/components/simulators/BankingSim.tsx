import React, { useState } from 'react';
import { BankTransaction } from '../../types';
import { INITIAL_BANK_TRANSACTIONS } from '../../data/portfolioData';
import {
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  CreditCard,
  History,
  Download,
} from 'lucide-react';

export const BankingSim: React.FC = () => {
  const [balance, setBalance] = useState<number>(48500);
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<BankTransaction[]>(INITIAL_BANK_TRANSACTIONS);
  const [recipientAccount, setRecipientAccount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [ifscCode, setIfscCode] = useState('SBIN0001234');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCategory, setTransferCategory] = useState('Project Fee');
  const [cardLocked, setCardLocked] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(transferAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid transfer amount.');
      return;
    }

    if (amountNum > balance) {
      showToast('Transaction Failed: Insufficient account balance.');
      return;
    }

    if (cardLocked) {
      showToast('Transaction Declined: Your card & digital transactions are currently FROZEN.');
      return;
    }

    // Execute simulated debit
    setBalance((prev) => prev - amountNum);

    const newTxn: BankTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: '2026-03-19',
      description: `Transfer to ${recipientName || 'Beneficiary'}`,
      amount: amountNum,
      type: 'debit',
      category: transferCategory,
      recipient: recipientAccount,
    };

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(`Success: ₹${amountNum.toLocaleString('en-IN')} transferred to ${recipientName}.`);
    setRecipientAccount('');
    setRecipientName('');
    setTransferAmount('');
    setShowTransferModal(false);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'credit') return t.type === 'credit';
    if (filterType === 'debit') return t.type === 'debit';
    return true;
  });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="bg-neutral-950/80 px-6 py-4 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              Banking Website (Front-End Simulation)
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                Interactive Sandbox
              </span>
            </h4>
            <p className="text-xs text-neutral-400">
              Clean, accessible simulated retail banking dashboard with fund transfers and security controls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-open-transfer"
            onClick={() => setShowTransferModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Quick Transfer
          </button>
        </div>
      </div>

      {/* Toast */}
      {feedback && (
        <div className="bg-cyan-950/90 border-b border-cyan-700/50 px-6 py-2.5 text-xs text-cyan-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-cyan-400 hover:text-cyan-200">
            ✕
          </button>
        </div>
      )}

      {/* Main Layout: Account Card & Quick Actions */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Account Balance Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Simulated Savings Account
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-neutral-400 hover:text-neutral-200 text-xs flex items-center gap-1"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showBalance ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="mt-3">
              <div className="text-xs text-neutral-400">Available Total Balance</div>
              <div className="text-3xl font-bold font-mono text-neutral-100 mt-1 flex items-baseline gap-2">
                {showBalance ? (
                  <>₹{balance.toLocaleString('en-IN')}</>
                ) : (
                  <span className="text-neutral-500 font-normal tracking-widest">••••••••</span>
                )}
                <span className="text-xs font-normal text-emerald-400 font-sans">Active & Verified</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
              <div className="font-mono">
                A/C: <span className="text-neutral-200">9876 •••• •••• 4321</span>
              </div>
              <div className="font-mono">
                IFSC: <span className="text-neutral-200">NMIET000785</span>
              </div>
              <div>
                Branch: <span className="text-neutral-200">Bhubaneswar Tech Hub</span>
              </div>
            </div>
          </div>

          {/* Virtual Card & Security Controls */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-cyan-400" /> Platinum Debit
                </span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    cardLocked
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {cardLocked ? 'Card Frozen' : 'Active'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono space-y-1">
                <div className="text-neutral-400">Cardholder: PRIYADARSHAN BARAL</div>
                <div className="text-neutral-200 font-semibold tracking-wider">4532 •••• •••• 8912</div>
                <div className="text-[11px] text-neutral-400">Exp: 08/29 | CVV: •••</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-900">
              <button
                id="btn-toggle-card-lock"
                onClick={() => {
                  setCardLocked(!cardLocked);
                  showToast(
                    cardLocked
                      ? 'Debit card unlocked! Digital transactions resumed.'
                      : 'Security Alert: Debit card frozen for protection.'
                  );
                }}
                className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  cardLocked
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-rose-300 border border-neutral-700'
                }`}
              >
                {cardLocked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" /> Unlock Card
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-rose-400" /> Freeze / Lock Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Ledger */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h5 className="font-semibold text-sm text-neutral-200 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Simulated Transaction History
            </h5>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded font-medium ${
                    filterType === 'all'
                      ? 'bg-neutral-800 text-neutral-100'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  All ({transactions.length})
                </button>
                <button
                  onClick={() => setFilterType('credit')}
                  className={`px-2.5 py-1 rounded font-medium ${
                    filterType === 'credit'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Credits
                </button>
                <button
                  onClick={() => setFilterType('debit')}
                  className={`px-2.5 py-1 rounded font-medium ${
                    filterType === 'debit'
                      ? 'bg-rose-950 text-rose-300 border border-rose-700/50'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Debits
                </button>
              </div>

              <button
                onClick={() => showToast('Simulated e-statement downloaded as PDF.')}
                className="p-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs flex items-center gap-1"
                title="Download e-Statement"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/60 text-neutral-400 uppercase tracking-wider font-mono border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 font-mono">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4 text-neutral-400">{tx.id}</td>
                    <td className="py-3 px-4 text-neutral-400">{tx.date}</td>
                    <td className="py-3 px-4 text-neutral-200 font-sans font-medium flex items-center gap-2">
                      {tx.type === 'credit' ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-400 shrink-0">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span>{tx.description}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 font-sans">
                        {tx.category}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-bold ${
                        tx.type === 'credit' ? 'text-emerald-400' : 'text-neutral-200'
                      }`}
                    >
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transfer Simulation Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h4 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                Simulate Money Transfer
              </h4>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-neutral-400 hover:text-neutral-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendMoney} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Beneficiary Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Beneficiary Account Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5010023456789"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 font-mono text-neutral-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 font-mono text-neutral-200 uppercase focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Transfer Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 2500"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 font-mono text-neutral-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] text-neutral-400">
                <span>Current Account Balance: </span>
                <span className="text-cyan-400 font-mono font-semibold">
                  ₹{balance.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-lg text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
