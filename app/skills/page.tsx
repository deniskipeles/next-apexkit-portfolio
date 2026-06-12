'use client';

import { useState, useEffect } from 'react';
import { SKILLS, SkillCategory } from '@/lib/data';
import { getSkills } from '@/lib/apex';

export default function SkillsPage() {
  const [skillsList, setSkillsList] = useState<SkillCategory[]>(SKILLS);

  useEffect(() => {
    getSkills().then(data => {
      setSkillsList(data);
    });
  }, []);

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
        <h3 className="font-display font-black tracking-tight text-2xl uppercase">TECHNICAL SKILLS</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillsList.map((categoryItem) => (
          <div 
            key={categoryItem.category} 
            className="border-[3px] border-black bg-white p-6 pt-10 shadow-[5px_5px_0px_0px_#000000] relative hover:shadow-[10px_10px_0px_0px_#32ff84] hover:-translate-y-1 transition duration-200"
          >
            <div className={`absolute -top-4 left-4 ${categoryItem.colorClass} text-black font-display font-black uppercase text-xs px-3 py-1.5 border-[3px] border-black shadow-[2px_2px_0px_0px_#000000]`}>
              {categoryItem.title}
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryItem.skills.map(skill => (
                <span key={skill} className="px-2.5 py-1.5 border-[2px] border-black bg-white text-black font-mono font-bold text-xs shadow-[2px_2px_0px_0px_#000000] hover:bg-black hover:text-white transition">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
