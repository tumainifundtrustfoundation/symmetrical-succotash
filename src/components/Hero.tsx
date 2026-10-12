import React from 'react';
import { ChevronDown, ArrowRight, Award, FileText, CreditCard, Compass } from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenResults?: () => void;
  onOpenAdmissions?: () => void;
  onOpenFees?: () => void;
  onOpenAdmin?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  onOpenResults,
  onOpenAdmissions,
  onOpenFees,
  onOpenAdmin,
}) => {
  return (
    <section id="home" className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#102A43]">
      {/* Real Uomboni Secondary School Photograph */}
      <div className="absolute inset-0 z-0">
        <img
          src="/media/media_14.webp"
          alt="Uomboni Secondary School Campus, Marangu Kilimanjaro"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Deep Navy & Emerald Gradient Overlay for optimal contrast & institutional dignity */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#102A43]/90 via-[#0A1C2E]/85 to-[#064e3b]/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center animate-in fade-in duration-700">
        
        {/* School Crest Badge */}
        <div className="flex justify-center mb-5">
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#C9A227]/40 shadow-xl inline-flex items-center gap-3">
            <SchoolLogo size="md" />
            <div className="text-left pr-2">
              <span className="block text-xs font-bold uppercase tracking-widest text-amber-300">
                NECTA CENTRE S0486
              </span>
              <span className="block text-[11px] text-emerald-200 font-medium">
                Catholic Diocese of Moshi · Marangu West
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-3 max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] drop-shadow-sm">
            Tujiendeleze Sisi Wenyewe
          </h1>
          <p className="text-base sm:text-xl font-medium text-amber-200 tracking-wide font-serif italic">
            &ldquo;Prayer · Education · Work&rdquo; · Elimu, Sala na Kazi
          </p>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-200/90 leading-relaxed pt-1">
            Shule ya Sekondari Uomboni (Kidato cha I–IV, Bweni na Kutwa kwa Wavulana na Wasichana) iliyopo kwenye mteremko wa Mlima Kilimanjaro, Marangu Magharibi, Moshi Vijijini.
          </p>
        </div>

        {/* Action Buttons (Deep Blue, Green, White & Gold) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
          {onOpenResults ? (
            <button
              onClick={onOpenResults}
              id="hero-results-btn"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-2 group border border-emerald-400/40"
            >
              <Award className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Matokeo ya Mitihani (NECTA)</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('results')}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Matokeo ya Mitihani</span>
            </button>
          )}

          {onOpenAdmissions ? (
            <button
              onClick={onOpenAdmissions}
              id="hero-admissions-btn"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-950/30 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <FileText className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Udahili &amp; Fomu za Kujiunga</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('admissions')}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>Udahili &amp; Kujiunga</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('fees')}
            id="hero-fees-btn"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/25 cursor-pointer backdrop-blur-xs flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-amber-300" />
            <span>Malipo ya Ada</span>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className="px-5 py-3 rounded-xl bg-white text-[#102A43] hover:bg-slate-100 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 group"
          >
            <span>Gundua Shule Yetu</span>
            <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Key Institutional Facts */}
        <div className="mt-12 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left max-w-4xl mx-auto">
          <div className="border-l-3 border-[#C9A227] pl-3.5">
            <span className="block text-xl sm:text-2xl font-black text-white font-mono">S0486</span>
            <span className="text-xs text-amber-200/80 font-medium">NECTA Registered Centre</span>
          </div>
          <div className="border-l-3 border-emerald-400 pl-3.5">
            <span className="block text-xl sm:text-2xl font-black text-white font-mono">Forms 1–4</span>
            <span className="text-xs text-emerald-200/80 font-medium">Ordinary Level (O-Level)</span>
          </div>
          <div className="border-l-3 border-[#C9A227] pl-3.5">
            <span className="block text-xl sm:text-2xl font-black text-white font-mono">Day &amp; Boarding</span>
            <span className="text-xs text-amber-200/80 font-medium">Co-Educational Campus</span>
          </div>
          <div className="border-l-3 border-emerald-400 pl-3.5">
            <span className="block text-xl sm:text-2xl font-black text-white font-mono">Marangu West</span>
            <span className="text-xs text-emerald-200/80 font-medium">Mt. Kilimanjaro Slopes</span>
          </div>
        </div>
      </div>

      {/* Gentle Scroll Hint */}
      <button
        onClick={() => onNavigate('quick-stats')}
        aria-label="Scroll to Quick Stats"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-[#FFFFF0]/70 hover:text-white transition-colors cursor-pointer"
      >
        <ChevronDown className="w-5 h-5 animate-bounce text-amber-300" />
      </button>
    </section>
  );
};
