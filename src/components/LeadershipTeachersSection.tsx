import React from 'react';
import { SAVED_TEACHERS } from '../data/savedSchoolMedia';

export const LeadershipTeachersSection: React.FC = () => {
  // Use authentic school teachers with real local media images
  const teachers = SAVED_TEACHERS.slice(0, 8);

  return (
    <section id="teachers" className="py-20 sm:py-24 bg-[#FFFFF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase">
            Faculty &amp; Academic Staff
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
            Meet Our Teachers
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
            Our qualified and experienced educators provide disciplined academic guidance, mentorship, and continuous pastoral support to ensure student success.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-lg border border-[#102A43]/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              {/* Teacher Photograph */}
              <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                <img
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Card Details */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#C9A227] tracking-wider block uppercase">
                    {teacher.department || 'Academic Department'}
                  </span>
                  <h3 className="text-base font-semibold text-[#102A43] mt-1">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    {teacher.role}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500">Subject:</span>
                    <span className="font-semibold text-[#102A43] text-right">
                      {Array.isArray(teacher.subjects)
                        ? teacher.subjects.join(', ')
                        : teacher.subjects || 'General Studies'}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 mt-1.5">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-700 text-right">
                      {teacher.department || 'Teaching Staff'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Teacher standard commitment note */}
        <div className="mt-12 text-center text-xs text-slate-500">
          Uomboni Secondary School maintains a strong teacher-to-student ratio ensuring individualized academic monitoring and continuous remedial support.
        </div>
      </div>
    </section>
  );
};
