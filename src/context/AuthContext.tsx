import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  auth,
  db,
  onAuthStateChanged,
  User,
  UserProfile,
  UserRole,
  getUserProfile,
  syncUserProfile,
  loginWithEmailPassword,
  registerWithEmailPassword,
  signInWithGoogle,
  logOutFromFirebase,
  sendResetPassword,
  resendVerificationEmail,
  checkEmailVerificationStatus,
  formatAuthError,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  isSupabaseConfigured,
  supabase,
  loginWithSupabaseAuth,
  registerWithSupabaseAuth,
  sendSupabasePasswordReset,
  signOutFromSupabase,
  getSupabaseProfile,
  SupabaseUserProfile,
} from '../lib/supabase';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';

export interface AuthMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authMessage: AuthMessage | null;
  setAuthMessage: (msg: AuthMessage | null) => void;
  activeView: 'login' | 'signup' | 'forgot-password' | 'verify-email' | 'portal' | 'website' | 'welcome' | 'admission-documents';
  setActiveView: (view: 'login' | 'signup' | 'forgot-password' | 'verify-email' | 'portal' | 'website' | 'welcome' | 'admission-documents') => void;
  activeRoleDashboard: UserRole;
  setActiveRoleDashboard: (role: UserRole) => void;
  login: (email: string, password: string, rememberMe?: boolean, preferredRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  loginWithDemoRole: (role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role?: 'student' | 'parent';
  }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleAuth: (
    preferredRole?: UserRole,
    chosenAccount?: { email: string; name: string; role: UserRole }
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: () => Promise<{ success: boolean; error?: string }>;
  checkVerification: () => Promise<boolean>;
  refreshProfile: () => Promise<UserProfile | null>;
  updateUserRoleByAdmin: (targetUid: string, newRole: UserRole) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState<AuthMessage | null>(null);
  const [activeView, setActiveView] = useState<'login' | 'signup' | 'forgot-password' | 'verify-email' | 'portal' | 'website' | 'welcome'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (path === '/welcome' || hash === '#welcome' || hash === '#karibu') return 'welcome';
      if (path === '/login' || hash === '#login' || hash === '#ingia') return 'login';
      if (path === '/signup' || path === '/register' || hash === '#signup' || hash === '#register') return 'signup';
      if (path === '/forgot-password' || hash === '#forgot-password') return 'forgot-password';
      if (path === '/verify-email' || hash === '#verify-email') return 'verify-email';
      if (path.includes('-dashboard') || hash === '#portal' || hash === '#dashboard') return 'portal';
      const savedView = sessionStorage.getItem('uomboni_view');
      if (savedView === 'portal' && localStorage.getItem('uomboni_active_session')) {
        return 'portal';
      }
    }
    return 'website';
  });
  const [activeRoleDashboard, setActiveRoleDashboard] = useState<UserRole>('student');

  // Handle URL hash / path on initial load
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path === '/welcome' || hash === '#welcome' || hash === '#karibu') {
        setActiveView('welcome');
      } else if (path === '/login' || hash === '#login' || hash === '#ingia') {
        setActiveView('login');
      } else if (path === '/signup' || path === '/register' || hash === '#signup' || hash === '#register') {
        setActiveView('signup');
      } else if (path === '/forgot-password' || hash === '#forgot-password' || hash === '#reset-password') {
        setActiveView('forgot-password');
      } else if (path === '/verify-email' || hash === '#verify-email') {
        setActiveView('verify-email');
      } else if (
        path === '/student-dashboard' ||
        path === '/parent-dashboard' ||
        path === '/teacher-dashboard' ||
        path === '/staff-dashboard' ||
        path === '/admin-dashboard' ||
        hash === '#portal' ||
        hash === '#dashboard'
      ) {
        setActiveView('portal');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  // Synchronize authentication state from Firebase with safety timeout
  useEffect(() => {
    let timerCleared = false;
    // Guaranteed safety timeout: Never block user screen for more than 500ms
    const safetyTimeout = setTimeout(() => {
      if (!timerCleared) {
        setLoading(false);
      }
    }, 500);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      timerCleared = true;
      clearTimeout(safetyTimeout);
      setUser(firebaseUser);
      if (firebaseUser) {
        // Sync profile asynchronously without stalling the page render
        syncUserProfile(firebaseUser)
          .then((profile) => {
            setUserProfile(profile);
            setActiveRoleDashboard(profile.role);
            try {
              localStorage.setItem('uomboni_active_session', JSON.stringify({ user: firebaseUser, profile }));
            } catch (e) {}
            // If in an auth login/signup screen, transition to portal
            setActiveView((prev) => (prev === 'login' || prev === 'signup' ? 'portal' : prev));
          })
          .catch((err) => {
            console.warn("Async user profile sync note:", err?.message || err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // Fallback to local session cache if present
        try {
          const cached = localStorage.getItem('uomboni_active_session');
          if (cached) {
            const data = JSON.parse(cached);
            if (data?.profile) {
              setUser(data.user || null);
              setUserProfile(data.profile);
              setActiveRoleDashboard(data.profile.role);
            } else {
              setUserProfile(null);
            }
          } else {
            setUserProfile(null);
          }
        } catch (e) {
          setUserProfile(null);
        }
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  // Update browser history when view changes
  const handleSetActiveView = (view: 'login' | 'signup' | 'forgot-password' | 'verify-email' | 'portal' | 'website' | 'welcome') => {
    setActiveView(view);
    try {
      sessionStorage.setItem('uomboni_view', view);
    } catch (e) {}
    if (view === 'website') {
      window.history.pushState(null, '', '/');
    } else if (view === 'portal') {
      const roleRoute = userProfile ? `/${userProfile.role}-dashboard` : '/student-dashboard';
      window.history.pushState(null, '', roleRoute);
    } else {
      window.history.pushState(null, '', `/${view}`);
    }
  };

  const login = async (email: string, password: string, rememberMe = true, preferredRole?: UserRole) => {
    setLoading(true);
    setAuthMessage(null);
    try {
      if (isSupabaseConfigured()) {
        const res = await loginWithSupabaseAuth(email.trim(), password);
        if (res.success && res.user) {
          const mappedRole: UserRole = (res.profile?.role as UserRole) || preferredRole || 'student';
          const mappedProfile: UserProfile = {
            uid: res.user.id,
            email: res.user.email || email.trim(),
            fullName: res.profile?.full_name || email.split('@')[0],
            phone: res.profile?.phone || '',
            role: mappedRole,
            photoURL: res.profile?.avatar_url || null,
            school: 'UOMBONI SECONDARY SCHOOL',
            createdAt: res.profile?.created_at || new Date().toISOString(),
            updatedAt: res.profile?.updated_at || new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            emailVerified: Boolean(res.user.email_confirmed_at),
          };

          const mappedUser: User = {
            uid: res.user.id,
            email: res.user.email || email.trim(),
            displayName: mappedProfile.fullName,
            photoURL: mappedProfile.photoURL,
            emailVerified: Boolean(res.user.email_confirmed_at),
          } as unknown as User;

          setUser(mappedUser);
          setUserProfile(mappedProfile);
          setActiveRoleDashboard(mappedRole);
          setActiveView('portal');
          try {
            localStorage.setItem('uomboni_active_session', JSON.stringify({ user: mappedUser, profile: mappedProfile }));
          } catch (e) {}

          setAuthMessage({
            type: 'success',
            text: `Karibu tena, ${mappedProfile.fullName}! Umeingia kupitia Supabase Authentication (${mappedRole.toUpperCase()}).`,
          });
          return { success: true };
        }
        const err = res.error || 'Imeshindwa kuingia kupitia Supabase.';
        setAuthMessage({ type: 'error', text: err });
        return { success: false, error: err };
      }

      // Fallback to real Firebase Auth
      const res = await loginWithEmailPassword(email.trim(), password, preferredRole);
      if (res.success && res.user && res.profile) {
        setUser(res.user);
        setUserProfile(res.profile);
        setActiveRoleDashboard(res.profile.role);
        setActiveView('portal');
        try {
          localStorage.setItem('uomboni_active_session', JSON.stringify({ user: res.user, profile: res.profile }));
        } catch (e) {}
        setAuthMessage({
          type: 'success',
          text: `Karibu tena, ${res.profile.fullName}! Umeingia kikamilifu kwenye Portal ya Uomboni (${res.profile.role.toUpperCase()}).`,
        });
        return { success: true };
      }
      const err = res.error || 'Imeshindwa kuingia.';
      setAuthMessage({ type: 'error', text: err });
      return { success: false, error: err };
    } catch (e: any) {
      const err = formatAuthError(e);
      setAuthMessage({ type: 'error', text: err });
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role: 'student' | 'parent';
  }) => {
    setLoading(true);
    setAuthMessage(null);
    try {
      // Rule 3: Enforce that public signup only allows 'student' or 'parent'
      const safeRole: 'student' | 'parent' = data.role === 'parent' ? 'parent' : 'student';

      if (isSupabaseConfigured()) {
        const res = await registerWithSupabaseAuth({
          fullName: data.fullName,
          email: data.email.trim(),
          phone: data.phone,
          password: data.password,
          role: safeRole,
        });

        if (res.success && res.user) {
          const profile: UserProfile = {
            uid: res.user.id,
            email: data.email.trim(),
            fullName: data.fullName,
            phone: data.phone || '',
            role: safeRole,
            photoURL: null,
            school: 'UOMBONI SECONDARY SCHOOL',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            emailVerified: false,
          };
          const mappedUser: User = {
            uid: res.user.id,
            email: data.email.trim(),
            displayName: data.fullName,
            emailVerified: false,
          } as unknown as User;

          setUser(mappedUser);
          setUserProfile(profile);
          setActiveRoleDashboard(safeRole);
          setActiveView('verify-email');
          setAuthMessage({
            type: 'success',
            text: 'Akaunti yako imeundwa kwenye Supabase! Tafadhali thibitisha barua pepe yako.',
          });
          return { success: true };
        }
        const err = res.error || 'Imeshindwa kuunda akaunti kwenye Supabase.';
        setAuthMessage({ type: 'error', text: err });
        return { success: false, error: err };
      }

      // Firebase registration fallback
      const res = await registerWithEmailPassword({
        ...data,
        email: data.email.trim(),
        role: safeRole,
      });
      if (res.success && res.user && res.profile) {
        setUser(res.user);
        setUserProfile(res.profile);
        setActiveRoleDashboard(res.profile.role);
        setActiveView('verify-email');
        setAuthMessage({
          type: 'success',
          text: 'Akaunti yako imeundwa kikamilifu! Kiungo cha uthibitisho kimetumwa kwenye barua pepe yako.',
        });
        return { success: true };
      }
      const err = res.error || 'Imeshindwa kuunda akaunti.';
      setAuthMessage({ type: 'error', text: err });
      return { success: false, error: err };
    } catch (e: any) {
      const err = formatAuthError(e);
      setAuthMessage({ type: 'error', text: err });
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleAuth = async (
    preferredRole?: UserRole,
    chosenAccount?: { email: string; name: string; role: UserRole }
  ) => {
    setLoading(true);
    setAuthMessage(null);
    try {
      const res = await signInWithGoogle(preferredRole, chosenAccount);
      if (res.success && res.user && res.profile) {
        setUser(res.user);
        setUserProfile(res.profile);
        setActiveRoleDashboard(res.profile.role);
        setActiveView('portal');
        try {
          localStorage.setItem('uomboni_active_session', JSON.stringify({ user: res.user, profile: res.profile }));
        } catch (e) {}
        setAuthMessage({
          type: 'success',
          text: `Karibu kwenye Uomboni Digital Portal, ${res.profile.fullName}!`,
        });
        return { success: true };
      }
      const err = res.error || 'Imeshindwa kuingia na Google.';
      setAuthMessage({ type: 'error', text: err });
      return { success: false, error: err };
    } catch (e: any) {
      const err = formatAuthError(e);
      setAuthMessage({ type: 'error', text: err });
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Demo accounts removed in accordance with security policies
  const loginWithDemoRole = async (_role: UserRole) => {
    const errorMsg = 'Akaunti za majaribio (demo accounts) zimeondolewa kwa mujibu wa taratibu za kiusalama za Shule ya Sekondari Uomboni. Tafadhali tumia akaunti halisi iliyoidhinishwa.';
    setAuthMessage({ type: 'error', text: errorMsg });
    return { success: false, error: errorMsg };
  };

  const logout = async () => {
    setLoading(true);
    try {
      try {
        localStorage.removeItem('uomboni_active_session');
      } catch (e) {}
      if (isSupabaseConfigured()) {
        await signOutFromSupabase();
      }
      await logOutFromFirebase();
      setUser(null);
      setUserProfile(null);
      handleSetActiveView('login');
      setAuthMessage({
        type: 'info',
        text: 'Umefanikiwa kutoka kwenye mfumo wa Uomboni Secondary School.',
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setAuthMessage(null);
    try {
      if (isSupabaseConfigured()) {
        const res = await sendSupabasePasswordReset(email.trim());
        if (res.success) {
          setAuthMessage({
            type: 'success',
            text: 'Ikiwa barua pepe hii imesajiliwa Supabase, kiungo cha kurejesha nenosiri kimetumwa.',
          });
          return { success: true };
        }
        return { success: false, error: res.error };
      }

      const res = await sendResetPassword(email.trim());
      if (res.success) {
        setAuthMessage({
          type: 'success',
          text: 'Ikiwa barua pepe hii imesajiliwa, kiungo cha kurejesha nenosiri kimetumwa.',
        });
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (e: any) {
      const err = formatAuthError(e);
      setAuthMessage({ type: 'error', text: err });
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      const res = await resendVerificationEmail();
      if (res.success) {
        setAuthMessage({
          type: 'success',
          text: 'Barua pepe mpya ya uthibitishaji imetumwa sasa hivi.',
        });
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (e: any) {
      return { success: false, error: formatAuthError(e) };
    }
  };

  const checkVerification = async () => {
    const isVerified = await checkEmailVerificationStatus();
    if (isVerified) {
      if (userProfile) {
        setUserProfile({ ...userProfile, emailVerified: true });
      }
      setAuthMessage({
        type: 'success',
        text: 'Barua pepe yako imethibitishwa kikamilifu!',
      });
      setActiveView('portal');
    }
    return isVerified;
  };

  const refreshProfile = async () => {
    if (!user) return null;
    const p = await getUserProfile(user.uid);
    if (p) {
      setUserProfile(p);
      setActiveRoleDashboard(p.role);
    }
    return p;
  };

  const updateUserRoleByAdmin = async (targetUid: string, newRole: UserRole) => {
    // Check if current user is admin
    if (userProfile?.role !== 'admin') {
      return { success: false, error: 'Idhini haitoshi: Wasimamizi pekee (Admin) wanaweza kubadilisha majukumu.' };
    }
    try {
      const userRef = doc(db, 'users', targetUid);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });
      // If updating self
      if (targetUid === user?.uid && userProfile) {
        setUserProfile({ ...userProfile, role: newRole });
        setActiveRoleDashboard(newRole);
      }
      return { success: true };
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
      }
      return { success: false, error: err?.message || 'Imeshindwa kusasisha jukumu.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authMessage,
        setAuthMessage,
        activeView,
        setActiveView: handleSetActiveView,
        activeRoleDashboard,
        setActiveRoleDashboard,
        login,
        loginWithDemoRole,
        signUp,
        loginWithGoogleAuth,
        logout,
        forgotPassword,
        resendVerification,
        checkVerification,
        refreshProfile,
        updateUserRoleByAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
