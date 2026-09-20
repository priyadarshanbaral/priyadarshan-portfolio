import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  CheckCircle2,
  ExternalLink,
  Download,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { usePhoto } from '../context/PhotoContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { photoUrl } = usePhoto();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textResume = `PRIYADARSHAN BARAL
MERN Stack Full Stack Developer (Frontend & Backend)
Bhubaneswar, Odisha, India | 8984054385 | priyadrshanbaral@gmail.com | linkedin.com/in/priyadarshan-baral | github.com/priyadarshanbaral

PROFESSIONAL SUMMARY
Full Stack Developer with hands-on MERN stack experience (MongoDB, Express.js, React.js, Node.js) gained through a live internship and three end-to-end projects. Comfortable across the full request/response cycle — building responsive React interfaces, designing RESTful APIs in Express, and modeling data in MongoDB. Familiar with Git-based version control. Seeking a Junior/Fresher Full Stack Developer role to contribute production-ready code from day one.

SKILLS
Languages: JavaScript, HTML, CSS
Frontend: React.js, React Hooks, State Management, Responsive Web Design
Backend: Node.js, Express.js, REST APIs, CRUD Operations
Database: MongoDB, Mongoose
Tools: Git, GitHub, VS Code, Postman
Deployment: Netlify
Soft Skills: Communication, Teamwork, Problem Solving, Time Management, Adaptability

INTERNSHIP EXPERIENCE
MERN Stack Developer Intern — Vidyavistara Institute, Bhubaneswar
January 2026 – Present
● Building full-stack web applications with React.js frontends integrated to Express.js/Node.js REST APIs and MongoDB data models
● Collaborating with a team on real-world project modules using Git for version control and Agile-style task tracking
● Debugging and resolving issues across frontend, backend, and database layers to improve application reliability

PROJECTS
Library Management System | MERN Stack | GitHub Repo
● Built a full-stack library management web application with book issue/return, user management, search, and fine calculation
● Designed RESTful APIs with Node.js and Express.js for CRUD operations on books, users, and transactions
● Modeled relational data (users, books, transactions) in MongoDB using Mongoose schemas
● Built a responsive React.js frontend consuming the API for real-time state updates

Online Shopping Website | HTML, CSS, JavaScript | GitHub Repo
● Developed a responsive e-commerce interface with product browsing, cart, and a simulated checkout/payment flow
● Implemented client-side state handling for cart and order data using vanilla JavaScript

Banking Website (Front-End Simulation) | HTML, CSS, JavaScript | GitHub Repo
● Built a basic banking interface with account details display and simulated transaction flow
● Focused on clean, accessible UI and cross-device responsive design

EDUCATION
Bachelor of Technology (B.Tech), Computer Science — NM Institute of Engineering and Technology, Bhubaneswar
2023 – 2027 (Ongoing) | CGPA: 7.85 (up to 5th Semester)
12th (Science) — Godavarish Higher Secondary School, Banpur | 2021–2023 | 65%
10th — Godavarish Vidyapitha, Banpur | 2020–2021 | 73%

CERTIFICATIONS
● Web Development — Vidyavistara Institute
● Artificial Intelligence — IBM SkillsBuild
● AI Tools Workshop — be10X
● DSA & MERN Workshop — MyAnatomy

ACHIEVEMENTS
● Participated in a Hackathon, gaining hands-on experience in team-based problem solving and rapid prototyping

