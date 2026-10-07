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
} from 'lucide-react';
import { SchoolLogo } from '../SchoolLogo';
import { CsrfTokenInput } from '../CsrfTokenInput';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { sendResetPassword, formatAuthError } from '../../lib/firebase';
import { checkServerSecurityStatus } from '../../services/authSecurityClient';
import { useCsrfProtection } from '../../hooks/useCsrfProtection';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogleAuth, loading: authLoading, setActiveView, setActiveRoleDashboard } = useAuth();
  const { language } = useLanguage();
  const { csrfToken, validateFormSubmit, refreshCsrfToken } = useCsrfProtection();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      setErrorMessage(
        language === 'sw'
          ? 'Tafadhali jaza Email/Username na nenosiri.'
          : 'Please enter Email/Username and password.'
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

    // CSRF Protection Token Validation for sensitive login submission
    const csrfCheck = await validateFormSubmit();
    if (!csrfCheck.valid) {
      setErrorMessage(
        csrfCheck.error ||
          (language === 'sw'
            ? 'Ulinzi wa CSRF: Hitilafu ya uthibitishaji wa token ya usalama. Tafadhali jaribu tena.'
            : 'CSRF Protection: Security token validation failed. Please try again.')
      );
      await refreshCsrfToken();
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(cleanIdentifier, password);
      if (res.success) {
        // Redirection will happen automatically based on verified authenticated role
      } else {
        // Generic security-hardened error message
        const err = res.error || '';
        if (err.includes('too-many-requests') || err.includes('Majaribio')) {
          setErrorMessage(
            language === 'sw'
              ? 'Majaribio mengi ya kuingia yameshindwa. Tafadhali subiri kidogo kisha ujaribu tena.'
              : 'Too many failed login attempts. Please wait a few moments before trying again.'
          );
        } else {
          setErrorMessage(
            language === 'sw'
              ? 'Email/Username au nenosiri si sahihi.'
              : 'Email/Username or password is incorrect.'
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(
        language === 'sw'
          ? 'Email/Username au nenosiri si sahihi.'
          : 'Email/Username or password is incorrect.'
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

    // Validate CSRF token on password reset request
    const csrfCheck = await validateFormSubmit();
    if (!csrfCheck.valid) {
      setResetFeedback({
        type: 'error',
        message: csrfCheck.error || 'Ulinzi wa CSRF: Hitilafu ya uthibitishaji wa token ya usalama.',
      });
      return;
    }

    setIsSendingReset(true);
    setResetFeedback(null);

    try {
      await sendResetPassword(resetEmail.trim());
      // Generic response that does not reveal if account exists
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
      // Still show safe message
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
    <div className="min-h-screen bg-[#FFFFF0] text-[#704214] font-sans flex flex-col justify-between selection:bg-[#704214] selection:text-[#FFFFF0]">
      {/* Top Utility Header */}
      <header className="w-full bg-[#FFFFF0] border-b border-[#704214]/15 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={() => setActiveView('website')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#704214] hover:text-[#58330F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#C9A227]" />
          <span>{language === 'sw' ? 'Rudi kwenye Tovuti ya Shule' : 'Back to School Website'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#704214]/80">
          <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
          <span className="font-semibold">NECTA Centre S0486</span>
        </div>
      </header>

      {/* Main 2-Column Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-5xl bg-white border border-[#704214]/20 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column (Desktop) / Header (Mobile): Institutional Identity */}
          <div className="lg:col-span-5 bg-[#704214] text-[#FFFFF0] p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#C9A227]/30">
            {/* Top Identity */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-xs border border-[#C9A227]">
                  <SchoolLogo size="sm" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#FFFFF0] leading-tight">
                    UOMBONI SECONDARY SCHOOL
                  </h2>
                  <p className="text-xs text-[#F5EBD7]/90 font-medium mt-0.5">
                    Catholic Diocese of Moshi · Marangu West
                  </p>
                </div>
              </div>

              {/* School Motto */}
              <div className="p-3.5 bg-[#58330F] rounded-lg border border-[#C9A227]/30 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227] block">
                  School Motto / Kaulimbiu
                </span>
                <p className="text-xs font-semibold text-[#FFFFF0] mt-1 italic">
                  &ldquo;Building Knowledge, Character &amp; Excellence&rdquo;
                </p>
                <p className="text-[11px] text-[#F5EBD7]/80 mt-0.5">
                  &ldquo;Tujiendeleze Sisi Wenyewe&rdquo;
                </p>
              </div>

              {/* Security Statement */}
              <div className="space-y-2 text-xs text-[#F5EBD7]/90 leading-relaxed">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <p>
                    {language === 'sw'
                      ? 'Mfumo rasmi na salama wa kidijitali wa Uomboni Secondary School. Taarifa zote zinalindwa kwa mujibu wa taratibu rasmi za shule na usalama wa kielektroniki.'
                      : 'Official and secure digital system for Uomboni Secondary School. All school records and credentials are protected using industry-standard security protocols.'}
                  </p>
                </div>
              </div>
            </div>

            {/* School Photograph */}
            <div className="mt-6 pt-6 border-t border-[#C9A227]/25">
              <div className="rounded-lg overflow-hidden border border-[#C9A227]/40 shadow-xs relative">
                <img
                  src="/media/media_14.webp"
                  alt="Uomboni Secondary School Campus"
                  className="w-full h-36 sm:h-40 object-cover"
                  onError={(e) => {
                    // Fallback to media_6 if needed
                    (e.currentTarget as HTMLImageElement).src = '/media/media_6.webp';
                  }}
                />
                <div className="absolute inset-0 bg-[#704214]/25" />
                <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-[#102A43]/85 rounded text-[10px] font-medium text-white flex items-center justify-between">
                  <span>Mazingira ya Shule · Marangu</span>
                  <span className="text-[#C9A227] font-bold">NECTA S0486</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Login Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              
              {/* Form Heading */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-[#704214] tracking-tight">
                  Karibu Uomboni Secondary School
                </h1>
                <p className="text-xs sm:text-sm text-[#704214]/80 mt-1.5">
                  Ingia kwenye akaunti yako ili kuendelea.
                </p>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-lg bg-[#FFFFF0] border border-[#704214]/30 text-xs text-[#704214] flex items-start gap-2.5 shadow-xs">
                  <AlertCircle className="w-4 h-4 text-[#704214] shrink-0 mt-0.5" />
                  <p className="font-semibold leading-relaxed">{errorMessage}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <CsrfTokenInput />

                {/* Field 1: Email / Username */}
                <div>
                  <label className="block text-xs font-bold text-[#704214] mb-1.5">
                    Email / Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoComplete="username"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Email / Username"
                      disabled={isBusy}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FFFFF0] border border-[#704214]/25 rounded-lg text-[#704214] placeholder-[#704214]/40 focus:outline-none focus:ring-2 focus:ring-[#704214] focus:border-transparent transition-all"
                    />
                    <Mail className="w-4 h-4 text-[#704214]/50 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Field 2: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#704214]">
                      {language === 'sw' ? 'Nenosiri' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetFeedback(null);
                        setIsForgotPasswordOpen(true);
                      }}
                      className="text-xs font-semibold text-[#704214] hover:text-[#58330F] underline cursor-pointer"
                    >
                      Umesahau nenosiri?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isBusy}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FFFFF0] border border-[#704214]/25 rounded-lg text-[#704214] placeholder-[#704214]/40 focus:outline-none focus:ring-2 focus:ring-[#704214] focus:border-transparent transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-[#704214]/60 hover:text-[#704214] absolute right-2.5 top-2 cursor-pointer transition-colors"
                      aria-label={showPassword ? 'Ficha nenosiri' : 'Onyesha nenosiri'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full py-2.5 px-4 bg-[#704214] hover:bg-[#58330F] text-[#FFFFF0] text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isBusy ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
                        <span>Inathibitisha akaunti...</span>
                      </>
                    ) : (
                      <span>INGIA</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-[#704214]/15" />
                <span className="text-[11px] font-semibold text-[#704214]/60 uppercase tracking-wider">
                  {language === 'sw' ? 'au' : 'or'}
                </span>
                <div className="flex-1 h-px bg-[#704214]/15" />
              </div>

              {/* Google SSO Button */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isBusy}
                  className="w-full py-2.5 px-4 bg-white hover:bg-[#FFFFF0] text-[#704214] border border-[#704214]/30 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
              </div>

              {/* Security Assurance footer notice */}
              <div className="mt-6 pt-5 border-t border-[#704214]/10 text-center">
                <p className="text-[11px] text-[#704214]/70">
                  Uthibitisho rasmi wa watumishi, wazazi na wanafunzi · Shule ya Sekondari Uomboni
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#FFFFF0] border-t border-[#704214]/15 px-4 sm:px-8 py-3.5 text-center text-xs text-[#704214]/75">
        &copy; 2026 Uomboni Secondary School. All Rights Reserved. · NECTA Centre S0486
      </footer>

      {/* Password Reset Modal (Umesahau nenosiri?) */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#704214]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-[#704214]/30 rounded-xl shadow-2xl overflow-hidden text-[#704214]">
            {/* Header */}
            <div className="bg-[#704214] px-5 py-4 flex items-center justify-between text-[#FFFFF0] border-b border-[#C9A227]/40">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C9A227]" />
                <h3 className="text-sm font-bold text-[#FFFFF0]">
                  Kurejesha Nenosiri (Password Reset)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                className="p-1 rounded text-[#F5EBD7] hover:text-white hover:bg-[#58330F] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {resetFeedback ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-[#FFFFF0] border border-[#704214]/20 rounded-lg text-xs leading-relaxed text-[#704214] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                    <p className="font-semibold">{resetFeedback.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="w-full py-2 bg-[#704214] text-[#FFFFF0] text-xs font-semibold rounded hover:bg-[#58330F] transition-colors cursor-pointer"
                  >
                    Funga Dirisha
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                  <CsrfTokenInput />
                  <p className="text-xs text-[#704214]/80 leading-relaxed">
                    Weka barua pepe iliyosajiliwa kwenye akaunti yako. Tutatuma kiungo rasmi cha kurejesha nenosiri lako.
                  </p>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-[#704214]">
                      Barua Pepe (Email Address)
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="mfano: mzazi@gmail.com"
                      className="w-full px-3 py-2 text-xs border border-[#704214]/25 rounded bg-[#FFFFF0] text-[#704214] focus:outline-none focus:ring-1 focus:ring-[#704214]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(false)}
                      className="px-3 py-2 text-xs font-semibold text-[#704214] hover:bg-[#FFFFF0] rounded border border-[#704214]/20 cursor-pointer"
                    >
                      Ghairi
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingReset}
                      className="px-4 py-2 bg-[#704214] hover:bg-[#58330F] text-[#FFFFF0] text-xs font-bold rounded transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {isSendingReset ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A227]" />
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
    </div>
  );
};
