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
      {/* Real Uomboni Secondary School Photograph - High-resolution original photography without distortion */}
      <div className="absolute inset-0 z-0">
        <img
          src="/media/media_14.webp"
          alt="Uomboni Secondary School Campus Grounds, Marangu West, Mount Kilimanjaro"
          width={1024}
          height={768}
          className="w-full h-full object-cover object-center select-none"
          loading="eager"
          decoding="async"
        />
        {/* Professional contrast scrim: protects WCAG AA typography while preserving real campus greenery & buildings */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/70 to-[#102A43]/45" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-in fade-in duration-700">
        {/* Institutional Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFF0]/10 border border-[#C9A227]/30 text-[#FFFFF0] text-xs font-semibold tracking-wider uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
          <span>NECTA Centre S0486 · Moshi Rural, Kilimanjaro</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Tujiendeleze Sisi Wenyewe
        </h1>

        {/* Subheading with Official Mission */}
        <p className="mt-5 text-base sm:text-lg lg:text-xl text-[#FFFFF0]/95 max-w-3xl mx-auto font-normal leading-[1.7]">
          To Provide Quality Education and Impressive Academic Performance · Catholic Diocese of Moshi (Marangu, Kilimanjaro)
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
            className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-transparent text-[#FFFFF0] border border-[#C9A227] font-semibold text-sm hover:bg-[#C9A227]/15 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Admissions</span>
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
            <span className="block text-xl font-bold text-white">Marangu-Moshi</span>
            <span className="text-xs text-[#FFFFF0]/70">P.O. Box 361 · Kilimanjaro</span>
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
