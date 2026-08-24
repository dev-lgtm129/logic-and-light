import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const OdometerArrow: React.FC = () => {
  const { scrollY } = useScroll();
  // Map scroll distance to mechanical 3D cylinder rotation (approx 1.5 degrees per px scrolled)
  const rawRotation = useTransform(scrollY, [0, 1200], [0, 1800]);
  const smoothRotation = useSpring(rawRotation, { stiffness: 160, damping: 22, mass: 0.4 });

  const faces = [0, 90, 180, 270];

  return (
    <span
      className="inline-flex items-center justify-center w-3.5 h-4.5 relative align-middle ml-1 overflow-hidden select-none"
      style={{ perspective: '120px' }}
    >
      <motion.span
        style={{
          rotateX: smoothRotation,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full absolute inset-0 flex items-center justify-center"
      >
        {faces.map((deg, index) => (
          <span
            key={index}
            className="absolute inset-0 flex items-center justify-center font-mono text-zinc-300 text-[11px] font-bold leading-none"
            style={{
              transform: `rotateX(${deg}deg) translateZ(7px)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            ↓
          </span>
        ))}
      </motion.span>
    </span>
  );
};

export const Hero: React.FC<{ ctaSlot?: React.ReactNode }> = ({ ctaSlot }) => {
  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col justify-between px-6 md:px-16 lg:px-20 pt-6 md:pt-8 pb-10 selection:bg-white selection:text-black z-10">
      
      {/* 1. Micro Architectural Header (Name Demoted to Micro-Tag) */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono-code text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-zinc-400 animate-glide delay-1 hairline-b pb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white font-medium">[DEVANSH / 01]</span>
          <span className="text-zinc-600 hidden sm:inline">&bull;</span>
          <span className="text-zinc-400 hidden sm:inline">SOFTWARE &amp; PHOTOGRAPHY</span>
        </div>
        <div className="text-zinc-400">
          2026 EDITION
        </div>
      </div>

      {/* 2. Monumental Focal Headline: LOGIC & LIGHT */}
      <div className="w-full my-auto py-6">
        <div className="animate-glide delay-2 py-2">
          <h1 className="font-serif-display font-light text-3xl sm:text-5xl md:text-6xl lg:text-[5.2rem] xl:text-[6.2rem] leading-[0.92] tracking-normal text-white select-none uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-full overflow-hidden">
            LOGIC &amp; LIGHT
          </h1>
        </div>

        {/* Architectural Hairline Divider */}
        <div className="w-full hairline-b my-6 md:my-8 animate-glide delay-3" />

        {/* 3. Asymmetric Offset Right Column (Subhead + Tagline) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-glide delay-4">
          
          {/* Left Column Micro Anchors */}
          <div className="hidden md:block md:col-span-5 font-mono-code text-[11px] uppercase tracking-[0.25em] text-zinc-400 space-y-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <p className="text-zinc-200 font-medium">[CODE + FRAME]</p>
            <p className="text-zinc-500">37.7749° N, 122.4194° W</p>
          </div>

          {/* Right Column Statement (Asymmetric Offset) */}
          <div className="md:col-span-7 space-y-3 md:pl-8 border-l border-white/10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            <p className="font-sans-body text-zinc-400 text-sm md:text-base tracking-widest uppercase font-light">
              Welcome to my website.
            </p>
            <p className="font-sans-body text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white leading-[1.15] tracking-tight max-w-xl">
              I build things that look right.
            </p>
          </div>

        </div>

        {/* 4. Dedicated Full-Width Parallax CTA Button Shelf */}
        {ctaSlot && (
          <div className="w-full mt-10 md:mt-14 pt-8 pb-4 border-t border-white/10 flex justify-center items-center animate-glide delay-5">
            {ctaSlot}
          </div>
        )}

      </div>

      {/* 5. Micro Footer / Status Line */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono-code text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-zinc-500 hairline-t pt-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        <span>DEVANSH &copy; {new Date().getFullYear()} &mdash; ALL RIGHTS RESERVED</span>
        <div className="text-zinc-400 flex items-center">
          <span>SCROLL TO EXPLORE</span>
          <OdometerArrow />
        </div>
      </div>

    </section>
  );
};
