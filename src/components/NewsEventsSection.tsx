import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Calendar,
  ArrowRight,
  X,
  FileText,
  CheckCircle2,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface NewsItem {
  id: string;
  title: string;
  titleSw?: string;
  category: 'Announcements' | 'Academic' | 'Examinations' | 'Events' | 'Achievements';
  date: string;
  excerpt: string;
  excerptSw?: string;
  detailedContent?: string;
  detailedContentSw?: string;
  imageUrl: string;
  featured?: boolean;
}

interface NewsEventsSectionProps {
  onOpenAdmissions?: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const NewsEventsSection: React.FC<NewsEventsSectionProps> = ({
  onOpenAdmissions,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedModalItem, setSelectedModalItem] = useState<NewsItem | null>(null);

  // Animation and viewport intersection states
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Detect user preference for reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);

  // IntersectionObserver: Triggers the entrance animation once when the section enters the viewport
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    // If reduced motion is preferred, immediately show content
    if (prefersReducedMotion) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEntered(true);
            // Trigger entrance only once; do not replay on scroll
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  // Handle ESC key for modal dialog
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedModalItem) {
        setSelectedModalItem(null);
      }
    },
    [selectedModalItem]
  );

  useEffect(() => {
    if (selectedModalItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedModalItem, handleKeyDown]);

  const newsItems: NewsItem[] = [
    {
      id: 'news-1',
      title: 'Form One 2026 Admissions & Student Transfers Open',
      titleSw: 'Nafasi za Kidato cha Kwanza 2026 na Uhamisho Ziko Wazi',
      category: 'Announcements',
      date: 'August 28, 2025',
      excerpt:
        'Uomboni Secondary School announces openings for Form One entry and selective Form 2 & 3 transfers for day and boarding students.',
      excerptSw:
        'Shule ya Sekondari Uomboni inatangaza nafasi za kujiunga na Kidato cha Kwanza na uhamisho wa Kidato cha Pili na Tatu kwa wanafunzi wa kutwa na bweni.',
      detailedContent:
        'The management of Uomboni Secondary School (NECTA Center S0486), located in Marangu West under the Catholic Diocese of Moshi, warmly invites parents and guardians to apply for Form One admissions for the 2026 academic year. Both boarding and day options are available with modern student hostels, science laboratories, and nutritious catering. Transfer applications for Form Two and Form Three are also currently being processed. Official joining instruction forms can be obtained from the school office or downloaded directly via the website admissions portal.',
      detailedContentSw:
        'Uongozi wa Shule ya Sekondari Uomboni (Kituo cha NECTA S0486) iliyopo Marangu Magharibi chini ya Jimbo Katoliki la Moshi unawakaribisha wazazi na walezi kuleta maombi ya nafasi za Kidato cha Kwanza kwa mwaka 2026. Nafasi za bweni na kutwa zinapatikana kwa wavulana na wasichana. Fomu za kujiunga (Joining Instructions) zinapatikana ofisi ya Mkuu wa Shule Marangu na kwenye tovuti hii.',
      imageUrl: '/media/media_6.webp',
      featured: true,
    },
    {
      id: 'news-2',
      title: 'Intensive Academic Revision Camp for Form Four Candidates',
      titleSw: 'Kambi Maalumu ya Marudio ya Masomo kwa Watahiniwa wa Kidato cha Nne',
      category: 'Examinations',
      date: 'August 20, 2025',
      excerpt:
        'Form 4 students commence their dedicated subject preparation and mock examinations ahead of the national CSEE assessment series.',
      excerptSw:
        'Wanafunzi wa Kidato cha 4 wameanza maandalizi thabiti ya marudio ya kitaaluma na mitihani ya majaribio kuelekea mtihani wa Taifa wa CSEE.',
      detailedContent:
        'As part of the Uomboni Secondary School academic performance strategy, Form Four candidates have entered the structured intensive revision phase. Departmental subject facilitators are conducting focused past-paper workshops, science practical clinics in Biology, Chemistry, and Physics, and timed test evaluations to reinforce mastery and confidence before the national CSEE examination series.',
      detailedContentSw:
        'Katika kuelekea mitihani ya Taifa ya CSEE, watahiniwa wa Kidato cha Nne wameanza kambi ya masomo na marudio ya vitendo katika maabara za sayansi (Fizikia, Kemia, na Biolojia) pamoja na mitihani ya majaribio (Mock) ili kuendeleza historia ya ufaulu wa kiwango cha juu shuleni.',
      imageUrl: '/media/media_7.webp',
    },
    {
      id: 'news-3',
      title: 'Practical Digital Skills & ICT Laboratory Commissioned',
      titleSw: 'Ufunguzi wa Maabara ya Kisasa ya Kompyuta na TEHAMA',
      category: 'Academic',
      date: 'August 14, 2025',
      excerpt:
        'Modern computer workstations and structured digital literacy classes installed to support scientific research and STEM learning.',
      excerptSw:
        'Vifaa vipya vya kompyuta na ratiba za masomo ya ujuzi wa kidijitali zimezinduliwa kusaidia tafiti za kisayansi na masomo ya TEHAMA.',
      detailedContent:
        'In line with national curriculum modernization and 21st-century technological competence, the newly refurbished school computer laboratory is now operational. Students across all forms will receive guided practical training in software fundamentals, document typing, Internet research, and coding essentials under qualified ICT instructors.',
      detailedContentSw:
        'Ili kuwajengea wanafunzi uelewa thabiti wa teknolojia ya kidijitali, maabara ya kompyuta ya shule imekamilika na kuanza kutumika. Wanafunzi wa madarasa yote wanajifunza misingi ya TEHAMA, matumizi ya mifumo ya kompyuta, na utafiti wa kitaaluma.',
      imageUrl: '/media/media_8.jpg',
    },
    {
      id: 'news-4',
      title: 'Solemn Thanksgiving Eucharistic Celebration & Spiritual Guidance',
      titleSw: 'Misa Takatifu ya Shukrani na Mwongozo wa Kiroho Shuleni',
      category: 'Events',
      date: 'August 08, 2025',
      excerpt:
        'Campus community gathers for prayer, thanksgiving, and moral reflection under the theme of Prayer, Education, and Diligent Work.',
      excerptSw:
        'Jumuiya ya shule ilikusanyika katika sala, shukrani na tafakari ya kimaadili chini ya kaulimbiu ya Sala, Elimu na Kazi.',
      detailedContent:
        'The Catholic Diocese of Moshi school chaplaincy led a reverent Eucharistic celebration with students, teaching staff, and management. The spiritual reflection emphasized the enduring school values: devotion to prayer, personal responsibility, academic discipline, and respectful coexistence in the community.',
      detailedContentSw:
        'Mlezi wa Kiroho wa shule akishirikiana na Parokia ya Marangu aliongoza Ibada ya Misa Takatifu ya kuwaombea wanafunzi na walimu. Msisitizo uliwekwa katika kukuza maadili mema, nidhamu, hofu ya Mungu na upendo miongoni mwa jumuiya ya shule.',
      imageUrl: '/media/media_9.jpg',
    },
    {
      id: 'news-5',
      title: 'Uomboni Sports Teams Victorious at UMISETA Athletics Circuit',
      titleSw: 'Ushindi wa Timu za Shule Mashindano ya Michezo ya UMISETA',
      category: 'Achievements',
      date: 'August 01, 2025',
      excerpt:
        'Student athletes excel in regional track and football tournaments, demonstrating high physical discipline and school camaraderie.',
      excerptSw:
        'Wanafunzi wameibuka washindi katika mashindano ya riadha na mpira wa miguu ukanda wa Marangu, wakidhihirisha nidhamu na vipaji.',
      detailedContent:
        'Uomboni Secondary School teams performed outstandingly in the inter-school UMISETA games, capturing first-place trophies in football, 100m sprint, and volleyball. The school administration commended the athletes and sports masters for upholding exemplary discipline and sportsmanship representing Marangu educational zone.',
      detailedContentSw:
        'Wanafunzi wanamichezo wa Uomboni wamepata ushindi wa vyeo vya juu katika mashindano ya UMISETA ngazi ya kata na tarafa ya Marangu. Timu ya soka na wanariadha walipongezwa na uongozi wa shule kwa kupeperusha bendera ya shule kwa nidhamu ya juu.',
      imageUrl: '/media/media_10.jpg',
    },
    {
      id: 'news-6',
      title: 'Annual Parents-Teachers Association (PTA) Conference',
      titleSw: 'Mkutano Mkuu wa Mwaka wa Wazazi na Walimu (PTA)',
      category: 'Announcements',
      date: 'July 25, 2025',
      excerpt:
        'School Board and parents review ongoing infrastructure improvements, boarding dining facilities, and academic strategies.',
      excerptSw:
        'Bodi ya shule na wazazi walitathmini maendeleo ya miundombinu, uboreshaji wa bweni na mikakati thabiti ya kuinua ufaulu.',
      detailedContent:
        'The annual general meeting of parents, teachers, and school board members convened successfully on the school campus. Key agenda items included the completion of new hostel sanitation blocks, academic review of mid-term progress reports, and shared partnerships to ensure every student reaches their full academic and moral potential.',
      detailedContentSw:
        'Mkutano wa pamoja wa wazazi na walimu ulifanyika shuleni Marangu kujadili mwenendo wa kitaaluma wa wanafunzi, uboreshaji wa mazingira ya bweni na chakula, na ushirikiano thabiti kati ya wazazi na uongozi wa shule.',
      imageUrl: '/media/media_11.webp',
    },
  ];

  const categories = [
    'All',
    'Announcements',
    'Academic',
    'Examinations',
    'Events',
    'Achievements',
  ];

  const filteredItems =
    selectedCategory === 'All'
      ? newsItems
      : newsItems.filter((item) => item.category === selectedCategory);

  return (
    <section
      ref={sectionRef}
      id="news"
      className="py-20 sm:py-24 bg-[#FFFFF0] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================================================================= */}
        {/* SECTION HEADER — SMOOTH ENTRANCE FADE-IN & STAGGER               */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            {/* 1. Heading 'Updates & Highlights' fades in smoothly (0.5s ease-out) */}
            <span
              className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase"
              style={{
                opacity: prefersReducedMotion || hasEntered ? 1 : 0,
                transform:
                  prefersReducedMotion || hasEntered
                    ? 'translateY(0)'
                    : 'translateY(12px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : 'opacity 0.5s ease-out, transform 0.5s ease-out',
              }}
            >
              {isSwahili ? 'Habari na Taarifa Muhimu' : 'Updates & Highlights'}
            </span>

            <h2
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]"
              style={{
                opacity: prefersReducedMotion || hasEntered ? 1 : 0,
                transform:
                  prefersReducedMotion || hasEntered
                    ? 'translateY(0)'
                    : 'translateY(14px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : 'opacity 0.5s ease-out, transform 0.5s ease-out',
              }}
            >
              {isSwahili ? 'Habari & Matukio ya Shule' : 'Updates & Highlights'}
            </h2>

            {/* 2. Subtitle fades in slightly after the heading (0.6s ease-out, 0.15s delay) */}
            <p
              className="mt-3 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal"
              style={{
                opacity: prefersReducedMotion || hasEntered ? 1 : 0,
                transform:
                  prefersReducedMotion || hasEntered
                    ? 'translateY(0)'
                    : 'translateY(14px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : 'opacity 0.6s ease-out 0.15s, transform 0.6s ease-out 0.15s',
              }}
            >
              {isSwahili
                ? 'Pata taarifa rasmi za shule, matangazo ya udahili, ratiba za mitihani, na mafanikio mbalimbali ya wanafunzi wa Shule ya Sekondari Uomboni.'
                : 'Stay informed with official school announcements, academic milestones, examinations schedules, and student achievements at Uomboni Secondary School.'}
            </p>
          </div>

          {/* Clean Segmented Filter Controls */}
          <div
            className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-md border border-slate-200 shadow-2xs"
            style={{
              opacity: prefersReducedMotion || hasEntered ? 1 : 0,
              transform:
                prefersReducedMotion || hasEntered
                  ? 'translateY(0)'
                  : 'translateY(12px)',
              transition: prefersReducedMotion
                ? 'none'
                : 'opacity 0.5s ease-out 0.22s, transform 0.5s ease-out 0.22s',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#102A43] text-white font-semibold'
                    : 'text-slate-600 hover:text-[#102A43] hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* NEWS / HIGHLIGHT CARDS GRID WITH STAGGERED ENTRANCE               */}
        {/* ================================================================= */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => {
            // 3. Staggered animation: Card 1 -> Card 2 -> Card 3 -> Card 4...
            // Timing: 0.6s each with 120ms stagger delay (between 100-150ms)
            const staggerDelay = prefersReducedMotion ? 0 : 0.25 + index * 0.12;

            return (
              <article
                key={item.id}
                onClick={() => setSelectedModalItem(item)}
                className="news-card-animated bg-white rounded-lg border border-[#102A43]/10 overflow-hidden shadow-xs flex flex-col justify-between group cursor-pointer"
                style={{
                  opacity: prefersReducedMotion || hasEntered ? 1 : 0,
                  transform:
                    prefersReducedMotion || hasEntered
                      ? 'translateY(0)'
                      : 'translateY(16px)',
                  transition: prefersReducedMotion
                    ? 'none'
                    : `opacity 0.6s ease-out ${staggerDelay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s, box-shadow 0.35s ease, border-color 0.35s ease`,
                }}
              >
                <div>
                  {/* Real Image Container with gentle 1.00 -> 1.03 hover zoom */}
                  <div className="aspect-16/10 overflow-hidden bg-slate-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="news-card-image w-full h-full object-cover"
                      loading="lazy"
                      width={800}
                      height={500}
                    />

                    {/* Category pill indicator */}
                    <div className="absolute top-3 left-3 bg-[#102A43]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded backdrop-blur-xs shadow-xs">
                      {item.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                      <span className="font-semibold text-[#C9A227]">
                        {item.category}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.date}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#102A43] leading-snug group-hover:text-[#102A43]/85 transition-colors line-clamp-2">
                      {isSwahili && item.titleSw ? item.titleSw : item.title}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {isSwahili && item.excerptSw ? item.excerptSw : item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <span className="text-xs font-semibold text-[#102A43] group-hover:text-[#C9A227] inline-flex items-center gap-1.5 transition-colors">
                    <span>
                      {isSwahili ? 'Soma Tangazo Kamili' : 'Read Announcement'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* ANNOUNCEMENT DETAIL DIALOG / MODAL                                */}
      {/* ================================================================= */}
      {selectedModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setSelectedModalItem(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#102A43]/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
              <img
                src={selectedModalItem.imageUrl}
                alt={selectedModalItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedModalItem(null)}
                aria-label="Close Announcement Dialog"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#C9A227] text-[#102A43] text-[11px] font-bold uppercase tracking-wider mb-2">
                  {selectedModalItem.category}
                </span>
                <h3
                  id="announcement-modal-title"
                  className="font-serif text-lg sm:text-2xl font-bold leading-snug drop-shadow-xs"
                >
                  {isSwahili && selectedModalItem.titleSw
                    ? selectedModalItem.titleSw
                    : selectedModalItem.title}
                </h3>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <span className="flex items-center gap-1.5 font-medium text-[#102A43]">
                  <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                  {selectedModalItem.date}
                </span>
                <span>•</span>
                <span>Uomboni Secondary School (NECTA S0486)</span>
              </div>

              <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                <p className="font-medium text-[#102A43]">
                  {isSwahili && selectedModalItem.excerptSw
                    ? selectedModalItem.excerptSw
                    : selectedModalItem.excerpt}
                </p>
                <p>
                  {isSwahili && selectedModalItem.detailedContentSw
                    ? selectedModalItem.detailedContentSw
                    : selectedModalItem.detailedContent}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {selectedModalItem.category === 'Announcements' && onOpenAdmissions ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModalItem(null);
                      onOpenAdmissions();
                    }}
                    className="px-5 py-2.5 bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>
                      {isSwahili ? 'Tuma Maombi ya Kujiunga' : 'Apply for Admission'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModalItem(null);
                      if (onNavigate) onNavigate('contact');
                    }}
                    className="px-5 py-2.5 bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {isSwahili ? 'Wasiliana na Ofisi ya Shule' : 'Contact Administration'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedModalItem(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isSwahili ? 'Funga' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
