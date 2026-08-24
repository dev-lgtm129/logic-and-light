import React, { useEffect, useState } from 'react';
import { getHeroCollisionPhotos } from '../utils/photoLoader';

type FontOption = 'source-serif' | 'abril' | 'dm-serif' | 'bodoni' | 'fraunces';

export const HeroChoreography: React.FC = () => {
  const [phase, setPhase] = useState<'orbit' | 'warp' | 'settled'>('orbit');
  const photos = getHeroCollisionPhotos().slice(0, 6);

  useEffect(() => {
    // Phase 1 (GPU Orbit): 0s -> 1.5s
    // Phase 2 (Perspective Cuboid Warp): 1.5s -> 2.8s
    // Phase 3 (Settled Backdrop): > 2.8s
    const warpTimer = setTimeout(() => {
      setPhase('warp');
    }, 1480); // Seamless timing handover right before orbit completion

    const settledTimer = setTimeout(() => {
      setPhase('settled');
    }, 2800);

    return () => {
      clearTimeout(warpTimer);
      clearTimeout(settledTimer);
    };
  }, []);

  const radius = 250; // Orbit radius in px

  // Cuboid Wall Target Transforms (Exact distances preserved as requested)
  const cuboidWallTargetTransforms = [
    // 0: Top Wall (Ceiling)
    { transform: 'translate3d(-50%, -350px, -60px) rotateX(-74deg) scaleX(2.2) scaleY(1.3)' },
    // 1: Bottom Wall (Floor)
    { transform: 'translate3d(-50%, 210px, -60px) rotateX(74deg) scaleX(2.2) scaleY(1.3)' },
    // 2: Left Wall
    { transform: 'translate3d(-520px, -50%, -60px) rotateY(74deg) scaleX(1.3) scaleY(2.2)' },
    // 3: Right Wall
    { transform: 'translate3d(370px, -50%, -60px) rotateY(-74deg) scaleX(1.3) scaleY(2.2)' },
  ];

  return (
    <div className="relative w-full min-h-[92dvh] flex flex-col justify-center items-center px-6 pt-24 pb-12 overflow-hidden select-none bg-black">
      
      {/* 3D Perspective Container */}
      <div
        className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
        style={{
          perspective: '950px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* SINGLE PERSISTENT DOM CONTAINER: Zero DOM unmounting, Zero React diffing lag */}
        <div
          className={`absolute top-1/2 left-1/2 w-[1px] h-[1px] pointer-events-none will-change-transform transform-gpu ${
            phase === 'orbit' ? 'animate-orbit-ring' : ''
          }`}
        >
          {photos.map((src, index) => {
            const baseAngle = (index / 6) * Math.PI * 2 - Math.PI / 2;
            const orbitX = Math.cos(baseAngle) * radius;
            const orbitY = Math.sin(baseAngle) * radius;

            const isFadedOut = (phase === 'warp' || phase === 'settled') && index >= 4;
            const isWallImage = index < 4;
            const wallTransform = isWallImage ? cuboidWallTargetTransforms[index].transform : '';

            // Compute style for Phase 1 vs Phase 2
            let currentStyle: React.CSSProperties = {
              width: '150px',
              height: '150px',
              position: 'absolute',
              top: '0px',
              left: '0px',
            };

            if (phase === 'orbit') {
              currentStyle = {
                ...currentStyle,
                transform: `translate3d(calc(-50% + ${orbitX}px), calc(-50% + ${orbitY}px), 0)`,
                opacity: 0.45,
                transition: 'none',
              };
            } else {
              // Phase 2 & Settled: Smooth CSS transition from orbit position into cuboid wall
              if (isFadedOut) {
                currentStyle = {
                  ...currentStyle,
                  transform: `translate3d(calc(-50% + ${orbitX}px), calc(-50% + ${orbitY}px), 0) scale(0.5)`,
                  opacity: 0,
                  transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease-out',
                };
              } else {
                currentStyle = {
                  ...currentStyle,
                  transform: wallTransform,
                  opacity: 0.38,
                  transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease-out',
                };
              }
            }

            return (
              <div
                key={`persistent-photo-${index}`}
                style={currentStyle}
                className="pointer-events-none select-none will-change-transform transform-gpu"
              >
                {/* Upright orientation during orbit; smooth 3D warp transition in phase 2 */}
                <div
                  className={`w-full h-full rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-zinc-900 will-change-transform transform-gpu ${
                    phase === 'orbit' ? 'animate-orbit-counter' : ''
                  }`}
                >
                  <img
                    src={src}
                    alt={`Choreographed photo ${index + 1}`}
                    className="w-full h-full object-cover aspect-square pointer-events-none select-none"
                    loading="eager"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Text Content: "LIGHT" */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-6 max-w-5xl mx-auto w-full">
        
        {/* Subhead Flavor Badge */}
        <div className="inline-flex items-center justify-center gap-3 px-4 py-1.5 border border-sky-500/30 rounded-full bg-sky-950/30 text-sky-300 font-mono-code text-[10px] uppercase tracking-[0.3em] animate-glide delay-1 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.15)] mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>NATURAL LIGHT &bull; VISUAL ESSAYS</span>
        </div>

        {/* Headline "LIGHT" */}
        <div className="animate-glide delay-2 py-2 flex justify-center items-center w-full">
          <h1 className="font-serif-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-[7.5rem] xl:text-[8.5rem] text-white leading-[0.92] tracking-normal select-none uppercase text-center max-w-full overflow-hidden drop-shadow-[0_4px_32px_rgba(0,0,0,0.95)]">
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
