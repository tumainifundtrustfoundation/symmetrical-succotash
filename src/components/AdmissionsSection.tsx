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
    { event: 'Application Window Opens', date: 'October 1, 2025' },
    { event: 'Entrance Assessments & Interviews', date: 'November – December 2025' },
    { event: 'Form One Reporting & Orientation', date: 'Early January 2026' },
    { event: 'Form 2 & 3 Transfer Admissions Deadline', date: 'January 15, 2026' },
  ];

  return (
    <section id="admissions" className="py-20 sm:py-24 bg-[#FFFFF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase">
            Enrollment 2026
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
            Admissions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
            We welcome applications for Form One entry and selective transfer placements into Form Two and Form Three for boys and girls seeking day or boarding education.
          </p>
        </div>

        {/* 2 Main Entry Routes: Form One & Transfers */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form One */}
          <div className="bg-white p-7 rounded-lg border border-[#102A43]/15 border-t-4 border-t-[#102A43] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#C9A227] tracking-wider uppercase">
                Direct Entry
              </span>
              <h3 className="text-xl font-semibold text-[#102A43] mt-1">
                Form One Admissions
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-[1.7] font-normal">
                Open to Standard Seven primary school graduates who have passed the National Primary School Leaving Examination (PSLE). Candidates must exhibit good character, willingness to learn, and readiness for a disciplined academic life.
              </p>
              <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>Day &amp; Boarding placements available</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>Comprehensive pastoral and academic orientation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Transfers */}
          <div className="bg-white p-7 rounded-lg border border-[#102A43]/15 border-t-4 border-t-[#C9A227] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#102A43] tracking-wider uppercase">
                Continuing Students
              </span>
              <h3 className="text-xl font-semibold text-[#102A43] mt-1">
                Student Transfers (Forms 2 &amp; 3)
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-[1.7] font-normal">
                Transfers from other registered secondary schools are considered based on vacancies, past term examination broadsheets, continuous assessment records, and a formal recommendation letter from the previous head of school.
              </p>
              <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>Subject credit evaluation &amp; interview</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>Smooth curriculum continuity and boarding integration</span>
                </li>
              </ul>
            </div>
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
                Application Information
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Forms are available online or at the Headmaster&apos;s Office in Marangu West, Moshi.
              </p>
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
