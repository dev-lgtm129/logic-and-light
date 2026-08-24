import React, { useEffect, useState } from 'react';
import { MemoryArrayGrid } from './MemoryArrayGrid';

const GLYPHS = ['0', '1', 'X', '#', '@', '%', '&', '*', 'A', 'F', '9', 'C', '7', '$'];
const TARGET = 'LOGIC';

export const LogicHero: React.FC = () => {
  const [displayText, setDisplayText] = useState('01010');

  useEffect(() => {
    let frame = 0;
    const totalFrames = 35; // Duration ~1.05s
    const intervalTime = 30; // 30ms per frame update

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const lockedLength = Math.floor(progress * TARGET.length);

      let current = '';
      for (let i = 0; i < TARGET.length; i++) {
        if (i < lockedLength) {
          current += TARGET[i];
        } else {
          current += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayText(current);

      if (frame >= totalFrames) {
        setDisplayText(TARGET);
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 pt-28 pb-16 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Left-Aligned Hero Text & Meta */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Micro Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-cyan-500/30 rounded-full bg-cyan-950/20 text-cyan-300 font-mono-code text-[10px] uppercase tracking-[0.3em] backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.12)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>[0x01 &bull; MEMORY ARRAY ACTIVE]</span>
          </div>

          {/* Headline "LOGIC" with Unscramble Load Entrance */}
          <div className="py-2">
            <h1 className="font-mono-code font-light text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] text-white leading-[0.9] tracking-wider uppercase select-none text-left drop-shadow-[0_4px_32px_rgba(0,0,0,0.95)]">
              {displayText}
            </h1>
          </div>

          {/* Architectural Subtitle Statement */}
          <p className="font-sans-body text-zinc-300 max-w-lg text-sm sm:text-base md:text-lg font-light tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Engineering software systems with precision, clean control flow, and spatial elegance.
          </p>

        </div>

        {/* Right Column: 3D Perspective Tilted Graph-Paper Memory Array Grid (Y-Axis Rotation) */}
        <div className="lg:col-span-7 relative flex justify-center items-center py-4">
          <div className="w-full max-w-[720px] h-[520px] sm:h-[600px] lg:h-[640px] relative">
            <MemoryArrayGrid className="w-full h-full rounded-lg" />
          </div>
        </div>

      </div>
    </div>
  );
};
