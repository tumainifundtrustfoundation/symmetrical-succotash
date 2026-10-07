import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Megaphone, Sparkles, ArrowRight } from 'lucide-react';

export interface UrgentNotificationBannerProps {
  onActionClick?: (target: string) => void;
  onOpenAdmissions?: () => void;
  onOpenResults?: () => void;
  onNavigate?: (sectionId: string) => void;
}

interface TickerItem {
  id: string;
  text: string;
  category: string;
  isUrgent: boolean;
  action: string;
  linkText: string;
}

export const UrgentNotificationBanner: React.FC<UrgentNotificationBannerProps> = ({
  onActionClick,
  onOpenAdmissions,
  onOpenResults,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const { alerts, news } = useData();

  // Accessibility: detect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Collect items dynamically from DataContext (alerts + news)
  const tickerItems = useMemo<TickerItem[]>(() => {
    const items: TickerItem[] = [];

    // 1. Active urgent alerts first (marked as urgent)
    const activeAlerts = (alerts || []).filter((a) => a.active);
    activeAlerts.forEach((alert) => {
      items.push({
        id: `alert-${alert.id}`,
        text: language === 'sw' ? alert.messageSw : alert.messageEn,
        category: language === 'sw' ? 'UDAHILI' : 'ADMISSIONS',
        isUrgent: true,
        action: alert.linkAction || 'admissions',
        linkText:
          language === 'sw'
            ? alert.linkTextSw || 'Fomu za Kujiunga'
            : alert.linkTextEn || 'Admission Forms',
      });
    });

    // 2. Add published news items
    if (news && news.length > 0) {
      news.slice(0, 5).forEach((n) => {
        items.push({
          id: `news-${n.id}`,
          text: language === 'sw' ? n.titleSw : n.titleEn,
          category: n.category ? n.category.toUpperCase() : (language === 'sw' ? 'HABARI' : 'NEWS'),
          isUrgent: !!n.featured,
          action: 'news',
          linkText: language === 'sw' ? 'Soma Zaidi' : 'Read More',
        });
      });
    }

    // 3. Fallback items if database list is empty
    if (items.length === 0) {
      items.push(
        {
          id: 'def-1',
          text:
            language === 'sw'
              ? 'Nafasi za Kidato cha 1 (2026) na Uhamisho wa Kidato cha 2 & 3 Ziko Wazi Shule ya Sekondari Uomboni (NECTA S0486).'
              : 'Form 1 (2026) Admissions and Form 2 & 3 Student Transfers Now Open at Uomboni Secondary School (NECTA S0486).',
          category: language === 'sw' ? 'UDAHILI' : 'ADMISSIONS',
          isUrgent: true,
          action: 'admissions',
          linkText: language === 'sw' ? 'Fomu za Kujiunga' : 'Admissions Form',
        },
        {
          id: 'def-2',
          text:
            language === 'sw'
              ? 'Matokeo Rasmi ya NECTA CSEE: Kituo S0486 Uomboni chashika nafasi za juu na ufaulu wa madaraja I, II na III.'
              : 'Official NECTA CSEE Results: Center S0486 Uomboni registers high performance across Divisions I, II and III.',
          category: 'NECTA',
          isUrgent: false,
          action: 'results',
          linkText: language === 'sw' ? 'Tazama Matokeo' : 'View Results',
        },
        {
          id: 'def-3',
          text:
            language === 'sw'
              ? 'Ufunguzi wa Maabara ya Kisasa ya Sayansi na TEHAMA kwa Mafunzo ya Vitendo ya Kompyuta na Sayansi.'
              : 'Commissioning of Modern Science and ICT Laboratory for Practical STEM Learning and Digital Skills.',
          category: language === 'sw' ? 'TEHAMA' : 'ICT LAB',
          isUrgent: false,
          action: 'news',
          linkText: language === 'sw' ? 'Soma Zaidi' : 'Read More',
        }
      );
    }

    return items;
  }, [alerts, news, language]);

  // Primary action target & label for the fixed [Important Link]
  const primaryUrgent = tickerItems.find((i) => i.isUrgent) || tickerItems[0];
  const actionTarget = primaryUrgent?.action || 'admissions';
  const actionLabel = primaryUrgent?.linkText || (language === 'sw' ? 'Fomu za Kujiunga' : 'Admissions Form');

  const handleActionClick = (target: string) => {
    if (target === 'admissions' || target === 'apply') {
      if (onOpenAdmissions) onOpenAdmissions();
      else if (onActionClick) onActionClick('admissions');
    } else if (target === 'results' || target === 'necta') {
      if (onOpenResults) onOpenResults();
      else if (onActionClick) onActionClick('results');
    } else if (onActionClick) {
      onActionClick(target);
    } else if (onNavigate) {
      onNavigate(target);
    }
  };

  // Calculate a comfortable, calm animation duration based on total items
  const animationDurationSeconds = Math.max(50, tickerItems.length * 18);

  return (
    <div
      id="top-school-news-ticker"
      role="region"
      aria-label={language === 'sw' ? 'Habari na Matangazo ya Shule' : 'School News and Announcements'}
      className="w-full bg-[#0B2A5B] text-[#FFFFFF] border-b border-[#174A8B] shadow-xs relative z-50 overflow-hidden select-none"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center h-9 sm:h-10 px-2 sm:px-4">
        {/* =========================================================================
            1. FIXED LEFT BADGE: [ 📢 TAARIFA ]
           ========================================================================= */}
        <div className="flex items-center gap-1.5 shrink-0 bg-[#0B2A5B] text-[#FFFFFF] py-1 pr-2.5 sm:pr-3.5 border-r border-[#174A8B] font-bold text-[11px] sm:text-xs uppercase tracking-wider z-20">
          <Megaphone className="w-3.5 h-3.5 text-[#C62828] shrink-0" aria-hidden="true" />
          <span className="font-bold text-[#FFFFFF] tracking-wide">
            {language === 'sw' ? 'TAARIFA' : 'NEWS'}
          </span>
        </div>

        {/* Subtle gradient separator on left */}
        <div className="w-3 sm:w-5 h-full bg-gradient-to-r from-[#0B2A5B] to-transparent z-10 shrink-0 pointer-events-none" />

        {/* =========================================================================
            2. ANIMATED NEWS CONTENT (Moving Right to Left)
           ========================================================================= */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center news-ticker-container">
          {prefersReducedMotion ? (
            /* ACCESSIBILITY: Display latest announcement statically without continuous animation */
            <div
              onClick={() => handleActionClick(primaryUrgent.action)}
              className="flex items-center gap-2 px-2 text-xs text-[#FFFFFF] truncate cursor-pointer group"
            >
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  primaryUrgent.isUrgent
                    ? 'bg-[#C62828] text-[#FFFFFF]'
                    : 'bg-[#174A8B] text-[#FFFFFF]'
                }`}
              >
                {primaryUrgent.category}
              </span>
              <span className="truncate font-medium group-hover:text-[#F5F7FA] transition-colors">
                {primaryUrgent.text}
              </span>
            </div>
          ) : (
            /* CONTINUOUS SMOOTH TICKER TRACK (Right to Left) */
            <div
              className="news-ticker-track flex items-center gap-8 sm:gap-12 text-xs sm:text-[13px] font-medium text-[#FFFFFF] py-1"
              style={{ animationDuration: `${animationDurationSeconds}s` }}
            >
              {/* Set 1 */}
              {tickerItems.map((item, idx) => (
                <div
                  key={`tick-1-${item.id}-${idx}`}
                  onClick={() => handleActionClick(item.action)}
                  className="flex items-center gap-2 shrink-0 cursor-pointer group"
                >
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      item.isUrgent
                        ? 'bg-[#C62828] text-[#FFFFFF]'
                        : 'bg-[#174A8B] text-[#FFFFFF] group-hover:bg-[#123A6E]'
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[#FFFFFF] group-hover:text-[#F5F7FA] transition-colors whitespace-nowrap">
                    {item.text}
                  </span>
                  <span className="text-[#174A8B] font-bold mx-2 select-none">•</span>
                </div>
              ))}

              {/* Set 2 (Duplicate for Seamless Infinite Marquee Loop) */}
              {tickerItems.map((item, idx) => (
                <div
                  key={`tick-2-${item.id}-${idx}`}
                  onClick={() => handleActionClick(item.action)}
                  className="flex items-center gap-2 shrink-0 cursor-pointer group"
                >
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      item.isUrgent
                        ? 'bg-[#C62828] text-[#FFFFFF]'
                        : 'bg-[#174A8B] text-[#FFFFFF] group-hover:bg-[#123A6E]'
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[#FFFFFF] group-hover:text-[#F5F7FA] transition-colors whitespace-nowrap">
                    {item.text}
                  </span>
                  <span className="text-[#174A8B] font-bold mx-2 select-none">•</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtle gradient separator on right */}
        <div className="w-3 sm:w-5 h-full bg-gradient-to-l from-[#0B2A5B] to-transparent z-10 shrink-0 pointer-events-none" />

        {/* =========================================================================
            3 & 4. FIXED RIGHT ELEMENTS: [ HARAKA ] [ Important Link ]
           ========================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-[#0B2A5B] pl-2 sm:pl-3 border-l border-[#174A8B] z-20">
          {/* [ HARAKA ] Badge in Professional Red #C62828 */}
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded font-bold text-[10px] sm:text-[11px] bg-[#C62828] text-[#FFFFFF] uppercase tracking-wider shadow-2xs shrink-0">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFFFFF]" aria-hidden="true" />
            <span>{language === 'sw' ? 'HARAKA' : 'URGENT'}</span>
          </span>

          {/* [ Important Link ] Button with Secondary Blue #174A8B */}
          <button
            onClick={() => handleActionClick(actionTarget)}
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#FFFFFF] hover:text-[#FFFFFF] bg-[#174A8B] hover:bg-[#123A6E] border border-white/20 px-2 sm:px-2.5 py-1 rounded transition-colors cursor-pointer shrink-0"
            title={actionLabel}
          >
            <span className="hidden xs:inline">{actionLabel}</span>
            <span className="xs:hidden">Fomu</span>
            <ArrowRight className="w-3 h-3 text-[#FFFFFF]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
