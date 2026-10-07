import React from 'react';
import { SAVED_TEACHERS } from '../data/savedSchoolMedia';
import { Award, Users, BookOpen, CheckCircle } from 'lucide-react';

export const LeadershipTeachersSection: React.FC = () => {
  // Select teachers with real, authentic photographs from Uomboni Secondary School
  const authenticTeachers = SAVED_TEACHERS.filter(
    (t) => t.imageUrl && !t.imageUrl.includes('unsplash')
  ).slice(0, 5);

  return (
    <section id="teachers" className="py-20 sm:py-24 bg-[#FFFFF0] border-t border-[#102A43]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase">
            Uongozi na Walimu wa Taaluma · Teaching Faculty
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
            Meet Our Teachers &amp; Academic Leadership
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
            Walimu wetu wana sifa stahiki na uzoefu mpana katika ufundishaji wa silabasi ya NECTA, usimamizi wa maabara za sayansi, na malezi ya kiroho na kimaadili chini ya Jimbo Katoliki la Moshi.
          </p>
        </div>

        {/* Featured Full Faculty Photograph */}
        <div className="mt-10 rounded-lg overflow-hidden border border-[#102A43]/15 bg-white shadow-sm">
          <div className="aspect-21/9 sm:aspect-24/9 overflow-hidden bg-slate-900 relative">
            <img
              src="/media/media_17.webp"
              alt="Uomboni Secondary School Full Teaching Faculty & Administrative Leadership"
              width={1024}
              height={461}
              className="w-full h-full object-cover object-center select-none"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 sm:p-6">
              <div className="text-white">
                <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider block">
                  Picha Rasmi ya Jopo la Walimu na Watumishi · Official Staff Photograph
                </span>
                <p className="text-sm sm:text-base font-serif font-bold text-white mt-0.5">
                  Uomboni Secondary School Faculty &amp; Academic Staff
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Academic Leaders with Real Photographs */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {authenticTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-lg border border-[#102A43]/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              {/* Teacher Photograph */}
              <div className="aspect-4/5 overflow-hidden bg-slate-100 relative">
                <img
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  width={400}
                  height={500}
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Card Details */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#C9A227] tracking-wider block uppercase">
                    {teacher.department || 'Taaluma & Utawala'}
                  </span>
                  <h3 className="text-sm font-bold text-[#102A43] mt-1 leading-snug">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {teacher.role}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs">
                  <div className="flex items-start justify-between gap-1 text-[11px]">
                    <span className="text-slate-400">Masomo:</span>
                    <span className="font-semibold text-[#102A43] text-right truncate max-w-[120px]">
                      {Array.isArray(teacher.subjects)
                        ? teacher.subjects.join(', ')
                        : teacher.subjects || 'Taaluma'}
                    </span>
                  </div>
                  {teacher.qualification && (
                    <div className="flex items-start justify-between gap-1 text-[11px] mt-1">
                      <span className="text-slate-400">Taaluma:</span>
                      <span className="text-slate-600 text-right truncate max-w-[120px]">
                        {teacher.qualification.split(',')[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Commitment note */}
        <div className="mt-8 p-4 rounded-md bg-white border border-[#102A43]/10 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
            <span>
              Walimu wote wa Uomboni wameidhinishwa kitaifa na hufundisha masomo ya Sayansi, Sanaa, Lugha na Biashara kwa weledi wa hali ya juu.
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">NECTA S0486 · Moshi Rural</span>
        </div>
      </div>
    </section>
  );
};
