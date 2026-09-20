import React, { useState } from 'react';
import { Project } from '../types';
import { PROJECTS_DATA, PERSONAL_INFO } from '../data/portfolioData';
import {
  FolderGit2,
  ExternalLink,
  Play,
  CheckCircle2,
  Code2,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  ShoppingCart,
  Landmark,
} from 'lucide-react';
import { LibrarySim } from './simulators/LibrarySim';
import { EcommerceSim } from './simulators/EcommerceSim';
import { BankingSim } from './simulators/BankingSim';

export const ProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'MERN Stack' | 'Frontend'>('All');
  const [activeSimulator, setActiveSimulator] = useState<'library' | 'ecommerce' | 'banking'>('library');

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'MERN Stack') return p.category === 'MERN Stack';
    if (activeFilter === 'Frontend') return p.category === 'Frontend';
    return true;
  });

  const getSimIcon = (type: 'library' | 'ecommerce' | 'banking') => {
    switch (type) {
      case 'library':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'ecommerce':
        return <ShoppingCart className="w-4 h-4 text-amber-400" />;
      case 'banking':
        return <Landmark className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <section id="projects" className="py-16 md:py-24 border-t border-neutral-900 bg-neutral-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              Featured Engineering Portfolio
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-100 tracking-tight">
              Production Projects & Interactive Demos
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
              End-to-end full-stack and frontend systems built with MongoDB, Express.js, React.js, and Node.js. Test live functional behavior in the interactive sandbox below.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs self-start md:self-auto">
            {(['All', 'MERN Stack', 'Frontend'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {filteredProjects.map((project) => {
            const isSimActive = activeSimulator === project.liveSimType;
            return (
              <div
                key={project.id}
                className={`bg-neutral-900/80 border rounded-2xl p-6 flex flex-col justify-between transition-all group relative overflow-hidden ${
                  isSimActive
                    ? 'border-emerald-500/60 ring-1 ring-emerald-500/40'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full border ${
                        project.category === 'MERN Stack'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      }`}
                    >
                      {project.category}
                    </span>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub Repository"
                      className="text-neutral-400 hover:text-neutral-100 flex items-center gap-1 text-xs font-mono transition-colors"
                    >
                      GitHub Repo
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-neutral-100 group-hover:text-emerald-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {project.tagline}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 my-4">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Bullet Highlights from Resume */}
                  <div className="space-y-2 mt-4 pt-4 border-t border-neutral-800/80">
                    <div className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 font-semibold">
                      Engineering Highlights
                    </div>
                    {project.highlights.slice(0, 3).map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="leading-snug">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-6 pt-4 border-t border-neutral-800/80">
                  <button
                    id={`btn-launch-sim-${project.id}`}
                    onClick={() => {
                      setActiveSimulator(project.liveSimType);
                      const el = document.getElementById('simulators');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isSimActive
                        ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-950/50'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {isSimActive ? 'Live Simulator Active Below' : 'Launch Live Interactive Simulator'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Simulator Workspace Container */}
        <div id="simulators" className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Live In-App Interactive Sandbox
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-100">
                Interactive Project Simulator
              </h3>
              <p className="text-xs text-neutral-400">
                Interact with the live application logic, state changes, fine calculations, and database models.
              </p>
            </div>

            {/* Simulator Switcher Buttons */}
            <div className="flex items-center bg-neutral-900 p-1.5 rounded-xl border border-neutral-800 gap-1 overflow-x-auto text-xs">
              <button
                id="btn-switch-sim-library"
                onClick={() => setActiveSimulator('library')}
                className={`px-3.5 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  activeSimulator === 'library'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Library System (MERN)</span>
              </button>

              <button
                id="btn-switch-sim-ecommerce"
                onClick={() => setActiveSimulator('ecommerce')}
                className={`px-3.5 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  activeSimulator === 'ecommerce'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Online Shopping (Store)</span>
              </button>

              <button
                id="btn-switch-sim-banking"
                onClick={() => setActiveSimulator('banking')}
                className={`px-3.5 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  activeSimulator === 'banking'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>Banking Simulation</span>
              </button>
            </div>
          </div>

          {/* Active Simulator Component */}
          <div>
            {activeSimulator === 'library' && <LibrarySim />}
            {activeSimulator === 'ecommerce' && <EcommerceSim />}
            {activeSimulator === 'banking' && <BankingSim />}
          </div>
        </div>
      </div>
    </section>
  );
};
