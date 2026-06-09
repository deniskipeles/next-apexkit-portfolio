'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROJECTS } from '@/lib/data';

export default function ProjectsPage() {
  const [projectFilter, setProjectFilter] = useState<'all' | 'web3' | 'systems' | 'frontend' | 'tooling'>('all');

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
          <h3 className="font-display font-black tracking-tight text-2xl uppercase">PROJECTS</h3>
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1 bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000000] font-mono text-[10px] font-bold uppercase">
          {(['all', 'web3', 'systems', 'frontend', 'tooling'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setProjectFilter(tab)}
              className={cn(
                "px-3 py-1 border transition-all duration-150 uppercase",
                projectFilter === tab 
                  ? "bg-black text-white border-black" 
                  : "bg-transparent text-black border-transparent hover:border-black"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {PROJECTS
            .filter(p => projectFilter === 'all' || p.category === projectFilter)
            .map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="border-[3px] border-black bg-white p-5 shadow-[5px_5px_0px_0px_#000000] flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_#32ff84] hover:-translate-y-1 transition duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b-2 border-dotted border-black pb-2">
                    <span className="font-mono text-sm font-extrabold text-black">/{project.title}</span>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 border-2 border-black bg-[#32ff84]/15 text-black font-black leading-none">
                      {project.category}
                    </span>
                  </div>
                  
                  <p className="text-xs font-semibold text-neutral-700 leading-relaxed mb-4 min-h-[50px]">
                    {project.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map(t => (
                      <span key={t} className="text-[9px] font-mono font-bold text-neutral-600 bg-neutral-100 border border-black px-1.5 py-0.5 lowercase">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 bg-black hover:bg-neutral-800 text-white py-2 font-mono font-bold text-[10px] border-2 border-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all uppercase"
                    >
                      SOURCE
                      <ExternalLink className="w-3 h-3 text-[#32ff84]" />
                    </a>
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 bg-[#32ff84] hover:bg-[#13a347] hover:text-white text-black py-2 font-mono font-bold text-[10px] border-2 border-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all uppercase"
                      >
                        <Globe className="w-3 h-3" />
                        LIVE DEMO
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
