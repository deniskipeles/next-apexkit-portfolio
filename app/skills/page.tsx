export default function SkillsPage() {
  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
        <h3 className="font-display font-black tracking-tight text-2xl uppercase">TECHNICAL SKILLS</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Languages card */}
        <div className="border-[3px] border-black bg-white p-6 pt-10 shadow-[5px_5px_0px_0px_#000000] relative hover:shadow-[10px_10px_0px_0px_#32ff84] hover:-translate-y-1 transition duration-200">
          <div className="absolute -top-4 left-4 bg-[#32ff84] text-black font-display font-black uppercase text-xs px-3 py-1.5 border-[3px] border-black shadow-[2px_2px_0px_0px_#000000]">
            LANGUAGES
          </div>
          <div className="flex flex-wrap gap-2">
            {['Zig', 'Rust', 'Go', 'TypeScript', 'C', 'SQL', 'Python', 'Shell Scripting'].map(skill => (
              <span key={skill} className="px-2.5 py-1.5 border-[2px] border-black bg-white text-black font-mono font-bold text-xs shadow-[2px_2px_0px_0px_#000000] hover:bg-black hover:text-white transition">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Backend card */}
        <div className="border-[3px] border-black bg-white p-6 pt-10 shadow-[5px_5px_0px_0px_#000000] relative hover:shadow-[10px_10px_0px_0px_#32ff84] hover:-translate-y-1 transition duration-200">
          <div className="absolute -top-4 left-4 bg-teal-300 text-black font-display font-black uppercase text-xs px-3 py-1.5 border-[3px] border-black shadow-[2px_2px_0px_0px_#000000]">
            BACKEND
          </div>
          <div className="flex flex-wrap gap-2">
            {['BaaS Engines', 'Interpreter Lab', 'WebSockets', 'Realtime Channels', 'Go APIs', 'JWT & Credentials Scoping', 'Redis Cache', 'Serverless Scripts'].map(skill => (
              <span key={skill} className="px-2.5 py-1.5 border-[2px] border-black bg-white text-black font-mono font-bold text-xs shadow-[2px_2px_0px_0px_#000000] hover:bg-black hover:text-white transition">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Frontend card */}
        <div className="border-[3px] border-black bg-white p-6 pt-10 shadow-[5px_5px_0px_0px_#000000] relative hover:shadow-[10px_10px_0px_0px_#32ff84] hover:-translate-y-1 transition duration-200">
          <div className="absolute -top-4 left-4 bg-yellow-300 text-black font-display font-black uppercase text-xs px-3 py-1.5 border-[3px] border-black shadow-[2px_2px_0px_0px_#000000]">
            FRONTEND
          </div>
          <div className="flex flex-wrap gap-2">
            {['Next.js 15', 'React 19', 'Tailwind CSS', 'Framer Motion', 'ApexKit SDK Integration', 'Dynamic Charts', 'Web3 UI Architecture', 'State Hydration'].map(skill => (
              <span key={skill} className="px-2.5 py-1.5 border-[2px] border-black bg-white text-black font-mono font-bold text-xs shadow-[2px_2px_0px_0px_#000000] hover:bg-black hover:text-white transition">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Infrastructure card */}
        <div className="border-[3px] border-black bg-white p-6 pt-10 shadow-[5px_5px_0px_0px_#000000] relative hover:shadow-[10px_10px_0px_0px_#32ff84] hover:-translate-y-1 transition duration-200">
          <div className="absolute -top-4 left-4 bg-sky-300 text-black font-display font-black uppercase text-xs px-3 py-1.5 border-[3px] border-black shadow-[2px_2px_0px_0px_#000000]">
            INFRASTRUCTURE
          </div>
          <div className="flex flex-wrap gap-2">
            {['Zig Build', 'Cargo Toolchain', 'Docker Pipelines', 'AI Vector DBs', 'Vercel Deployments', 'Unit/Integration Tests', 'GitHub Actions'].map(skill => (
              <span key={skill} className="px-2.5 py-1.5 border-[2px] border-black bg-white text-black font-mono font-bold text-xs shadow-[2px_2px_0px_0px_#000000] hover:bg-black hover:text-white transition">
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
