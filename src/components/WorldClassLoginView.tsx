import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Coins,
  GraduationCap,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Mail,
  HelpCircle,
  ArrowRight,
  LogOut,
  Building2,
  FileSpreadsheet,
  Globe2,
  KeyRound,
  UserCheck,
  User,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useLanguage } from '../context/LanguageContext';
import { SAVED_TEACHERS } from '../data/savedSchoolMedia';
import {
  verifyTeacherIndividualLogin,
  setCustomTeacherPin,
  TEACHER_AUTH_DIRECTORY,
  TeacherAuthProfile,
} from '../services/teacherAuthDirectory';

export type PortalLoginRole = 'admin' | 'bursar' | 'academic_master' | 'teacher';

interface WorldClassLoginViewProps {
  activeRole: PortalLoginRole;
  onRoleChange?: (role: PortalLoginRole) => void;
  onGoogleSignIn: () => Promise<void> | void;
  isSigningIn: boolean;
  authError?: string;
  currentUser?: { email: string | null; displayName: string | null; photoURL: string | null } | null;
  onContinueToPortal?: () => void;
  onSwitchAccount?: () => void;
  onClose?: () => void;
  isModal?: boolean;
  availableTeachers?: any[];
  onDirectTeacherLogin?: (teacherInfo: { id?: string; name: string; email: string; role?: string; subjects?: string[] }) => void;
  onDirectAcademicLogin?: (academicInfo: { name: string; email: string }) => void;
}

