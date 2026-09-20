import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import {
  Code,
  Layout,
  Server,
  Database,
  Wrench,
  Cloud,
  HeartHandshake,
  Search,
  CheckCircle,
  ArrowRight,
  Cpu,
  Layers,
} from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [skillSearch, setSkillSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const getCategoryIcon = (title: string) => {
    switch (title) {
      case 'Languages':
        return <Code className="w-4 h-4 text-amber-400" />;
      case 'Frontend Development':
        return <Layout className="w-4 h-4 text-cyan-400" />;
      case 'Backend Development':
        return <Server className="w-4 h-4 text-emerald-400" />;
      case 'Databases & Modeling':
        return <Database className="w-4 h-4 text-green-400" />;
      case 'Tools & Version Control':
        return <Wrench className="w-4 h-4 text-orange-400" />;
      case 'Deployment & Hosting':
        return <Cloud className="w-4 h-4 text-sky-400" />;
      case 'Soft Skills':
        return <HeartHandshake className="w-4 h-4 text-rose-400" />;
      default:
        return <Cpu className="w-4 h-4 text-neutral-400" />;
    }
  };

  const categories = ['All', ...SKILL_CATEGORIES.map((c) => c.title)];

  const filteredCategories = SKILL_CATEGORIES.map((cat) => {
    const matchesCat = activeCategory === 'All' || cat.title === activeCategory;
    if (!matchesCat) return null;

    const filteredItems = cat.items.filter((item) =>
      item.name.toLowerCase().includes(skillSearch.toLowerCase())
    );

    if (skillSearch && filteredItems.length === 0) return null;

    return {
      ...cat,
      items: skillSearch ? filteredItems : cat.items,
    };
  }).filter(Boolean) as typeof SKILL_CATEGORIES;

  return (
    <section id="skills" className="py-16 md:py-24 border-t border-neutral-800/60 bg-neutral-950/60 backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
              <Cpu className="w-3.5 h-3.5" />
              Technical Competencies & Toolchain
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-100 tracking-tight">
              MERN Stack & Full-Stack Tooling
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
              Production skills spanning JavaScript (ES6+), React component ecosystems, Node.js REST API servers, MongoDB Mongoose data modeling, and modern Git version control.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              id="skills-search-input"
              type="text"
              placeholder="Filter skills (e.g. React, MongoDB)..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {filteredCategories.map((cat) => (
            <div
              key={cat.title}
              className="bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 rounded-xl p-5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-neutral-800/80">
                  <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    {getCategoryIcon(cat.title)}
                  </div>
                  <h3 className="font-semibold text-sm text-neutral-200">{cat.title}</h3>
                  <span className="text-[11px] font-mono text-neutral-500 ml-auto">
                    {cat.items.length} skills
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800/90 hover:border-cyan-500/40 text-xs font-medium text-neutral-300 flex items-center justify-between gap-2 transition-colors group"
                    >
                      <span className="group-hover:text-cyan-300 transition-colors">{item.name}</span>
                      {item.level && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            item.level === 'Advanced'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : item.level === 'Proficient'
                              ? 'bg-cyan-500/10 text-cyan-400'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {item.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Architectural Lifecycle Infographic */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
          <div className="max-w-3xl mb-6">
            <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Full Request/Response Lifecycle Mastery
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Priyadarshan designs clean boundaries across each tier of modern web application architecture:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/90 relative">
              <div className="text-emerald-400 font-bold mb-1 flex items-center justify-between">
                <span>01. Client-Side (React.js)</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                  Frontend
                </span>
              </div>
              <p className="text-neutral-400 text-[11px] font-sans leading-relaxed mt-2">
                Functional components, custom state hooks, responsive mobile-first Tailwind design, and clean async API consumption with error boundary resilience.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/90 relative">
              <div className="text-cyan-400 font-bold mb-1 flex items-center justify-between">
                <span>02. RESTful APIs (Node/Express)</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">
                  Middleware & Logic
                </span>
              </div>
              <p className="text-neutral-400 text-[11px] font-sans leading-relaxed mt-2">
                Modular Express routers, JSON payload validation, CORS, asynchronous error handlers, and business logic execution (e.g. overdue fine engines).
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/90 relative">
              <div className="text-amber-400 font-bold mb-1 flex items-center justify-between">
                <span>03. Persistence (MongoDB / Mongoose)</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                  Database Tier
                </span>
              </div>
              <p className="text-neutral-400 text-[11px] font-sans leading-relaxed mt-2">
                Strict Mongoose schemas, reference population, compound indexing for rapid search queries, and atomic document updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
