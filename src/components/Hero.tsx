import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmissions?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenAdmissions }) => {
  const handleAdmissionsClick = () => {
    if (onOpenAdmissions) {
      onOpenAdmissions();
    } else {
      onNavigate('admissions');
    }
  };

  return (
    <section id="home" className="relative w-full min-h-[82vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#102A43]">
      {/* Real Uomboni Secondary School Photograph */}
      <div className="absolute inset-0 z-0">
        <img
          src="/media/media_14.webp"
          alt="Uomboni Secondary School Campus, Marangu Kilimanjaro"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Subtle Deep Navy Overlay */}
        <div className="absolute inset-0 bg-[#102A43]/82 backdrop-brightness-90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-in fade-in duration-700">
        {/* Institutional Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFF0]/10 border border-[#C9A227]/40 text-[#FFFFF0] text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
          <span>NECTA S0486 · Catholic Diocese of Moshi · Marangu, Kilimanjaro</span>
        </div>

        {/* Headline */}
        <div className="space-y-3 max-w-4xl mx-auto">
          <p className="font-serif text-amber-300 text-lg sm:text-2xl font-black tracking-wide uppercase">
            “ELIMU NI MAISHA”
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
            Tujendelee Sisi Wenyewe: Prayer · Education · Work
          </h1>
        </div>

        {/* Subheading */}
        <p className="mt-6 text-base sm:text-lg text-[#FFFFF0]/90 max-w-3xl mx-auto font-normal leading-[1.75]">
          Shule ya Sekondari Uomboni (Pre-Form 1, Kidato cha 1–4 Bweni &amp; Kutwa) chini ya Jimbo Katoliki la Moshi, Marangu West kwenye mteremko wa Mlima Kilimanjaro. Udahili wa 2026/2027 umefunguliwa rasmi!
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('about')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-[#FFFFF0] text-[#102A43] font-semibold text-sm hover:bg-white transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 group"
          >
            <span>Explore Our School</span>
            <ArrowRight className="w-4 h-4 text-[#C9A227] group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleAdmissionsClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-[#C9A227] text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <span>Admissions &amp; Joining</span>
          </button>
        </div>

        {/* Key Institutional Facts */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
          <div className="border-l-2 border-[#C9A227] pl-3.5">
            <span className="block text-xl font-bold text-white">S0486</span>
            <span className="text-xs text-[#FFFFF0]/70">NECTA Registered Centre</span>
          </div>
          <div className="border-l-2 border-[#C9A227] pl-3.5">
            <span className="block text-xl font-bold text-white">Forms 1–4</span>
            <span className="text-xs text-[#FFFFF0]/70">Ordinary Level Secondary</span>
          </div>
          <div className="border-l-2 border-[#C9A227] pl-3.5">
            <span className="block text-xl font-bold text-white">Day &amp; Boarding</span>
            <span className="text-xs text-[#FFFFF0]/70">Co-Educational Facilities</span>
          </div>
          <div className="border-l-2 border-[#C9A227] pl-3.5">
            <span className="block text-xl font-bold text-white">Marangu West</span>
            <span className="text-xs text-[#FFFFF0]/70">Mount Kilimanjaro Slopes</span>
          </div>
        </div>
      </div>

      {/* Gentle Scroll Hint */}
      <button
        onClick={() => onNavigate('about')}
        aria-label="Scroll to About section"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-[#FFFFF0]/60 hover:text-white transition-colors cursor-pointer"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
};
