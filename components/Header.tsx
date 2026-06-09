'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b-[4px] border-black bg-white sticky top-0 z-50 px-4 py-3 sm:px-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_0_0_#000]">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-black border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#32ff84] group-hover:shadow-[3px_3px_0px_0px_#000] group-hover:bg-[#32ff84] transition-all">
            <Terminal className="w-5 h-5 text-white group-hover:text-black transition-colors" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight uppercase leading-none">
              DENIS KIPELES
            </h1>
            <p className="font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">
              FULL-STACK SYSTEMS DEV
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold uppercase">
        <Link 
          href="/" 
          className={cn(
            "px-2.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000] transition-all",
            pathname === '/' ? "bg-[#32ff84] text-black" : "bg-white text-black hover:bg-neutral-50"
          )}
        >
          HOME
        </Link>
        <Link 
          href="/about" 
          className={cn(
            "px-2.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000] transition-all",
            pathname === '/about' ? "bg-[#32ff84] text-black" : "bg-white text-black hover:bg-neutral-50"
          )}
        >
          ABOUT
        </Link>
        <Link 
          href="/skills" 
          className={cn(
            "px-2.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000] transition-all",
            pathname === '/skills' ? "bg-[#32ff84] text-black" : "bg-white text-black hover:bg-neutral-50"
          )}
        >
          SKILLS
        </Link>
        <Link 
          href="/projects" 
          className={cn(
            "px-2.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000] transition-all",
            pathname === '/projects' ? "bg-[#32ff84] text-black" : "bg-white text-black hover:bg-neutral-50"
          )}
        >
          PROJECTS
        </Link>
        <Link 
          href="/contact" 
          className={cn(
            "px-2.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000] transition-all",
            pathname === '/contact' ? "bg-[#32ff84] text-black" : "bg-white text-black hover:bg-neutral-50"
          )}
        >
          CONTACT
        </Link>
        <Link 
          href="/terminal" 
          className={cn(
            "px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all",
            pathname === '/terminal' ? "bg-black text-[#32ff84]" : "bg-[#32ff84] text-black"
          )}
        >
          SYSTEM TERMINAL
        </Link>
      </nav>
    </header>
  );
}
