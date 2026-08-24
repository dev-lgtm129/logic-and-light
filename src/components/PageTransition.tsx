import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TransitionInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  targetPage: 'home' | 'photography' | 'coding';
  color: 'white' | 'dark';
}

interface Props {
  transitionInfo: TransitionInfo | null;
  onTransitionComplete: () => void;
  onMidpoint: () => void;
}

export const PageTransition: React.FC<Props> = ({
  transitionInfo,
  onTransitionComplete,
  onMidpoint,
}) => {
  const [phase, setPhase] = useState<'expanding' | 'fading' | 'idle'>('idle');

  useEffect(() => {
    if (!transitionInfo) {
      setPhase('idle');
      return;
    }

    setPhase('expanding');

    // Trigger page swap at midpoint (~400ms)
    const midTimer = setTimeout(() => {
      onMidpoint();
      setPhase('fading');
    }, 450);

    // Complete transition overlay (~650ms)
    const endTimer = setTimeout(() => {
      onTransitionComplete();
    }, 650);

    return () => {
      clearTimeout(midTimer);
      clearTimeout(endTimer);
    };
  }, [transitionInfo]);

  if (!transitionInfo || phase === 'idle') return null;

  const bgStyle =
    transitionInfo.color === 'white'
      ? 'bg-white text-black'
      : 'bg-black text-white border border-white/20';

  return (
    <AnimatePresence>
      <motion.div
        key="transition-wipe"
        initial={{
          top: transitionInfo.y,
          left: transitionInfo.x,
          width: transitionInfo.width,
          height: transitionInfo.height,
          borderRadius: '9999px',
          opacity: 1,
        }}
        animate={
          phase === 'expanding'
            ? {
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                borderRadius: '0px',
                opacity: 1,
              }
            : {
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                borderRadius: '0px',
                opacity: 0,
              }
        }
        transition={{
          duration: 0.48,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`fixed z-[9999] pointer-events-none ${bgStyle} flex items-center justify-center`}
      >
        <span className="font-mono-code text-xs uppercase tracking-[0.3em] opacity-40">
          {transitionInfo.targetPage === 'photography' ? 'PHOTOGRAPHY' : 'CODING'}
        </span>
      </motion.div>
    </AnimatePresence>
  );
};
