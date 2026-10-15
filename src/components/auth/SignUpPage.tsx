import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Users,
  ChevronLeft,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { SchoolLogo } from '../SchoolLogo';
import { GoogleAccountSelectModal } from '../GoogleAccountSelectModal';
import { TermsAndPrivacyModal } from '../TermsAndPrivacyModal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../lib/firebase';
import { validateParentStudentLink, submitTeacherAccessRequest } from '../../services/teacherAuthDirectory';

type SignupRole = 'student' | 'parent';

export const SignUpPage: React.FC = () => {
  const { signUp, loginWithGoogleAuth, loading, authMessage, setAuthMessage, setActiveView } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<SignupRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');

  // Parent student verification states
  const [childStudentId, setChildStudentId] = useState('');
  const [childAcademicYear, setChildAcademicYear] = useState('2026');
  const [parentVerifiedChild, setParentVerifiedChild] = useState<{ name: string; form: string } | null>(null);
  const [parentContactAlert, setParentContactAlert] = useState<string | null>(null);

  // Teacher Access Request Modal States
  const [isTeacherRequestModalOpen, setIsTeacherRequestModalOpen] = useState(false);
  const [trName, setTrName] = useState('');
  const [trEmail, setTrEmail] = useState('');
  const [trPhone, setTrPhone] = useState('');
  const [trDept, setTrDept] = useState('Sayansi');
  const [trSubjects, setTrSubjects] = useState('');
  const [trNotes, setTrNotes] = useState('');
  const [trFeedback, setTrFeedback] = useState<string | null>(null);

  // Live password strength calculation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  let strengthLabel = 'Very Weak';
  let strengthColor = 'bg-rose-500';
  let strengthTextColor = 'text-rose-400';

  if (criteriaCount === 5) {
    strengthLabel = 'Strong (Excellent)';
    strengthColor = 'bg-emerald-500';
    strengthTextColor = 'text-emerald-400';
  } else if (criteriaCount >= 3) {
    strengthLabel = 'Good';
    strengthColor = 'bg-blue-500';
    strengthTextColor = 'text-blue-400';
  } else if (criteriaCount >= 2) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500';
    strengthTextColor = 'text-amber-400';
  }

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      errors.fullName = language === 'sw' ? 'Tafadhali ingiza jina lako kamili.' : 'Please enter your full name.';
    }

    if (!email.trim()) {
      errors.email = language === 'sw' ? 'Tafadhali ingiza anwani ya barua pepe.' : 'Please enter your email.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = language === 'sw' ? 'Muundo wa barua pepe si sahihi.' : 'Invalid email address format.';
    }

    if (!phone.trim()) {
      errors.phone = language === 'sw' ? 'Tafadhali ingiza nambari ya simu.' : 'Please enter your phone number.';
    }

    if (criteriaCount < 5) {
      errors.password =
        language === 'sw'
          ? 'Nenosiri lazima litimize masharti yote 5 ya kiusalama hapa chini.'
          : 'Password must satisfy all 5 security requirements below.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword =
        language === 'sw' ? 'Manenosiri hayalingani. Hakiki tena.' : 'Passwords do not match.';
    }

    if (selectedRole === 'parent') {
      if (!childStudentId.trim()) {
        errors.childStudentId =
          language === 'sw'
            ? 'Mzazi lazima aweke Student ID au Namba ya Mtihani ya mwanafunzi wake.'
            : 'Parent must enter their student’s ID or Exam Index Number.';
      } else {
        const linkRes = validateParentStudentLink(childStudentId.trim(), childAcademicYear);
        if (!linkRes.valid) {
          errors.childStudentId =
            language === 'sw'
              ? 'Mwanafunzi huyu hajapatikana katika kanzidata ya shule ya mwaka 2026. Tafadhali wasiliana na uongozi wa shule.'
              : 'Student not found in the 2026 school database. Please contact school administration.';
          setParentContactAlert(
            language === 'sw'
              ? 'Mwanafunzi huyu hajapatikana katika kanzidata ya shule ya mwaka 2026. Kama hayupo huyo mwanafunzi basi awasiliane na uongozi wa shule (0782 558 127 au info@uombonisec.ac.tz).'
              : 'Student record not found in 2026 official database. If the student is not yet registered, please contact school administration.'
          );
        } else {
          setParentVerifiedChild({ name: linkRes.studentName || '', form: linkRes.form || '' });
          setParentContactAlert(null);
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerifyChild = () => {
    if (!childStudentId.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        childStudentId: language === 'sw' ? 'Tafadhali weka Student ID au Namba ya Mtihani.' : 'Please enter Student ID or Index Number.',
      }));
      return;
    }
    const linkRes = validateParentStudentLink(childStudentId.trim(), childAcademicYear);
    if (!linkRes.valid) {
      setParentVerifiedChild(null);
      setParentContactAlert(
        language === 'sw'
          ? 'Mwanafunzi huyu hajapatikana katika kanzidata ya shule ya mwaka 2026. Kama hayupo huyo mwanafunzi basi awasiliane na uongozi wa shule (0782 558 127 au uongozi@uombonisec.ac.tz).'
          : 'Student record not found in 2026 database. If not registered, contact school leadership.'
      );
    } else {
      setParentContactAlert(null);
      setParentVerifiedChild({ name: linkRes.studentName || '', form: linkRes.form || '' });
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.childStudentId;
        return next;
      });
    }
  };

  const handleSubmitTeacherRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trName.trim() || !trEmail.trim()) {
      setTrFeedback(language === 'sw' ? 'Tafadhali jaza jina na barua pepe.' : 'Please enter name and email.');
      return;
    }
    const res = submitTeacherAccessRequest({
      name: trName.trim(),
      email: trEmail.trim(),
      phone: trPhone.trim(),
      department: trDept,
      subjects: trSubjects.split(',').map((s) => s.trim()).filter(Boolean),
      notes: trNotes.trim(),
    });
    if (res.success) {
      setTrFeedback(
        language === 'sw'
          ? '✅ Ombi lako limetumwa kwa Mkuu wa Shule (Admin). Utapewa email na nenosiri la kuingilia baada ya uhakiki.'
          : '✅ Request submitted to the Administrator. Credentials will be issued after verification.'
      );
      setTimeout(() => {
        setIsTeacherRequestModalOpen(false);
        setTrFeedback(null);
      }, 3500);
    } else {
      setTrFeedback(res.error || 'Hitilafu imetokea.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await signUp({
      fullName,
      email,
      phone,
      password,
      role: selectedRole,
    });
    setIsSubmitting(false);
  };

  const handleGoogleSignUp = () => {
    setIsGoogleModalOpen(true);
  };

  const handleSelectGoogleAccount = async (selectedEmail: string, selectedName: string, role: UserRole) => {
    setIsGoogleModalOpen(false);
    setIsSubmitting(true);
    await loginWithGoogleAuth(role, { email: selectedEmail, name: selectedName, role });
    setIsSubmitting(false);
  };

  const openLegalModal = (tab: 'privacy' | 'terms') => {
    setLegalTab(tab);
    setIsLegalModalOpen(true);
  };

  const rolesConfig: { id: SignupRole; label: string; sub: string; icon: React.ElementType }[] = [
    { id: 'student', label: 'Student', sub: 'Mwanafunzi', icon: GraduationCap },
    { id: 'parent', label: 'Parent/Guardian', sub: 'Mzazi / Mlezi', icon: Users },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Subtle Mesh Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-700/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => setActiveView('website')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/50 backdrop-blur-md transition-all group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>{language === 'sw' ? 'Rudi Tovuti Kuu ya Shule' : 'Back to Public Site'}</span>
        </button>

        {/* Language Selector */}
        <div className="flex items-center bg-slate-900/70 p-1 rounded-xl border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setLanguage('sw')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              language === 'sw' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇹🇿 SW
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              language === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇬🇧 EN
          </button>
        </div>
      </header>

      {/* Registration Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Top glowing line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-400" />

          {/* Heading */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="p-2 rounded-2xl bg-slate-800/60 border border-slate-700/50 shadow-inner">
                <SchoolLogo size="md" />
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-normal">
              Create Your Uomboni Account
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              Join the Uomboni Secondary School digital community.
            </p>

            <div className="mt-1.5 flex items-center justify-center gap-2 text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
              <span>TUJIENDELEZE SISI WENYEWE</span>
              <span>•</span>
              <span className="text-emerald-400">Education, Pray, Work</span>
            </div>
          </div>

          {/* Error / Info banner */}
          <AnimatePresence>
            {authMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-5 p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                  authMessage.type === 'error'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                {authMessage.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 font-medium">{authMessage.text}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Account Type Selection */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {language === 'sw' ? 'Chagua Aina ya Akaunti Yako' : 'Select Account Type'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {rolesConfig.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRole(item.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col items-center text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md shadow-emerald-950/50'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold leading-tight">{item.label}</span>
                    <span className="text-[10px] opacity-70 leading-tight mt-0.5">{item.sub}</span>
                  </button>
                );
              })}
            </div>
            {/* Teacher and Staff Provisioning Alert & Request Trigger */}
            <div className="mt-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-amber-300 block">
                    {language === 'sw' ? '👨‍🏫 Wewe ni Mwalimu au Mtumishi?' : '👨‍🏫 Are you a Teacher or Staff member?'}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {language === 'sw'
                      ? 'Akaunti zote za walimu hupewa barua pepe na nenosiri la kuingilia na Mkuu wa Shule (Admin) pekee.'
                      : 'All teacher and staff credentials (email & initial password) are assigned directly by the Administrator.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTeacherRequestModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Tuma Ombi kwa Admin' : 'Request Account'}
                </button>
              </div>

              {/* Student Admission Option for Unregistered Students */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  {language === 'sw' ? '🎓 Mwanafunzi mpya asiye na usajili?' : '🎓 New student not yet registered?'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('website');
                    window.location.hash = '#apply';
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
                >
                  {language === 'sw' ? 'Fungua Admission ya Mwanafunzi →' : 'Student Admission Form →'}
                </button>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                {language === 'sw' ? 'Jina Kamili' : 'Full Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: '' });
                  }}
                  placeholder="e.g. Mary J. Massawe"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
              {fieldErrors.fullName && (
                <p className="mt-1 text-[11px] text-rose-400 font-medium">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Parent-Only Student Link Requirement (Exact prompt rule: student ID, number, year 2026) */}
            {selectedRole === 'parent' && (
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border-2 border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'sw' ? 'Uthibitisho wa Mwanafunzi Wako' : 'Student Verification'}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Mwaka 2026
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {language === 'sw'
                    ? 'Mzazi anahitajika kuweka Student ID au Namba ya Mtihani/Usajili na Mwaka wa mwanafunzi wake. Mfumo utamthibitisha moja kwa moja kabla ya kusajili akaunti.'
                    : 'Parents must provide their child’s Student ID or Exam/Index Number and Academic Year for verification.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {language === 'sw' ? 'Student ID / Namba ya Mtihani *' : 'Student ID / Exam Index *'}
                    </label>
                    <input
                      type="text"
                      value={childStudentId}
                      onChange={(e) => {
                        setChildStudentId(e.target.value);
                        setParentVerifiedChild(null);
                        setParentContactAlert(null);
                        if (fieldErrors.childStudentId) {
                          setFieldErrors({ ...fieldErrors, childStudentId: '' });
                        }
                      }}
                      placeholder="mf. S0486-0036 au S.0486.0001"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white uppercase placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {language === 'sw' ? 'Mwaka wa Masomo' : 'Academic Year'}
                    </label>
                    <input
                      type="text"
                      value={childAcademicYear}
                      onChange={(e) => setChildAcademicYear(e.target.value)}
                      placeholder="2026"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleVerifyChild}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    {language === 'sw' ? 'Hakiki Mwanafunzi Sasa' : 'Verify Student Now'}
                  </button>

                  <span className="text-[10px] text-slate-400">
                    Kidato cha 1 - 4 (2026)
                  </span>
                </div>

                {fieldErrors.childStudentId && (
                  <p className="text-[11px] text-rose-400 font-medium">{fieldErrors.childStudentId}</p>
                )}

                {/* Verified student banner */}
                {parentVerifiedChild && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400 text-xs text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold">Mwanafunzi Amethibitishwa:</span> {parentVerifiedChild.name} ({parentVerifiedChild.form}, 2026)
                    </div>
                  </div>
                )}

                {/* Not found alert with contact school leadership guidance */}
                {parentContactAlert && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{parentContactAlert}</p>
                    </div>
                    <div className="flex items-center gap-3 pt-1 text-[11px]">
                      <a
                        href="tel:+255782558127"
                        className="font-bold text-amber-300 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>0782 558 127 (Mkuu wa Shule)</span>
                      </a>
                      <a
                        href="mailto:info@uombonisec.ac.tz"
                        className="text-slate-300 hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        <span>info@uombonisec.ac.tz</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'sw' ? 'Barua Pepe' : 'Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-rose-400 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                    }}
                    placeholder="+255 7XX XXX XXX"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-[11px] text-rose-400 font-medium">{fieldErrors.phone}</p>
                )}
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'sw' ? 'Nenosiri' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'sw' ? 'Thibitisha Nenosiri' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error notifications for passwords */}
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-400 font-medium">{fieldErrors.password}</p>
            )}
            {fieldErrors.confirmPassword && (
              <p className="text-[11px] text-rose-400 font-medium">{fieldErrors.confirmPassword}</p>
            )}

            {/* Live Password Strength Indicator */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-semibold">
                  {language === 'sw' ? 'Ubora wa Nenosiri:' : 'Password Strength:'}
                </span>
                <span className={`font-bold ${strengthTextColor}`}>{strengthLabel}</span>
              </div>

              {/* Strength Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2.5">
                <motion.div
                  className={`h-full ${strengthColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(criteriaCount / 5) * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* Live 5-Criteria Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {hasMinLength ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-slate-600 inline-block" />}
                  <span>8+ Characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {hasUppercase ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-slate-600 inline-block" />}
                  <span>Uppercase (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {hasLowercase ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-slate-600 inline-block" />}
                  <span>Lowercase (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {hasNumber ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-slate-600 inline-block" />}
                  <span>Number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'} col-span-2 sm:col-span-1`}>
                  {hasSpecial ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-slate-600 inline-block" />}
                  <span>Symbol (!@#$)</span>
                </div>
              </div>
            </div>

            {/* Primary Submit Button: CREATE ACCOUNT */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-black text-sm shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="tracking-wide uppercase">CREATE ACCOUNT</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Secondary Option: Optional Google Account */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isSubmitting || loading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-2.5 border border-slate-800 hover:border-slate-700 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{language === 'sw' ? 'Au jisajili kwa Google' : 'Or register with Google'}</span>
              </button>
            </div>
          </form>

          {/* Already have an account? Sign In */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMessage(null);
                  setActiveView('login');
                }}
                className="font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </p>

            {/* Privacy Policy & Terms of Service Links */}
            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-500">
              <button
                type="button"
                onClick={() => openLegalModal('privacy')}
                className="hover:text-amber-300 transition-colors underline cursor-pointer"
              >
                {language === 'sw' ? 'Sera ya Faragha (Privacy Policy)' : 'Privacy Policy'}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openLegalModal('terms')}
                className="hover:text-amber-300 transition-colors underline cursor-pointer"
              >
                {language === 'sw' ? 'Masharti ya Matumizi (Terms)' : 'Terms of Service'}
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Google Account Selector Modal (Allows user to select their preferred Google email) */}
      <GoogleAccountSelectModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleSelectGoogleAccount}
        defaultRole={selectedRole}
      />

      {/* Terms and Privacy Modal */}
      <TermsAndPrivacyModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalTab}
      />

      {/* Teacher Access Request Modal (Requested feature: teachers request credentials from admin) */}
      {isTeacherRequestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {language === 'sw' ? 'Ombi la Akaunti ya Ualimu / Watumishi' : 'Teacher Access Request'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsTeacherRequestModalOpen(false);
                  setTrFeedback(null);
                }}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4">
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {language === 'sw'
                  ? 'Kwa mujibu wa taratibu za kiusalama za Uomboni Secondary School, akaunti za walimu na watumishi huandaliwa na kupewa email na nenosiri la awali na Mkuu wa Shule (Admin). Jaza taarifa zako hapa chini ili zitumwe kwa uongozi.'
                  : 'In compliance with school security policy, teacher credentials are authorized and provisioned by the Administrator. Submit your details below to request access.'}
              </p>

              {trFeedback && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-xs text-emerald-200">
                  {trFeedback}
                </div>
              )}

              <form onSubmit={handleSubmitTeacherRequest} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {language === 'sw' ? 'Jina Kamili la Mwalimu *' : 'Teacher Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={trName}
                    onChange={(e) => setTrName(e.target.value)}
                    placeholder="mf. Mwl. Yohana Bahati"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      {language === 'sw' ? 'Barua Pepe Rasmi *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={trEmail}
                      onChange={(e) => setTrEmail(e.target.value)}
                      placeholder="mwalimu@uombonisec.ac.tz"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={trPhone}
                      onChange={(e) => setTrPhone(e.target.value)}
                      placeholder="+255 7XX XXX XXX"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      {language === 'sw' ? 'Idara' : 'Department'}
                    </label>
                    <select
                      value={trDept}
                      onChange={(e) => setTrDept(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="Sayansi">Sayansi (Science)</option>
                      <option value="Lugha">Lugha (Languages)</option>
                      <option value="Sanaa na Jamii">Sanaa na Jamii (Humanities)</option>
                      <option value="Biashara">Biashara (Commercial)</option>
                      <option value="Utawala na Malezi">Utawala na Malezi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      {language === 'sw' ? 'Masomo Unayofundisha' : 'Subjects Taught'}
                    </label>
                    <input
                      type="text"
                      value={trSubjects}
                      onChange={(e) => setTrSubjects(e.target.value)}
                      placeholder="mf. Chemistry, Biology"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {language === 'sw' ? 'Maelezo ya Ziada / Ufafanuzi' : 'Additional Notes'}
                  </label>
                  <textarea
                    rows={2}
                    value={trNotes}
                    onChange={(e) => setTrNotes(e.target.value)}
                    placeholder="Ufafanuzi wowote kuhusu kitengo au majukumu yako..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTeacherRequestModalOpen(false);
                      setTrFeedback(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    {language === 'sw' ? 'Ghairi' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md cursor-pointer transition-colors"
                  >
                    {language === 'sw' ? 'Tuma Ombi kwa Msimamizi' : 'Submit Request to Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-500">
        <p>UOMBONI SECONDARY SCHOOL • Marangu Magharibi, Moshi • Education • Pray • Work</p>
      </footer>
    </div>
  );
};
