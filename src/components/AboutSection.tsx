import React from 'react';
import { SchoolLogo } from './SchoolLogo';
import { useLanguage } from '../context/LanguageContext';
import {
  Cross,
  CheckCircle2,
  Sparkles,
  Award,
  BookOpen,
  Target,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Scale,
  Users2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

interface AboutSectionProps {
  onNavigate?: (sectionId: string) => void;
  onOpenAdmissions?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate, onOpenAdmissions }) => {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  return (
    <section id="about" className="py-20 sm:py-24 bg-[#FFFFF0] border-t border-[#102A43]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase">
            {isSwahili ? 'Kuhusu Shule Yetu · Catholic Diocese of Moshi' : 'Institutional Profile · Catholic Diocese of Moshi'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
            {isSwahili ? 'Kuhusu Shule ya Sekondari Uomboni' : 'About Uomboni Secondary School'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
            {isSwahili
              ? 'Shule ya Sekondari Uomboni ni shule ya sekondari ya kutwa na bweni kwa wavulana na wasichana (Kidato cha 1 hadi cha 4) iliyopo Marangu-Moshi, Mkoa wa Kilimanjaro, chini ya Jimbo Katoliki la Moshi. Shule inatekeleza dhamira ya kutoa elimu bora na ufaulu wa juu wa kitaaluma, nidhamu na maadili mema.'
              : 'Uomboni Secondary School is a registered Catholic co-educational Ordinary Level (Forms 1–4) day and boarding school located in Marangu-Moshi, Kilimanjaro, under the Catholic Diocese of Moshi. We are committed to nurturing high academic performance, self-reliance, moral discipline, and holistic character.'}
          </p>
        </div>

        {/* OFFICIAL CHARTER DISPLAY (Based on Official Letterhead) */}
        <div className="bg-white rounded-xl border-2 border-[#C9A227]/40 shadow-sm overflow-hidden mb-16">
          {/* Letterhead Header Banner */}
          <div className="bg-[#102A43] text-white p-6 sm:p-8 text-center relative border-b border-[#C9A227]/30">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-white p-1 rounded-full shadow-md">
                <SchoolLogo size="full" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#C9A227]">
                CATHOLIC DIOCESE OF MOSHI
              </h3>
              <h4 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                UOMBONI SECONDARY SCHOOL
              </h4>
              <p className="text-xs sm:text-sm font-medium tracking-wide text-[#FFFFF0]/90 mt-1">
                MARANGU-MOSHI · P.O. BOX 361
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-3 text-xs text-[#FFFFF0]/80 pt-2 border-t border-white/10">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Email: <strong className="text-white font-medium">uombonisecondary@gmail.com</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>SIMU Na: <strong className="text-white font-medium">0767 207 688</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>NECTA Centre: <strong className="text-[#C9A227] font-medium">S0486</strong></span>
                </span>
              </div>
            </div>
          </div>

          {/* Institutional Pillars Grid (Motto, Mission, Vision, Core Values) */}
          <div className="p-6 sm:p-10 bg-[#FFFFF0]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 1. MOTTO */}
              <div className="bg-white p-6 rounded-lg border border-[#102A43]/15 border-t-4 border-t-[#C9A227] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                      {isSwahili ? 'Wito wa Shule' : 'School Motto'}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#102A43] leading-snug">
                    &ldquo;Tujiendeleze sisi wenyewe.&rdquo;
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {isSwahili
                      ? 'Kaulimbiu inayosisitiza moyo wa kujitegemea, bidii, maarifa, na uwajibikaji wa mwanafunzi na jamii nzima ya Uomboni.'
                      : 'Our defining motto fostering self-reliance, personal industry, knowledge, and shared community responsibility.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#102A43]">
                  MOTTO: Tujiendeleze sisi wenyewe.
                </div>
              </div>

              {/* 2. MISSION */}
              <div className="bg-white p-6 rounded-lg border border-[#102A43]/15 border-t-4 border-t-[#102A43] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#102A43] uppercase tracking-wider">
                      {isSwahili ? 'Dira ya Shule' : 'Our Mission'}
                    </span>
                    <Target className="w-4 h-4 text-[#102A43]" />
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#102A43] leading-snug">
                    &ldquo;To provide quality education and impressive academic performance.&rdquo;
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {isSwahili
                      ? 'Dhamira yetu kuu ni kutoa elimu bora yenye viwango vya juu vya ufaulu wa kitaaluma, umakini katika masomo na utendaji wa vitendo.'
                      : 'Our mission is to provide rigorous, high-quality secondary education resulting in stellar, impressive academic results.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#C9A227]">
                  MISSION: Quality Education &amp; Performance
                </div>
              </div>

              {/* 3. VISION */}
              <div className="bg-white p-6 rounded-lg border border-[#102A43]/15 border-t-4 border-t-[#102A43] shadow-xs flex flex-col justify-between md:col-span-2 lg:col-span-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#102A43] uppercase tracking-wider">
                      {isSwahili ? 'Dhima ya Shule' : 'Our Vision'}
                    </span>
                    <Compass className="w-4 h-4 text-[#102A43]" />
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#102A43] leading-snug">
                    &ldquo;To be the centre of excellence in providing quality education in the country.&rdquo;
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {isSwahili
                      ? 'Lengo letu ni kuwa kituo cha mfano bora na kielelezo cha kitaifa katika utoaji wa elimu bora na maadili mema nchini Tanzania.'
                      : 'To serve as a national benchmark of educational excellence, holistic character, and competence across Tanzania.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#C9A227]">
                  VISION: National Centre of Excellence
                </div>
              </div>
            </div>

            {/* 4. OUR CORE VALUES (Strictly as written in the official document) */}
            <div className="mt-8 bg-white p-6 sm:p-8 rounded-lg border border-[#102A43]/15 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
                    {isSwahili ? 'Nguzo za Maadili Yetu' : 'Institutional Principles'}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#102A43] mt-0.5">
                    OUR CORE VALUES · MAADILI YA MSINGI
                  </h4>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-[#102A43] text-white rounded-md self-start sm:self-auto">
                  6 Core Values
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Prayer and work */}
                <div className="p-4 rounded-md bg-[#FFFFF0] border border-[#102A43]/10 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-md bg-[#102A43] text-[#C9A227] flex items-center justify-center shrink-0 mt-0.5">
                    <Cross className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#102A43]">
                      1. Prayer and work.
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {isSwahili ? 'Sala na Kazi — kumtanguliza Mungu na kufanya kazi kwa bidii na nidhamu.' : 'Spiritual devotion paired with diligent, relentless industry.'}
                    </p>
                  </div>
                </div>

                {/* 2. Efficiency */}
                <div className="p-4 rounded-md bg-[#FFFFF0] border border-[#102A43]/10 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-md bg-[#102A43] text-[#C9A227] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#102A43]">
                      2. Efficiency.
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {isSwahili ? 'Ufanisi wa hali ya juu katika matumizi ya muda na utekelezaji wa masomo.' : 'Optimal resource utilization, punctuality, and productive focus.'}
                    </p>
                  </div>
                </div>

                {/* 3. Team work */}
                <div className="p-4 rounded-md bg-[#FFFFF0] border border-[#102A43]/10 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-md bg-[#102A43] text-[#C9A227] flex items-center justify-center shrink-0 mt-0.5">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#102A43]">
                      3. Team work.
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {isSwahili ? 'Ushirikiano madhubuti kati ya walimu, wanafunzi, wazazi na uongozi.' : 'Collaborative synergy uniting teachers, students, and families.'}
                    </p>
                  </div>
                </div>

                {/* 4. Discipline */}
                <div className="p-4 rounded-md bg-[#FFFFF0] border border-[#102A43]/10 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-md bg-[#102A43] text-[#C9A227] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#102A43]">
                      4. Discipline.
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {isSwahili ? 'Nidhamu thabiti ya kibinafsi, heshima kwa sheria, na maadili mema.' : 'Personal self-governance, respect for authority, and order.'}
                    </p>
                  </div>
                </div>

                {/* 5. Accountability */}
                <div className="p-4 rounded-md bg-[#FFFFF0] border border-[#102A43]/10 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-md bg-[#102A43] text-[#C9A227] flex items-center justify-center shrink-0 mt-0.5">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#102A43]">
                      5. Accountability.
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {isSwahili ? 'Uwajibikaji kamili katika majukumu ya kitaaluma, uongozi na malezi.' : 'Personal and collective ownership of results and duties.'}
                    </p>
                  </div>
                </div>

                {/* 6. Transparency */}
                <div className="p-4 rounded-md bg-[#FFFFF0] border border-[#102A43]/10 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-md bg-[#102A43] text-[#C9A227] flex items-center justify-center shrink-0 mt-0.5">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#102A43]">
                      6. Transparency.
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {isSwahili ? 'Uwazi, ukweli na uaminifu katika uendeshaji wa shule na taaluma.' : 'Openness, honesty, and integrity in all administrative engagements.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real School Campus Photography & Environment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-lg overflow-hidden border border-[#102A43]/15 shadow-md bg-white">
              <img
                src="/media/media_6.webp"
                alt="Uomboni Secondary School Administration and Classrooms, Marangu"
                width={1000}
                height={750}
                className="w-full h-auto aspect-4/3 object-cover select-none"
                loading="lazy"
                decoding="async"
              />
              <div className="p-4 bg-white border-t border-slate-100">
                <p className="text-xs font-bold text-[#102A43]">
                  Uomboni Secondary School Campus
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Marangu-Moshi · P.O. Box 361 · Catholic Diocese of Moshi
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-semibold text-[#C9A227] tracking-wider uppercase block">
              {isSwahili ? 'Historia na Malezi ya Shule' : 'Heritage & Ethos'}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#102A43] leading-snug">
              {isSwahili
                ? 'Elimu ya Sekondari yenye Mizizi ya Maadili Mema na Taaluma Bora'
                : 'Secondary Education Rooted in Moral Values & Academic Diligence'}
            </h3>
            <p className="text-sm text-slate-700 leading-[1.8] font-normal">
              {isSwahili
                ? 'Ikiwa imezungukwa na hali ya hewa ya baridi na mazingira ya kijani kibichi ya mteremko wa Mlima Kilimanjaro Marangu, Shule ya Sekondari Uomboni inatoa mazingira bora ya utulivu wa kiakili. Wanafunzi hufundishwa masomo yote ya msingi ya O-Level (Kidato cha I hadi IV), mafunzo ya vitendo maabarani, stadi za TEHAMA, na malezi ya kiroho yanayowaandaa kuwa raia wema na viongozi wa kesho.'
                : 'Surrounded by the serene, cool mountain climate of Mount Kilimanjaro in Marangu, Uomboni Secondary School offers the optimal environment for academic study and personal reflection. Students master national curriculum subjects through practical laboratory experiments, ICT computing, athletic competitions, and moral coaching.'}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              {onOpenAdmissions && (
                <button
                  type="button"
                  onClick={onOpenAdmissions}
                  className="px-6 py-3 rounded-md bg-[#102A43] text-white text-xs font-semibold hover:bg-[#0A1C2E] transition-colors cursor-pointer shadow-xs"
                >
                  {isSwahili ? 'Omba Udahili wa Kujiunga' : 'Apply for Admission'}
                </button>
              )}
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3 rounded-md border border-[#102A43]/25 text-[#102A43] text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Wasiliana Nasi' : 'Contact Administration'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
