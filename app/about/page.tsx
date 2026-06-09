export default function AboutPage() {
  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
        <h3 className="font-display font-black tracking-tight text-2xl uppercase">ABOUT THE ARCHITECT</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-12 border-[3px] border-black bg-white p-6 sm:p-8 shadow-[5px_5px_0px_0px_#000000]">
          <p className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-neutral-900 leading-snug mb-4">
            I am a Full-Stack Systems Engineer specializing in low-level compilers, Swahili programming environment interpreters, and high-performance Rust-based BaaS infrastructure.
          </p>
          
          <p className="text-sm font-medium leading-relaxed text-neutral-600 max-w-4xl">
            As the creator of <span className="font-semibold text-black underline decoration-[#32ff84] decoration-2">swalang</span> and <span className="font-semibold text-black underline decoration-[#32ff84] decoration-2">apexkit</span>, I build custom compiler architectures in Zig, Go, and Rust. I thrive at the intersection of custom platform runtime engines and ultra-slick web portals that leverage them. My work focuses on sub-millisecond execution speeds, automated environment scoping (Root, Tenant, and Sandbox regions), and highly intuitive next-generation developer tooling.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="border-[2px] border-black bg-neutral-50 p-4 shadow-[3px_3px_0px_0px_#000000] flex items-start gap-3">
              <div className="w-4 h-4 bg-[#32ff84] border-2 border-black flex-shrink-0 mt-0.5" />
              <span className="font-sans font-bold text-sm text-neutral-800">Advanced compiler & interpreter design using Zig, Go, and C shared libraries</span>
            </div>
            <div className="border-[2px] border-black bg-neutral-50 p-4 shadow-[3px_3px_0px_0px_#000000] flex items-start gap-3">
              <div className="w-4 h-4 bg-teal-300 border-2 border-black flex-shrink-0 mt-0.5" />
              <span className="font-sans font-bold text-sm text-neutral-800">BaaS construction in Rust featuring custom real-time socket channels and vector engines</span>
            </div>
            <div className="border-[2px] border-black bg-neutral-50 p-4 shadow-[3px_3px_0px_0px_#000000] flex items-start gap-3">
              <div className="w-4 h-4 bg-yellow-300 border-2 border-black flex-shrink-0 mt-0.5" />
              <span className="font-sans font-bold text-sm text-neutral-800">Next-generation frontend dashboards with real-time multi-tenant credentials mapping</span>
            </div>
            <div className="border-[2px] border-black bg-neutral-50 p-4 shadow-[3px_3px_0px_0px_#000000] flex items-start gap-3">
              <div className="w-4 h-4 bg-sky-300 border-2 border-black flex-shrink-0 mt-0.5" />
              <span className="font-sans font-bold text-sm text-neutral-800">API tooling creation with modular TypeScript SDKs for custom platform integrations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
