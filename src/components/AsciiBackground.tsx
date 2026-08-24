import React, { useEffect, useRef } from 'react';

const CHAR_SET = [' ', '.', ':', '-', '=', '+', '*', '%', '#', '@'];
const AMBIENT_CHAR_SET = ['.', ':', '-', '=', '+', '*'];

export const AsciiBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Grid config
    const fontSize = 13;
    const cellWidth = 20;
    const cellHeight = 24;
    let cols = 0;
    let rows = 0;

    // Mouse lerp tracking
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    const radius = 240; // Cursor glow radius in px

    // Mobile / Touch check
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

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
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      targetX = -1000;
      targetY = -1000;
    };

    window.addEventListener('resize', resize);
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }
    resize();

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Smooth lerp mouse tracking
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellWidth + cellWidth / 2;
          const y = r * cellHeight + cellHeight / 2;

          let char = '.';
          let opacity = 0.14; // Crisp, clearly visible base opacity

          if (isTouchDevice) {
            // Ambient wave animation for mobile / touch
            const wave = Math.sin(time + c * 0.15 + r * 0.15);
            const ambientIndex = Math.floor(((wave + 1) / 2) * (AMBIENT_CHAR_SET.length - 1));
            char = AMBIENT_CHAR_SET[ambientIndex];
            opacity = 0.10 + ((wave + 1) / 2) * 0.10;
          } else {
            // Distance to cursor
            const dx = x - currentX;
            const dy = y - currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius) {
              const factor = 1 - dist / radius; // 1 at center, 0 at edge
              // Shift character based on proximity
              const charIndex = Math.min(
                CHAR_SET.length - 1,
                Math.floor(factor * (CHAR_SET.length - 1))
              );
              char = CHAR_SET[charIndex];
              // Enhanced contrast cursor glow (up to 0.65)
              opacity = 0.14 + factor * 0.51;
            } else {
              // Base state ambient micro pulse
              const baseWave = Math.sin(time * 0.5 + c * 0.05 + r * 0.05);
              opacity = 0.11 + ((baseWave + 1) / 2) * 0.06;
              char = Math.random() > 0.985 ? '*' : '.';
            }
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`;
          ctx.fillText(char, x, y);
        }
      }

      // Vignette effect overlay
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
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
