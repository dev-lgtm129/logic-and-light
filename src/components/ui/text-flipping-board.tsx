"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FLAP_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$()-+&=;:'\"%,./?°";

const CELL_TEXT_STYLE: React.CSSProperties = {
  fontSize: "clamp(10px, 1.6vw, 19px)",
  lineHeight: 1,
};

// ── Individual Split-Flap Character (Monochrome Ultra-High-Contrast Black & White) ──

const FlapCell = React.memo(function FlapCell({
  target,
  delay,
  stepMs,
  flipDuration,
}: {
  target: string;
  delay: number;
  stepMs: number;
  flipDuration: number;
}) {
  const [current, setCurrent] = useState(" ");
  const [prev, setPrev] = useState(" ");
  const [flipId, setFlipId] = useState(0);
  const curRef = useRef(" ");
  const tgtRef = useRef<string | null>(null);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (startTimer.current) clearTimeout(startTimer.current);
    if (stepTimer.current) clearTimeout(stepTimer.current);
    startTimer.current = null;
    stepTimer.current = null;

    const normalized = FLAP_CHARS.includes(target.toUpperCase())
      ? target.toUpperCase()
      : " ";
    if (normalized === tgtRef.current) return;
    tgtRef.current = normalized;

    if (normalized === " " && curRef.current === " ") return;

    // Scramble / mechanical sequence length
    const scrambleCount = normalized === " " ? 4 : 8;

    const runStep = (i: number) => {
      const isLast = i === scrambleCount;
      const ch = isLast
        ? normalized
        : FLAP_CHARS[1 + Math.floor(Math.random() * (FLAP_CHARS.length - 1))];

      setPrev(curRef.current);
      curRef.current = ch;
      setCurrent(ch);
      setFlipId((n) => n + 1);

      if (!isLast) {
        stepTimer.current = setTimeout(() => runStep(i + 1), stepMs);
      }
    };

    startTimer.current = setTimeout(() => runStep(1), delay);

    return () => {
      if (startTimer.current) clearTimeout(startTimer.current);
      if (stepTimer.current) clearTimeout(stepTimer.current);
      startTimer.current = null;
      stepTimer.current = null;
      tgtRef.current = null;
    };
  }, [target, delay, stepMs]);

  const show = current === " " ? "\u00A0" : current;
  const showPrev = prev === " " ? "\u00A0" : prev;

  const textCx =
    "absolute inset-x-0 flex select-none items-center justify-center font-mono font-black tracking-wider text-zinc-50 drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]";
  const cardBg = "bg-zinc-950 border-zinc-700/80";
  const flapTopBg = "bg-zinc-900 border-zinc-700/80";

  const bottomDelay = flipDuration * 0.45;

  return (
    <div className="flex aspect-[3/4.6] flex-col overflow-hidden rounded-[2px] border border-white/15 md:rounded-[3px] bg-zinc-950 shadow-md">
      {/* Flap content area */}
      <div className="relative flex-1 perspective-dramatic transform-3d">
        
        {/* Hinge notch details */}
        <div className="absolute inset-0 z-40 hidden flex-row items-center justify-center md:flex">
          <div className="h-1/2 w-px rounded-tr-sm rounded-br-sm bg-black/80" />
          <div className="flex h-px flex-1 bg-black/90" />
          <div className="h-1/2 w-px rounded-tl-sm rounded-bl-sm bg-black/80" />
        </div>

        {/* Static top – new character top half */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[calc(50%-0.5px)] overflow-hidden rounded-t-[3px]",
            cardBg,
          )}
        >
          <div
            className={cn(textCx, "top-0 h-[200%]")}
            style={CELL_TEXT_STYLE}
          >
            {show}
          </div>
        </div>

        {/* Static bottom – new character bottom half */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-[calc(50%-0.5px)] overflow-hidden rounded-b-[3px]",
            cardBg,
          )}
        >
          <div
            className={cn(textCx, "bottom-0 h-[200%]")}
            style={CELL_TEXT_STYLE}
          >
            {show}
          </div>
          {flipId > 0 && (
            <motion.div
              key={`s${flipId}`}
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8),transparent_60%)]"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              transition={{ duration: flipDuration * 1.2, ease: "easeOut" }}
            />
          )}
        </div>

        {/* Flipping top flap – old character top half, drops down */}
        {flipId > 0 && (
          <motion.div
            key={flipId}
            className={cn(
              "absolute inset-x-0 top-0 z-10 h-[calc(50%-0.5px)] origin-bottom overflow-hidden rounded-t-[3px] backface-hidden transform-3d will-change-transform",
              flapTopBg,
            )}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -100 }}
            transition={{
              duration: flipDuration,
              ease: [0.55, 0.055, 0.675, 0.19],
            }}
          >
            <div
              className={cn(textCx, "top-0 h-[200%]")}
              style={CELL_TEXT_STYLE}
            >
              {showPrev}
            </div>
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.95))]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: flipDuration }}
            />
          </motion.div>
        )}

        {/* Flipping bottom flap – new character bottom half, rises up */}
        {flipId > 0 && (
          <motion.div
            key={`b${flipId}`}
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 h-[calc(50%-0.5px)] origin-top overflow-hidden rounded-b-[3px] backface-hidden transform-3d will-change-transform",
              cardBg,
            )}
            initial={{ rotateX: 90 }}
            animate={{ rotateX: 0 }}
            transition={{
              duration: flipDuration * 0.9,
              delay: bottomDelay,
              ease: [0.33, 1.4, 0.64, 1],
            }}
          >
            <div
              className={cn(textCx, "bottom-0 h-[200%]")}
              style={CELL_TEXT_STYLE}
            >
              {show}
            </div>
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0),rgba(0,0,0,0.7))]"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0 }}
              transition={{
                duration: flipDuration * 0.9,
                delay: bottomDelay,
              }}
            />
          </motion.div>
        )}

        {/* Center Split Hinge Line */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-[0.5px] bg-black" />
      </div>

      {/* Bottom subtle mechanical line texture */}
      <div className="h-1.5 w-full bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_0.15rem)] opacity-30" />
    </div>
  );
},
(prevProps, nextProps) =>
  prevProps.target === nextProps.target &&
  prevProps.delay === nextProps.delay &&
  prevProps.stepMs === nextProps.stepMs &&
  prevProps.flipDuration === nextProps.flipDuration,
);

