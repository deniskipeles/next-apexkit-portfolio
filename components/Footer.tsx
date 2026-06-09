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
            <span>INTEGRATED STACK: NEXT.js x TAILWIND</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
