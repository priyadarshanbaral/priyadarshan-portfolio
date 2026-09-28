import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Terminal,
  Database,
  Layers,
  FileText,
  Mail,
  ArrowRight,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Briefcase,
  GraduationCap,
  Sparkles,
  User,
  ShieldCheck,
  Zap,
  Bot,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TiltCard } from './TiltCard';
import { useTheme } from '../context/ThemeContext';
import { usePhoto } from '../context/PhotoContext';

interface HeroProps {
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume, onOpenContact }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'code'>('profile');
  const [activeSnippet, setActiveSnippet] = useState<'express' | 'mongoose' | 'react' | 'git'>('express');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { theme } = useTheme();
  const { photoUrl } = usePhoto();

  // Cycling titles animation
  const roles = [
    'MERN Stack Developer',
    'Full Stack Web Engineer',
    'React & Node.js Specialist',
    'REST API & Database Architect',
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText.length < currentRole.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
      }, 75);
    } else if (!isDeleting && displayText.length === currentRole.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentRole.slice(0, displayText.length - 1));
      }, 40);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const codeSnippets = {
    express: {
      file: 'server/routes/api.js',
      lang: 'JavaScript / Express.js',
      code: `// RESTful CRUD API Architecture by Priyadarshan
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Issue book with date calculation & availability check
router.post('/books/:id/issue', async (req, res) => {
  try {
    const { userId } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book || !book.available) {
      return res.status(400).json({ message: 'Book is unavailable' });
    }
    
    book.available = false;
    book.issuedTo = userId;
    book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await book.save();
    
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});`,
    },
    mongoose: {
      file: 'server/db/connection.js',
      lang: 'MongoDB / Mongoose ODM',
      code: `const mongoose = require('mongoose');

// Connect to MongoDB database
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ MongoDB Connected successfully'))
.catch(err => console.error('✕ MongoDB Connection Error:', err));

const TransactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  fineAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Issued', 'Returned', 'Overdue'], default: 'Issued' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);`,
    },
    react: {
      file: 'client/src/hooks/useCartState.js',
      lang: 'React.js / Custom Hooks',
      code: `import { useState, useCallback, useMemo } from 'react';

export function useCartState(initialItems = []) {
  const [cart, setCart] = useState(initialItems);

  const addItem = useCallback((product) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const totalAmount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  }, [cart]);

  return { cart, addItem, totalAmount };
}`,
    },
    git: {
      file: 'terminal: git log --oneline -n 4',
      lang: 'Git Version Control',
      code: `* a4f8b1c (HEAD -> main) feat(library): add automated fine calculation engine
* e7c3091 fix(express): optimize MongoDB query indexes for search latency
* d2b146e feat(ecommerce): implement client-side cart persistent state
* 9081efa init: bootstrap MERN stack architecture with modular REST routes

$ git status
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean`,
    },
  };

  return (
    <section id="hero" className="relative pt-8 pb-16 md:py-20 overflow-hidden">
      {/* Background ambient subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bio & Core Pitch */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pill & Location */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-emerald-400">Immediate Joiner</span>
                <span className="text-neutral-500">•</span>
                <span>Open for Full-Stack Roles</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/60 border border-neutral-800/80 text-xs text-neutral-400">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Bhubaneswar, India</span>
              </div>
            </div>

            {/* Headline with Dynamic Typing */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-100 tracking-tight leading-tight">
                Priyadarshan Baral
              </h1>
              <div className="text-lg sm:text-2xl font-bold text-emerald-400 mt-2.5 flex items-center gap-2 min-h-[36px]">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  {displayText}
                </span>
                <span className="w-0.5 h-6 bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Quick Education & Internship Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900/70 border border-neutral-800">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>B.Tech CSE • CGPA 7.85 (6th Sem)</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900/70 border border-neutral-800">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Intern @ Evatril Pvt Ltd (Sep 2026)</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900/70 border border-neutral-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Production MERN Architecture</span>
              </div>
            </div>

            {/* Professional Summary Paragraph */}
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              Software engineer with hands-on MERN stack expertise (<span className="text-emerald-300 font-semibold">MongoDB, Express.js, React.js, Node.js</span>). Built 3 end-to-end production applications and active industry experience managing complete client-to-database lifecycles, resilient REST APIs, and responsive interfaces.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                <span>Explore Projects & Demos</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                id="btn-hero-resume"
                onClick={onOpenResume}
                className="px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-700 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>View Full Resume</span>
              </button>

              <button
                id="btn-hero-contact-trigger"
                onClick={onOpenContact}
                className="px-4 py-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                title="Send inquiry to Priyadarshan"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Get in Touch</span>
              </button>

              <button
                id="btn-hero-ai-assistant"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('open-ai-assistant', {
                      detail: { query: 'Why should we hire Priyadarshan for a MERN Stack Developer role?' },
                    })
                  )
                }
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-950/80 via-neutral-900 to-teal-950/80 hover:from-emerald-900 hover:to-teal-900 text-emerald-300 border border-emerald-500/40 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950/40"
                title="Ask AI Assistant to assess Priyadarshan"
              >
                <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Ask AI Assistant</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  Gemini
                </span>
              </button>

              <button
                id="btn-hero-copy-email"
                onClick={handleCopyEmail}
                className="px-4 py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border border-neutral-800 text-xs sm:text-sm flex items-center gap-2 transition-all font-mono cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span>{PERSONAL_INFO.email}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Metrics Bento Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-900">
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
                <div className="text-xl font-bold font-mono text-emerald-400">2</div>
                <div className="text-[11px] text-neutral-400">Engineering Internships</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
                <div className="text-xl font-bold font-mono text-cyan-400">3</div>
                <div className="text-[11px] text-neutral-400">Full-Stack Projects</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
                <div className="text-xl font-bold font-mono text-amber-400">7.85</div>
                <div className="text-[11px] text-neutral-400">B.Tech CSE CGPA</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
                <div className="text-xl font-bold font-mono text-neutral-200">Day 1</div>
                <div className="text-[11px] text-neutral-400">Ready to Deploy</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Showcase (Profile Headshot & Code Terminal) */}
          <div className="lg:col-span-5">
            {/* View Toggle Tabs */}
            <div className="flex items-center justify-between bg-neutral-900/90 border border-neutral-800 rounded-t-2xl p-2 px-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3D Profile Card</span>
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'code'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Code Architecture</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Interactive 3D
              </span>
            </div>

            {/* TAB 1: 3D Profile Headshot Card */}
            {activeTab === 'profile' ? (
              <TiltCard
                maxTilt={10}
                perspective={1200}
                className="bg-neutral-900/95 border border-t-0 border-neutral-800 rounded-b-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden group"
              >
                {/* Ambient dynamic glow aura */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                {/* Profile Image & Glowing Rings */}
                <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 mb-6">
                  {/* Outer animated gradient ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-teal-400 p-1 animate-spin duration-1000 shadow-xl shadow-emerald-500/20 opacity-80" />

                  {/* Inner frame displaying profile photo */}
                  <div className="absolute inset-1 rounded-full bg-neutral-950 p-1 overflow-hidden relative shadow-inner">
                    <img
                      src={photoUrl}
                      alt="Priyadarshan Baral - Full Stack Developer"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full shadow-inner hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Floating 3D Tech Badge: Top Right */}
                  <div className="absolute -top-1 -right-2 sm:-right-4 px-2.5 py-1 rounded-full bg-neutral-900/90 border border-emerald-500/40 text-[10px] sm:text-[11px] font-mono font-semibold text-emerald-300 shadow-lg backdrop-blur-md flex items-center gap-1.5 animate-bounce pointer-events-none">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>MERN Stack</span>
                  </div>

                  {/* Floating 3D Tech Badge: Bottom Left */}
                  <div className="absolute -bottom-1 -left-2 sm:-left-4 px-2.5 py-1 rounded-full bg-neutral-900/90 border border-cyan-500/40 text-[10px] sm:text-[11px] font-mono font-semibold text-cyan-300 shadow-lg backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Immediate Joiner</span>
                  </div>
                </div>

                {/* Profile Info Summary */}
                <div className="text-center space-y-2 relative z-10">
                  <h3 className="text-lg font-bold text-neutral-100 flex items-center justify-center gap-2">
                    <span>Priyadarshan Baral</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-normal font-mono border border-emerald-500/20">
                      Bhubaneswar
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Full-Stack Engineer specialized in React.js, Node.js, Express, MongoDB, and scalable REST microservices.
                  </p>
                </div>

                {/* Mini Tech Chips */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4 mt-4 border-t border-neutral-800">
                  {['React 19', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git', 'Tailwind'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-neutral-950/80 border border-neutral-800 text-[10px] font-mono text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card Action footer */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800 text-xs">
                  <button
                    onClick={() => setActiveTab('code')}
                    className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Inspect Code Architecture &rarr;</span>
                  </button>
                  <button
                    onClick={onOpenContact}
                    className="text-neutral-400 hover:text-neutral-200 text-[11px] cursor-pointer"
                  >
                    Quick Inquiry
                  </button>
                </div>
              </TiltCard>
            ) : (
              /* TAB 2: Interactive Code Editor Window */
              <div className="bg-neutral-900/90 border border-t-0 border-neutral-800 rounded-b-2xl overflow-hidden shadow-2xl">
                {/* Window Title Bar */}
                <div className="bg-neutral-950 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-neutral-400 ml-2 truncate">
                      {codeSnippets[activeSnippet].file}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                    {codeSnippets[activeSnippet].lang}
                  </span>
                </div>

                {/* Code Snippet Tabs */}
                <div className="flex items-center bg-neutral-950/60 px-3 pt-2 border-b border-neutral-800 gap-1 overflow-x-auto text-xs font-mono">
                  <button
                    onClick={() => setActiveSnippet('express')}
                    className={`px-3 py-1.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeSnippet === 'express'
                        ? 'bg-neutral-900 text-emerald-400 font-semibold border-t-2 border-emerald-500'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" /> Express API
                  </button>
                  <button
                    onClick={() => setActiveSnippet('mongoose')}
                    className={`px-3 py-1.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeSnippet === 'mongoose'
                        ? 'bg-neutral-900 text-cyan-400 font-semibold border-t-2 border-cyan-500'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" /> Mongoose Model
                  </button>
                  <button
                    onClick={() => setActiveSnippet('react')}
                    className={`px-3 py-1.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeSnippet === 'react'
                        ? 'bg-neutral-900 text-amber-400 font-semibold border-t-2 border-amber-500'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> React State Hook
                  </button>
                  <button
                    onClick={() => setActiveSnippet('git')}
                    className={`px-3 py-1.5 rounded-t-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeSnippet === 'git'
                        ? 'bg-neutral-900 text-purple-400 font-semibold border-t-2 border-purple-500'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" /> Git Log
                  </button>
                </div>

                {/* Code Body */}
                <div className="p-4 bg-neutral-950 font-mono text-xs overflow-x-auto text-neutral-300 leading-relaxed max-h-[350px]">
                  <pre>{codeSnippets[activeSnippet].code}</pre>
                </div>

                {/* Code Window Footer */}
                <div className="bg-neutral-950/80 px-4 py-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Production-tested code patterns</span>
                  </div>
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    github.com/priyadarshanbaral
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
