'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  const credits = [
    {
      name: 'ApexKit',
      url: 'https://github.com/deniskipeles/apexkit',
      description: 'MultiTenancy BaaS',
    },
    {
      name: 'Denis Kipeles',
      url: 'https://deniskipeles.is-a.dev',
      description: 'Lead Developer',
    },
    {
      name: 'Next.js 15',
      url: 'https://nextjs.org',
      description: 'React Framework',
    },
    {
      name: 'Cloudflare',
      url: 'https://pages.cloudflare.com',
      description: 'Frontend Hosting',
    },
    {
      name: 'Hugging Face',
      url: 'https://huggingface.co/spaces',
      description: 'Backend Engine',
    },
  ];

  return (
    <footer className="border-t-[4px] border-black bg-white py-8 px-4 sm:px-6 md:px-8 mt-16 shadow-[0_-4px_0_0_#000000]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 font-mono">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black border-2 border-black flex items-center justify-center text-[#32ff84] font-black font-display text-sm shadow-[2.5px_2.5px_0px_0px_#000000] shrink-0">
            DK
          </div>
          <div>
            <span className="font-display font-black text-sm uppercase tracking-tight text-black block leading-none">
              DENIS KIPELES PORTFOLIO
            </span>
            <p className="text-[10px] font-bold text-neutral-500 uppercase mt-1">
              © {year} ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>

        {/* Credits */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold">
          <span className="text-[10px] uppercase font-black text-neutral-400 w-full lg:w-auto text-center">
            POWERED BY &amp; BUILT WITH:
          </span>
          {credits.map((credit) => (
            <a
              key={credit.name}
              href={credit.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex flex-col items-center px-2.5 py-1 bg-neutral-50 hover:bg-[#32ff84] border-2 border-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              <span className="font-black text-[11px] text-black uppercase">
                {credit.name}
              </span>
              <span className="text-[9px] text-neutral-600 group-hover:text-black font-semibold uppercase">
                {credit.description}
              </span>
            </a>
          ))}
        </div>

        {/* Legal & Gateway */}
        <div className="flex items-center gap-3 text-xs font-bold uppercase">
          <a
            href="https://github.com/deniskipeles/next-apexkit-portfolio/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:underline hover:text-[#32ff84] text-neutral-700 transition-colors"
          >
            MIT LICENSE
          </a>
          <span className="text-neutral-400">·</span>
          <Link
            href="/login"
            className="text-black bg-[#32ff84] hover:bg-black hover:text-[#32ff84] px-2 py-1 border-2 border-black font-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            [ADMIN GATEWAY]
          </Link>
        </div>

      </div>
    </footer>
  );
}