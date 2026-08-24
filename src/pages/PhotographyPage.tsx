import React from 'react';
import { motion } from 'framer-motion';
import { HeroChoreography } from '../components/HeroChoreography';
import { GalleryStream } from '../components/GalleryStream';
import { ArrowLeft } from '@/components/animate-ui/icons/arrow-left';

interface Props {
  onBackToHome: () => void;
}

export const PhotographyPage: React.FC<Props> = ({ onBackToHome }) => {
  return (
    <div className="min-h-[100dvh] bg-black text-white relative flex flex-col justify-between selection:bg-white selection:text-black">
      
      {/* Top Header Navigation */}
      <header className="w-full fixed top-0 left-0 z-50 bg-black/80 backdrop-blur-lg hairline-b">
        <nav aria-label="Photography Navigation" className="max-w-[1400px] mx-auto px-6 md:px-16 h-16 md:h-20 flex items-center justify-between">
          <motion.button
            onClick={onBackToHome}
            whileHover={{ scale: 1.04, x: -2 }}
            whileTap={{ scale: 0.96 }}
            className="font-mono-code text-[11px] uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-2 cursor-pointer group"
          >
            <ArrowLeft size={15} animateOnHover className="text-zinc-400 group-hover:text-white transition-colors" />
            <span>[HOME]</span>
          </motion.button>

          <div className="flex items-center gap-3 font-mono-code text-[10.5px] uppercase tracking-[0.2em]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-sky-400">PHOTOGRAPHY</span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-emerald-400/80">GALLERY</span>
          </div>
        </nav>
      </header>

      {/* Main Content: Hero Choreography (Orbit -> Perspective Tunnel) + Gallery Stream */}
      <main className="flex-1 flex flex-col justify-center relative z-10">
        <HeroChoreography />
        <GalleryStream />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-8 border-t border-white/5 text-center text-xs font-mono-code text-zinc-600 tracking-widest uppercase relative z-10">
        Devansh &copy; {new Date().getFullYear()} &mdash; Photography Gallery
      </footer>

    </div>
  );
};
