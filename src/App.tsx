import React, { useState } from 'react';
import { ThemeProvider, useTheme, THEME_CONFIGS } from './context/ThemeContext';
import { PhotoProvider } from './context/PhotoContext';
import { ThreeBackground } from './components/ThreeBackground';
import { ThreeIntro } from './components/ThreeIntro';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { CertificationsSection } from './components/CertificationsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { AIAssistant } from './components/AIAssistant';

function PortfolioApp() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { theme } = useTheme();

  React.useEffect(() => {
    const handleReplay = () => setShowIntro(true);
    window.addEventListener('replay-intro', handleReplay);
    return () => window.removeEventListener('replay-intro', handleReplay);
  }, []);

  const handleOpenResume = () => {
    setIsResumeOpen(true);
  };

  const handleCloseResume = () => {
    setIsResumeOpen(false);
  };

  const handleScrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 3D Animation Intro Screen */}
      {showIntro && (
        <ThreeIntro onEnter={() => setShowIntro(false)} />
      )}

      <div className={`min-h-screen relative flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200 transition-colors duration-500 ${THEME_CONFIGS[theme].bgClass}`}>
        {/* Interactive 3D Background */}
        <ThreeBackground />

        {/* Navigation Header */}
        <Navbar
          onOpenResume={handleOpenResume}
          onOpenContact={handleScrollToContact}
        />

        {/* Main Showcase Sections */}
        <main className="flex-1 relative z-10">
          <Hero
            onOpenResume={handleOpenResume}
            onOpenContact={handleScrollToContact}
          />

          <ProjectsSection />

          <SkillsSection />

          <ExperienceTimeline />

          <CertificationsSection />

          <ContactSection />
        </main>

        {/* Footer */}
        <Footer onReplayIntro={() => setShowIntro(true)} />

        {/* Full Digital Resume Modal */}
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={handleCloseResume}
        />

        {/* Floating Theme Switcher */}
        <aside aria-label="Quick theme selection" className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
          <ThemeSwitcher />
        </aside>

        {/* Advanced Gemini AI Assistant */}
        <AIAssistant onOpenResume={handleOpenResume} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PhotoProvider>
        <PortfolioApp />
      </PhotoProvider>
    </ThemeProvider>
  );
}
