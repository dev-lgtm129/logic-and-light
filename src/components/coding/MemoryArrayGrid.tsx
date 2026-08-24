import React, { useState, useRef, useEffect } from 'react';

interface MemoryCellState {
  digit: '0' | '1' | null;
  colorType: 'white' | 'cyan' | 'pink';
  active: boolean;
}

interface MemoryArrayGridProps {
  cols?: number;
  rows?: number;
  className?: string;
}

export const MemoryArrayGrid: React.FC<MemoryArrayGridProps> = ({
  cols = 9,
  rows = 7,
  className = '',
}) => {
  const totalCells = cols * rows;
  const [cells, setCells] = useState<MemoryCellState[]>(() =>
    Array(totalCells).fill({ digit: null, colorType: 'white', active: false })
  );

  const timersRef = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({});

  useEffect(() => {
    return () => {
      // Clear timers on unmount
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const handleCellEnter = (index: number) => {
    const digit: '0' | '1' = Math.random() > 0.5 ? '1' : '0';
    const rand = Math.random();

    // Sparse highlight color distribution: 90% white, 5% cyan, 5% neon pink
    let colorType: 'white' | 'cyan' | 'pink' = 'white';
    if (rand > 0.95) colorType = 'pink';
    else if (rand > 0.90) colorType = 'cyan';

    // Clear existing timer if cell re-hovered
    if (timersRef.current[index]) {
      clearTimeout(timersRef.current[index]);
    }

    setCells((prev) => {
      const next = [...prev];
      next[index] = { digit, colorType, active: true };
      return next;
    });

    // Smooth ~700ms decay fade
    timersRef.current[index] = setTimeout(() => {
      setCells((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], active: false };
        return next;
      });
    }, 700);
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
      style={{
        perspective: '900px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* 3D Tilted Perspective Grid Array with Soft Radial Gradient Edge Mask */}
      <div
        className="grid gap-[1px] bg-white/20 transition-transform duration-500 hover:rotate-y-[-18deg]"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          transform: 'rotateY(-25deg) rotateX(4deg)',
          transformStyle: 'preserve-3d',
          width: '100%',
          maxWidth: '840px',
          aspectRatio: `${cols} / ${rows}`,
          maskImage: 'radial-gradient(ellipse 68% 68% at 50% 50%, black 15%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 68% 68% at 50% 50%, black 15%, transparent 85%)',
        }}
      >
        {cells.map((cell, idx) => {
          let textStyle = 'text-white/90';
          let bgStyle = 'bg-zinc-950/95';

          if (cell.active) {
            if (cell.colorType === 'cyan') {
              textStyle = 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]';
              bgStyle = 'bg-cyan-950/40 border-cyan-500/40';
            } else if (cell.colorType === 'pink') {
              textStyle = 'text-pink-500 font-bold drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]';
              bgStyle = 'bg-pink-950/40 border-pink-500/40';
            } else {
              textStyle = 'text-white font-bold drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]';
              bgStyle = 'bg-zinc-800/80';
            }
          }

          return (
            <div
              key={idx}
              onPointerEnter={() => handleCellEnter(idx)}
              onMouseEnter={() => handleCellEnter(idx)}
              className={`relative flex items-center justify-center font-mono-code text-sm md:text-base transition-all duration-300 cursor-crosshair ${bgStyle} ${
                cell.active ? 'scale-[1.03] z-10' : ''
              }`}
            >
              <span
                className={`transition-opacity duration-500 ${
                  cell.active ? 'opacity-100' : 'opacity-0'
                } ${textStyle}`}
              >
                {cell.digit || '0'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
