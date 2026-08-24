import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGalleryPhotos } from '../utils/photoLoader';
import { X } from '@/components/animate-ui/icons/x';

export const GalleryStream: React.FC = () => {
  const photos = getGalleryPhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Divide photos into 2 staggered rows (matching hand-drawn sketch)
  const topRowPhotos = photos.filter((_, i) => i % 2 === 0);
  const bottomRowPhotos = photos.filter((_, i) => i % 2 !== 0);

  // Varied tile height classes for top row (creates layout asymmetry while allowing photo aspect ratio to set width)
  const topTileHeights = [
    'h-[220px] sm:h-[260px] md:h-[300px]',
    'h-[270px] sm:h-[320px] md:h-[370px]',
    'h-[190px] sm:h-[220px] md:h-[250px]',
    'h-[250px] sm:h-[290px] md:h-[330px]',
    'h-[210px] sm:h-[240px] md:h-[280px]',
    'h-[280px] sm:h-[330px] md:h-[380px]',
  ];

  // Varied tile height classes for bottom row
  const bottomTileHeights = [
    'h-[260px] sm:h-[300px] md:h-[340px]',
    'h-[180px] sm:h-[200px] md:h-[220px]',
    'h-[280px] sm:h-[330px] md:h-[370px]',
    'h-[200px] sm:h-[230px] md:h-[260px]',
    'h-[240px] sm:h-[280px] md:h-[310px]',
    'h-[190px] sm:h-[210px] md:h-[240px]',
  ];

  return (
    <section className="w-full py-20 bg-black text-white overflow-hidden relative">
      
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-[0.25em] text-sky-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>[GALLERY STREAM &bull; AUTO-SCROLL]</span>
          </div>
          <h2 className="font-serif-display text-3xl md:text-5xl font-normal tracking-tight text-white">
            Atmospheric Visual Gallery
          </h2>
        </div>
        <div className="font-mono-code text-xs text-zinc-500 uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          {photos.length} FRAMES &bull; SLOW AUTO SCROLL
        </div>
      </div>

      {/* GPU-Accelerated Off-Thread Auto-Scrolling 2-Row Gallery */}
      <div className="w-full space-y-8 overflow-hidden py-4 select-none">
        
        {/* ROW 1: Top Row (GPU-Accelerated Off-Thread Left Marquee) */}
        <div className="flex overflow-hidden w-full">
          <div className="flex items-center gap-6 shrink-0 animate-marquee-left will-change-transform transform-gpu">
            {[...topRowPhotos, ...topRowPhotos].map((src, index) => {
              const heightClass = topTileHeights[index % topTileHeights.length];
              return (
                <div
                  key={`top-${index}`}
                  onClick={() => setSelectedPhoto(src)}
                  className={`shrink-0 w-auto rounded-2xl overflow-hidden border border-white/20 bg-zinc-900 shadow-2xl cursor-pointer hover:scale-[1.03] hover:border-sky-400 transition-all duration-300 group ${heightClass} will-change-transform flex items-center justify-center`}
                >
                  <img
                    src={src}
                    alt={`Top photo ${index}`}
                    decoding="async"
                    loading="lazy"
                    className="h-full w-auto max-w-none block transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 2: Bottom Row (GPU-Accelerated Off-Thread Right Marquee) */}
        <div className="flex overflow-hidden w-full">
          <div className="flex items-center gap-6 shrink-0 animate-marquee-right will-change-transform transform-gpu">
            {[...bottomRowPhotos, ...bottomRowPhotos].map((src, index) => {
              const heightClass = bottomTileHeights[index % bottomTileHeights.length];
              return (
                <div
                  key={`bottom-${index}`}
                  onClick={() => setSelectedPhoto(src)}
                  className={`shrink-0 w-auto rounded-2xl overflow-hidden border border-white/20 bg-zinc-900 shadow-2xl cursor-pointer hover:scale-[1.03] hover:border-emerald-400 transition-all duration-300 group ${heightClass} will-change-transform flex items-center justify-center`}
                >
                  <img
                    src={src}
                    alt={`Bottom photo ${index}`}
                    decoding="async"
                    loading="lazy"
                    className="h-full w-auto max-w-none block transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Lightbox Full-Screen Modal with Smooth Entrance & Exit Animations */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 cursor-zoom-out select-none"
          >
            <motion.div
              key="lightbox-content"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-zinc-950 flex items-center justify-center p-2 sm:p-4"
            >
              <img
                src={selectedPhoto}
                alt="Expanded view"
                className="w-full h-full object-contain max-h-[85vh] rounded-xl pointer-events-none select-none"
                decoding="async"
              />
              <motion.button
                onClick={() => setSelectedPhoto(null)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-black/85 hover:bg-white hover:text-black text-white px-5 py-2 rounded-full font-mono-code text-xs uppercase tracking-widest border border-white/30 transition-colors duration-200 cursor-pointer shadow-2xl backdrop-blur-md z-50"
              >
                [CLOSE]
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
