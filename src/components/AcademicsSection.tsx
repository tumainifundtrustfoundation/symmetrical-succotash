import React from 'react';

interface AcademicsSectionProps {
  onOpenAdmissions?: () => void;
  onOpenResults?: () => void;
}

export const AcademicsSection: React.FC<AcademicsSectionProps> = ({
  onOpenAdmissions,
  onOpenResults,
}) => {
  const forms = [
    {
      form: 'Form One',
      description: 'Foundational secondary stage introducing secondary science subjects, advanced mathematics, English communication, and disciplined study habits.',
      focus: 'Foundations & Transition',
    },
    {
      form: 'Form Two',
      description: 'Core subject deepening and intensive preparation for the National Form Two Assessment (FTNA) administered by NECTA.',
      focus: 'FTNA National Assessment',
    },
    {
      form: 'Form Three',
      description: 'Specialized subject concentration, extensive practical laboratory experiments, and coursework mastery across arts and sciences.',
      focus: 'Specialization & Practicals',
    },
    {
      form: 'Form Four',
      description: 'Comprehensive academic revision, mock examination series, and preparation for the Certificate of Secondary Education Examination (CSEE).',
      focus: 'NECTA CSEE Preparation',
    },
  ];

  const departments = [
    {
      name: 'Science',
      subjects: 'Physics, Chemistry & Biology',
      description: 'Rigorous theoretical instruction reinforced with hands-on laboratory experiments, scientific reasoning, and practical test readiness.',
    },
    {
      name: 'Mathematics',
      subjects: 'Basic Mathematics',
      description: 'Focus on logical deduction, problem solving, algebraic methods, geometry, trigonometry, and statistical analysis.',
    },
    {
      name: 'Languages',
      subjects: 'English & Kiswahili',
      description: 'Comprehensive grammatical instruction, literature comprehension, essay composition, and spoken communication fluency.',
    },
    {
      name: 'Humanities',
      subjects: 'History, Geography & Civics',
      description: 'Critical exploration of national heritage, governance, environmental geography, global affairs, and social responsibility.',
    },
    {
      name: 'ICT',
      subjects: 'Computer Studies & Digital Literacy',
      description: 'Practical computer laboratory sessions teaching digital literacy, document preparation, internet research, and computational principles.',
    },
  ];

  return (
    <section id="academics" className="py-20 sm:py-24 bg-white border-t border-b border-[#102A43]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase">
            Curriculum &amp; Learning
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
            Academics
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
            Uomboni Secondary School follows the official Tanzanian national curriculum accredited by the Ministry of Education, Science and Technology and the National Examinations Council of Tanzania (NECTA).
          </p>
        </div>

        {/* 1. Academic Levels (Forms 1–4) */}
        <div className="mt-12">
          <h3 className="text-base font-semibold text-[#102A43] mb-6 flex items-center gap-2">
            <span>Academic Levels</span>
            <span className="h-px bg-slate-200 flex-grow max-w-xs" />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {forms.map((item) => (
              <div
                key={item.form}
                className="bg-[#FFFFF0] p-6 rounded-lg border border-[#102A43]/10 border-t-2 border-t-[#102A43] flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-semibold text-[#C9A227] tracking-wider uppercase">
                    {item.focus}
                  </div>
                  <h4 className="text-lg font-semibold text-[#102A43] mt-1">
                    {item.form}
                  </h4>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-[1.7] font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Core Academic Departments */}
        <div className="mt-16">
          <h3 className="text-base font-semibold text-[#102A43] mb-6 flex items-center gap-2">
            <span>Core Subject Departments</span>
            <span className="h-px bg-slate-200 flex-grow max-w-xs" />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="bg-white p-6 rounded-lg border border-slate-200 border-l-4 border-l-[#C9A227] shadow-xs"
              >
                <h4 className="text-base font-semibold text-[#102A43]">
                  {dept.name}
                </h4>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  {dept.subjects}
                </div>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-[1.7] font-normal">
                  {dept.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info strip */}
        <div className="mt-12 p-6 rounded-lg bg-[#FFFFF0] border border-[#C9A227]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold text-[#102A43] block">
              Official Examination Centre: NECTA S0486
            </span>
            <span className="text-xs text-slate-600">
              Regular continuous assessments, weekly tests, and supervised evening prep for all students.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenResults && (
              <button
                onClick={onOpenResults}
                className="px-4 py-2 text-xs font-semibold text-[#102A43] border border-[#102A43]/20 bg-white hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
              >
                View Examination Results
              </button>
            )}
            {onOpenAdmissions && (
              <button
                onClick={onOpenAdmissions}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0A1C2E] rounded-md transition-colors cursor-pointer"
              >
                Enroll for 2026
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
