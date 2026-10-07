import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  Calendar,
  User,
  Tag,
  Languages,
  X,
  Clock,
  Eye,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Radio,
} from 'lucide-react';
import { NewsItem } from '../types';

interface LiveNewsCardProps {
  onNavigate?: (sectionId: string) => void;
}

/**
 * LiveNewsCard Component
 * Strictly styled with the Blue + Red color system:
 * - Primary Deep Blue:   #0B2A5B
 * - Secondary Blue:      #174A8B
 * - Professional Red:    #C62828 (Used sparingly for urgent/active states)
 * - White:               #FFFFFF
 * - Light Gray:          #F5F7FA
 */
export const LiveNewsCard: React.FC<LiveNewsCardProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { news } = useData();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [selectedNewsDetail, setSelectedNewsDetail] = useState<NewsItem | null>(null);
  const [cardLangOverride, setCardLangOverride] = useState<'sw' | 'en' | null>(null);

  const activeLang = cardLangOverride || language;

  const newsList =
    news && news.length > 0
      ? news
      : [
          {
            id: 'fallback-1',
            titleSw: 'Nafasi za Kidato cha Kwanza (2026) na Uhamisho Ziko Wazi Shule ya Sekondari Uomboni',
            titleEn: 'Form 1 (2026) Admissions and Transfers Now Open at Uomboni Secondary School',
            excerptSw: 'Uongozi wa Shule ya Sekondari Uomboni unakaribisha maombi ya udahili kwa wanafunzi wa bweni na kutwa.',
            excerptEn: 'Uomboni Secondary School management invites applications for boarding and day scholars.',
            contentSw:
              'Uongozi wa Shule ya Sekondari Uomboni unakaribisha maombi ya udahili kwa wanafunzi wa bweni na kutwa kwa mwaka wa masomo 2026. Fomu za kujiunga zinapatikana mtandaoni au ofisini shuleni.',
            contentEn:
              'The management of Uomboni Secondary School welcomes admission applications for boarding and day students for the 2026 academic year. Joining instructions are available online or at the school office.',
            category: 'Matangazo' as const,
            date: '2026-08-15',
            imageUrl: '/media/media_6.webp',
            featured: true,
            author: 'Ofisi ya Mkuu wa Shule',
          },
        ];

  // Auto-slide effect every 7 seconds
  useEffect(() => {
    if (isPaused || newsList.length <= 1) return;

    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % newsList.length);
        setFadeState('in');
      }, 350);
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused, newsList.length]);

  const handleNext = () => {
    setFadeState('out');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % newsList.length);
      setFadeState('in');
    }, 200);
  };

  const handlePrev = () => {
    setFadeState('out');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + newsList.length) % newsList.length);
      setFadeState('in');
    }, 200);
  };

  const currentNews = newsList[currentIndex] || newsList[0];
  const isUrgent = currentNews.category === 'Matangazo' || currentNews.featured;

  const toggleLanguage = () => {
    const nextLang = activeLang === 'sw' ? 'en' : 'sw';
    setCardLangOverride(nextLang);
  };

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-8">
      {/* 1. HORIZONTAL MARQUEE LIVE TICKER BAR (#0B2A5B Deep Blue) */}
      <div className="bg-[#0B2A5B] text-white rounded-t-xl border-t border-x border-[#174A8B] px-3 sm:px-4 py-2 shadow-sm flex items-center gap-3 overflow-hidden">
        {/* Live Indicator with Red Accent */}
        <div className="flex items-center gap-1.5 shrink-0 bg-[#C62828] text-white px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/20">
          <Radio className="w-3.5 h-3.5" />
          <span>{activeLang === 'sw' ? 'TAARIFA MPYA' : 'LATEST NEWS'}</span>
        </div>

        {/* Continuous Horizontal Marquee Bar */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee flex items-center gap-8 text-xs sm:text-sm font-medium text-slate-100 hover:cursor-pointer">
            {newsList.map((item, idx) => (
              <span
                key={`marquee-${item.id}-${idx}`}
                onClick={() => setSelectedNewsDetail(item)}
                className="flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C62828] inline-block" />
                <strong className="text-white font-bold">[{item.category}]</strong>
                <span>{activeLang === 'sw' ? item.titleSw : item.titleEn}</span>
                <span className="text-[10px] text-slate-300 font-mono">({item.date})</span>
                <span className="text-[#174A8B] mx-2">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Translation Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="shrink-0 px-2.5 py-1 rounded bg-[#174A8B] hover:bg-[#123A6E] text-white font-bold text-[10px] sm:text-xs flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer"
          title="Tafsiri / Translate Card"
        >
          <Languages className="w-3 h-3 text-white" />
          <span>{activeLang === 'sw' ? 'SW ➔ EN' : 'EN ➔ SW'}</span>
        </button>
      </div>

      {/* 2. NEWS HERO CARD (White #FFFFFF with Deep Blue #0B2A5B Accents) */}
      <div className="bg-white rounded-b-xl border-b border-x border-[#0B2A5B]/20 p-4 sm:p-6 shadow-md relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Col 1: Image Box */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-xl border border-slate-200">
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
              <img
                src={currentNews.imageUrl || '/media/media_6.webp'}
                alt={activeLang === 'sw' ? currentNews.titleSw : currentNews.titleEn}
                className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-102 ${
                  fadeState === 'in' ? 'opacity-100' : 'opacity-35'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A5B]/85 via-transparent to-transparent" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded text-white font-bold text-xs flex items-center gap-1.5 shadow-xs ${
                    isUrgent ? 'bg-[#C62828]' : 'bg-[#0B2A5B]'
                  }`}
                >
                  <Tag className="w-3 h-3 text-white" />
                  <span>{currentNews.category}</span>
                </span>
                {currentNews.featured && (
                  <span className="px-2 py-0.5 rounded bg-[#C62828] text-white font-bold text-[10px] uppercase">
                    HARAKA
                  </span>
                )}
              </div>

              {/* Date on Image */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                <span className="flex items-center gap-1 font-mono text-white/90">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  {currentNews.date}
                </span>
                <span className="flex items-center gap-1 text-white/90 font-medium">
                  <User className="w-3.5 h-3.5 text-white/80" />
                  {currentNews.author || 'Uongozi wa Shule'}
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Content Area */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div
              className={`transition-all duration-400 ease-out ${
                fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {/* Counter & Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-[#0B2A5B] bg-[#F5F7FA] px-2.5 py-0.5 rounded border border-[#E2E8F0]">
                    Habari {currentIndex + 1} / {newsList.length}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#174A8B]" />
                    Inabadilika kiotomatiki
                  </span>
                </div>

                <span className="text-[10px] font-bold text-[#174A8B] bg-[#F5F7FA] border border-[#E2E8F0] px-2 py-0.5 rounded flex items-center gap-1">
                  <Languages className="w-3 h-3 text-[#174A8B]" />
                  <span>{activeLang === 'sw' ? 'Kiswahili' : 'English'}</span>
                </span>
              </div>

              {/* Headline in Deep Blue #0B2A5B */}
              <h3
                onClick={() => setSelectedNewsDetail(currentNews)}
                className="font-serif text-base sm:text-lg lg:text-xl font-bold text-[#0B2A5B] hover:text-[#174A8B] transition-colors cursor-pointer line-clamp-2 leading-snug"
              >
                {activeLang === 'sw' ? currentNews.titleSw : currentNews.titleEn}
              </h3>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 leading-relaxed mt-2 font-normal">
                {activeLang === 'sw'
                  ? currentNews.excerptSw || currentNews.contentSw
                  : currentNews.excerptEn || currentNews.contentEn}
              </p>
            </div>

            {/* Bottom Actions and Controls */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              {/* Action Buttons: Read Full Story (Deep Blue) + All News */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedNewsDetail(currentNews)}
                  className="px-4 py-2 rounded-md bg-[#0B2A5B] hover:bg-[#071F43] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{activeLang === 'sw' ? 'Soma Habari Kamili' : 'Read Full Story'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate('news')}
                    className="px-3 py-2 rounded-md bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#174A8B] font-bold text-xs transition-colors cursor-pointer border border-[#174A8B]/30"
                  >
                    <span>{activeLang === 'sw' ? 'Habari Zote →' : 'All News →'}</span>
                  </button>
                )}
              </div>

              {/* Carousel Controls: Play/Pause, Prev, Indicators, Next */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-md bg-[#F5F7FA] hover:bg-[#0B2A5B] text-[#0B2A5B] hover:text-white transition-colors cursor-pointer border border-[#0B2A5B]/20"
                  title={isPaused ? 'Endelea (Play)' : 'Simamisha (Pause)'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handlePrev}
                  className="p-2 rounded-md bg-[#F5F7FA] hover:bg-[#0B2A5B] text-[#0B2A5B] hover:text-white transition-colors cursor-pointer border border-[#0B2A5B]/20"
                  title="Iliyopita"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Dot indicators: Active dot in Red #C62828 */}
                <div className="flex items-center gap-1 px-1">
                  {newsList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFadeState('out');
                        setTimeout(() => {
                          setCurrentIndex(idx);
                          setFadeState('in');
                        }, 200);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentIndex === idx
                          ? 'w-5 bg-[#C62828]'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-md bg-[#F5F7FA] hover:bg-[#0B2A5B] text-[#0B2A5B] hover:text-white transition-colors cursor-pointer border border-[#0B2A5B]/20"
                  title="Inayofuata"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FULL NEWS DETAIL MODAL */}
      {selectedNewsDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#0B2A5B]/20 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#0B2A5B] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#174A8B]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#C62828] text-white font-bold text-xs uppercase tracking-wide">
                  {selectedNewsDetail.category}
                </span>
                <span className="text-xs text-white/80 font-mono">
                  {selectedNewsDetail.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleLanguage}
                  className="px-2.5 py-1 rounded bg-[#174A8B] text-white text-xs font-bold flex items-center gap-1 border border-white/20"
                >
                  <Languages className="w-3 h-3" />
                  <span>{activeLang === 'sw' ? 'English' : 'Kiswahili'}</span>
                </button>
                <button
                  onClick={() => setSelectedNewsDetail(null)}
                  className="p-1.5 text-white/80 hover:text-white rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-white">
              {selectedNewsDetail.imageUrl && (
                <div className="rounded-lg overflow-hidden max-h-64 w-full bg-slate-900">
                  <img
                    src={selectedNewsDetail.imageUrl}
                    alt={activeLang === 'sw' ? selectedNewsDetail.titleSw : selectedNewsDetail.titleEn}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B2A5B] leading-snug">
                {activeLang === 'sw' ? selectedNewsDetail.titleSw : selectedNewsDetail.titleEn}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-[#E2E8F0]">
                <span>
                  Mwandishi:{' '}
                  <strong className="text-[#0B2A5B]">{selectedNewsDetail.author || 'Uongozi wa Shule'}</strong>
                </span>
                <span>•</span>
                <span>
                  Tarehe: <strong className="text-[#0B2A5B]">{selectedNewsDetail.date}</strong>
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
                <p>
                  {activeLang === 'sw' ? selectedNewsDetail.contentSw : selectedNewsDetail.contentEn}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F5F7FA] border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Shule ya Sekondari Uomboni • NECTA S0486
              </span>
              <button
                onClick={() => setSelectedNewsDetail(null)}
                className="px-4 py-2 rounded-md bg-[#0B2A5B] text-white text-xs font-bold hover:bg-[#071F43] cursor-pointer"
              >
                Funga
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
