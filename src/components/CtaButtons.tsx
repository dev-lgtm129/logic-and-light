import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Props {
  onNavigate?: (e: React.MouseEvent<HTMLAnchorElement>, targetPage: 'photography' | 'coding', isWhite: boolean) => void;
}

export const CtaButtons: React.FC<Props> = ({ onNavigate }) => {
  // Track window scroll
  const { scrollY } = useScroll();

  // Controlled scroll-linked parallax convergence:
  const leftX = useTransform(scrollY, [0, 250], [-60, 0]);
  const rightX = useTransform(scrollY, [0, 250], [60, 0]);
  
  // Fade in smoothly on scroll
  const buttonOpacity = useTransform(scrollY, [0, 180], [0.2, 1]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetPage: 'photography' | 'coding',
    isWhite: boolean
  ) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(e, targetPage, isWhite);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-3xl mx-auto py-2 relative z-20">
      
      {/* 1. Explore Photography Button */}
      <motion.a
        href="#photography"
        onClick={(e) => handleClick(e, 'photography', true)}
        style={{ x: leftX, opacity: buttonOpacity }}
        className="w-full sm:w-[270px] md:w-[280px] py-4 bg-white text-black font-mono-code text-xs md:text-sm font-semibold tracking-[0.18em] uppercase rounded-full flex items-center justify-center gap-2 border border-white hover:bg-zinc-200 transition-colors duration-200 shadow-xl group cursor-pointer shrink-0 text-center"
      >
        <span className="whitespace-nowrap">Explore Photography</span>
        <span className="text-xs group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
      </motion.a>

      {/* 2. Explore Coding Button */}
      <motion.a
        href="#coding"
        onClick={(e) => handleClick(e, 'coding', false)}
        style={{ x: rightX, opacity: buttonOpacity }}
        className="w-full sm:w-[270px] md:w-[280px] py-4 bg-black/60 backdrop-blur-md text-white font-mono-code text-xs md:text-sm font-semibold tracking-[0.18em] uppercase rounded-full flex items-center justify-center gap-2 border border-white/30 hover:border-white hover:bg-white/10 transition-colors duration-200 group cursor-pointer shrink-0 text-center"
      >
        <span className="whitespace-nowrap">Explore Coding</span>
        <span className="text-xs group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
      </motion.a>

    </div>
  );
};
