import React, { useEffect, useRef } from 'react';

const CHAR_SET = [' ', '.', ':', '-', '=', '+', '*', '%', '#', '@'];
const AMBIENT_CHAR_SET = ['.', ':', '-', '=', '+', '*'];

// Pre-generated opacity strings array to avoid per-frame string allocations
const OPACITY_CACHE = Array.from({ length: 101 }, (_, i) => {
  const opacity = (i / 100).toFixed(2);
  return `rgba(255, 255, 255, ${opacity})`;
});

const getOpacityColor = (val: number): string => {
  const clamped = Math.max(0, Math.min(100, Math.round(val * 100)));
  return OPACITY_CACHE[clamped];
};

export const AsciiBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Optimized grid cell size (24px x 28px reduces canvas draw calls by ~45%)
    const fontSize = 13;
    const cellWidth = 24;
    const cellHeight = 28;
    let cols = 0;
    let rows = 0;

    // Mouse lerp tracking
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    const radius = 240;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    let lastTime = 0;
    const targetFps = 30;
    const frameInterval = 1000 / targetFps;
    const radiusSq = radius * radius;

    let vignetteGradient: CanvasGradient | null = null;
    let isVisible = !document.hidden;

    const createVignette = () => {
      if (!ctx || width === 0 || height === 0) return;
      vignetteGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / cellWidth);
      rows = Math.ceil(height / cellHeight);
      createVignette();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      targetX = -1000;
      targetY = -1000;
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }
    resize();

    let time = 0;

    const render = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisible) return;

      const elapsed = timestamp - lastTime;
      if (elapsed < frameInterval) return;
      lastTime = timestamp - (elapsed % frameInterval);

      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let lastFillStyle = '';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellWidth + cellWidth / 2;
          const y = r * cellHeight + cellHeight / 2;

          let char = '.';
          let opacity = 0.14;

          if (isTouchDevice) {
            const wave = Math.sin(time + c * 0.15 + r * 0.15);
            const ambientIndex = Math.floor(((wave + 1) / 2) * (AMBIENT_CHAR_SET.length - 1));
            char = AMBIENT_CHAR_SET[ambientIndex];
            opacity = 0.10 + ((wave + 1) / 2) * 0.10;
          } else {
            const dx = x - currentX;
            const dy = y - currentY;
            const distSq = dx * dx + dy * dy;

            if (distSq < radiusSq) {
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / radius;
              const charIndex = Math.min(
                CHAR_SET.length - 1,
                Math.floor(factor * (CHAR_SET.length - 1))
              );
              char = CHAR_SET[charIndex];
              opacity = 0.14 + factor * 0.51;
            } else {
              const baseWave = Math.sin(time * 0.5 + c * 0.05 + r * 0.05);
              opacity = 0.11 + ((baseWave + 1) / 2) * 0.06;
              char = Math.random() > 0.985 ? '*' : '.';
            }
          }

          const fillStyle = getOpacityColor(opacity);
          if (fillStyle !== lastFillStyle) {
            ctx.fillStyle = fillStyle;
            lastFillStyle = fillStyle;
          }
          ctx.fillText(char, x, y);
        }
      }

      if (vignetteGradient) {
        ctx.fillStyle = vignetteGradient;
        ctx.fillRect(0, 0, width, height);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
