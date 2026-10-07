import React from 'react';
import { SchoolLogo } from './SchoolLogo';

interface AboutSectionProps {
  onNavigate?: (sectionId: string) => void;
  onOpenAdmissions?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate, onOpenAdmissions }) => {
  return (
    <section id="about" className="py-20 sm:py-24 bg-[#FFFFF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Real School Photograph */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-lg overflow-hidden border border-[#102A43]/15 shadow-md bg-white">
              <img
                src="/media/media_6.webp"
                alt="Uomboni Secondary School Administration and Classrooms, Marangu"
                className="w-full h-auto aspect-4/3 object-cover"
                loading="lazy"
              />
              <div className="p-4 bg-white border-t border-slate-100">
                <p className="text-xs font-semibold text-[#102A43]">
                  Uomboni Secondary School Campus
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Marangu West, Moshi Rural · Catholic Diocese of Moshi
                </p>
              </div>
            </div>

            {/* Quick Fact Box with Official School Crest */}
            <div className="bg-white p-5 rounded-lg border border-[#102A43]/10 shadow-xs">
              <div className="flex items-center gap-3.5 pb-3 mb-3 border-b border-slate-100">
                <SchoolLogo size="md" />
                <div>
                  <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wide">
                    Official School Identity
                  </h4>
                  <p className="text-[11px] text-[#C9A227] font-semibold">
                    Catholic Diocese of Moshi
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>School Registration:</span>
                <span className="font-semibold text-[#102A43]">Govt. &amp; NECTA Accredited</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-2 pt-2 border-t border-slate-100">
                <span>Centre Code:</span>
                <span className="font-mono font-bold text-[#102A43]">NECTA S0486</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-2 pt-2 border-t border-slate-100">
                <span>Location:</span>
                <span className="font-semibold text-[#102A43]">Kilimanjaro, Tanzania</span>
              </div>
            </div>
          </div>

          {/* Right Column: About Uomboni Secondary School */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase">
                About Our School
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
                About Uomboni Secondary School
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
                Uomboni Secondary School is an established co-educational Ordinary Level (Forms 1–4) day and boarding school situated in the tranquil, intellectually stimulating climate of Marangu West on the slopes of Mount Kilimanjaro. Under the auspices of the Catholic Diocese of Moshi, we are dedicated to providing accessible, high-quality secondary education rooted in academic rigor, self-discipline, and moral integrity.
              </p>
            </div>

            {/* 4 Core Pillars: Mission, Vision, Core Values, Motto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Mission */}
              <div className="bg-white p-5 rounded-lg border border-[#102A43]/10 border-t-2 border-t-[#C9A227] shadow-xs">
                <h3 className="text-sm font-semibold text-[#102A43]">
                  Our Mission
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-[1.7] font-normal">
                  To provide quality secondary education that nurtures intellectual curiosity, self-reliance, practical skills, and sound moral character in every student.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white p-5 rounded-lg border border-[#102A43]/10 border-t-2 border-t-[#102A43] shadow-xs">
                <h3 className="text-sm font-semibold text-[#102A43]">
                  Our Vision
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-[1.7] font-normal">
                  To be a premier center of academic competence, discipline, and holistic personal development for young women and men in Tanzania.
                </p>
              </div>

              {/* Core Values */}
              <div className="bg-white p-5 rounded-lg border border-[#102A43]/10 border-t-2 border-t-[#102A43] shadow-xs">
                <h3 className="text-sm font-semibold text-[#102A43]">
                  Core Values
                </h3>
                <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-600 leading-[1.6]">
                  <li>• Academic Diligence &amp; Honesty</li>
                  <li>• Moral Discipline &amp; Self-Respect</li>
                  <li>• Accountability &amp; Hard Work</li>
                  <li>• Faith, Humility &amp; Service</li>
                </ul>
              </div>

              {/* School Motto */}
              <div className="bg-white p-5 rounded-lg border border-[#102A43]/10 border-t-2 border-t-[#C9A227] shadow-xs">
                <h3 className="text-sm font-semibold text-[#102A43]">
                  School Motto
                </h3>
                <p className="mt-2 text-base font-serif font-bold text-[#102A43] leading-snug">
                  &ldquo;Building Knowledge, Character &amp; Excellence&rdquo;
                </p>
                <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed">
                  Swahili: &ldquo;Tujiendeleze Sisi Wenyewe&rdquo; (Elimu, Sala na Kazi)
                </p>
              </div>
            </div>

            {/* Action link */}
            <div className="pt-2 flex items-center gap-4">
              {onNavigate && (
                <button
                  onClick={() => onNavigate('academics')}
                  className="px-5 py-2.5 rounded-md bg-[#102A43] text-white text-xs font-semibold hover:bg-[#0A1C2E] transition-colors cursor-pointer"
                >
                  View Academic Programs
                </button>
              )}
              {onOpenAdmissions && (
                <button
                  onClick={onOpenAdmissions}
                  className="px-5 py-2.5 rounded-md border border-[#102A43]/20 text-[#102A43] text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
                >
                  Join Our Community
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
