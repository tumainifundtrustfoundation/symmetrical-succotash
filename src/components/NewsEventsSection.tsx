import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
  FileText,
  Clock,
  Sparkles,
  Layers,
  BookOpen,
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

/**
 * UPDATES & HIGHLIGHTS — BLUE + RED COLOR PALETTE (Strict Specification)
 * - Primary Deep Blue:   #0B2A5B (Headings, Main Controls, Read Full Story, Borders)
 * - Secondary Blue:      #174A8B (Secondary Controls, Labels, Hover States)
 * - Professional Red:    #C62828 (SPARINGLY: "HARAKA", Urgent Badges, Active Slide Dot)
 * - White:               #FFFFFF (Card backgrounds, Content, Button Text)
 * - Light Gray:          #F5F7FA (Subtle backgrounds, Light borders)
 */
export const NewsEventsSection: React.FC<NewsEventsSectionProps> = ({
  onOpenAdmissions,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Filter & Modal State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedModalItem, setSelectedModalItem] = useState<NewsItem | null>(null);
  const [showAllGrid, setShowAllGrid] = useState<boolean>(false);

  // Viewport & Accessibility
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Detect user preference for reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
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

  // IntersectionObserver: trigger section entrance only once
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;
    if (prefersReducedMotion) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEntered(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Authentic Uomboni Secondary School News Records
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

  // Progressive image preloading for next slide
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nextIdx = (currentIndex + 1) % newsItems.length;
    const img = new Image();
    img.src = newsItems[nextIdx].imageUrl;
  }, [currentIndex, newsItems]);

  // Smooth slide change with crossfade & vertical settling (450ms)
  const changeSlide = useCallback(
    (newIndex: number) => {
      if (isTransitioning) return;
      if (prefersReducedMotion) {
        setCurrentIndex(newIndex);
        return;
      }
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsTransitioning(false);
      }, 220);
    },
    [isTransitioning, prefersReducedMotion]
  );

  const handleNext = useCallback(() => {
    changeSlide((currentIndex + 1) % newsItems.length);
  }, [changeSlide, currentIndex, newsItems.length]);

  const handlePrev = useCallback(() => {
    changeSlide((currentIndex - 1 + newsItems.length) % newsItems.length);
  }, [changeSlide, currentIndex, newsItems.length]);

  // Automatic Rotation: 7 seconds (pause on click, hover, or focus)
  useEffect(() => {
    if (isPaused || isHovered || isFocused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, isHovered, isFocused, prefersReducedMotion, handleNext]);

  // Handle ESC for modal
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

  const currentNews = newsItems[currentIndex] || newsItems[0];
  const isUrgent = currentNews.category === 'Announcements' || currentNews.featured;

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
      className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA] relative overflow-hidden border-t border-b border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            SECTION HEADER — DOMINANT DEEP BLUE #0B2A5B WITH SUBTLE RED ACCENT
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            {/* Small Label using Secondary Blue #174A8B */}
            <span
              className="text-xs font-semibold text-[#174A8B] tracking-wider block mb-2 uppercase"
              style={{
                opacity: prefersReducedMotion || hasEntered ? 1 : 0,
                transform:
                  prefersReducedMotion || hasEntered ? 'translateY(0)' : 'translateY(10px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : 'opacity 0.5s ease-out, transform 0.5s ease-out',
              }}
            >
              {isSwahili ? 'Habari na Taarifa Muhimu' : 'Updates & Highlights'}
            </span>

            {/* Main News Heading using Deep Blue #0B2A5B */}
            <h2
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B2A5B] tracking-tight leading-[1.2]"
              style={{
                opacity: prefersReducedMotion || hasEntered ? 1 : 0,
                transform:
                  prefersReducedMotion || hasEntered ? 'translateY(0)' : 'translateY(12px)',
                transition: prefersReducedMotion
                  ? 'none'
                  : 'opacity 0.5s ease-out, transform 0.5s ease-out',
              }}
            >
              {isSwahili ? 'Habari & Matukio ya Shule' : 'Updates & Highlights'}
            </h2>

            {/* Subtitle */}
            <p
              className="mt-3 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal"
              style={{
                opacity: prefersReducedMotion || hasEntered ? 1 : 0,
                transform:
                  prefersReducedMotion || hasEntered ? 'translateY(0)' : 'translateY(12px)',
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

          {/* Quick Toggle for All News Grid */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowAllGrid(!showAllGrid)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F5F7FA] text-[#0B2A5B] border border-[#0B2A5B]/30 hover:border-[#174A8B] text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#174A8B]" />
              <span>
                {showAllGrid
                  ? isSwahili
                    ? 'Ficha Orodha'
                    : 'Collapse Grid'
                  : isSwahili
                  ? 'Tazama Habari Zote'
                  : 'All News'}
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            NEWS CAROUSEL — BLUE + RED COLOR SYSTEM & SMOOTH CROSSFADE ANIMATION
           ========================================================================= */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={isSwahili ? 'Habari Muhimu za Shule' : 'Featured School News Carousel'}
          className="bg-white rounded-xl border border-[#0B2A5B]/20 shadow-md overflow-hidden relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsFocused(true)}
          onBlurCapture={() => setIsFocused(false)}
        >
          {/* Main Carousel Grid: Responsive for Mobile, Tablet, Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px] lg:min-h-[460px]">
            {/* -------------------------------------------------------------
                IMAGE AREA (Mobile: Image First | Desktop: Left 6 columns)
               ------------------------------------------------------------- */}
            <div className="lg:col-span-6 relative overflow-hidden bg-[#0B2A5B] min-h-[260px] sm:min-h-[320px] lg:min-h-full">
              {/* Image Crossfade Container */}
              <div
                className="w-full h-full relative"
                style={{
                  opacity: isTransitioning ? 0.25 : 1,
                  transition: prefersReducedMotion
                    ? 'none'
                    : 'opacity 500ms ease-out',
                }}
              >
                <img
                  src={currentNews.imageUrl}
                  alt={isSwahili && currentNews.titleSw ? currentNews.titleSw : currentNews.title}
                  className="w-full h-full object-cover object-center select-none"
                  width={800}
                  height={520}
                  loading="eager"
                  decoding="async"
                />

                {/* Scrim with Deep Blue gradient for academic elegance */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A5B]/90 via-[#0B2A5B]/30 to-transparent pointer-events-none" />
              </div>

              {/* Category Badges on Image (Red for Urgent/Important, Secondary Blue for others) */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                {isUrgent ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#C62828] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs border border-white/20">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span>{isSwahili ? 'HARAKA' : 'URGENT'}</span>
                  </span>
                ) : null}

                <span className="px-2.5 py-1 rounded bg-[#0B2A5B]/90 text-white text-[11px] font-semibold tracking-wide backdrop-blur-xs border border-white/15 shadow-xs">
                  {currentNews.category}
                </span>
              </div>

              {/* Status Ribbon on bottom of Image */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white text-[11px]">
                <span className="flex items-center gap-1.5 font-medium text-white/90">
                  <Calendar className="w-3.5 h-3.5 text-white/80" />
                  <span>{currentNews.date}</span>
                </span>

                <span className="text-white/80 font-mono text-[10px]">
                  NECTA Center: S0486
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------------
                CONTENT AREA (Mobile: Category/Date -> Headline -> Description -> Buttons -> Controls)
               ------------------------------------------------------------- */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
              {/* Upper Content Block with Animated Fade & Slide Up */}
              <div className="space-y-4">
                {/* 1. Category & Date Header (Metadata appears subtly) */}
                <div
                  className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-[#E2E8F0]"
                  style={{
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? 'translateY(6px)' : 'translateY(0)',
                    transition: prefersReducedMotion
                      ? 'none'
                      : 'opacity 400ms ease-out, transform 400ms ease-out',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        isUrgent ? 'text-[#C62828]' : 'text-[#174A8B]'
                      }`}
                    >
                      {currentNews.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3 text-[#174A8B]" />
                      <span>{currentNews.date}</span>
                    </span>
                  </div>

                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#F5F7FA] text-[#174A8B] border border-[#E2E8F0]">
                    {currentIndex + 1} / {newsItems.length}
                  </span>
                </div>

                {/* 2. Headline in Primary Deep Blue #0B2A5B (Fades and slides upward slightly) */}
                <h3
                  onClick={() => setSelectedModalItem(currentNews)}
                  className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold text-[#0B2A5B] hover:text-[#174A8B] transition-colors leading-[1.3] cursor-pointer"
                  style={{
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                    transition: prefersReducedMotion
                      ? 'none'
                      : 'opacity 460ms ease-out 40ms, transform 460ms ease-out 40ms',
                  }}
                >
                  {isSwahili && currentNews.titleSw ? currentNews.titleSw : currentNews.title}
                </h3>

                {/* 3. Description follows smoothly */}
                <p
                  className="text-sm sm:text-base text-slate-700 leading-[1.7] font-normal"
                  style={{
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
                    transition: prefersReducedMotion
                      ? 'none'
                      : 'opacity 500ms ease-out 80ms, transform 500ms ease-out 80ms',
                  }}
                >
                  {isSwahili && currentNews.excerptSw ? currentNews.excerptSw : currentNews.excerpt}
                </p>
              </div>

              {/* -----------------------------------------------------------
                  4. BUTTONS & 5. CAROUSEL CONTROLS
                 ----------------------------------------------------------- */}
              <div className="pt-6 mt-6 border-t border-[#E2E8F0] space-y-4">
                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Read Full Story Button: Deep Blue #0B2A5B, White text */}
                  <button
                    type="button"
                    onClick={() => setSelectedModalItem(currentNews)}
                    className="px-5 py-2.5 bg-[#0B2A5B] hover:bg-[#071F43] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>{isSwahili ? 'Soma Habari Kamili' : 'Read Full Story'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* All News Button: Secondary Blue Outline / Light Gray */}
                  <button
                    type="button"
                    onClick={() => setShowAllGrid(!showAllGrid)}
                    className="px-4 py-2.5 bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#174A8B] border border-[#174A8B]/30 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isSwahili ? 'Habari Zote →' : 'All News →'}</span>
                  </button>
                </div>

                {/* Carousel Navigation Controls Row */}
                <div
                  className="flex items-center justify-between gap-3 pt-2"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                >
                  {/* Slide Indicators: Red #C62828 for active, Deep Blue tint for inactive */}
                  <div className="flex items-center gap-1.5">
                    {newsItems.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => changeSlide(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          currentIndex === idx
                            ? 'w-7 bg-[#C62828]'
                            : 'w-2.5 bg-[#0B2A5B]/20 hover:bg-[#174A8B]/60'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Carousel Buttons: Previous, Play/Pause, Next */}
                  <div className="flex items-center gap-2">
                    {/* Pause / Play Button */}
                    <button
                      type="button"
                      onClick={() => setIsPaused(!isPaused)}
                      title={
                        isPaused
                          ? isSwahili
                            ? 'Endelea (Play)'
                            : 'Resume Auto Rotation'
                          : isSwahili
                          ? 'Simamisha (Pause)'
                          : 'Pause Auto Rotation'
                      }
                      className="w-8 h-8 rounded-md bg-[#F5F7FA] hover:bg-[#0B2A5B] text-[#0B2A5B] hover:text-white border border-[#0B2A5B]/30 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>

                    {/* Previous Button: Deep Blue border/hover */}
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous News"
                      className="w-8 h-8 rounded-md bg-[#F5F7FA] hover:bg-[#0B2A5B] text-[#0B2A5B] hover:text-white border border-[#0B2A5B]/30 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Next Button: Deep Blue border/hover */}
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next News"
                      className="w-8 h-8 rounded-md bg-[#F5F7FA] hover:bg-[#0B2A5B] text-[#0B2A5B] hover:text-white border border-[#0B2A5B]/30 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            "ALL NEWS" EXPANDABLE GRID (Clean Academic Presentation)
           ========================================================================= */}
        {showAllGrid && (
          <div className="mt-12 pt-8 border-t border-[#E2E8F0] animate-in fade-in duration-300">
            {/* Filter Tabs using Deep Blue #0B2A5B & Secondary Blue #174A8B */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h4 className="font-serif text-lg font-bold text-[#0B2A5B]">
                {isSwahili ? 'Mkusanyiko Kamili wa Habari' : 'All School Bulletins'}
              </h4>

              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-md border border-[#E2E8F0] shadow-2xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#0B2A5B] text-white font-semibold'
                        : 'text-slate-600 hover:text-[#0B2A5B] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const itemIsUrgent = item.category === 'Announcements' || item.featured;
                return (
                  <article
                    key={item.id}
                    onClick={() => setSelectedModalItem(item)}
                    className="bg-white rounded-lg border border-[#0B2A5B]/15 overflow-hidden shadow-xs hover:shadow-md hover:border-[#174A8B] transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Image */}
                      <div className="aspect-16/10 overflow-hidden bg-slate-100 relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              itemIsUrgent
                                ? 'bg-[#C62828] text-white'
                                : 'bg-[#0B2A5B] text-white'
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                          <Calendar className="w-3 h-3 text-[#174A8B]" />
                          <span>{item.date}</span>
                        </div>

                        <h5 className="font-serif text-base font-bold text-[#0B2A5B] leading-snug group-hover:text-[#174A8B] transition-colors line-clamp-2">
                          {isSwahili && item.titleSw ? item.titleSw : item.title}
                        </h5>

                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {isSwahili && item.excerptSw ? item.excerptSw : item.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-0">
                      <span className="text-xs font-semibold text-[#0B2A5B] group-hover:text-[#174A8B] inline-flex items-center gap-1 transition-colors">
                        <span>{isSwahili ? 'Soma Habari Kamili' : 'Read Full Story'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          FULL STORY DETAIL MODAL (Deep Blue Header, Red Accent, Accessible)
         ========================================================================= */}
      {selectedModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setSelectedModalItem(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#0B2A5B]/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
              <img
                src={selectedModalItem.imageUrl}
                alt={selectedModalItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A5B]/90 via-[#0B2A5B]/30 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedModalItem(null)}
                aria-label="Close Announcement Dialog"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mb-2 ${
                    selectedModalItem.category === 'Announcements' || selectedModalItem.featured
                      ? 'bg-[#C62828] text-white'
                      : 'bg-[#174A8B] text-white'
                  }`}
                >
                  {selectedModalItem.category}
                </span>
                <h3
                  id="announcement-modal-title"
                  className="font-serif text-lg sm:text-2xl font-bold leading-snug text-white"
                >
                  {isSwahili && selectedModalItem.titleSw
                    ? selectedModalItem.titleSw
                    : selectedModalItem.title}
                </h3>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 sm:p-8 space-y-5 bg-white">
              <div className="flex items-center gap-3 text-xs text-slate-500 pb-4 border-b border-[#E2E8F0]">
                <span className="flex items-center gap-1.5 font-medium text-[#0B2A5B]">
                  <Calendar className="w-3.5 h-3.5 text-[#174A8B]" />
                  {selectedModalItem.date}
                </span>
                <span>•</span>
                <span>Uomboni Secondary School (NECTA S0486)</span>
              </div>

              <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                <p className="font-semibold text-[#0B2A5B]">
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
              <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                {selectedModalItem.category === 'Announcements' && onOpenAdmissions ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModalItem(null);
                      onOpenAdmissions();
                    }}
                    className="px-5 py-2.5 bg-[#0B2A5B] hover:bg-[#071F43] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
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
                    className="px-5 py-2.5 bg-[#0B2A5B] hover:bg-[#071F43] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {isSwahili ? 'Wasiliana na Ofisi ya Shule' : 'Contact Administration'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedModalItem(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-[#F5F7FA] text-slate-700 text-xs font-medium rounded-md transition-colors cursor-pointer"
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
