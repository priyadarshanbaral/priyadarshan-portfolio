import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, Phone, Heart, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { usePhoto } from '../context/PhotoContext';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const { photoUrl } = usePhoto();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-800/60 bg-neutral-950/70 backdrop-blur-[2px] py-12 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-900">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <img
              src={photoUrl}
              alt="Priyadarshan Baral"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-sm"
            />
            <div>
              <div className="font-bold text-neutral-200">{PERSONAL_INFO.name}</div>
              <div className="text-[11px] text-neutral-500 font-mono">
                {PERSONAL_INFO.title} • Bhubaneswar, Odisha
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>3D Intro</span>
              </button>
            )}
            <a href="#hero" className="hover:text-neutral-200 transition-colors">
              Overview
            </a>
            <a href="#projects" className="hover:text-neutral-200 transition-colors">
              Projects
            </a>
            <a href="#simulators" className="hover:text-neutral-200 transition-colors">
              Live Simulators
            </a>
            <a href="#skills" className="hover:text-neutral-200 transition-colors">
              Skills
            </a>
            <a href="#experience" className="hover:text-neutral-200 transition-colors">
              Experience
            </a>
            <a href="#certifications" className="hover:text-neutral-200 transition-colors">
              Certifications
            </a>
            <a href="#contact" className="hover:text-neutral-200 transition-colors">
              Contact
            </a>
          </div>

          {/* Social & Back to Top */}
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent('Hiring Inquiry - Full Stack Developer')}`}
              aria-label="Send direct email"
              className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
              title={`Mail ${PERSONAL_INFO.email}`}
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 flex items-center gap-1 text-xs"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Priyadarshan Baral. Built with React, TypeScript & Tailwind CSS.
          </div>
          <div className="flex items-center gap-1 font-mono">
            <span>priyadarshan-s-showcase</span>
            <span>•</span>
            <span className="text-emerald-400">Ready for Production Roles</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
