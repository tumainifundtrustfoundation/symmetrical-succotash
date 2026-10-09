import React from 'react';
import { ArrowRight, CheckCircle2, Calendar, FileText, Download } from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';

interface AdmissionsSectionProps {
  onOpenAdmissions?: () => void;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({ onOpenAdmissions }) => {
  const requirements = [
    'Primary School Leaving Examination (PSLE) Result Slip or Certificate',
    'Certified Copy of Official Birth Certificate (RITA)',
    'Official Transfer Letter & Academic Progress Report (for transfer applicants)',
    'Medical Examination Form signed and stamped by an authorized medical officer',
    'Four (4) recent passport-sized photographs (sky blue background)',
    'Signed School Rules and Discipline Acceptance Agreement by Parent/Guardian',
  ];

  const dates = [
    { event: 'Pre-Form One Program Commences (Special Notice)', date: '21 Septemba 2026' },
    { event: 'Form One Admissions & Registration (2026/2027)', date: 'Inaendelea (Open Now)' },
    { event: 'Form 2 & 3 Transfer Applications Window', date: 'Inaendelea (Open Now)' },
    { event: 'Kuripoti Shuleni & Maandalizi ya Muhula', date: 'Januari 2026' },
  ];

  return (
    <section id="admissions" className="py-20 sm:py-24 bg-[#FFFFF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wider uppercase mb-2 border border-amber-300">
            <span>TANGAZO RASMI LA UDAHILI 2026 - 2027</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
            Admissions &amp; Pre-Form One 2026/2027
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
            Nafasi za kujiunga na Pre-Form One, Kidato cha Kwanza na Kidato cha Tatu kwa wavulana na wasichana (Bweni na Kutwa) zipo wazi. Shule ya Kikatoliki yenye malezi thabiti, maabara za kisasa, maktaba kubwa, na mazingira tulivu ya Marangu, Kilimanjaro.
          </p>
        </div>

        {/* 3 Main Entry Routes: Pre-Form 1, Form 1 & Transfers */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pre-Form One - Direct from Flyer Special Notice */}
          <div className="bg-white p-6 rounded-2xl border-2 border-amber-400/80 shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                SPECIAL NOTICE
              </span>
              <h3 className="text-lg font-bold text-[#102A43]">
                Pre-Form One Program
              </h3>
              <p className="text-xs font-bold text-amber-700">
                🗓️ Inaanza: 21 Septemba 2026
              </p>
              <p className="text-xs text-slate-600 leading-[1.6]">
                Mpango maalum wa kuwajengea msingi imara wanafunzi waliomaliza darasa la saba katika lugha ya Kiingereza, hisabati (Mathematics) na stadi za sayansi kabla ya kuanza rasmi kidato cha kwanza.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Kiingereza cha kina &amp; Sayansi</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Nafasi za Bweni na Kutwa zipo</span>
              </li>
            </ul>
          </div>

          {/* Form One */}
          <div className="bg-white p-6 rounded-2xl border border-[#102A43]/15 border-t-4 border-t-[#102A43] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#C9A227] tracking-wider uppercase">
                Direct Entry
              </span>
              <h3 className="text-lg font-bold text-[#102A43]">
                Form One Admissions
              </h3>
              <p className="text-xs text-slate-600 leading-[1.6]">
                Wanafunzi waliohitimu Darasa la Saba (PSLE) wanakaribishwa kujiunga na Shule ya Sekondari Uomboni. Mazingira yenye utulivu wa kipekee na walimu waliojitolea.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>Bweni na Kutwa (Wavulana &amp; Wasichana)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>Ada nafuu inayolipwa kwa awamu</span>
              </li>
            </ul>
          </div>

          {/* Transfers Form 2 & 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#102A43]/15 border-t-4 border-t-[#C9A227] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#102A43] tracking-wider uppercase">
                Continuing Students
              </span>
              <h3 className="text-lg font-bold text-[#102A43]">
                Kidato cha 2 &amp; 3 (Transfers)
              </h3>
              <p className="text-xs text-slate-600 leading-[1.6]">
                Uhamisho kwa wanafunzi wa Kidato cha Pili na Tatu wenye maendeleo mazuri ya kitaaluma na tabia njema kutoka shule zilizosajiliwa.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>Kipimo cha alama za mitihani ya awali</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>Mwendelezo mzuri wa masomo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Requirements & Dates Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admission Requirements (7 cols) */}
          <div className="lg:col-span-7 bg-white p-7 rounded-lg border border-slate-200">
            <h4 className="text-base font-semibold text-[#102A43] mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C9A227]" />
              <span>Admission Requirements</span>
            </h4>
            <div className="space-y-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-[#FFFFF0] border border-[#102A43]/20 flex items-center justify-center text-[11px] font-bold text-[#102A43] shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Dates & Application Info (5 cols) */}
          <div className="lg:col-span-5 bg-white p-7 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-[#102A43] mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C9A227]" />
                <span>Important Dates</span>
              </h4>
              <div className="space-y-3 text-xs sm:text-sm">
                {dates.map((d) => (
                  <div key={d.event} className="pb-2.5 border-b border-slate-100 last:border-b-0">
                    <span className="font-semibold text-[#102A43] block">{d.event}</span>
                    <span className="text-slate-500 text-xs">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <h5 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-1">
                Upatikanaji wa Fomu (Kwenye Tangazo la Shule)
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fomu za kujiunga zinapatikana: <strong>Ofisi ya Shule Marangu</strong>, <strong>Moshi Bookshop</strong>, na <strong>Ngarenaro</strong>. Pia unaweza kupakua mtandaoni hapa.
              </p>
              <div className="mt-2 text-[11px] text-slate-700 font-mono font-bold">
                Mawasiliano: 0752 000 939 | 0782 558 127 | 0745 548 225 | 0754 532 949
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Strip with School Logo */}
        <div className="mt-10 p-6 rounded-lg bg-white border border-[#102A43]/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-2 rounded-xl bg-[#FFFFF0] border border-[#C9A227]/40 shadow-xs shrink-0">
              <SchoolLogo size="md" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#102A43]">
                Ready to Apply for Uomboni Secondary School?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Review full joining instructions, fee structure, and complete your admission request.
              </p>
            </div>
          </div>

          <button
            id="admissions-view-btn"
            onClick={onOpenAdmissions}
            className="w-full sm:w-auto px-7 py-3 rounded-md bg-[#102A43] text-white font-semibold text-sm hover:bg-[#0A1C2E] transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 group shrink-0"
          >
            <span>View Admissions</span>
            <ArrowRight className="w-4 h-4 text-[#C9A227] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
