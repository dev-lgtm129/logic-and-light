import React, { useEffect, useRef, useState } from 'react';
import { getHeroCollisionPhotos } from '../utils/photoLoader';

interface CardPath {
  id: string;
  src: string;
  // Starting point at screen outer edge
  startX: number;
  startY: number;
  // Target collision point at text box boundary
  targetX: number;
  targetY: number;
  // Current animation state
  currentX: number;
  currentY: number;
  progress: number; // 0 (at start) -> 1 (at target collision box)
  direction: 'inbound' | 'outbound' | 'waiting';
  delayFrames: number;
  size: number;
}

export const HeroCollision: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [cards, setCards] = useState<CardPath[]>([]);
  const cardsRef = useRef<CardPath[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const setupPaths = () => {
      const containerBounds = container.getBoundingClientRect();
      const textBounds = textEl.getBoundingClientRect();

      const width = containerBounds.width || window.innerWidth;
      const height = containerBounds.height || window.innerHeight;
      const cardSize = width < 768 ? 120 : 160;

      // Text collision box coordinates relative to container
      const textRect = {
        left: textBounds.left - containerBounds.left - 24,
        right: textBounds.right - containerBounds.left + 24,
        top: textBounds.top - containerBounds.top - 20,
        bottom: textBounds.bottom - containerBounds.top + 20,
      };

      const photos = getHeroCollisionPhotos().slice(0, 5);

      // 5 distinct non-overlapping straight-line trajectories (Top-Left, Top-Right, Bottom-Left, Bottom-Right, Top-Center)
      const rayConfigs = [
        // 1. Top-Left -> Text Top-Left
        { start: { x: 30, y: 80 }, target: { x: textRect.left - cardSize, y: textRect.top - cardSize / 2 } },
        // 2. Top-Right -> Text Top-Right
        { start: { x: width - cardSize - 30, y: 80 }, target: { x: textRect.right, y: textRect.top - cardSize / 2 } },
        // 3. Bottom-Left -> Text Bottom-Left
        { start: { x: 30, y: height - cardSize - 60 }, target: { x: textRect.left - cardSize, y: textRect.bottom - cardSize / 2 } },
        // 4. Bottom-Right -> Text Bottom-Right
        { start: { x: width - cardSize - 30, y: height - cardSize - 60 }, target: { x: textRect.right, y: textRect.bottom - cardSize / 2 } },
        // 5. Top-Center -> Text Top-Center
        { start: { x: width / 2 - cardSize / 2, y: 60 }, target: { x: width / 2 - cardSize / 2, y: textRect.top - cardSize } },
      ];

      // Staggered frame delays (0, 40, 80, 120, 160 frames)
      const initialCards: CardPath[] = photos.map((src, idx) => {
        const config = rayConfigs[idx % rayConfigs.length];
        return {
          id: `card-${idx}`,
          src,
          startX: config.start.x,
          startY: config.start.y,
          targetX: config.target.x,
          targetY: config.target.y,
          currentX: config.start.x,
          currentY: config.start.y,
          progress: 0,
          direction: 'waiting',
          delayFrames: idx * 45, // Staggered entry
          size: cardSize,
        };
      });

      cardsRef.current = initialCards;
      setCards(initialCards);
    };

    setupPaths();
    window.addEventListener('resize', setupPaths);

    let animationFrameId: number;

    const animate = () => {
      const inboundSpeed = 0.008; // Fast, direct inbound trajectory (~120 frames)
      const outboundSpeed = 0.003; // Inelastic collision energy loss (~330 frames, noticeably slower)

      const updated = cardsRef.current.map((card) => {
        let { startX, startY, targetX, targetY, progress, direction, delayFrames } = card;

        if (direction === 'waiting') {
          if (delayFrames > 0) {
            return { ...card, delayFrames: delayFrames - 1 };
          }
          direction = 'inbound';
        }

        if (direction === 'inbound') {
          progress += inboundSpeed;
          if (progress >= 1) {
            progress = 1;
            direction = 'outbound'; // Collision event! Retrace path at slower speed
          }
        } else if (direction === 'outbound') {
          progress -= outboundSpeed;
          if (progress <= 0) {
            progress = 0;
            direction = 'waiting';
            delayFrames = 30; // Brief pause before next cycle
          }
        }

        // Linear interpolation along straight-line trajectory
        const currentX = startX + (targetX - startX) * progress;
        const currentY = startY + (targetY - startY) * progress;

        return {
          ...card,
          currentX,
          currentY,
          progress,
          direction,
          delayFrames,
        };
      });

      cardsRef.current = updated;
      setCards([...updated]);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setupPaths);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[88dvh] flex flex-col justify-center items-center px-6 pt-24 pb-12 overflow-hidden select-none"
    >
      {/* Straight-Line Trajectory Photo Cards (Non-interactive ambient collision) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              transform: `translate3d(${Math.round(card.currentX)}px, ${Math.round(card.currentY)}px, 0)`,
              width: `${card.size}px`,
              height: `${card.size}px`,
            }}
            className="absolute top-0 left-0 opacity-45 pointer-events-none select-none will-change-transform"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900">
              <img
                src={card.src}
                alt="Photography frame"
                className="w-full h-full object-cover aspect-square pointer-events-none select-none"
                loading="eager"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Main Hero Typography: Exact Match to Landing Page ("LOGIC & LIGHT") */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-6 max-w-5xl mx-auto w-full">
        
        {/* Subhead Flavor Badge (Centered) */}
        <div className="inline-flex items-center justify-center gap-3 px-4 py-1.5 border border-sky-500/30 rounded-full bg-sky-950/30 text-sky-300 font-mono-code text-[10px] uppercase tracking-[0.3em] animate-glide delay-1 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.15)] mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>NATURAL LIGHT &bull; VISUAL ESSAYS</span>
        </div>

        {/* Headline "LIGHT" (Exact font-serif-display, font-light, leading-[0.92], tracking-normal as landing page) */}
        <div className="animate-glide delay-2 py-2 flex justify-center items-center w-full">
          <h1
            ref={textRef}
            className="font-serif-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-[6.8rem] xl:text-[7.5rem] text-white leading-[0.92] tracking-normal select-none uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] text-center max-w-full overflow-hidden"
          >
            LIGHT
          </h1>
        </div>

        {/* Subtitle */}
        <p className="font-sans-body text-zinc-300 max-w-lg mx-auto text-sm sm:text-base md:text-lg font-light tracking-wide animate-glide delay-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] text-center">
          Exploring atmosphere, shadow, and silent perspective through photographic frames.
        </p>

      </div>
    </div>
  );
};
