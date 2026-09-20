import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  FileText,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ThemeSwitcher } from './ThemeSwitcher';
import { usePhoto } from '../context/PhotoContext';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { photoUrl } = usePhoto();

  const [avatarSrc, setAvatarSrc] = useState<string>(photoUrl || '/priyadarshan.jpg');
  const [avatarError, setAvatarError] = useState<boolean>(false);
  const [avatarAttempt, setAvatarAttempt] = useState<number>(0);

  useEffect(() => {
    if (photoUrl) {
      setAvatarSrc(photoUrl);
      setAvatarError(false);
      setAvatarAttempt(0);
    }
  }, [photoUrl]);

  const handleAvatarError = () => {
    setAvatarAttempt((prev) => {
      const next = prev + 1;
      if (next === 1) {
        setAvatarSrc('/priyadarshan.jpg');
      } else if (next === 2) {
        setAvatarSrc('/profile.jpg');
      } else {
        setAvatarError(true);
      }
      return next;
    });
  };

  const navLinks = [
    { name: 'Overview', href: '#hero' },
    { name: 'Projects', href: '#projects' },
    { name: 'Live Demos', href: '#simulators' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Avatar - Prominent, Uncrushable (shrink-0), Always Visible */}
          <a href="#hero" className="flex items-center gap-3 group shrink-0 py-1">
            <div className="relative shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 shadow-md shadow-emerald-950/60 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full rounded-[10px] bg-neutral-950 overflow-hidden flex items-center justify-center">
                {!avatarError ? (
                  <img
                    src={avatarSrc}
                    alt="Priyadarshan Baral"
                    referrerPolicy="no-referrer"
                    onError={handleAvatarError}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-bold text-xs font-mono">
                    PB
                  </div>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-neutral-950 shadow-sm" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm sm:text-base text-neutral-100 flex items-center gap-2">
                <span>{PERSONAL_INFO.name}</span>
                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available Now
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono truncate">MERN Stack Full Stack Dev</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-neutral-400 hover:text-neutral-100 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Switcher Button */}
            <ThemeSwitcher />

            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-neutral-800 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-neutral-800 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <button
              id="btn-nav-resume"
              onClick={onOpenResume}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Resume</span>
            </button>

            <a
              id="btn-nav-hire"
              href={`mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent('Hiring / Interview Opportunity - Full Stack Developer')}`}
              onClick={(e) => {
                onOpenContact();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Hire Me</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeSwitcher compact />
            <button
              onClick={onOpenResume}
              className="p-2 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800 text-xs flex items-center gap-1"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-neutral-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4 space-y-3">
          {/* Mobile Profile Card with Prominent Avatar */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/90 border border-neutral-800">
            <div className="relative shrink-0 w-12 h-12 rounded-xl p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 shadow-md">
              <div className="w-full h-full rounded-[10px] bg-neutral-950 overflow-hidden flex items-center justify-center">
                {!avatarError ? (
                  <img
                    src={avatarSrc}
                    alt="Priyadarshan Baral"
                    referrerPolicy="no-referrer"
                    onError={handleAvatarError}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-bold text-sm">
                    PB
                  </div>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-neutral-950" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-neutral-100 flex items-center gap-1.5 truncate">
                <span>{PERSONAL_INFO.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Available
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono truncate">
                Full Stack MERN Developer
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <a
              href={`mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent('Interview Opportunity - Priyadarshan Baral')}`}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-neutral-950 bg-emerald-400 text-center flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Get In Touch (Mail)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
