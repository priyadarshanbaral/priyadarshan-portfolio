import React from 'react';
import { EXPERIENCES, EDUCATION_LIST, ACHIEVEMENTS } from '../data/portfolioData';
import {
  Briefcase,
  GraduationCap,
  Trophy,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
  GitBranch,
  Award,
} from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-16 md:py-24 border-t border-neutral-900 bg-neutral-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Internship Experience */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
                <Briefcase className="w-3.5 h-3.5" />
                Industry Experience
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
                Live Internship & Practical Work
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Collaborating in engineering teams, resolving full-stack issues, and shipping production-ready web modules.
              </p>
            </div>

            <div className="space-y-6">
              {EXPERIENCES.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden shadow-xl hover:border-emerald-500/40 transition-all"
                >
                  {/* Active Indicator Top Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
                        Active Role (Current)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 bg-neutral-950 px-3 py-1 rounded-full border border-neutral-800">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      {exp.period}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-100">{exp.role}</h3>
                  <div className="text-sm font-semibold text-emerald-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>{exp.company}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-400 text-xs flex items-center gap-1 font-normal">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      {exp.location}
                    </span>
                  </div>

                  {/* Bullet points from Resume */}
                  <div className="mt-5 space-y-3">
                    {exp.description.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills tags */}
                  <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-neutral-500 mr-1">Stack Applied:</span>
                    {exp.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Hackathon Achievement Card */}
              <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-amber-400 font-semibold uppercase">
                    Competitive Achievement
                  </div>
                  <h4 className="text-base font-bold text-neutral-100 mt-0.5">
                    {ACHIEVEMENTS[0].title}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                    {ACHIEVEMENTS[0].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Academic Education Timeline */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
                <GraduationCap className="w-3.5 h-3.5" />
                Academic Background
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
                Formal Education
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Computer Science foundation in algorithms, databases, system design, and software engineering.
              </p>
            </div>

            <div className="space-y-4">
              {EDUCATION_LIST.map((edu, idx) => (
                <div
                  key={edu.id}
                  className={`bg-neutral-900/70 border rounded-xl p-5 transition-all ${
                    edu.current
                      ? 'border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      {edu.period}
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                        edu.current
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {edu.score}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-neutral-100 leading-snug">
                    {edu.degree}
                  </h4>
                  <div className="text-xs font-medium text-neutral-300 mt-1">
                    {edu.institution}
                  </div>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {edu.location}
                  </div>
                </div>
              ))}

              {/* College Highlights Card */}
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 text-xs text-neutral-400 space-y-2">
                <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-cyan-400" />
                  Academic Excellence Summary
                </div>
                <p className="leading-relaxed">
                  Consistent academic track record with strong focus on Data Structures & Algorithms, Object-Oriented Design, Operating Systems, Database Management Systems, and Web Technologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
