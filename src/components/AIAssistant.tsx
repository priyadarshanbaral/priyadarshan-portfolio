import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Minimize2,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  User,
  Zap,
  Mic,
  MicOff,
  Briefcase,
  Layers,
  GraduationCap,
  Mail,
  RefreshCw,
  Volume2,
  VolumeX,
  Code2,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePhoto } from '../context/PhotoContext';
import { PERSONAL_INFO } from '../data/portfolioData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  engine?: string;
}

const RECRUITER_PROMPTS = [
  {
    label: '🎯 Assess Candidate Fit',
    query: 'Why should we hire Priyadarshan Baral for a MERN Stack Developer role?',
  },
  {
    label: '🚀 Featured Projects',
    query: 'Tell me about the Library Management System and other projects built by Priyadarshan.',
  },
  {
    label: '🏢 Internship Experience',
    query: 'What did Priyadarshan accomplish during his MERN Stack internship at Vidyavistara Institute?',
  },
  {
    label: '🧠 Tech Interview Questions',
    query: 'Generate 4 technical interview questions based on Priyadarshan’s MERN skills.',
  },
  {
    label: '⚡ Immediate Availability',
    query: 'What is his notice period, location preference, and how can we contact him?',
  },
];

export const AIAssistant: React.FC<{ onOpenResume?: () => void }> = ({ onOpenResume }) => {
  const { photoUrl } = usePhoto();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechActiveId, setSpeechActiveId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(1);
  const [hasOpenedOnce, setHasOpenedOnce] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `👋 Greetings! I am Priyadarshan's **Advanced AI Career Concierge**, powered by Google **Gemini**.\n\nPriyadarshan is an **Immediate Joiner** specializing in the **MERN Stack** (React.js, Node.js, Express.js, MongoDB) with live full-stack projects and internship experience.\n\nHow can I help you evaluate his profile today? You can select a quick prompt below or type any technical question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Why should we hire him?',
        'Tell me about his projects',
        'What is his internship experience?',
        'Is he available immediately?',
      ],
      engine: 'Gemini Intelligence',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  // Listen for global custom events to open AI assistant from any component
  useEffect(() => {
    const handleCustomOpen = (e: any) => {
      setIsOpen(true);
      setIsMinimized(false);
      setUnreadCount(0);
      setHasOpenedOnce(true);
      if (e.detail?.query) {
        handleSendMessage(e.detail.query);
      }
    };

    window.addEventListener('open-ai-assistant' as any, handleCustomOpen);
    return () => {
      window.removeEventListener('open-ai-assistant' as any, handleCustomOpen);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    setHasOpenedOnce(true);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    // Stop ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeechActiveId(null);
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.id !== 'welcome-1')
        .slice(-6)
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          text: m.text,
        }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || "I'm ready to answer any questions regarding Priyadarshan's engineering projects, skills, or availability.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions && data.suggestions.length > 0 ? data.suggestions : undefined,
        engine: data.engine ? (data.engine.includes('flash') ? 'Gemini 3.8 Flash' : 'Candidate Knowledge Engine') : 'Gemini AI',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('[AI Assistant Error]', err);
      const fallbackMsg: Message = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        text: `### Priyadarshan Baral — Quick Profile Summary\n\n• **Core Stack:** React.js, Node.js, Express.js, MongoDB, JavaScript ES6+, Tailwind CSS.\n• **Immediate Joiner:** Actively available with **zero notice period** for junior/fresher Full Stack roles.\n• **Internship:** MERN Stack Developer Intern at Vidyavistara Institute.\n• **Direct Contact:** [priyadrshanbaral@gmail.com](mailto:priyadrshanbaral@gmail.com) | +91 89840 54385.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Show me his projects', 'What is his education?', 'Schedule an interview'],
        engine: 'Offline Knowledge Engine',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeechActiveId(null);
    }
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: `Conversation reset. I am ready to answer any questions about Priyadarshan's technical architecture, projects, internship, or interview availability.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'What are his key skills?',
          'Tell me about his projects',
          'Is he available immediately?',
          'Contact Priyadarshan',
        ],
        engine: 'Gemini Intelligence',
      },
    ]);
  };

  // Text-To-Speech Reader
  const toggleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (speechActiveId === id) {
      window.speechSynthesis.cancel();
      setSpeechActiveId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown formatting before speaking
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/###/g, '')
      .replace(/•/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/`{1,3}.*?`{1,3}/g, 'code block');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeechActiveId(null);
    utterance.onerror = () => setSpeechActiveId(null);

    setSpeechActiveId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Dictation
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice dictation is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition failed to initialize:', e);
      setIsListening(false);
    }
  };

  const handleAction = (type: string) => {
    if (type === 'projects') {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'skills') {
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'experience') {
      document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'resume' && onOpenResume) {
      onOpenResume();
    }
  };

  // Helper to render markdown bold, bullet points, headers, and code snippets
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Headers (e.g. ### Header)
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="font-bold text-emerald-300 text-xs mt-2 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{trimmed.replace(/^###\s*/, '')}</span>
          </h4>
        );
      }

      // Bullet points
      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('*') || trimmed.startsWith('-');
      const formattedLine = trimmed.replace(/^[•*-]\s*/, '');

      // Parse bold segments
      const parts = (isBullet ? formattedLine : line).split(/(\*\*.*?\*\*)/g);

      return (
        <p
          key={idx}
          className={`${
            isBullet
              ? 'flex items-start gap-1.5 ml-1 mt-1 text-neutral-300'
              : 'mt-1 text-neutral-200'
          } leading-relaxed`}
        >
          {isBullet && <span className="text-emerald-400 mt-0.5 font-bold shrink-0">•</span>}
          <span>
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-semibold text-emerald-300">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.includes('mailto:')) {
                return (
                  <a
                    key={pIdx}
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 font-medium"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                );
              }
              return part;
            })}
          </span>
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Trigger in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900/90 border border-emerald-500/30 backdrop-blur-md shadow-2xl cursor-pointer hover:border-emerald-400/60 transition-all group"
            onClick={handleOpen}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-medium text-neutral-200 group-hover:text-emerald-300 transition-colors">
              Ask AI about Priyadarshan
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Gemini
            </span>
          </motion.div>
        )}

        <motion.button
          id="btn-ai-assistant-toggle"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              handleOpen();
            }
          }}
          aria-label="Toggle Advanced AI Assistant"
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all border border-emerald-300/40 cursor-pointer"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-neutral-950" />
          ) : (
            <>
              <Bot className="w-7 h-7 text-neutral-950 transition-transform group-hover:rotate-12" />
              {unreadCount > 0 && !hasOpenedOnce && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 font-bold text-[10px] flex items-center justify-center shadow-md animate-bounce">
                  1
                </span>
              )}
            </>
          )}

          {/* Pulsing halo ring */}
          <span className="absolute inset-0 rounded-2xl border border-emerald-400/50 animate-beacon-ping pointer-events-none" />
        </motion.button>
      </div>

      {/* Assistant Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? '70px' : '640px',
            }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[440px] max-w-[460px] bg-neutral-950/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px 2px rgba(16, 185, 129, 0.2)',
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-neutral-900/95 via-neutral-900 to-neutral-900/95 border-b border-neutral-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={photoUrl}
                    alt={PERSONAL_INFO.name}
                    className="w-9 h-9 rounded-xl object-cover object-top border border-emerald-500/50"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-neutral-950 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-neutral-100 flex items-center gap-1">
                      Priyadarshan AI
                      <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                    </h3>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 font-mono border border-emerald-500/30">
                      Gemini 3.8
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Immediate Joiner • Ready to code
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear Chat History"
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/70 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/70 transition-colors"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            {!isMinimized && (
              <>
                {/* Fast Action / Navigation Bar */}
                <div className="px-3 py-1.5 bg-neutral-900/60 border-b border-neutral-800/60 flex items-center justify-between gap-1 text-[10px] text-neutral-400 overflow-x-auto scrollbar-none">
                  <span className="shrink-0 text-neutral-500 font-mono">Jump:</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAction('projects')}
                      className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Briefcase className="w-2.5 h-2.5 text-emerald-400" />
                      Projects
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction('skills')}
                      className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Layers className="w-2.5 h-2.5 text-cyan-400" />
                      Skills
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction('experience')}
                      className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Terminal className="w-2.5 h-2.5 text-indigo-400" />
                      Experience
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction('contact')}
                      className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Mail className="w-2.5 h-2.5 text-amber-400" />
                      Contact
                    </button>
                    {onOpenResume && (
                      <button
                        type="button"
                        onClick={() => handleAction('resume')}
                        className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <GraduationCap className="w-2.5 h-2.5 text-purple-400" />
                        Resume
                      </button>
                    )}
                  </div>
                </div>

                {/* Recruiter Quick Filter Chips */}
                <div className="px-3 py-1.5 bg-neutral-950 border-b border-neutral-800/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {RECRUITER_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(p.query)}
                      className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-emerald-950/60 text-neutral-300 hover:text-emerald-300 border border-neutral-800 hover:border-emerald-500/40 transition-all shrink-0 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs scrollbar-thin scrollbar-thumb-neutral-800">
                  {messages.map((m) => {
                    const isAssistant = m.role === 'assistant';
                    const isSpeaking = speechActiveId === m.id;

                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                      >
                        {isAssistant && (
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}

                        <div className="max-w-[85%] space-y-1.5">
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              isAssistant
                                ? 'bg-neutral-900/90 border border-neutral-800 text-neutral-200 rounded-tl-sm'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-tr-sm shadow-md'
                            }`}
                          >
                            {isAssistant ? renderFormattedText(m.text) : <p>{m.text}</p>}

                            {/* Assistant message footer actions */}
                            {isAssistant && (
                              <div className="pt-2 mt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500">
                                <span className="flex items-center gap-1 font-mono">
                                  <Zap className="w-2.5 h-2.5 text-emerald-400" />
                                  {m.engine || 'Gemini 3.8'}
                                </span>
                                <div className="flex items-center gap-2">
                                  {/* Speech reader button */}
                                  <button
                                    type="button"
                                    onClick={() => toggleSpeech(m.id, m.text)}
                                    className={`transition-colors flex items-center gap-1 ${
                                      isSpeaking ? 'text-emerald-400 font-bold' : 'hover:text-neutral-300'
                                    }`}
                                    title={isSpeaking ? 'Stop reading' : 'Read aloud with AI voice'}
                                  >
                                    {isSpeaking ? (
                                      <>
                                        <VolumeX className="w-3 h-3 text-emerald-400 animate-pulse" />
                                        <span>Stop</span>
                                      </>
                                    ) : (
                                      <>
                                        <Volume2 className="w-3 h-3" />
                                        <span>Speak</span>
                                      </>
                                    )}
                                  </button>

                                  {/* Copy button */}
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(m.id, m.text)}
                                    className="hover:text-neutral-300 transition-colors flex items-center gap-1"
                                    title="Copy text"
                                  >
                                    {copiedId === m.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-emerald-400">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy</span>
                                      </>
                                    )}
                                  </button>
                                  <span>{m.timestamp}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Quick suggestions if attached to this assistant message */}
                          {isAssistant && m.suggestions && m.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {m.suggestions.map((suggestion, sIdx) => (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => handleSendMessage(suggestion)}
                                  className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 border border-neutral-800 hover:border-emerald-500/40 transition-all flex items-center gap-1 text-left cursor-pointer"
                                >
                                  <span>{suggestion}</span>
                                  <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {!isAssistant && (
                          <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Loading indicator */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2.5 justify-start items-center"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="px-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                        <span>Priyadarshan AI is analyzing candidate data...</span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-neutral-900/80 border-t border-neutral-800 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="relative flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about MERN skills, projects, notice period..."
                        disabled={loading}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500/80 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none pr-9 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleVoiceInput}
                        title={isListening ? 'Listening...' : 'Voice dictation'}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors cursor-pointer ${
                          isListening ? 'text-rose-400 animate-pulse' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || loading}
                      className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-600 flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <p className="text-[10px] text-neutral-500 text-center mt-2 flex items-center justify-center gap-1 font-mono">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                    Gemini-powered recruiter intelligence • Immediate candidate evaluation
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
