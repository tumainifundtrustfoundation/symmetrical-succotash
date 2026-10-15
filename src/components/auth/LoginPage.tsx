import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  X,
  Sparkles,
  KeyRound,
  User,
  ExternalLink,
} from 'lucide-react';
import { SchoolLogo } from '../SchoolLogo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { sendResetPassword } from '../../lib/firebase';
import { checkServerSecurityStatus } from '../../services/authSecurityClient';
import { submitTeacherAccessRequest } from '../../services/teacherAuthDirectory';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogleAuth, loading: authLoading, setActiveView } = useAuth();
  const { language } = useLanguage();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  // Forgot password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Teacher Access Request Modal state (For teachers requesting account from admin)
  const [isTeacherRequestOpen, setIsTeacherRequestOpen] = useState(false);
  const [trName, setTrName] = useState('');
  const [trEmail, setTrEmail] = useState('');
  const [trPhone, setTrPhone] = useState('');
  const [trDept, setTrDept] = useState('Sayansi');
  const [trSubjects, setTrSubjects] = useState('');
  const [trNotes, setTrNotes] = useState('');
  const [trFeedback, setTrFeedback] = useState<string | null>(null);

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
          : '✅ Request submitted to Administrator. Login credentials will be issued upon review.'
      );
      setTimeout(() => {
        setIsTeacherRequestOpen(false);
        setTrFeedback(null);
      }, 3500);
    } else {
      setTrFeedback(res.error || 'Hitilafu imetokea.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      setErrorMessage(
        language === 'sw'
          ? 'Tafadhali jaza Username/Email na Nenosiri.'
          : 'Please enter Username/Email and password.'
      );
      return;
    }

    // Pre-check rate-limiting from security server
    try {
      const securityCheck = await checkServerSecurityStatus(cleanIdentifier);
      if (securityCheck.isLocked) {
        setErrorMessage(
          language === 'sw'
            ? 'Majaribio mengi ya kuingia yameshindwa. Tafadhali subiri kidogo kisha ujaribu tena.'
            : 'Too many failed login attempts. Please wait a few moments before trying again.'
        );
        return;
      }
    } catch {
      // Backend status precheck fallback
    }

    setIsSubmitting(true);

    try {
      const res = await login(cleanIdentifier, password);
      if (!res.success) {
        const err = res.error || '';
        if (err.includes('too-many-requests') || err.includes('Majaribio')) {
          setErrorMessage(
            language === 'sw'
              ? 'Majaribio mengi ya kuingia yameshindwa. Tafadhali subiri kidogo kisha ujaribu tena.'
              : 'Too many failed login attempts. Please wait a few moments before trying again.'
          );
        } else {
          setErrorMessage(err || (language === 'sw' ? 'Username au Nenosiri si sahihi.' : 'Invalid Username or Password.'));
        }
      }
    } catch (err: any) {
      setErrorMessage(
        language === 'sw'
          ? 'Username au Nenosiri si sahihi.'
          : 'Invalid Username or Password.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogleAuth();
      if (!res.success) {
        setErrorMessage(
          language === 'sw'
            ? res.error || 'Imeshindwa kuingia na Google. Tafadhali jaribu tena.'
            : res.error || 'Failed to sign in with Google. Please try again.'
        );
      }
    } catch (err: any) {
      setErrorMessage(
        language === 'sw'
          ? 'Hitilafu ya uthibitishaji wa Google imetokea.'
          : 'A Google authentication error occurred.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setIsSendingReset(true);
    setResetFeedback(null);

    try {
      await sendResetPassword(resetEmail.trim());
      setResetFeedback({
        type: 'success',
        message:
          language === 'sw'
            ? 'Maelekezo ya kurejesha nenosiri yametumwa ikiwa akaunti hiyo ipo.'
            : 'Password reset instructions have been sent if an account with this email exists.',
      });
      setTimeout(() => {
        setResetEmail('');
      }, 3000);
    } catch (err: any) {
      setResetFeedback({
        type: 'success',
        message:
          language === 'sw'
            ? 'Maelekezo ya kurejesha nenosiri yametumwa ikiwa akaunti hiyo ipo.'
            : 'Password reset instructions have been sent if an account with this email exists.',
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  const isBusy = isSubmitting || authLoading;

  return (
    <div className="min-h-screen w-full neumorph-canvas flex flex-col justify-between selection:bg-[#2563eb] selection:text-white font-sans">
      
      {/* Top Navigation Bar */}
      <header className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={() => setActiveView('website')}
          className="neumorph-pill-small px-3.5 py-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#2563eb]" />
          <span>{language === 'sw' ? 'Rudi Tovuti Rasmi' : 'Back to Website'}</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center p-0.5 bg-[#ebf0f7] shadow-xs">
            <SchoolLogo size="sm" />
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-[11px] font-black text-slate-800 tracking-tight leading-none">
              UOMBONI SECONDARY SCHOOL
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              NECTA Centre S0486 • Marangu
            </div>
          </div>
        </div>
      </header>

      {/* Main Center Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10">
        
        {/* Title Exactly Matching User Screenshot: "Animated Embossed Login" */}
        <div className="text-center mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#d63031] tracking-wide drop-shadow-xs">
            Animated Embossed Login
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Shule ya Sekondari Uomboni · Mfumo Salama wa Kuingia
          </p>
        </div>

        {/* Error Alert Box (if any) */}
        {errorMessage && (
          <div className="w-full max-w-sm mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 shadow-sm animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-semibold">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-rose-500 hover:text-rose-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Center Circular Embossed Disc (Matching User Graphic) */}
        <div className="relative animate-float-gentle">
          <div className="neumorph-circle w-[320px] h-[320px] sm:w-[390px] sm:h-[390px] md:w-[420px] md:h-[420px] flex flex-col items-center justify-center p-6 sm:p-8 select-none">
            
            {/* Header inside circle: SIGN IN */}
            <h2 className="text-lg sm:text-2xl font-black text-[#2d3748] tracking-widest uppercase mb-5 sm:mb-6">
              SIGN IN
            </h2>

            {/* Embossed Form */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3.5 sm:gap-4 w-full">
              
              {/* Field 1: Username (Inset / Debossed Pill) */}
              <div className="w-60 sm:w-72 relative">
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Username"
                  disabled={isBusy}
                  className="neumorph-input w-full h-11 sm:h-12 px-5 sm:px-6 text-xs sm:text-sm font-medium pr-10"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 sm:top-4 pointer-events-none" />
              </div>

              {/* Field 2: Password (Inset / Debossed Pill) */}
              <div className="w-60 sm:w-72 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  disabled={isBusy}
                  className="neumorph-input w-full h-11 sm:h-12 px-5 sm:px-6 text-xs sm:text-sm font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3.5 top-2.5 sm:top-3 cursor-pointer transition-colors"
                  aria-label={showPassword ? 'Ficha nenosiri' : 'Onyesha nenosiri'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Action Button: Login (Raised Embossed Pill, animated press effect) */}
              <div className="w-60 sm:w-72 pt-1 sm:pt-2">
                <button
                  type="submit"
                  disabled={isBusy}
                  onMouseDown={() => setIsButtonPressed(true)}
                  onMouseUp={() => setIsButtonPressed(false)}
                  onTouchStart={() => setIsButtonPressed(true)}
                  onTouchEnd={() => setIsButtonPressed(false)}
                  className={`neumorph-btn w-full h-11 sm:h-12 flex items-center justify-center text-xs sm:text-sm font-bold text-[#2563eb] tracking-wide cursor-pointer transition-all ${
                    isButtonPressed ? 'neumorph-btn-pressed' : ''
                  }`}
                >
                  {isBusy ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#2563eb]" />
                      <span>{language === 'sw' ? 'Inaingia...' : 'Signing in...'}</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span>Login</span>
                      {/* Subtle pointer click icon like in graphic */}
                      <span className="text-[13px] opacity-80 select-none">👆</span>
                    </span>
                  )}
                </button>
              </div>

            </form>

            {/* Quick Helper below Login inside or right below disc */}
            <div className="mt-4 sm:mt-5 flex items-center gap-3 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setResetFeedback(null);
                  setIsForgotPasswordOpen(true);
                }}
                className="text-slate-500 hover:text-[#2563eb] font-medium transition-colors cursor-pointer"
              >
                {language === 'sw' ? 'Umesahau nenosiri?' : 'Forgot password?'}
              </button>
            </div>

          </div>
        </div>

        {/* Secondary Neumorphic Actions Below Circle */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-500">
          
          {/* Google Sign In (Embossed Pill) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
            className="neumorph-pill-small px-5 py-2.5 flex items-center gap-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer disabled:opacity-50"
          >
            <div className="w-4 h-4 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 24 24">
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
            </div>
            <span>Endelea na Google</span>
          </button>

          {/* Secure Production Badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Uthibitisho Salama wa Supabase &amp; NECTA S0486</span>
          </div>
        </div>

        {/* FIRST-TIME USER / NO ACCOUNT DIRECT GUIDANCE (Prompt requirements) */}
        <div className="w-full max-w-xl mt-6 p-4 sm:p-5 rounded-3xl neumorph-canvas shadow-[10px_10px_25px_#1e293b15,-5px_-5px_15px_#ffffff] space-y-3.5 animate-in fade-in duration-700">
          <div className="text-center">
            <span className="text-xs font-black text-slate-800 tracking-wide uppercase">
              {language === 'sw' ? 'Hujawahi Kuingia au Huna Akaunti Bado?' : 'First Time Here or Need an Account?'}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'sw'
                ? 'Mfumo unatambua watumiaji kulingana na vitengo rasmi:'
                : 'The system directs you according to official school roles:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
            {/* 1. Student Admission */}
            <button
              type="button"
              onClick={() => {
                setActiveView('website');
                window.location.hash = '#apply';
              }}
              className="p-3.5 rounded-2xl bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1.5 text-emerald-900 font-black text-xs mb-1">
                  <span className="text-sm">🎓</span>
                  <span>{language === 'sw' ? 'Mwanafunzi Mpya' : 'New Student'}</span>
                </div>
                <p className="text-[11px] text-emerald-950/80 leading-snug">
                  {language === 'sw'
                    ? 'Jaza Fomu ya Kujiunga (Student Admission Form 2026).'
                    : 'Fill official student admission form for 2026.'}
                </p>
              </div>
              <span className="mt-2.5 text-[10px] font-black text-emerald-700 group-hover:underline">
                {language === 'sw' ? 'Fungua Admission →' : 'Open Admission →'}
              </span>
            </button>

            {/* 2. Teacher Request */}
            <button
              type="button"
              onClick={() => {
                setTrFeedback(null);
                setIsTeacherRequestOpen(true);
              }}
              className="p-3.5 rounded-2xl bg-amber-50/90 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs mb-1">
                  <span className="text-sm">👨‍🏫</span>
                  <span>{language === 'sw' ? 'Mwalimu / Staff' : 'Teacher / Staff'}</span>
                </div>
                <p className="text-[11px] text-amber-950/80 leading-snug">
                  {language === 'sw'
                    ? 'Mkuu wa Shule (Admin) ndiye anayekupa email & nenosiri.'
                    : 'Admin provisions your official email & initial password.'}
                </p>
              </div>
              <span className="mt-2.5 text-[10px] font-black text-amber-800 group-hover:underline">
                {language === 'sw' ? 'Omba kwa Admin →' : 'Request Account →'}
              </span>
            </button>

            {/* 3. Parent Sign Up */}
            <button
              type="button"
              onClick={() => setActiveView('signup')}
              className="p-3.5 rounded-2xl bg-blue-50/90 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1.5 text-blue-900 font-black text-xs mb-1">
                  <span className="text-sm">👨‍👩‍👧</span>
                  <span>{language === 'sw' ? 'Mzazi / Mlezi' : 'Parent / Guardian'}</span>
                </div>
                <p className="text-[11px] text-blue-950/80 leading-snug">
                  {language === 'sw'
                    ? 'Jisajili ukiwa na Student ID, Namba na Mwaka 2026.'
                    : 'Sign up with Student ID and Academic Year 2026.'}
                </p>
              </div>
              <span className="mt-2.5 text-[10px] font-black text-blue-700 group-hover:underline">
                {language === 'sw' ? 'Jisajili Sasa →' : 'Sign Up Now →'}
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 font-medium">
        &copy; 2026 Uomboni Secondary School · Marangu, Kilimanjaro · NECTA Centre S0486
      </footer>

      {/* Neumorphic Password Reset Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="w-full max-w-md neumorph-canvas rounded-3xl p-6 shadow-[20px_20px_50px_#1e293b55,-10px_-10px_30px_#ffffff] text-slate-800 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-bold text-slate-800">
                  Kurejesha Nenosiri (Password Reset)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="pt-4">
              {resetFeedback ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="font-semibold">{resetFeedback.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="neumorph-btn w-full py-2.5 text-xs font-bold text-[#2563eb] cursor-pointer"
                  >
                    Funga Dirisha
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Weka barua pepe (email) iliyosajiliwa kwenye akaunti yako. Tutatuma kiungo rasmi cha kurejesha nenosiri lako.
                  </p>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-700">
                      Barua Pepe (Email Address)
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="mfano: mzazi@gmail.com"
                      className="neumorph-input w-full h-11 px-4 text-xs font-medium"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(false)}
                      className="neumorph-pill-small px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                    >
                      Ghairi
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingReset}
                      className="neumorph-btn px-5 py-2 text-xs font-bold text-[#2563eb] cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {isSendingReset ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Inatuma...</span>
                        </>
                      ) : (
                        <span>Tuma Maelekezo</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Teacher Request Modal on LoginPage */}
      {isTeacherRequestOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg neumorph-canvas rounded-3xl p-6 shadow-2xl text-slate-800 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-xl">👨‍🏫</span>
                <h3 className="text-sm font-black text-slate-800">
                  {language === 'sw' ? 'Ombi la Akaunti ya Mwalimu kwa Mkuu wa Shule' : 'Teacher Access Request to Admin'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsTeacherRequestOpen(false);
                  setTrFeedback(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4">
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {language === 'sw'
                  ? 'Kwa mujibu wa taratibu za kiusalama, akaunti za walimu hupewa barua pepe na nenosiri la kuingilia na Mkuu wa Shule (Admin) pekee. Tuma taarifa zako hapa chini:'
                  : 'According to school security protocols, teachers are issued official login credentials directly by the Administrator. Submit your details below:'}
              </p>

              {trFeedback && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-semibold">
                  {trFeedback}
                </div>
              )}

              <form onSubmit={handleSubmitTeacherRequest} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {language === 'sw' ? 'Jina Kamili la Mwalimu *' : 'Teacher Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={trName}
                    onChange={(e) => setTrName(e.target.value)}
                    placeholder="mf. Mwl. Yohana Bahati"
                    className="neumorph-input w-full h-10 px-3.5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'sw' ? 'Barua Pepe Rasmi *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={trEmail}
                      onChange={(e) => setTrEmail(e.target.value)}
                      placeholder="mwalimu@uombonisec.ac.tz"
                      className="neumorph-input w-full h-10 px-3.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'sw' ? 'Nambari ya Simu' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={trPhone}
                      onChange={(e) => setTrPhone(e.target.value)}
                      placeholder="+255 7XX XXX XXX"
                      className="neumorph-input w-full h-10 px-3.5 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'sw' ? 'Idara' : 'Department'}
                    </label>
                    <select
                      value={trDept}
                      onChange={(e) => setTrDept(e.target.value)}
                      className="neumorph-input w-full h-10 px-3 font-semibold"
                    >
                      <option value="Sayansi">Sayansi (Science)</option>
                      <option value="Lugha">Lugha (Languages)</option>
                      <option value="Sanaa na Jamii">Sanaa na Jamii (Humanities)</option>
                      <option value="Biashara">Biashara (Commercial)</option>
                      <option value="Utawala na Malezi">Utawala na Malezi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {language === 'sw' ? 'Masomo Unayofundisha' : 'Subjects'}
                    </label>
                    <input
                      type="text"
                      value={trSubjects}
                      onChange={(e) => setTrSubjects(e.target.value)}
                      placeholder="mf. Chemistry, Biology"
                      className="neumorph-input w-full h-10 px-3.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {language === 'sw' ? 'Ufafanuzi wa Majukumu / Barua' : 'Notes'}
                  </label>
                  <textarea
                    rows={2}
                    value={trNotes}
                    onChange={(e) => setTrNotes(e.target.value)}
                    placeholder="Maelezo ya ziada kwa Mkuu wa Shule..."
                    className="neumorph-input w-full p-2.5 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTeacherRequestOpen(false);
                      setTrFeedback(null);
                    }}
                    className="neumorph-pill-small px-4 py-2 font-semibold text-slate-600 cursor-pointer"
                  >
                    {language === 'sw' ? 'Ghairi' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="neumorph-btn px-5 py-2 font-black text-[#2563eb] cursor-pointer"
                  >
                    {language === 'sw' ? 'Tuma Ombi kwa Admin' : 'Submit to Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
