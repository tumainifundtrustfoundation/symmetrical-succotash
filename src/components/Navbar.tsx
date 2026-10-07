import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SchoolLogo } from './SchoolLogo';
import { UrgentNotificationBanner } from './UrgentNotificationBanner';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Lock,
  Users,
  ChevronRight,
  Globe,
  LogIn,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  onOpenParentPortal?: () => void;
  onOpenStaffPortal?: () => void;
  onOpenAdmissions?: () => void;
  onOpenLogin?: () => void;
  onOpenResults?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection = 'home',
  onNavigate,
  onOpenParentPortal,
  onOpenStaffPortal,
  onOpenAdmissions,
  onOpenLogin,
  onOpenResults,
}) => {
  const { language, setLanguage } = useLanguage();
  const { user, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'academics', label: 'Academics' },
    { id: 'teachers', label: 'Teachers' },
    { id: 'students', label: 'Students' },
    { id: 'parents', label: 'Parents' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'news', label: 'News & Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Animated News & Announcement Ticker */}
      <UrgentNotificationBanner
        onActionClick={(target) => {
          if (target === 'admissions' || target === 'apply') {
            if (onOpenAdmissions) onOpenAdmissions();
          } else if (target === 'results' || target === 'necta') {
            if (onOpenResults) onOpenResults();
          } else if (onNavigate) {
            onNavigate(target);
          }
        }}
        onOpenAdmissions={onOpenAdmissions}
        onOpenResults={onOpenResults}
        onNavigate={onNavigate}
      />

      {/* Top Institutional Header Bar */}
      <div className="bg-[#102A43] text-[#FFFFF0] border-b border-[#C9A227]/20 text-[12px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden sm:inline-flex items-center gap-1.5 font-medium text-[#FFFFF0]/90">
              <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
              Marangu, Moshi, Kilimanjaro
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#FFFFF0]/90">
              <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
              +255 782 558 127
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[#FFFFF0]/80">
              <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
              uombonisec@gmail.com
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold tracking-wider text-[#C9A227]">
              NECTA CENTRE S0486
            </span>
            <span className="text-[#FFFFF0]/30">|</span>
            <button
              onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FFFFF0]/90 hover:text-[#C9A227] transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3 h-3 text-[#C9A227]" />
              {language === 'sw' ? 'English' : 'Kiswahili'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full bg-[#FFFFFF] border-b transition-all ${
          isScrolled
            ? 'shadow-sm border-[#102A43]/10 py-2.5'
            : 'border-[#102A43]/10 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo & School Branding */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <SchoolLogo size="md" />
            <div>
              <span className="block text-sm sm:text-base font-bold text-[#102A43] tracking-tight group-hover:text-[#102A43]/85 transition-colors">
                Uomboni Secondary School
              </span>
              <span className="block text-[11px] text-slate-500 font-medium">
                Building Knowledge, Character &amp; Excellence
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-1 2xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2.5 py-1.5 text-[13px] font-medium transition-colors cursor-pointer rounded-md ${
                    isActive
                      ? 'text-[#102A43] font-bold border-b-2 border-[#C9A227] rounded-none'
                      : 'text-slate-700 hover:text-[#102A43] hover:bg-[#FFFFF0]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              id="nav-parent-portal-btn"
              onClick={onOpenParentPortal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#102A43] border border-[#102A43]/25 hover:border-[#102A43] hover:bg-[#FFFFF0] rounded-md transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Parent Portal</span>
            </button>

            <button
              id="nav-staff-portal-btn"
              onClick={onOpenStaffPortal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#102A43] hover:bg-[#0A1C2E] rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Staff Portal</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F5EBD7] rounded text-xs text-[#704214] border border-[#704214]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                  <span className="font-semibold truncate max-w-[110px]">{userProfile?.fullName || user.email?.split('@')[0]}</span>
                  <span className="text-[10px] uppercase font-bold text-[#704214]/70">({userProfile?.role || 'user'})</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-[#704214] hover:bg-[#F5EBD7] rounded border border-[#704214]/20 transition-colors cursor-pointer"
                  title="Ondoka kwenye mfumo (Logout)"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Toka</span>
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#704214] bg-[#F5EBD7] hover:bg-white border border-[#704214]/25 rounded-md transition-colors cursor-pointer shadow-2xs"
                title="Ingia kwenye Mfumo (Login)"
              >
                <LogIn className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Ingia</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#102A43] hover:bg-[#FFFFF0] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[126px] z-50 bg-[#102A43]/40 backdrop-blur-xs xl:hidden">
          <div className="bg-[#FFFFFF] border-b border-[#102A43]/15 max-h-[85vh] overflow-y-auto px-4 py-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-md transition-colors flex items-center justify-between ${
                    activeSection === link.id
                      ? 'bg-[#FFFFF0] text-[#102A43] font-bold border-l-3 border-[#C9A227]'
                      : 'text-slate-700 hover:bg-[#FFFFF0] hover:text-[#102A43]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="pt-6 mt-4 border-t border-slate-200 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenParentPortal) onOpenParentPortal();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#102A43] border border-[#102A43]/30 rounded-md hover:bg-[#FFFFF0] transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#C9A227]" />
                <span>Parent Portal</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenStaffPortal) onOpenStaffPortal();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#102A43] rounded-md hover:bg-[#0A1C2E] transition-colors cursor-pointer shadow-xs"
              >
                <Lock className="w-4 h-4 text-[#C9A227]" />
                <span>Staff Portal</span>
              </button>

              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#704214] bg-[#F5EBD7] rounded-md hover:bg-[#F5EBD7]/80 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#C9A227]" />
                  <span>Toka ({userProfile?.fullName || user.email?.split('@')[0]})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenLogin) onOpenLogin();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#704214] bg-[#F5EBD7] border border-[#704214]/25 rounded-md hover:bg-white transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#C9A227]" />
                  <span>Ingia kwenye Akaunti (Login)</span>
                </button>
              )}

              {onOpenAdmissions && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmissions();
                  }}
                  className="w-full text-center px-4 py-2.5 text-xs font-semibold text-[#102A43] bg-[#FFFFF0] border border-[#C9A227]/40 rounded-md hover:bg-white transition-colors cursor-pointer"
                >
                  Apply for Admissions
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