// ── Helpers ─────────────────────────────────────────────────────────

function wrapLine(text: string, maxCols: number): string {
  if (text.length > maxCols) {
    return text.slice(0, maxCols);
  }
  return text;
}

// ── Main TextFlippingBoard Component ──────────────────────────────────

export interface TextFlippingBoardProps {
  rows?: string[];
  text?: string;
  className?: string;
  boardRows?: number;
  boardCols?: number;
  /** Individual character flip animation duration in seconds (defaults to 1.0s) */
  flipDuration?: number;
}

export function TextFlippingBoard({
  rows,
  text,
  className,
  boardRows = 5,
  boardCols = 24,
  flipDuration = 1.0,
}: TextFlippingBoardProps) {
  const colDelay = 30;
  const rowDelay = 50;
  const stepMs = 60;

  const board = useMemo(() => {
    const grid: string[][] = Array.from({ length: boardRows }, () =>
      Array.from({ length: boardCols }, () => " ")
    );

    const rawLines: string[] = rows
      ? rows
      : text
      ? text.split("\n")
      : [];

    // Calculate vertical offset to center the text lines vertically in the board
    const startRow = Math.max(0, Math.floor((boardRows - rawLines.length) / 2));

    rawLines.forEach((line, i) => {
      const r = startRow + i;
      if (r >= boardRows) return;
      const trimmed = line.trim();
      const wrapped = wrapLine(trimmed, boardCols);
      // Center align text horizontally across grid columns
      const startCol = Math.max(0, Math.floor((boardCols - wrapped.length) / 2));
      const chars = wrapped.split("");
      chars.forEach((ch, c) => {
        if (startCol + c < boardCols) {
          grid[r][startCol + c] = ch;
        }
      });
    });

    return grid;
  }, [rows, text, boardRows, boardCols]);

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-4xl md:max-w-5xl rounded-2xl bg-zinc-950/95 border border-white/20 p-4 md:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] backdrop-blur-2xl",
        className,
      )}
    >
      <div
        className="grid gap-[2px] md:gap-1"
        style={{ gridTemplateColumns: `repeat(${boardCols}, 1fr)` }}
      >
        {board.map((row, r) =>
          row.map((ch, c) => (
            <FlapCell
              key={`${r}-${c}`}
              target={ch}
              delay={c * colDelay + r * rowDelay}
              stepMs={stepMs}
              flipDuration={flipDuration}
            />
          ))
        )}
      </div>
    </div>
  );
}
