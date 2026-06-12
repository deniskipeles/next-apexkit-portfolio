'use client';

import { useState, useEffect } from 'react';
import { ABOUT, AboutData } from '@/lib/data';
import { getAbout } from '@/lib/apex';

export default function AboutPage() {
  const [aboutInfo, setAboutInfo] = useState<AboutData>(ABOUT);

  useEffect(() => {
    getAbout().then(data => {
      setAboutInfo(data);
    });
  }, []);

  const getIndicatorStyle = (color: string) => {
    if (color.startsWith('#')) return { backgroundColor: color };
    return {};
  };

  const getIndicatorClass = (color: string) => {
    if (color.startsWith('bg-')) return color;
    if (color === 'teal-300') return 'bg-teal-300';
    if (color === 'yellow-300') return 'bg-yellow-300';
    if (color === 'sky-300') return 'bg-sky-300';
    if (color === '#32ff84') return 'bg-[#32ff84]';
    return 'bg-[#32ff84]'; // Default fallback accent
  };

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-[#32ff84] border-[3px] border-black flex-shrink-0 shadow-[2px_2px_0px_0px_#000000]" />
        <h3 className="font-display font-black tracking-tight text-2xl uppercase">ABOUT THE ARCHITECT</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-12 border-[3px] border-black bg-white p-6 sm:p-8 shadow-[5px_5px_0px_0px_#000000]">
          <p className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-neutral-900 leading-snug mb-4">
            {aboutInfo.headline}
          </p>
          
          <p className="text-sm font-medium leading-relaxed text-neutral-600 max-w-4xl">
            {aboutInfo.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {aboutInfo.highlights.map((highlight, index) => (
              <div key={index} className="border-[2px] border-black bg-neutral-50 p-4 shadow-[3px_3px_0px_0px_#000000] flex items-start gap-3">
                <div 
                  className={`w-4 h-4 border-2 border-black flex-shrink-0 mt-0.5 ${getIndicatorClass(highlight.color)}`}
                  style={getIndicatorStyle(highlight.color)}
                />
                <span className="font-sans font-bold text-sm text-neutral-800">{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
