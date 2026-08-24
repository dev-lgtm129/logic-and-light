import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FolderOpen, ArrowUpRight } from 'lucide-react';
import { PROJECTS, parseRepoName, ProjectConfig } from '../../utils/projectConfig';

interface ExpandingState {
  repoUrl: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ProjectFolders: React.FC = () => {
  const [expanding, setExpanding] = useState<ExpandingState | null>(null);

  const handleFolderClick = (e: React.MouseEvent<HTMLDivElement>, project: ProjectConfig) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const name = parseRepoName(project.repoUrl);

    setExpanding({
      repoUrl: project.repoUrl,
      name,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });

    // Open GitHub repo in a new tab after ~1.2s, keeping current tab on site
    setTimeout(() => {
      window.open(project.repoUrl, '_blank');
    }, 1200);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16 relative z-10 select-none">
      
      {/* Section Subhead */}
      <div className="flex items-center gap-3 font-mono-code text-[11px] uppercase tracking-[0.25em] text-zinc-500 mb-10 border-b border-white/10 pb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span>[CODING PROJECTS &bull; GITHUB REPOSITORIES]</span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project, index) => {
          const repoName = parseRepoName(project.repoUrl);

          return (
            <div
              key={index}
              onClick={(e) => handleFolderClick(e, project)}
              className="group relative cursor-pointer p-6 rounded-2xl bg-zinc-950/60 border border-white/10 hover:border-cyan-500/40 hover:bg-zinc-900/50 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl backdrop-blur-md"
            >
              {/* Top Row: Clean Lucide Outline Folder Icon + Link Indicator */}
              <div className="flex items-center justify-between">
                
                {/* Smooth Animated Folder Icon (Lucide) */}
                <div className="relative w-10 h-10 flex items-center justify-center text-zinc-400 group-hover:text-cyan-300 transition-colors duration-300">
                  <Folder
                    className="absolute inset-0 w-8 h-8 m-auto opacity-100 group-hover:opacity-0 scale-100 group-hover:scale-90 group-hover:-rotate-6 transition-all duration-300 ease-out"
                    strokeWidth={1.75}
                  />
                  <FolderOpen
                    className="absolute inset-0 w-8 h-8 m-auto opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 group-hover:rotate-0 transition-all duration-300 ease-out text-cyan-300"
                    strokeWidth={1.75}
                  />
                </div>

                {/* External Repo Badge */}
                <div className="font-mono-code text-[10.5px] text-zinc-500 group-hover:text-cyan-300 transition-colors uppercase tracking-widest border border-white/10 group-hover:border-cyan-500/30 px-3 py-1 rounded-full bg-black/60 flex items-center gap-1.5">
                  <span>[REPO]</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

              </div>

              {/* Bottom Row: Project Name */}
              <div className="pt-2 border-t border-white/5">
                <h3 className="font-mono-code text-xl font-semibold text-white tracking-wider group-hover:text-cyan-300 transition-colors">
                  {repoName}
                </h3>
              </div>

            </div>
          );
        })}
      </div>

      {/* Screen Expand & Wipe Transition Modal */}
      <AnimatePresence>
        {expanding && (
          <motion.div
            initial={{
              top: expanding.y,
              left: expanding.x,
              width: expanding.width,
              height: expanding.height,
              borderRadius: '1rem',
              opacity: 0.9,
            }}
            animate={{
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: '0rem',
              opacity: 1,
            }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed z-[99999] bg-black flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <div className="space-y-6 max-w-2xl mx-auto font-mono-code">
              
              {/* Destination Indicator */}
              <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-cyan-500/40 rounded-full bg-cyan-950/30 text-cyan-300 text-xs uppercase tracking-[0.25em] shadow-[0_0_25px_rgba(0,240,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>[OPENING GITHUB REPOSITORY]</span>
              </div>

              {/* Displayed Repo URL */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/20 shadow-2xl space-y-3">
                <p className="text-zinc-500 text-xs uppercase tracking-widest">[TARGET URL]</p>
                <p className="text-white text-sm sm:text-base md:text-lg font-mono font-medium tracking-wide break-all text-cyan-300">
                  {expanding.repoUrl}
                </p>
              </div>

              {/* Return Control */}
              <div className="pt-4 flex justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanding(null);
                  }}
                  className="px-5 py-2 rounded-full border border-white/20 hover:border-white text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors cursor-pointer bg-zinc-900/80"
                >
                  [RETURN TO CODING PAGE]
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