LANGUAGES
English (Professional), Hindi (Professional), Odia (Native)`;

    navigator.clipboard.writeText(textResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-4xl w-full my-auto shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Action Bar */}
        <div className="bg-neutral-950 px-6 py-3.5 border-b border-neutral-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-neutral-200">Official Resume Preview</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified Source
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-neutral-700"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Copied Text
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Resume
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Content Paper (Clean light paper styling for print and high contrast) */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-neutral-950 text-neutral-200 font-sans text-xs sm:text-sm space-y-6 select-text">
          {/* Header */}
          <div className="border-b border-neutral-800 pb-5 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={photoUrl}
              alt="Priyadarshan Baral"
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-md shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
                PRIYADARSHAN BARAL
              </h1>
              <div className="text-sm sm:text-base font-semibold text-emerald-400 mt-1">
                MERN Stack Full Stack Developer (Frontend & Backend)
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-neutral-400 font-mono">
                <span>Bhubaneswar, Odisha, India</span>
                <span>|</span>
                <a href="tel:8984054385" className="hover:text-emerald-300">
                  8984054385
                </a>
                <span>|</span>
                <a href="mailto:priyadrshanbaral@gmail.com" className="hover:text-emerald-300">
                  priyadrshanbaral@gmail.com
                </a>
                <span>|</span>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                className="text-cyan-400 hover:underline"
              >
                linkedin.com/in/priyadarshan-baral
              </a>
              <span>|</span>
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline"
              >
                github.com/priyadarshanbaral
              </a>
            </div>
            </div>
          </div>

          {/* Section: Professional Summary */}
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-100 border-b border-neutral-800 pb-1 mb-2 font-mono">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm">
              Full Stack Developer with hands-on MERN stack experience (MongoDB, Express.js, React.js, Node.js) gained through a live internship and three end-to-end projects. Comfortable across the full request/response cycle — building responsive React interfaces, designing RESTful APIs in Express, and modeling data in MongoDB. Familiar with Git-based version control. Seeking a Junior/Fresher Full Stack Developer role to contribute production-ready code from day one.
            </p>
          </div>

          {/* Section: Skills */}
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-100 border-b border-neutral-800 pb-1 mb-2 font-mono">
              SKILLS
            </h2>
            <div className="space-y-1.5 text-xs">
              <div>
                <strong className="text-neutral-200">Languages:</strong>{' '}
                <span className="text-neutral-300">JavaScript, HTML, CSS</span>
              </div>
              <div>
                <strong className="text-neutral-200">Frontend:</strong>{' '}
                <span className="text-neutral-300">React.js, React Hooks, State Management, Responsive Web Design</span>
              </div>
              <div>
                <strong className="text-neutral-200">Backend:</strong>{' '}
                <span className="text-neutral-300">Node.js, Express.js, REST APIs, CRUD Operations</span>
              </div>
              <div>
                <strong className="text-neutral-200">Database:</strong>{' '}
                <span className="text-neutral-300">MongoDB, Mongoose</span>
              </div>
              <div>
                <strong className="text-neutral-200">Tools:</strong>{' '}
                <span className="text-neutral-300">Git, GitHub, VS Code, Postman</span>
              </div>
              <div>
                <strong className="text-neutral-200">Deployment:</strong>{' '}
                <span className="text-neutral-300">Netlify</span>
              </div>
              <div>
                <strong className="text-neutral-200">Soft Skills:</strong>{' '}
                <span className="text-neutral-300">Communication, Teamwork, Problem Solving, Time Management, Adaptability</span>
              </div>
            </div>
          </div>

          {/* Section: Internship Experience */}
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-100 border-b border-neutral-800 pb-1 mb-2 font-mono">
              INTERNSHIP EXPERIENCE
            </h2>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <span className="font-bold text-neutral-100 text-xs sm:text-sm">
                  MERN Stack Developer Intern — Vidyavistara Institute, Bhubaneswar
                </span>
                <span className="text-xs font-mono text-neutral-400">January 2026 – Present</span>
              </div>
              <ul className="list-disc list-outside pl-4 mt-2 space-y-1 text-xs text-neutral-300">
                <li>
                  Building full-stack web applications with React.js frontends integrated to Express.js/Node.js REST APIs and MongoDB data models
                </li>
                <li>
                  Collaborating with a team on real-world project modules using Git for version control and Agile-style task tracking
                </li>
                <li>
                  Debugging and resolving issues across frontend, backend, and database layers to improve application reliability
                </li>
              </ul>
            </div>
          </div>

          {/* Section: Projects */}
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-100 border-b border-neutral-800 pb-1 mb-2 font-mono">
              PROJECTS
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <span className="font-bold text-neutral-100 text-xs sm:text-sm">
                    Library Management System | MERN Stack
                  </span>
                  <a
                    href="https://github.com/priyadarshanbaral"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:underline font-mono"
                  >
                    GitHub Repo
                  </a>
                </div>
                <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-xs text-neutral-300">
                  <li>
                    Built a full-stack library management web application with book issue/return, user management, search, and fine calculation
                  </li>
                  <li>
                    Designed RESTful APIs with Node.js and Express.js for CRUD operations on books, users, and transactions
                  </li>
                  <li>
                    Modeled relational data (users, books, transactions) in MongoDB using Mongoose schemas
                  </li>
                  <li>
                    Built a responsive React.js frontend consuming the API for real-time state updates
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <span className="font-bold text-neutral-100 text-xs sm:text-sm">
                    Online Shopping Website | HTML, CSS, JavaScript
                  </span>
                  <a
                    href="https://github.com/priyadarshanbaral"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:underline font-mono"
                  >
                    GitHub Repo
                  </a>
                </div>
                <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-xs text-neutral-300">
                  <li>
                    Developed a responsive e-commerce interface with product browsing, cart, and a simulated checkout/payment flow
                  </li>
                  <li>
                    Implemented client-side state handling for cart and order data using vanilla JavaScript
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <span className="font-bold text-neutral-100 text-xs sm:text-sm">
                    Banking Website (Front-End Simulation) | HTML, CSS, JavaScript
                  </span>
                  <a
                    href="https://github.com/priyadarshanbaral"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:underline font-mono"
                  >
                    GitHub Repo
                  </a>
                </div>
                <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-xs text-neutral-300">
                  <li>
                    Built a basic banking interface with account details display and simulated transaction flow
                  </li>
                  <li>
                    Focused on clean, accessible UI and cross-device responsive design
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section: Education */}
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-100 border-b border-neutral-800 pb-1 mb-2 font-mono">
              EDUCATION
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <span className="font-bold text-neutral-100">
                  Bachelor of Technology (B.Tech), Computer Science — NM Institute of Engineering and Technology, Bhubaneswar
                </span>
                <span className="font-mono text-neutral-400">2023 – 2027 (Ongoing) | CGPA: 7.85 (up to 5th Semester)</span>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <span className="text-neutral-300">
                  12th (Science) — Godavarish Higher Secondary School, Banpur
                </span>
                <span className="font-mono text-neutral-400">2021 – 2023 | 65%</span>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-1">
                <span className="text-neutral-300">
                  10th — Godavarish Vidyapitha, Banpur
                </span>
                <span className="font-mono text-neutral-400">2020 – 2021 | 73%</span>
              </div>
            </div>
          </div>

          {/* Section: Certifications */}
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-100 border-b border-neutral-800 pb-1 mb-2 font-mono">
              CERTIFICATIONS
            </h2>
            <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-neutral-300">
              <li>Web Development — Vidyavistara Institute</li>
              <li>Artificial Intelligence — IBM SkillsBuild</li>
              <li>AI Tools Workshop — be10X</li>
              <li>DSA & MERN Workshop — MyAnatomy</li>
            </ul>
          </div>

          {/* Section: Achievements & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-100 border-b border-neutral-800 pb-1 mb-2 font-mono">
                ACHIEVEMENTS
              </h2>
              <ul className="list-disc list-outside pl-4 text-xs text-neutral-300">
                <li>
                  Participated in a Hackathon, gaining hands-on experience in team-based problem solving and rapid prototyping
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-100 border-b border-neutral-800 pb-1 mb-2 font-mono">
                LANGUAGES
              </h2>
              <p className="text-xs text-neutral-300">
                English (Professional), Hindi (Professional), Odia (Native)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
