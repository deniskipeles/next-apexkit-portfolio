'use client';

import { ArrowRight, Code2, ShieldAlert, Cpu, Terminal, FileCode, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface MetricFeed {
  module: string;
  load: number;
  status: 'optimal' | 'warning' | 'critical';
  latency: string;
}

export default function Home() {
  const [tickerSignals, setTickerSignals] = useState<Record<string, MetricFeed>>({
    'APEXKIT-RUST': { module: 'BaaS Realtime', load: 18.2, status: 'optimal', latency: '3ms' },
    'SWALANG-ZIG': { module: 'V2 Compiler', load: 8.4, status: 'optimal', latency: '1ms' },
    'SWALANG-BETA': { module: 'Go Interpreter', load: 34.5, status: 'optimal', latency: '5ms' },
    'APEXKIT-JS-SDK': { module: 'TS Query Engine', load: 11.2, status: 'optimal', latency: '2ms' }
  });

  useEffect(() => {
    const inter = setInterval(() => {
      setTickerSignals(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          // Adjust load slightly
          const drift = (Math.random() - 0.5) * 5;
          next[k].load = Math.max(1, Math.min(100, Math.round((next[k].load + drift) * 10) / 10));
          
          // Adjust latency
          const baseLat = parseInt(next[k].latency);
          const nextLat = Math.max(1, Math.round(baseLat + (Math.random() - 0.5) * 3));
          next[k].latency = `${nextLat}ms`;
        });
        return next;
      });
    }, 2200);
    return () => clearInterval(inter);
  }, []);

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Dev telemetry ticker */}
      <div className="border-[3px] border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000000] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 bg-black border-2 border-[#32ff84] flex-shrink-0 animate-ping rounded-full" />
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-black">ACTIVE NODE TELEMETRY:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-xs">
          {Object.entries(tickerSignals).map(([moduleName, feed]) => (
            <div 
              key={moduleName} 
              className="flex items-center gap-1.5 px-3 py-1.5 border-[2px] border-black bg-white text-black shadow-[2px_2px_0px_0px_#000000]"
            >
              <span className="font-extrabold">{moduleName}</span>
              <span className="font-semibold text-neutral-600">{feed.load}% load</span>
              <span className="text-[10px] flex items-center font-bold px-1 rounded border border-black bg-[#32ff84]/20 text-neutral-800">
                {feed.latency}
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="border-[3px] border-black bg-white p-6 sm:p-8 lg:p-12 shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden animate-in fade-in duration-700" id="hero">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#32ff84]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-block px-3 py-1 bg-black text-white font-mono font-bold text-[10px] tracking-widest uppercase mb-4 shadow-[3px_3px_0px_0px_#32ff84]">
            SYSTEMS ARCHITECT
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-none uppercase mb-6">
            I BUILD CUSTOM INTERPRETERS & SOUPED-UP BACKEND ENGINE FABRICS.
          </h2>
          
          <p className="text-base sm:text-lg font-medium border-l-[4px] border-black pl-4 text-neutral-700 max-w-3xl mb-8 leading-relaxed">
            Creator of <span className="font-mono bg-[#32ff84]/15 px-1 py-0.5 text-black font-semibold rounded">swalang</span> and <span className="font-mono bg-[#32ff84]/15 px-1 py-0.5 text-black font-semibold rounded">apexkit</span>. 
            Specialist in compiling high-speed interpreters (Zig/Go), managing complex multi-tenant BaaS contexts behind the scenes, and organizing modular JavaScript SDK pipelines.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/projects" 
              className="px-6 py-3.5 bg-[#32ff84] text-black border-[3px] border-black font-mono font-bold text-sm tracking-uppercase uppercase shadow-[4px_4px_0px_0px_#000000] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all duration-150 active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center gap-2"
            >
              EXPLORE REPOSITORIES
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/terminal" 
              className="px-6 py-3.5 bg-white text-black border-[3px] border-black font-mono font-bold text-sm tracking-uppercase uppercase shadow-[4px_4px_0px_0px_#000000] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all duration-150 active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center gap-2"
            >
              LAUNCH CORE TERMINAL
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/about" className="group block border-[3px] border-black bg-white p-6 shadow-[5px_5px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#32ff84] hover:-translate-y-1 transition duration-200">
          <div className="w-12 h-12 bg-black border-[3px] border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#32ff84] group-hover:bg-[#32ff84] transition-colors">
            <Code2 className="text-white w-6 h-6 group-hover:text-black transition-colors" />
          </div>
          <h3 className="font-display font-black text-xl uppercase mb-3 border-b-2 border-black pb-2 inline-block">ENGINE LOGIC</h3>
          <p className="font-mono text-xs text-neutral-600 leading-relaxed group-hover:text-black transition-colors">
            Learn more about swalang's AST interpreters in Zig and Go, alongside C shared library linking.
          </p>
        </Link>

        <Link href="/skills" className="group block border-[3px] border-black bg-white p-6 shadow-[5px_5px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#32ff84] hover:-translate-y-1 transition duration-200">
          <div className="w-12 h-12 bg-black border-[3px] border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#32ff84] group-hover:bg-[#32ff84] transition-colors">
            <Cpu className="text-white w-6 h-6 group-hover:text-black transition-colors" />
          </div>
          <h3 className="font-display font-black text-xl uppercase mb-3 border-b-2 border-black pb-2 inline-block">TECH SPECS</h3>
          <p className="font-mono text-xs text-neutral-600 leading-relaxed group-hover:text-black transition-colors">
            Complete core skillset overview across rust, zig, golang compilers, and next.js web layer topologies.
          </p>
        </Link>

        <Link href="/contact" className="group block border-[3px] border-black bg-[#32ff84] text-black p-6 shadow-[5px_5px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-y-1 transition duration-200">
          <div className="w-12 h-12 bg-white border-[3px] border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#000000]">
            <ShieldAlert className="text-black w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-xl uppercase mb-3 border-b-2 border-black pb-2 inline-block">INITIATE CONTACT</h3>
          <p className="font-mono text-xs text-neutral-800 leading-relaxed">
            Need an architect for a specialized SaaS integration, custom programming language interpreter, or high-performance Rust web service? Initiate transmission.
          </p>
        </Link>
      </div>
    </div>
  );
}
