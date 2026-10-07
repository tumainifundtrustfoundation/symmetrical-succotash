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

    // 1. Active urgent alerts first
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
          isUrgent: false,
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
              ? 'Uhamisho wa Kidato cha 2 & 3 Unaendelea. Pakua fomu na maelekezo ya kujiunga sasa.'
              : 'Form 2 & 3 Student Transfers Ongoing. Download joining instructions and application forms now.',
          category: language === 'sw' ? 'UHAMISHO' : 'TRANSFERS',
          isUrgent: true,
          action: 'admissions',
          linkText: language === 'sw' ? 'Pakua Fomu' : 'Download Forms',
        },
        {
          id: 'def-2',
          text:
            language === 'sw'
              ? 'Matokeo Rasmi ya NECTA CSEE: Kituo S0486 Uomboni chapata ufaulu mzuri wa madaraja ya juu (Div I, II na III).'
              : 'Official NECTA CSEE Results: Center S0486 Uomboni achieves high performance in Division I, II and III.',
          category: 'NECTA',
          isUrgent: false,
          action: 'results',
          linkText: language === 'sw' ? 'Tazama Matokeo' : 'View Results',
        },
        {
          id: 'def-3',
          text:
            language === 'sw'
              ? 'Matangazo ya Shule: Nafasi za Udahili Kidato cha Kwanza 2026 za Bweni na Kutwa ziko wazi.'
              : 'School Announcements: Form One 2026 Boarding and Day admissions are now open.',
          category: language === 'sw' ? 'MATANGAZO' : 'ANNOUNCEMENTS',
          isUrgent: false,
          action: 'admissions',
          linkText: language === 'sw' ? 'Fomu za Kujiunga' : 'Admission Forms',
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
      className="w-full bg-[#102A43] text-[#FFFFF0] border-b border-[#C9A227]/30 shadow-xs relative z-50 overflow-hidden select-none"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center h-9 sm:h-10 px-2 sm:px-4">
        {/* =========================================================================
            1. FIXED LEFT BADGE: [ 📢 TAARIFA ]
           ========================================================================= */}
        <div className="flex items-center gap-1.5 shrink-0 bg-[#102A43] text-[#FFFFF0] py-1 pr-2.5 sm:pr-3.5 border-r border-[#C9A227]/30 font-bold text-[11px] sm:text-xs uppercase tracking-wider z-20">
          <Megaphone className="w-3.5 h-3.5 text-[#C9A227] shrink-0" aria-hidden="true" />
          <span className="font-bold text-white tracking-wide">
            {language === 'sw' ? 'TAARIFA' : 'NEWS'}
          </span>
        </div>

        {/* Subtle gradient separator on left */}
        <div className="w-3 sm:w-5 h-full bg-gradient-to-r from-[#102A43] to-transparent z-10 shrink-0 pointer-events-none" />

        {/* =========================================================================
            2. ANIMATED NEWS CONTENT (Moving Right to Left)
           ========================================================================= */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center news-ticker-container">
          {prefersReducedMotion ? (
            /* ACCESSIBILITY: Display latest announcement statically without continuous animation */
            <div
              onClick={() => handleActionClick(primaryUrgent.action)}
              className="flex items-center gap-2 px-2 text-xs text-[#FFFFF0] truncate cursor-pointer group"
            >
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40">
                {primaryUrgent.category}
              </span>
              <span className="truncate font-medium group-hover:text-[#C9A227] transition-colors">
                {primaryUrgent.text}
              </span>
            </div>
          ) : (
            /* CONTINUOUS SMOOTH TICKER TRACK (Right to Left) */
            <div
              className="news-ticker-track flex items-center gap-8 sm:gap-12 text-xs sm:text-[13px] font-medium text-[#FFFFF0] py-1"
              style={{ animationDuration: `${animationDurationSeconds}s` }}
            >
              {/* Set 1 */}
              {tickerItems.map((item, idx) => (
                <div
                  key={`tick-1-${item.id}-${idx}`}
                  onClick={() => handleActionClick(item.action)}
                  className="flex items-center gap-2 shrink-0 cursor-pointer group"
                >
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40 group-hover:bg-[#C9A227] group-hover:text-[#102A43] transition-colors">
                    {item.category}
                  </span>
                  <span className="text-[#FFFFF0] group-hover:text-[#C9A227] transition-colors whitespace-nowrap">
                    {item.text}
                  </span>
                  <span className="text-[#C9A227] font-bold mx-2 select-none">•</span>
                </div>
              ))}

              {/* Set 2 (Duplicate for Seamless Infinite Marquee Loop) */}
              {tickerItems.map((item, idx) => (
                <div
                  key={`tick-2-${item.id}-${idx}`}
                  onClick={() => handleActionClick(item.action)}
                  className="flex items-center gap-2 shrink-0 cursor-pointer group"
                >
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40 group-hover:bg-[#C9A227] group-hover:text-[#102A43] transition-colors">
                    {item.category}
                  </span>
                  <span className="text-[#FFFFF0] group-hover:text-[#C9A227] transition-colors whitespace-nowrap">
                    {item.text}
                  </span>
                  <span className="text-[#C9A227] font-bold mx-2 select-none">•</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtle gradient separator on right */}
        <div className="w-3 sm:w-5 h-full bg-gradient-to-l from-[#102A43] to-transparent z-10 shrink-0 pointer-events-none" />

        {/* =========================================================================
            3 & 4. FIXED RIGHT ELEMENTS: [ HARAKA ] [ Important Link ]
           ========================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-[#102A43] pl-2 sm:pl-3 border-l border-[#C9A227]/30 z-20">
          {/* [ HARAKA ] Badge */}
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded font-bold text-[10px] sm:text-[11px] bg-[#C9A227] text-[#102A43] uppercase tracking-wider shadow-2xs shrink-0">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#102A43]" aria-hidden="true" />
            <span>{language === 'sw' ? 'HARAKA' : 'URGENT'}</span>
          </span>

          {/* [ Important Link ] */}
          <button
            onClick={() => handleActionClick(actionTarget)}
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#FFFFF0] hover:text-[#C9A227] bg-[#FFFFF0]/10 hover:bg-[#FFFFF0]/20 border border-[#C9A227]/40 px-2 sm:px-2.5 py-1 rounded transition-colors cursor-pointer shrink-0"
            title={actionLabel}
          >
            <span className="hidden xs:inline">{actionLabel}</span>
            <span className="xs:hidden">Fomu</span>
            <ArrowRight className="w-3 h-3 text-[#C9A227]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
