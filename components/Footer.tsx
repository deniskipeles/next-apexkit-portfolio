import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-[4px] border-black bg-white py-6 px-4 sm:px-6 md:px-8 mt-12 shadow-[0_-4px_0_0_#000]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-neutral-500 font-extrabold uppercase">
        <div className="flex items-center gap-2">
          <span>© 2026 DENIS KIPELES. ALL RIGHTS RESERVED.</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#32ff84] border border-black animate-pulse inline-block" />
            <span>NODE_V2_ACTIVE [32ms]</span>
          </div>
          <div>
            <span>INTEGRATED STACK: NEXT.js x APEXKIT</span>
          </div>
          {/* Admin gateway login integration */}
          <div>
            <Link 
              href="/login" 
              className="text-black hover:text-[#32ff84] hover:bg-black px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none transition-all inline-flex items-center gap-1"
            >
              [ADMIN GATEWAY]
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}