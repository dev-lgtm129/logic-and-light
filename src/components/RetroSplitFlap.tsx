import React, { useState, useEffect } from 'react';
import { TextFlippingBoard } from './ui/text-flipping-board';
import { getGalleryPhotos } from '../utils/photoLoader';
import { PROJECTS } from '../utils/projectConfig';
import { getTimeBasedMessage } from '../utils/timeEasterEggs';

export const RetroSplitFlap: React.FC = () => {
  const [stateIndex, setStateIndex] = useState<0 | 1>(0);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [easterEgg, setEasterEgg] = useState<string>('JUST BROWSING?');

  // Dynamic counts
  const photoCount = getGalleryPhotos().length;
  const codingCount = PROJECTS.length;
  const totalCount = photoCount + codingCount;

  // Real-time clock update & Easter egg recalculation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).toUpperCase();
      setCurrentTime(timeStr);
      setEasterEgg(getTimeBasedMessage(now));
    };

    updateTime();
    const clockTimer = setInterval(updateTime, 10000);
    return () => clearInterval(clockTimer);
  }, []);

  // Cycle states every 6 seconds (5s hold time + 1s flip transition)
  useEffect(() => {
    const stateTimer = setInterval(() => {
      setStateIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000);

    return () => clearInterval(stateTimer);
  }, []);

  // State 1: Dynamic Counts
  const state1Rows = [
    `PHOTOGRAPHY: ${photoCount}`,
    `CODING: ${codingCount}`,
    `TOTAL PROJECTS: ${totalCount}`,
  ];

  // State 2: Time + Easter Egg
  const state2Rows = [
    `TIME: ${currentTime || '11:30 AM'}`,
    `${easterEgg}`,
    `STATUS: ONLINE`,
  ];

  const currentRows = stateIndex === 0 ? state1Rows : state2Rows;

  return (
    <div className="w-full max-w-5xl md:max-w-6xl mx-auto my-4 flex flex-col items-center select-none">
      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-3 font-mono-code text-[10px] uppercase tracking-[0.25em] text-zinc-500">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
        <span>[SPLIT-FLAP MATRIX &bull; LIVE FEED]</span>
      </div>

      {/* 5 Rows x 24 Columns Retro Split-Flap Display (Top & Bottom Empty Padding Rows for Perfect Centering) */}
      <TextFlippingBoard
        rows={currentRows}
        boardRows={5}
        boardCols={24}
        flipDuration={1.0}
      />
    </div>
  );
};
