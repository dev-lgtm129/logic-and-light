import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hero } from './components/Hero';
import { AsciiBackground } from './components/AsciiBackground';
import { CtaButtons } from './components/CtaButtons';
import { RetroSplitFlap } from './components/RetroSplitFlap';
import { PageTransition, TransitionInfo } from './components/PageTransition';
import { PhotographyPage } from './pages/PhotographyPage';
import { CodingPage } from './pages/CodingPage';
import { ArrowLeft } from '@/components/animate-ui/icons/arrow-left';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'photography' | 'coding'>('home');
  const [transitionInfo, setTransitionInfo] = useState<TransitionInfo | null>(null);

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetPage: 'photography' | 'coding',
    isWhite: boolean
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTransitionInfo({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      targetPage,
      color: isWhite ? 'white' : 'dark',
    });
  };

  const handleMidpoint = () => {
    if (transitionInfo) {
      setCurrentPage(transitionInfo.targetPage);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  const handleTransitionComplete = () => {
    setTransitionInfo(null);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white relative selection:bg-white selection:text-black">
      
      {/* Button Wipe Screen Transition (Stage 1) */}
      <PageTransition
        transitionInfo={transitionInfo}
        onMidpoint={handleMidpoint}
        onTransitionComplete={handleTransitionComplete}
      />

      {currentPage === 'photography' ? (
        <PhotographyPage onBackToHome={handleBackToHome} />
      ) : currentPage === 'coding' ? (
        <CodingPage onBackToHome={handleBackToHome} />
      ) : (
        <div className="flex flex-col justify-between min-h-[100dvh] relative">
          {/* Canvas ASCII Background */}
          <AsciiBackground />

          {/* Main Hero Content */}
          <main className="flex-1 flex flex-col justify-center relative z-10">
            <Hero ctaSlot={<CtaButtons onNavigate={handleNavigate} />} />
          </main>

          {/* Dedicated Retro Split-Flap Board Section */}
          <section className="w-full py-16 md:py-24 px-4 relative z-10 flex flex-col items-center justify-center border-t border-white/10 bg-black/70 backdrop-blur-md">
            <RetroSplitFlap />
          </section>
          
          {/* Footer */}
          <footer className="w-full py-6 px-8 border-t border-white/5 text-center text-xs font-mono-code text-zinc-600 tracking-widest uppercase relative z-10">
            Devansh &copy; {new Date().getFullYear()} &mdash; Photography & Coding
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
