import React from 'react';
import { CERTIFICATIONS, PERSONAL_INFO } from '../data/portfolioData';
import { Award, CheckCircle2, Globe2, Sparkles, ShieldCheck } from 'lucide-react';

export const CertificationsSection: React.FC = () => {
  return (
    <section id="certifications" className="py-16 md:py-24 border-t border-neutral-800/60 bg-neutral-950/60 backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Certifications */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
                <Award className="w-3.5 h-3.5" />
                Industry Credentials
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
                Verified Certifications & Workshops
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Continuous professional growth across Full-Stack Web Development, Data Structures, and Applied AI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-neutral-900/60 border border-neutral-800/80 hover:border-emerald-500/40 rounded-xl p-5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                        {cert.badgeType}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>

                    <h3 className="text-base font-bold text-neutral-100 leading-snug">
                      {cert.title}
                    </h3>
                    <div className="text-xs font-semibold text-emerald-400 mt-1">
                      {cert.issuer}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {cert.skillsCovered.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Spoken Languages & Recruiter Pitch */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
                <Globe2 className="w-3.5 h-3.5" />
                Communication
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
                Languages Spoken
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Effective cross-cultural & collaborative team communication.
              </p>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-3">
              {PERSONAL_INFO.languages.map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-neutral-800/80"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-sm font-semibold text-neutral-200">{lang.name}</span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Candidate Value Box */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/30 space-y-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Candidate Value Proposition
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Priyadarshan brings hands-on full-stack development capability, an active internship, verified AI tooling credentials, and disciplined Git practices. Ready to onboard smoothly and start writing production code immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