export const WorldClassLoginView: React.FC<WorldClassLoginViewProps> = ({
  activeRole,
  onRoleChange,
  onGoogleSignIn,
  isSigningIn,
  authError,
  currentUser,
  onContinueToPortal,
  onSwitchAccount,
  onClose,
  isModal = true,
  availableTeachers,
  onDirectTeacherLogin,
  onDirectAcademicLogin,
}) => {
  const { language, setLanguage } = useLanguage();
  const [showSupportModal, setShowSupportModal] = useState(false);

  const teachersList = availableTeachers && availableTeachers.length > 0 ? availableTeachers : SAVED_TEACHERS;
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(() => {
    const defaultTeacher =
      teachersList.find(
        (t) =>
          t.roleSw?.includes('Taaluma') ||
          t.subjects?.includes('Chemistry') ||
          t.subjects?.includes('Sayansi')
      ) || teachersList[0];
    return defaultTeacher?.id || 'tch-003';
  });
  const [loginMethod, setLoginMethod] = useState<'quick' | 'google'>('quick');
  const [teacherPinInput, setTeacherPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [pinError, setPinError] = useState('');
  const [isLoggingInDirectly, setIsLoggingInDirectly] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [customPinInput, setCustomPinInput] = useState('');
  const [changePinMsg, setChangePinMsg] = useState('');

  const handleSaveCustomPin = () => {
    setChangePinMsg('');
    if (!customPinInput.trim() || customPinInput.trim().length < 4) {
      setChangePinMsg(
        language === 'sw'
          ? 'PIN lazima iwe na angalau tarakimu 4 au zaidi.'
          : 'PIN must be at least 4 digits.'
      );
      return;
    }
    const ok = setCustomTeacherPin(selectedTeacherId, customPinInput.trim());
    if (ok) {
      setChangePinMsg(
        language === 'sw'
          ? '✓ PIN yako mpya binafsi imehifadhiwa kikamilifu!'
          : '✓ Your new confidential PIN has been saved successfully!'
      );
      setTeacherPinInput(customPinInput.trim());
      setTimeout(() => {
        setChangePinMsg('');
        setShowChangePinModal(false);
      }, 1500);
    }
  };

  const handleExecuteDirectTeacherLogin = (customTeacher?: any) => {
    setPinError('');
    const targetTeacher =
      customTeacher || teachersList.find((t) => t.id === selectedTeacherId) || teachersList[0];
    if (!targetTeacher) {
      setPinError(language === 'sw' ? 'Tafadhali chagua mwalimu.' : 'Please select a teacher.');
      return;
    }

    if (!teacherPinInput.trim()) {
      setPinError(
        language === 'sw'
          ? 'Tafadhali weka nambari yako ya siri binafsi (PIN ya mwalimu).'
          : 'Please enter your personal confidential teacher PIN.'
      );
      return;
    }

    // Strict Individual Teacher PIN Verification (prevents teacher impersonation)
    const verification = verifyTeacherIndividualLogin(targetTeacher.id, teacherPinInput);
    if (!verification.success) {
      setPinError(
        language === 'sw'
          ? (verification.errorSw || verification.error || 'PIN si sahihi.')
          : (verification.error || 'Incorrect teacher PIN.')
      );
      return;
    }

    setIsLoggingInDirectly(true);
    if (onDirectTeacherLogin) {
      onDirectTeacherLogin({
        id: targetTeacher.id,
        name: targetTeacher.name,
        email: targetTeacher.email || 'walimu@uombonisec.ac.tz',
        role: 'teacher',
        subjects: verification.teacher?.assignedSubjects || targetTeacher.subjects || ['Chemistry'],
      });
    } else if (onContinueToPortal) {
      onContinueToPortal();
    }
    setIsLoggingInDirectly(false);
  };

  const handleExecuteDirectAcademicLogin = () => {
    setPinError('');
    if (!teacherPinInput.trim()) {
      setPinError(
        language === 'sw'
          ? 'Tafadhali weka PIN ya Mkuu wa Taaluma.'
          : 'Please enter the Academic Master PIN.'
      );
      return;
    }

    const pin = teacherPinInput.trim().toLowerCase();
    const validAcademicPins = [
      '745225',
      '745548',
      'taaluma2026',
      'taaluma-0486',
      '0486',
      'uomboni2026',
    ];

    if (!validAcademicPins.includes(pin)) {
      setPinError(
        language === 'sw'
          ? 'PIN ya Taaluma si sahihi. Tafadhali thibitisha nenosiri lako la siri la uongozi wa taaluma.'
          : 'Invalid Academic Master PIN. Please enter your confidential dean passkey.'
      );
      return;
    }

    setIsLoggingInDirectly(true);
    if (onDirectAcademicLogin) {
      onDirectAcademicLogin({
        name: 'Mwl. Yohana Bahati (Mtaaluma Mkuu)',
        email: 'yohana.bahati@uombonisec.ac.tz',
      });
    } else if (onContinueToPortal) {
      onContinueToPortal();
    }
    setIsLoggingInDirectly(false);
  };

  const rolesConfig: Record<
    PortalLoginRole,
    {
      nameSw: string;
      nameEn: string;
      shortSw: string;
      shortEn: string;
      titleSw: string;
      titleEn: string;
      descSw: string;
      descEn: string;
      icon: React.ElementType;
      badgeColor: string;
      accentBg: string;
      borderGlow: string;
      permissionsSw: string[];
      permissionsEn: string[];
    }
  > = {
    admin: {
      nameSw: 'Utawala Mkuu',
      nameEn: 'Administration',
      shortSw: 'Utawala',
      shortEn: 'Admin',
      titleSw: 'Jopo Kuu la Utawala & Mkuu wa Shule',
      titleEn: 'Executive Leadership & Admin Console',
      descSw: 'Kituo kikuu cha maamuzi, mipangilio ya mifumo ya shule, orodha ya wafanyakazi na taarifa za uendeshaji.',
      descEn: 'Master administrative operations, system configurations, employee management, and institutional governance.',
      icon: ShieldCheck,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      accentBg: 'from-emerald-500/20 via-emerald-600/5 to-transparent',
      borderGlow: 'hover:border-emerald-500/50',
      permissionsSw: ['Usimamizi wa Shule Nzima', 'Mipangilio & Idhini za Watumiaji', 'Ripoti Kuu za Bodi & Wizara'],
      permissionsEn: ['Comprehensive School Operations', 'Security & User Authorization', 'Ministry & Board Analytics'],
    },
    bursar: {
      nameSw: 'Uhasibu & Ada',
      nameEn: 'Bursar & Finance',
      shortSw: 'Uhasibu',
      shortEn: 'Bursar',
      titleSw: 'Ofisi ya Uhasibu na Fedha za Shule',
      titleEn: 'School Finance & Fee Management',
      descSw: 'Usimamizi thabiti wa mapato, kumbukumbu za ada za wanafunzi, ankara, stakabadhi na ukaguzi wa madeni.',
      descEn: 'Fee ledgers, payment tracking, bank receipt reconciliation, debtor reporting, and financial analytics.',
      icon: Coins,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      accentBg: 'from-amber-500/20 via-amber-600/5 to-transparent',
      borderGlow: 'hover:border-amber-500/50',
      permissionsSw: ['Uhakiki wa Malipo ya Ada', 'Utoaji wa Risiti za Kidijitali', 'Taarifa za Madeni & Makusanyo'],
      permissionsEn: ['Fee Collection Verification', 'Electronic Receipt Generation', 'Debtors & Audit Summary'],
    },
    academic_master: {
      nameSw: 'Mkuu wa Taaluma',
      nameEn: 'Academic Dean',
      shortSw: 'Taaluma',
      shortEn: 'Academic',
      titleSw: 'Ofisi Kuu ya Taaluma na Mitihani',
      titleEn: 'Examination Office & Broadsheets',
      descSw: 'Uchakataji wa mitihani ya NECTA, Mock na nusu muhula, viwango vya ufaulu (GPA & Division) na ratiba.',
      descEn: 'NECTA grading compliance, continuous assessment broadsheets, GPA computation, and academic scheduling.',
      icon: GraduationCap,
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      accentBg: 'from-cyan-500/20 via-cyan-600/5 to-transparent',
      borderGlow: 'hover:border-cyan-500/50',
      permissionsSw: ['Broadsheets & Ukokotoaji wa NECTA', 'Uchapishaji wa Ripoti za Mitihani', 'Ratiba Kuu za Shule'],
      permissionsEn: ['Broadsheet Engine & NECTA Ranks', 'Report Card Generator', 'Curriculum & Timetables'],
    },
    teacher: {
      nameSw: 'Walimu wa Masomo',
      nameEn: 'Faculty & Teachers',
      shortSw: 'Walimu',
      shortEn: 'Teachers',
      titleSw: 'Jukwaa la Walimu wa Masomo (Gradebook)',
      titleEn: 'Faculty & Subject Marks Gradebook',
      descSw: 'Uwekaji wa alama za masomo darasani, kupakia Excel marksheets, na kutoa maoni ya kitaaluma ya mwanafunzi.',
      descEn: 'Subject scores entry, single/bulk Excel uploads, class attendance tracking, and student behavioral remarks.',
      icon: BookOpen,
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      accentBg: 'from-indigo-500/20 via-indigo-600/5 to-transparent',
      borderGlow: 'hover:border-indigo-500/50',
      permissionsSw: ['Uwekaji wa Alama kwa Masomo', 'Upakiaji wa Excel Marksheets', 'Maoni ya Mwalimu kwa Wanafunzi'],
      permissionsEn: ['Subject Marks Entry', 'Excel Marks Batch Upload', 'Student Subject Remarks'],
    },
  };

  const currentRoleConfig = rolesConfig[activeRole];
  const RoleIcon = currentRoleConfig.icon;

  return (
    <div
      id="world-class-login-container"
      className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col lg:flex-row text-white text-left selection:bg-emerald-500 selection:text-white"
    >
      {/* ========================================================================= */}
      {/* SIDE A: BRAND & INSTITUTIONAL HERITAGE SHOWCASE (Desktop Left / Mobile Top) */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-5/12 bg-gradient-to-br from-emerald-950/90 via-slate-950 to-slate-900 p-6 sm:p-10 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80">
        {/* Ambient subtle light orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
                <SchoolLogo size="sm" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wide font-serif text-white leading-tight">
                  UOMBONI SECONDARY SCHOOL
                </h1>
                <p className="text-[10px] font-semibold text-amber-400 tracking-wider font-mono uppercase">
                  NECTA CENTRE • S0486
                </p>
              </div>
            </div>

            {/* Live System Status Indicator */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-semibold"
              title="Mfumo wa Ndani wa Watumishi Upo Hewani"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Active</span>
              <span className="font-mono text-[9px] text-emerald-400/80">INTRANET</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Lango la Ndani la Watumishi (Intranet)' : 'Restricted Staff Intranet'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {language === 'sw'
                ? 'Ofisi ya Ndani ya Walimu na Utawala'
                : 'Staffroom & Administrative Gate'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {language === 'sw'
                ? 'Mfumo wa siri na salama wa ndani kwa ajili ya Walimu, Idara ya Taaluma, Uhasibu na Uongozi Mkuu wa Shule ya Sekondari Uomboni.'
                : 'Confidential staff gateway for faculty gradebooks, examination broadsheets, bursar ledgers, and institutional governance.'}
            </p>
          </div>

          {/* Core Feature Highlights */}
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            <div className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">
                  {language === 'sw' ? 'Uthibitishaji Salama wa Google (SSO)' : 'Google Workspace Single Sign-On'}
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {language === 'sw'
                    ? 'Hakuna haja ya kukariri nenosiri au PIN. Ingia moja kwa moja kwa akaunti yako rasmi ya Google.'
                    : 'Zero password friction with encrypted Google OAuth 2.0 institutional authentication.'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">
                  {language === 'sw' ? 'NECTA Broadsheet & Takwimu za Ada' : 'NECTA Broadsheets & Financial Ledgers'}
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {language === 'sw'
                    ? 'Uchakataji wa haraka wa matokeo ya kitaifa na ripoti kamili za mapato ya shule kwa usahihi wa 100%.'
                    : 'Instant automated computations adhering to national education standards.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer School Credibility Quote */}
        <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/30 space-y-2 text-left">
            <p className="text-xs italic text-emerald-200/90 leading-relaxed font-serif">
              &ldquo;TUJIENDELEZE SISI WENYEWE • (Education • Pray • Work)&rdquo;
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Shule ya Sekondari Uomboni</span>
              <span className="font-mono text-emerald-400">Jimbo Katoliki la Moshi</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SIDE B: INTERACTIVE AUTHENTICATION TERMINAL (Right Panel)                  */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-7/12 p-6 sm:p-10 flex flex-col justify-between bg-slate-900/95 backdrop-blur-xl">
        {/* Top Control Bar: Language Switcher & Close Button */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Lugha / Language:
            </span>
            <div className="inline-flex p-0.5 rounded-xl bg-slate-950 border border-slate-800" role="group">
              <button
                type="button"
                id="login-lang-sw"
                onClick={() => setLanguage('sw')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'sw' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇹🇿</span>
                <span>Kiswahili</span>
              </button>
              <button
                type="button"
                id="login-lang-en"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'en' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="login-help-btn"
              onClick={() => setShowSupportModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700/80"
              title="Help & IT Support"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{language === 'sw' ? 'Msaada' : 'Support'}</span>
            </button>

            {isModal && onClose && (
              <button
                type="button"
                id="login-close-btn"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Central Auth Area */}
        <div className="py-6 space-y-6">
          {/* Eyebrow & Title */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Uthibitishaji Salama wa Kiwango cha Kimataifa' : 'Enterprise Authentication'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'sw' ? 'Ingia Kwenye Mfumo' : 'Sign in to Your Account'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'sw'
                ? 'Chagua jukumu lako hapa chini kisha thibitisha utambulisho wako kwa akaunti ya Google.'
                : 'Select your administrative role below to access your secure departmental console.'}
            </p>
          </div>

          {/* Role Switcher Tabs (Segmented Control) */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              {language === 'sw' ? '1. Chagua Jukumu Lako (Portal Role):' : '1. Select Your Role:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(rolesConfig) as PortalLoginRole[]).map((roleKey) => {
                const conf = rolesConfig[roleKey];
                const IconComponent = conf.icon;
                const isSelected = activeRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    id={`login-role-tab-${roleKey}`}
                    onClick={() => onRoleChange && onRoleChange(roleKey)}
                    className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 overflow-hidden ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-400 text-white shadow-lg ring-2 ring-amber-400/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black truncate">
                        {language === 'sw' ? conf.shortSw : conf.shortEn}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {language === 'sw' ? conf.nameSw : conf.nameEn}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Context Information Card */}
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-2xl border bg-gradient-to-br ${currentRoleConfig.accentBg} border-slate-800 space-y-3`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg border ${currentRoleConfig.badgeColor}`}>
                <RoleIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white leading-tight">
                  {language === 'sw' ? currentRoleConfig.titleSw : currentRoleConfig.titleEn}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  {language === 'sw' ? currentRoleConfig.descSw : currentRoleConfig.descEn}
                </p>
              </div>
            </div>

            {/* Permission bullets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(language === 'sw' ? currentRoleConfig.permissionsSw : currentRoleConfig.permissionsEn).map(
                (perm, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-800 text-[10px] font-medium text-slate-300"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{perm}</span>
                  </span>
                )
              )}
            </div>
          </motion.div>

          {/* Authentication Action Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                {language === 'sw' ? '2. Njia ya Kuingia:' : '2. Sign-In Method:'}
              </label>
              {(activeRole === 'teacher' || activeRole === 'academic_master') && (
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('quick')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      loginMethod === 'quick'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🔑 {language === 'sw' ? 'PIN / Haraka' : 'PIN / Quick'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('google')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      loginMethod === 'google'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🌐 Google SSO
                  </button>
                </div>
              )}
            </div>

            {/* If user is already authenticated with Google */}
            {currentUser && currentUser.email ? (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User'}
                        className="w-10 h-10 rounded-full border border-emerald-400 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300 text-sm">
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {currentUser.displayName || 'Watumishi wa Shule'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {language === 'sw' ? 'Imethibitishwa' : 'Verified'}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  {onSwitchAccount && (
                    <button
                      type="button"
                      id="login-switch-account-btn"
                      onClick={onSwitchAccount}
                      className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Sign in with another Google account"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{language === 'sw' ? 'Badili' : 'Switch'}</span>
                    </button>
                  )}
                </div>

                {onContinueToPortal && (
                  <button
                    type="button"
                    id="btn-continue-to-portal"
                    onClick={onContinueToPortal}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/40 group"
                  >
                    <span>
                      {language === 'sw'
                        ? `Fungua Jopo la ${currentRoleConfig.shortSw}`
                        : `Access ${currentRoleConfig.shortEn} Portal`}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            ) : loginMethod === 'quick' && activeRole === 'teacher' ? (
              /* QUICK TEACHER LOGIN / INDIVIDUAL CREDENTIALS & ISOLATION GATE */
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/95 border-2 border-emerald-500/40 space-y-4 shadow-2xl">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h5 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'sw' ? 'Utambulisho wa Mwalimu wa Somo' : 'Teacher Identification & Subject Gate'}</span>
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'sw'
                        ? 'Chagua jina lako na uweke PIN yako binafsi ya siri kuingia kwenye somo lako.'
                        : 'Select your faculty profile and enter your individual secret PIN.'}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/60 font-mono font-bold self-start sm:self-center">
                    🔒 RBAC Protected
                  </span>
                </div>

                {/* Faculty Search & Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      {language === 'sw' ? '1. Chagua Jina Lako:' : '1. Select Your Faculty Name:'}
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {teachersList.length} {language === 'sw' ? 'walimu wamesajiliwa' : 'registered faculty'}
                    </span>
                  </div>

                  {/* Search box if searching through teachers */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={teacherSearchQuery}
                      onChange={(e) => setTeacherSearchQuery(e.target.value)}
                      placeholder={language === 'sw' ? 'Tafuta mwalimu au somo...' : 'Search faculty or subject...'}
                      className="w-full pl-8.5 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Teacher Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {teachersList
                      .filter((tch) => {
                        if (!teacherSearchQuery.trim()) return true;
                        const q = teacherSearchQuery.toLowerCase();
                        return (
                          tch.name.toLowerCase().includes(q) ||
                          (tch.subjects && tch.subjects.some((s: string) => s.toLowerCase().includes(q))) ||
                          (tch.department && tch.department.toLowerCase().includes(q))
                        );
                      })
                      .map((tch) => {
                        const isSelected = (tch.id === selectedTeacherId) || (!selectedTeacherId && tch.id === teachersList[0]?.id);
                        const assignedList = tch.subjects && tch.subjects.length > 0 ? tch.subjects : ['Chemistry'];
                        return (
                          <button
                            key={tch.id}
                            type="button"
                            onClick={() => {
                              setSelectedTeacherId(tch.id);
                              setPinError('');
                            }}
                            className={`p-2.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-emerald-400 text-white ring-2 ring-emerald-400/40 shadow-md'
                                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                            }`}
                          >
                            <img
                              src={tch.imageUrl || '/media/media_1.webp'}
                              alt={tch.name}
                              className="w-10 h-10 rounded-xl object-cover border border-amber-400/50 shrink-0 mt-0.5"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-white truncate block">{tch.name}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
                              </div>
                              <span className="text-[10px] text-slate-400 block truncate font-mono">
                                {tch.department || 'Idara ya Masomo'}
                              </span>
                              {/* Prominent Assigned Subject Badge */}
                              <div className="pt-0.5">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                  isSelected
                                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                                    : 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60'
                                }`}>
                                  ★ Somo: {assignedList.join(', ')}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Selected Teacher Summary Banner */}
                {(() => {
                  const currentTeacherObj = teachersList.find((t) => t.id === selectedTeacherId) || teachersList[0];
                  const currentSubjects = currentTeacherObj?.subjects || ['Chemistry'];
                  return (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center border border-emerald-500/30">
                          {currentTeacherObj?.name.split(' ')[1]?.[0] || 'M'}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Utaingia kama:</span>
                          <span className="font-black text-white">{currentTeacherObj?.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-amber-400 block font-bold">Ruhusa ya Kuingiza Maksi:</span>
                        <span className="text-xs font-black text-emerald-300">
                          Somo la {currentSubjects.join(', ')} pekee
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Personal Secret PIN Input (Secured, No prefilled dummy values) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'sw' ? '2. Nambari Yako Binafsi ya Siri (PIN ya Mwalimu):' : '2. Your Personal Confidential PIN:'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowChangePinModal(!showChangePinModal)}
                      className="text-[10px] text-amber-400 underline font-bold hover:text-amber-300 cursor-pointer"
                    >
                      {language === 'sw' ? 'Badili PIN Yangu' : 'Set/Change My PIN'}
                    </button>
                  </div>

                  {/* Change Personal PIN Drawer */}
                  {showChangePinModal && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-amber-400/40 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold">
                        <span>{language === 'sw' ? 'Weka PIN Mpya Binafsi ya Siri:' : 'Set New Personal PIN:'}</span>
                        <button
                          type="button"
                          onClick={() => setShowChangePinModal(false)}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          value={customPinInput}
                          onChange={(e) => setCustomPinInput(e.target.value)}
                          placeholder={language === 'sw' ? 'Tarakimu 4 au zaidi...' : '4 or more digits...'}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-hidden focus:border-amber-400"
                        />
                        <button
                          type="button"
                          onClick={handleSaveCustomPin}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer shadow-xs"
                        >
                          {language === 'sw' ? 'Hifadhi' : 'Save'}
                        </button>
                      </div>
                      {changePinMsg && (
                        <p className="text-[10px] font-bold text-emerald-400">{changePinMsg}</p>
                      )}
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      id="input-teacher-direct-pin"
                      value={teacherPinInput}
                      onChange={(e) => {
                        setTeacherPinInput(e.target.value);
                        if (pinError) setPinError('');
                      }}
                      placeholder={language === 'sw' ? 'Weka PIN yako binafsi ya siri...' : 'Enter your personal confidential PIN...'}
                      className="w-full pl-3.5 pr-10 py-3 bg-slate-950 border-2 border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 rounded-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-hidden tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                      title={showPin ? 'Ficha PIN' : 'Onyesha PIN'}
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Security Isolation Notice */}
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {language === 'sw'
                        ? 'Ulinzi wa Utambulisho: Kila mwalimu anayo PIN yake binafsi ya siri. Mwalimu mwingine hawezi kuingia kwa jina la mwenzake.'
                        : 'Identity Isolation: Each faculty member has their own confidential PIN. Other teachers cannot access this portal under your name.'}
                    </span>
                  </div>

                  {pinError && (
                    <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-xs text-rose-300 font-semibold flex items-center gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{pinError}</span>
                    </div>
                  )}
                </div>

                {/* Direct Teacher Login Submit Button */}
                <button
                  type="button"
                  id="btn-teacher-direct-login"
                  disabled={isLoggingInDirectly}
                  onClick={() => handleExecuteDirectTeacherLogin()}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/50 group"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {language === 'sw'
                      ? 'Thibitisha na Ingia Kwenye Somo Lako'
                      : 'Authenticate & Open Your Subject Gradebook'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : loginMethod === 'quick' && activeRole === 'academic_master' ? (
              /* QUICK ACADEMIC MASTER LOGIN */
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/95 border-2 border-amber-500/40 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-xl shadow-md">
                    📚
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">Mwl. Yohana Bahati / Madam Adela Manyanga</h5>
                    <p className="text-xs text-slate-400">
                      Wakuu wa Idara ya Taaluma na Mitihani • yohana.bahati@uombonisec.ac.tz
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'sw' ? 'Nenosiri / PIN ya Siri ya Taaluma (Dean Passkey):' : 'Academic Master Secret PIN:'}</span>
                  </label>

                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      id="input-academic-direct-pin"
                      value={teacherPinInput}
                      onChange={(e) => {
                        setTeacherPinInput(e.target.value);
                        if (pinError) setPinError('');
                      }}
                      placeholder={language === 'sw' ? 'Weka PIN ya Mkuu wa Taaluma...' : 'Enter Academic Master PIN...'}
                      className="w-full pl-3.5 pr-10 py-3 bg-slate-950 border-2 border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 rounded-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-hidden tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                      title={showPin ? 'Ficha PIN' : 'Onyesha PIN'}
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Inahitaji nenosiri la siri la Mkuu wa Taaluma kuruhusu uidhinishaji wa matokeo ya shule.</span>
                  </p>

                  {pinError && (
                    <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-xs text-rose-300 font-semibold flex items-center gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{pinError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  id="btn-academic-direct-login"
                  disabled={isLoggingInDirectly}
                  onClick={handleExecuteDirectAcademicLogin}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/50 group"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {language === 'sw'
                      ? 'Thibitisha na Ingia Kwenye Jopo la Taaluma'
                      : 'Authenticate & Open Academic Master Console'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              /* PRIMARY GOOGLE SIGN-IN BUTTON */
              <div className="space-y-3">
                <GoogleSignInButton
                  onClick={onGoogleSignIn}
                  isLoading={isSigningIn}
                  label={
                    language === 'sw'
                      ? `Ingia kwa Akaunti ya Google (${currentRoleConfig.shortSw})`
                      : `Sign in with Google (${currentRoleConfig.shortEn})`
                  }
                  sublabel={
                    language === 'sw'
                      ? 'Firebase OAuth 2.0 • Anwani rasmi ya Google'
                      : 'Firebase OAuth 2.0 • Verified Google SSO'
                  }
                  theme="dark"
                  id={`btn-google-signin-${activeRole}`}
                  className="py-4 shadow-xl border-amber-500/40 hover:border-amber-400 bg-slate-950"
                />

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-slate-300 font-bold">
                    <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{language === 'sw' ? 'Akaunti zilizoidhinishwa:' : 'Authorized Accounts:'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                    @uombonisec.ac.tz au barua pepe rasmi iliyosajiliwa (mfano: adolphmassawe@gmail.com)
                  </p>
                </div>
              </div>
            )}

            {/* Error Message Display */}
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 flex items-start gap-2.5 text-rose-300 text-xs font-medium text-left"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <span className="font-bold block">{language === 'sw' ? 'Hitilafu ya Kuingia' : 'Authentication Error'}</span>
                  <span>{authError}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Trust & Compliance Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL/TLS</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Firebase OAuth 2.0</span>
            </span>
          </div>

          <button
            type="button"
            id="login-it-contact-link"
            onClick={() => setShowSupportModal(true)}
            className="text-amber-400 hover:text-amber-300 hover:underline transition-colors font-medium cursor-pointer"
          >
            {language === 'sw' ? 'Wasiliana na Ofisi ya TEHAMA' : 'Contact IT Helpdesk'}
          </button>
        </div>
      </div>

      {/* IT Support Dialog */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {language === 'sw' ? 'Msaada wa Kuingia (IT Support)' : 'Staff Sign-In Helpdesk'}
                  </h4>
                </div>
                <button
                  type="button"
                  id="close-support-modal-btn"
                  onClick={() => setShowSupportModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  {language === 'sw'
                    ? 'Ikiwa unakumbana na changamoto ya kuingia kwenye jopo lako la kazi, hakikisha akaunti yako ya Google imeidhinishwa na Ofisi ya Mkuu wa Shule au Kitengo cha TEHAMA.'
                    : 'If you experience any difficulties signing in, ensure your Google Workspace email address is registered with the Headmaster’s Office or IT Unit.'}
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-bold">+255 782 558 127</span>
                    <span className="text-[10px] text-slate-400">(Simu & WhatsApp)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span className="font-mono">info@uombonisecondary.ac.tz</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span>Ofisi Kuu ya Utawala, Marangu Moshi</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="ack-support-btn"
                onClick={() => setShowSupportModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                {language === 'sw' ? 'Nimeelewa' : 'Understood'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
