import React from 'react';
import { SchoolLogo } from './SchoolLogo';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  Sparkles,
  BookOpen,
  Award,
  Users,
  Compass,
  HeartHandshake,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Layers,
  GraduationCap,
  FlaskConical,
  Trees,
  Laptop,
  Church,
  Trophy
} from 'lucide-react';

interface AboutSectionProps {
  onNavigate?: (sectionId: string) => void;
  onOpenAdmissions?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate, onOpenAdmissions }) => {
  const { language } = useLanguage();
  const { schoolProfile } = useData();

  // 7 Core Features verbatim from the official School Flyer / Karatasi ya Udahili
  const flyerFeatures = [
    {
      icon: Users,
      titleSw: 'Experienced & Committed Teachers',
      titleEn: 'Experienced & Committed Teachers',
      descSw: 'Walimu wenye uzoefu mkubwa wa kitaaluma, waliojitolea na wanaoishi maadili ya malezi ya mwanafunzi.',
      descEn: 'Highly qualified, dedicated educators providing rigorous syllabus coverage and individual academic guidance.',
    },
    {
      icon: Trees,
      titleSw: 'Conducive Learning Environment',
      titleEn: 'Conducive Learning Environment',
      descSw: 'Mazingira tulivu, hewa safi na uoto wa asili kwenye mteremko wa Mlima Kilimanjaro, Marangu West.',
      descEn: 'Serene, distraction-free campus nestled on the cool slopes of Mount Kilimanjaro in Marangu.',
    },
    {
      icon: FlaskConical,
      titleSw: 'Modern Library & Science Labs',
      titleEn: 'Modern Library & Science Labs',
      descSw: 'Maabara tatu kamili za Fizikia, Kemia, Baiolojia na Maktaba kubwa ya kisasa yenye maelfu ya vitabu.',
      descEn: 'Fully equipped Physics, Chemistry, Biology laboratories and extensive resource library.',
    },
    {
      icon: Trophy,
      titleSw: 'High Academic Excellence',
      titleEn: 'High Academic Excellence',
      descSw: 'Ufaulu wa juu endelevu katika mitihani ya NECTA na CSSC na idadi kubwa ya wanafunzi wa Daraja I na II.',
      descEn: 'Consistent high pass-rate track record in National (NECTA) and Northern Zone Christian schools exams.',
    },
    {
      icon: Church,
      titleSw: 'Spiritual & Moral Guidance (Catholic Values)',
      titleEn: 'Spiritual & Moral Guidance (Catholic Values)',
      descSw: 'Malezi ya kiroho, Misa Takatifu na maadili thabiti chini ya Jimbo Katoliki la Moshi na Padri Mlezi.',
      descEn: 'Holistic Catholic values, resident chaplaincy, spiritual retreats, and strong moral discipline.',
    },
    {
      icon: Award,
      titleSw: 'Sports & Extracurricular Activities',
      titleEn: 'Sports & Extracurricular Activities',
      descSw: 'Michezo ya mpira wa miguu, pete, wavu, kwaya, mijadala ya kiingereza na vilabu vya taaluma.',
      descEn: 'Vibrant sports, liturgical choir, debate clubs, scouts, and student leadership development.',
    },
    {
      icon: Laptop,
      titleSw: 'Computer & ICT Studies',
      titleEn: 'Computer & ICT Studies',
      descSw: 'Maabara ya kisasa ya kompyuta yenye intaneti na mafunzo ya stadi za kidijitali na TEHAMA.',
      descEn: 'Modern computer lab with educational software and internet equipping students with digital literacy.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-24 bg-[#FFFFF0] border-b border-[#102A43]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Part: Overview + Real Photo + Official Institutional Fact Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Real School Photograph & Official Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#102A43]/15 shadow-lg bg-white group">
              <img
                src="/media/media_6.webp"
                alt="Uomboni Secondary School Administration and Classrooms, Marangu"
                className="w-full h-auto aspect-4/3 object-cover group-hover:scale-102 transition-transform duration-500"
                loading="lazy"
              />
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#102A43]">
                    Uomboni Secondary School Campus
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Marangu West, Moshi Vijijini · Jimbo Katoliki la Moshi
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#F5EBD7] text-[#704214] border border-[#704214]/20">
                  NECTA S0486
                </span>
              </div>
            </div>

            {/* Quick Fact Box with Official School Crest */}
            <div className="bg-white p-5 rounded-2xl border border-[#102A43]/15 shadow-sm space-y-3">
              <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
                <SchoolLogo size="md" />
                <div>
                  <h4 className="text-xs font-black text-[#102A43] uppercase tracking-wider">
                    Uomboni Secondary School
                  </h4>
                  <p className="text-[11px] text-[#C9A227] font-bold">
                    Catholic Diocese of Moshi (Jimbo Katoliki la Moshi)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FFFFF0] border border-[#102A43]/10">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Kituo cha NECTA</span>
                  <span className="font-mono font-black text-sm text-[#102A43]">S0486</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFFFF0] border border-[#102A43]/10">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Madarasa</span>
                  <span className="font-bold text-xs text-[#102A43]">Form 1 – 4 (Bweni &amp; Kutwa)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFFFF0] border border-[#102A43]/10">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Eneo</span>
                  <span className="font-bold text-xs text-[#102A43]">Marangu, Moshi - Kilimanjaro</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFFFF0] border border-[#102A43]/10">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Mawasiliano</span>
                  <span className="font-bold text-xs text-[#102A43]">info@uomboniss.ac.tz</span>
                </div>
              </div>

              {/* Admissions Action Link */}
              <button
                type="button"
                onClick={onOpenAdmissions ? onOpenAdmissions : () => onNavigate?.('admissions')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#102A43] to-[#0A1C2E] hover:from-[#0A1C2E] hover:to-[#102A43] text-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-[#C9A227]/40"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>{language === 'sw' ? 'Taarifa za Kujiunga & Udahili 2026' : 'Admissions & Enrollment 2026'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: About Narrative + Main Motto Banner */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#102A43]/10 text-[#102A43] text-xs font-black tracking-wider uppercase mb-3 border border-[#102A43]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>{language === 'sw' ? 'Kuhusu Shule ya Sekondari Uomboni' : 'About Uomboni Secondary School'}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
                {language === 'sw'
                  ? 'Taasisi ya Elimu Bora, Malezi ya Kiroho na Maadili Mema'
                  : 'A Sanctuary of Academic Competence, Spiritual Growth & Moral Discipline'}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-700 leading-[1.8] font-normal">
                {language === 'sw'
                  ? 'Shule ya Sekondari Uomboni ni shule ya kutwa na bweni kwa wavulana na wasichana (Kidato cha 1 hadi 4) iliyopo katika mazingira tulivu, hewa safi na yenye uoto mzuri wa asili ya Marangu West kwenye mteremko wa Mlima Kilimanjaro. Chini ya usimamizi wa Jimbo Katoliki la Moshi, tunajizatiti kutoa elimu yenye viwango vya juu vya kitaaluma inayomjenga mwanafunzi kifikra, kimaadili, na kiroho.'
                  : 'Uomboni Secondary School is an established co-educational Ordinary Level (Forms 1–4) day and boarding school situated in the tranquil, intellectually stimulating climate of Marangu West on the slopes of Mount Kilimanjaro. Under the auspices of the Catholic Diocese of Moshi, we are dedicated to providing accessible, high-quality secondary education rooted in academic rigor, self-discipline, and moral integrity.'}
              </p>
            </div>

            {/* Prominent Motto Highlight Card from Flyer & Logo */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#102A43] via-[#0b2545] to-[#102A43] text-white border-2 border-[#C9A227] shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300">
                  {language === 'sw' ? '★ KAULIMBIU RASMI YA SHULE (OFFICIAL MOTTO)' : '★ OFFICIAL SCHOOL MOTTO'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                  Catholic Diocese of Moshi
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-serif text-2xl sm:text-3xl font-black text-amber-300 tracking-wide">
                  “ELIMU NI MAISHA”
                </p>
                <p className="text-xs sm:text-sm font-bold text-white/95">
                  “TUJENDELEE SISI WENYEWE”
                </p>
                <p className="text-xs text-amber-200/90 font-medium">
                  Misingi ya Nembo: <span className="font-black text-white">PRAYER · EDUCATION · WORK</span> (Sala, Elimu na Kazi)
                </p>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed pt-1">
                {language === 'sw'
                  ? 'Kaulimbiu hii inayopatikana kwenye nembo na karatasi rasmi ya shule inasisitiza kwamba elimu ya kweli ni chachu ya maisha, ikishirikiana na maombi, heshima, na kazi ya bidii ili kujiendeleza wenyewe.'
                  : 'Our institutional motto embodies education as the foundation of meaningful life, combining persistent prayer, academic rigor, and diligent work to achieve true self-reliance.'}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars: Vision, Mission, Core Values, Foundation */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#102A43]">
              {language === 'sw' ? 'Dira, Dhima na Misingi ya Uomboni Secondary' : 'Our Vision, Mission & Foundational Values'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {language === 'sw'
                ? 'Misingi thabiti inayoongoza kila hatua ya utendaji wetu na malezi ya wanafunzi.'
                : 'Guiding tenets shaping our curriculum, pastoral care, and student character formation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Vision (Dira) */}
            <div className="bg-white p-5 rounded-2xl border border-[#102A43]/15 border-t-4 border-t-amber-500 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-600 mb-2">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-[#102A43] uppercase tracking-wide">
                  {language === 'sw' ? 'Dira Yetu (Our Vision)' : 'Our Vision'}
                </h4>
                <p className="mt-2 text-xs text-slate-700 leading-[1.7] font-semibold">
                  “{language === 'sw'
                    ? (schoolProfile?.visionSw || 'Kutoa elimu bora na ufaulu wa kuvutia kitaaluma')
                    : (schoolProfile?.vision || schoolProfile?.visionEn || 'To provide quality education and impressive academic performance')}”
                </p>
                <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                  {language === 'sw'
                    ? 'Inaongozwa na kaulimbiu rasmi ya “Elimu ni Maisha” chini ya Jimbo Katoliki la Moshi, Marangu.'
                    : 'Guided by the official motto “Elimu ni Maisha” under the Catholic Diocese of Moshi, Marangu.'}
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md self-start border border-amber-200">
                Ubora na Maono
              </span>
            </div>

            {/* 2. Mission (Dhima) */}
            <div className="bg-white p-5 rounded-2xl border border-[#102A43]/15 border-t-4 border-t-[#102A43] shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-900/10 border border-blue-900/20 flex items-center justify-center text-[#102A43] mb-2">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-[#102A43] uppercase tracking-wide">
                  {language === 'sw' ? 'Dhima Yetu (Our Mission)' : 'Our Mission'}
                </h4>
                <p className="mt-2 text-xs text-slate-700 leading-[1.7] font-normal">
                  {language === 'sw'
                    ? (schoolProfile?.missionSw || 'Kuelimisha wavulana na wasichana kufikia uwezo wao kamili ili wawe watu wanaojitegemea na wenye nidhamu wanaoweza kukabiliana na changamoto za sasa na zijazo kupitia ushirikiano na wazazi na jamii husika.')
                    : (schoolProfile?.mission || schoolProfile?.missionEn || 'To educate boys and girls to their full potential so that they become independent and disciplined persons who can face contemporary and future challenges through the cooperation with parents and relevant community.')}
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#102A43] bg-blue-50 px-2.5 py-1 rounded-md self-start border border-blue-200">
                Wajibu na Utendaji
              </span>
            </div>

            {/* 3. Core Values */}
            <div className="bg-white p-5 rounded-2xl border border-[#102A43]/15 border-t-4 border-t-emerald-600 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700 mb-2">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-[#102A43] uppercase tracking-wide">
                  {language === 'sw' ? 'Maadili ya Msingi' : 'Core Values'}
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600 leading-[1.6]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Bidii &amp; Uadilifu:</strong> Academic diligence &amp; honesty</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Nidhamu &amp; Kujitambua:</strong> Moral discipline &amp; self-respect</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Sala na Kazi:</strong> Prayer, education &amp; hard work</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Unyenyekevu &amp; Huduma:</strong> Faith, humility &amp; service</span>
                  </li>
                </ul>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md self-start border border-emerald-200">
                Malezi Thabiti
              </span>
            </div>

            {/* 4. Institutional Foundation */}
            <div className="bg-white p-5 rounded-2xl border border-[#102A43]/15 border-t-4 border-t-[#C9A227] shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-700 mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-[#102A43] uppercase tracking-wide">
                  {language === 'sw' ? 'Msingi wa Shule' : 'Institutional Foundation'}
                </h4>
                <p className="mt-2 text-base font-serif font-bold text-[#102A43] leading-snug">
                  “ELIMU NI MAISHA”
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong>Tujendelee Sisi Wenyewe:</strong> Sala, Elimu na Kazi (Prayer, Education, Work). Chini ya Jimbo Katoliki la Moshi.
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md self-start border border-amber-200">
                Nembo na Kaulimbiu
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SIFA 7 KUU ZA UOMBONI & DIRA YA SHULE (OUR VISION & HALLMARK FEATURES)     */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border-2 border-amber-400/50 shadow-md space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 text-[11px] font-black uppercase tracking-wider mb-2 border border-amber-300 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'sw' ? 'Misingi na Sifa Kuu za Shule' : 'Foundational & Hallmark Features'}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-3xl font-bold text-[#102A43]">
                {language === 'sw' ? 'Dira & Sifa 7 za Ubora wa Uomboni (Our Vision & Hallmark Features):' : 'Our Vision & 7 Hallmark Features:'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                {language === 'sw'
                  ? 'Taarifa rasmi za kitaaluma, malezi ya kimaadili na vigezo vya ubora katika Shule ya Sekondari Uomboni (Moshi - Marangu) kwa mwaka wa masomo 2026/2027.'
                  : 'Official institutional features, academic rigor and foundational values of Uomboni Secondary School (2026/2027).'}
              </p>
            </div>

            {onOpenAdmissions && (
              <button
                onClick={onOpenAdmissions}
                className="px-5 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-amber-300 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0 border border-amber-400/30"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>{language === 'sw' ? 'Taarifa za Udahili 2026' : 'Admissions Info 2026'}</span>
              </button>
            )}
          </div>

          {/* Embedded Institutional Spotlight: School Seal & Core Facts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-slate-50 p-5 sm:p-6 rounded-2xl border border-amber-300/80 items-stretch">
            {/* Official School Seal & Affiliation Box */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#102A43] to-[#0A1C2E] text-white p-6 rounded-2xl border-2 border-amber-400/60 shadow-lg flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3.5">
                <SchoolLogo size="md" />
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                    NECTA REG: S0486
                  </span>
                  <h4 className="font-serif text-base font-bold text-white leading-tight">
                    UOMBONI SECONDARY
                  </h4>
                </div>
              </div>

              <div className="space-y-2.5 border-y border-white/10 py-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mamlaka &amp; Dhamana:</span>
                  <p className="font-bold text-amber-300 text-xs">Roman Catholic Diocese of Moshi</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mahali pa Shule:</span>
                  <p className="text-white text-xs font-medium">Marangu West, Mteremko wa Mlima Kilimanjaro</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Kaulimbiu Rasmi:</span>
                  <p className="font-serif text-amber-300 font-bold text-sm">“ELIMU NI MAISHA”</p>
                  <p className="text-[10px] text-slate-300">Tujendelee Sisi Wenyewe: Prayer · Education · Work</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-200 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Usajili Kamili wa Wizara ya Elimu (NECTA S0486)</span>
              </div>
            </div>

            {/* Structured Institutional Highlights */}
            <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-[#102A43] text-amber-300">
                  CATHOLIC DIOCESE OF MOSHI
                </div>
                <h4 className="font-serif text-lg sm:text-2xl font-black text-[#102A43]">
                  UOMBONI SECONDARY SCHOOL
                </h4>
                <p className="text-xs font-bold text-amber-800">
                  KILIMANJARO - MOSHI, MARANGU · “ELIMU NI MAISHA”
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-amber-300/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-700 uppercase block">
                    {language === 'sw' ? '📌 DIRA YA SHULE (OUR VISION)' : '📌 SCHOOL VISION'}
                  </span>
                  <p className="font-bold text-[#102A43] text-xs">
                    “{language === 'sw'
                      ? (schoolProfile?.visionSw || 'Kutoa elimu bora na ufaulu wa kuvutia kitaaluma')
                      : (schoolProfile?.vision || 'To provide quality education and impressive academic performance')}”
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-amber-300/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-700 uppercase block">
                    {language === 'sw' ? '📅 TANGAZO LA PRE-FORM ONE' : '📅 SPECIAL NOTICE'}
                  </span>
                  <p className="font-bold text-[#102A43] text-xs">
                    Kuanza: 21 Septemba 2026
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Masomo: Kiingereza, Mathematics Form 1 &amp; Sayansi.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-amber-300/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-700 uppercase block">
                    {language === 'sw' ? '📍 MAHALI & ANWANI YA SHULE' : '📍 LOCATION & ADDRESS'}
                  </span>
                  <p className="font-semibold text-slate-800 text-xs">
                    Marangu - Moshi, Kilimanjaro · P.O. Box 90000
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-amber-300/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-700 uppercase block">
                    {language === 'sw' ? '📞 MAWASILIANO YA SHULE' : '📞 SCHOOL CONTACTS'}
                  </span>
                  <p className="font-semibold text-slate-800 text-xs">
                    Simu: +255 802 2000 / +255 000 0000
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    info@uomboniss.ac.tz · www.uomboniss.ac.tz
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of the 7 features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {flyerFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-4.5 rounded-2xl bg-[#FFFFF0] border border-[#102A43]/10 hover:border-[#102A43]/30 transition-all hover:shadow-xs space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-[#102A43] text-amber-300 flex items-center justify-center shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-[#102A43] leading-snug">
                      {language === 'sw' ? feat.titleSw : feat.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {language === 'sw' ? feat.descSw : feat.descEn}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] font-bold text-[#102A43]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'sw' ? 'Sifa Kuu ya Shule' : 'School Hallmark Feature'}</span>
                  </div>
                </div>
              );
            })}

            {/* 8th Special Notice Card */}
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-[#FFFFF0] border-2 border-amber-400/80 shadow-xs space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  SPECIAL NOTICE
                </span>
                <h4 className="text-xs sm:text-sm font-black text-[#102A43] leading-snug">
                  PRE-FORM ONE PROGRAM
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                  Starts: <span className="font-black text-[#102A43]">21st September 2026</span>
                </p>
                <p className="text-[10px] text-slate-600 leading-tight">
                  Maandalizi maalum ya lugha ya Kiingereza, hisabati (Mathematics Form 1) na sayansi kwa wanafunzi wanaoingia kidato cha kwanza.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAdmissions}
                className="w-full py-1.5 px-3 rounded-lg bg-[#102A43] text-amber-300 text-[11px] font-bold text-center hover:bg-[#0A1C2E] transition-colors cursor-pointer"
              >
                Omba Nafasi Sasa →
              </button>
            </div>
          </div>
        </div>

        {/* Action Link Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#102A43] text-white">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-white">
              {language === 'sw'
                ? 'Karibu Ujiunge na Familia ya Shule ya Sekondari Uomboni'
                : 'Welcome to the Uomboni Secondary School Family'}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'sw'
                ? 'Nafasi za Pre-Form One, Kidato cha 1 na cha 3 kwa Mwaka wa Masomo 2026–2027 zipo wazi.'
                : 'Admissions for Pre-Form 1, Form 1 and Form 3 for the 2026–2027 Academic Year are open.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('academics')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'sw' ? 'Tazama Taaluma' : 'Academic Programs'}
              </button>
            )}
            {onOpenAdmissions && (
              <button
                onClick={onOpenAdmissions}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-colors cursor-pointer shadow-sm"
              >
                {language === 'sw' ? 'Omba Udahili Sasa' : 'Apply for Admission'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

