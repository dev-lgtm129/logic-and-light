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
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileCheck);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!transitionInfo) {
      setPhase('idle');
      return;
    }

    setPhase('expanding');

    // DESKTOP: 450ms midpoint, 650ms end (Exact original deliberate timing)
    // MOBILE / ANDROID: 680ms midpoint, 1100ms end (Extended smooth pacing for low-powered GPUs)
    const midDuration = isMobile ? 680 : 450;
    const endDuration = isMobile ? 1100 : 650;

    const midTimer = setTimeout(() => {
      onMidpoint();
      setPhase('fading');
    }, midDuration);

    const endTimer = setTimeout(() => {
      onTransitionComplete();
    }, endDuration);

    return () => {
      clearTimeout(midTimer);
      clearTimeout(endTimer);
    };
  }, [transitionInfo, isMobile]);

  if (!transitionInfo || phase === 'idle') return null;

  const bgStyle =
    transitionInfo.color === 'white'
      ? 'bg-white text-black'
      : 'bg-black text-white border border-white/20';

  // =========================================================================
  // 1. MOBILE / ANDROID ISOLATED PATH (Extended 0.72s expansion + 0.45s smooth fade)
  // =========================================================================
  if (isMobile) {
    const originX = transitionInfo.x + transitionInfo.width / 2;
    const originY = transitionInfo.y + transitionInfo.height / 2;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 w-screen h-screen z-[9999] pointer-events-none overflow-hidden">
          {/* Background circle overlay scaling on GPU */}
          <motion.div
            key="transition-wipe-mobile-bg"
            initial={{ scale: 0.05, opacity: 1 }}
            animate={
              phase === 'expanding'
                ? { scale: 3.4, opacity: 1 }
                : { scale: 3.4, opacity: 0 }
            }
            transition={{
              duration: phase === 'expanding' ? 0.72 : 0.45,
              ease: phase === 'expanding' ? [0.16, 1, 0.3, 1] : [0.25, 1, 0.5, 1],
            }}
            style={{
              transformOrigin: `${originX}px ${originY}px`,
              willChange: 'transform, opacity',
            }}
            className={`absolute inset-0 w-full h-full rounded-full ${bgStyle}`}
          />
          {/* Label text placed OUTSIDE scaled container - 100% centered, unscaled 12px font */}
          <motion.div
            key="transition-wipe-mobile-text"
            initial={{ opacity: 0.4, scale: 1 }}
            animate={
              phase === 'expanding'
                ? { opacity: 0.6, scale: 1 }
                : { opacity: 0, scale: 1 }
            }
            transition={{
              duration: phase === 'expanding' ? 0.72 : 0.45,
            }}
            className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <span className="font-mono-code text-xs uppercase tracking-[0.3em] select-none">
              {transitionInfo.targetPage === 'photography' ? 'PHOTOGRAPHY' : 'CODING'}
            </span>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // =========================================================================
  // 2. DESKTOP-ONLY 100% UNTOUCHED ORIGINAL PATH (Exact original timing & morph)
  // =========================================================================
  return (
    <AnimatePresence>
      <motion.div
        key="transition-wipe-desktop"
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
