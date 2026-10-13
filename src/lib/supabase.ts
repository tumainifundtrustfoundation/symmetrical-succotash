import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.trim() !== '' &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey &&
    supabaseAnonKey.trim() !== ''
  );
};

export const getSupabaseConfigError = (): string | null => {
  if (!isSupabaseConfigured()) {
    return 'Supabase URL au Anon Key haijawekwa kwenye mazingira (VITE_SUPABASE_URL na VITE_SUPABASE_ANON_KEY zinahitajika).';
  }
  return null;
};

// Create the Supabase client instance (or a dummy if not yet configured, to avoid build/runtime crash)
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);

export type SchoolRole = 'admin' | 'academic_master' | 'teacher' | 'bursar' | 'student' | 'parent';

export interface SupabaseUserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: SchoolRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch profile for an authenticated user from the PostgreSQL `profiles` table.
 */
export async function getSupabaseProfile(userId: string): Promise<SupabaseUserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Supabase profile fetch note:', error.message);
      return null;
    }
    return data as SupabaseUserProfile;
  } catch (err) {
    console.error('Error fetching Supabase profile:', err);
    return null;
  }
}

/**
 * Real login using Supabase Auth with email/password.
 * Rejects with genuine error if credentials are wrong or backend is unreachable.
 */
export async function loginWithSupabaseAuth(
  identifier: string,
  password: string
): Promise<{
  success: boolean;
  user?: SupabaseUser;
  profile?: SupabaseUserProfile | null;
  session?: Session | null;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Mfumo wa Supabase haujasanidiwa bado. Tafadhali weka VITE_SUPABASE_URL na VITE_SUPABASE_ANON_KEY kwenye faili la mazingira.',
    };
  }

  const cleanIdentifier = identifier.trim();
  let email = cleanIdentifier;
  if (!cleanIdentifier.includes('@')) {
    email = `${cleanIdentifier.toLowerCase().replace(/[^a-z0-9._-]/g, '')}@uombonisec.ac.tz`;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: formatSupabaseAuthError(error),
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Akaunti haikupatikana au nenosiri si sahihi.',
      };
    }

    const profile = await getSupabaseProfile(data.user.id);

    return {
      success: true,
      user: data.user,
      profile,
      session: data.session,
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatSupabaseAuthError(err),
    };
  }
}

/**
 * Real user registration via Supabase Auth.
 * CRITICAL RULE: Public sign up only permits 'student' or 'parent'.
 * It NEVER grants 'admin', 'academic_master', or 'teacher' privileges automatically.
 */
export async function registerWithSupabaseAuth(data: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: 'student' | 'parent';
}): Promise<{
  success: boolean;
  user?: SupabaseUser;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase haijasanidiwa. Weka VITE_SUPABASE_URL na VITE_SUPABASE_ANON_KEY.',
    };
  }

  // Enforce zero self-promotion
  const safeRole: SchoolRole = data.role === 'parent' ? 'parent' : 'student';

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone || '',
          role: safeRole,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: formatSupabaseAuthError(error),
      };
    }

    if (authData.user) {
      // Sync into profiles table directly
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone || '',
        role: safeRole,
      });
    }

    return {
      success: true,
      user: authData.user ?? undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatSupabaseAuthError(err),
    };
  }
}

/**
 * Send password reset email via Supabase Auth
 */
export async function sendSupabasePasswordReset(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase haijasanidiwa. Tafadhali sanidi VITE_SUPABASE_URL.',
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/#reset-password`,
    });

    if (error) {
      return { success: false, error: formatSupabaseAuthError(error) };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: formatSupabaseAuthError(err) };
  }
}

/**
 * Sign out from Supabase session
 */
export async function signOutFromSupabase(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn('Supabase signOut error:', e);
  }
}

/**
 * Format human-friendly error messages in Swahili & English
 */
export function formatSupabaseAuthError(err: any): string {
  if (!err) return 'Hitilafu ya uthibitishaji imetokea.';
  const msg = (err.message || '').toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
    return 'Barua pepe au nenosiri si sahihi. Tafadhali hakiki na ujaribu tena.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Barua pepe yako haijathibitishwa bado. Tafadhali kagua sanduku lako la barua pepe.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'Akaunti yenye barua pepe hii tayari ipo kwenye mfumo. Tafadhali ingia au urejeshe nenosiri.';
  }
  if (msg.includes('password should be at least')) {
    return 'Nenosiri lazima liwe na angalau herufi 6.';
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Majaribio mengi sana yameshindwa. Tafadhali subiri dakika chache kabla ya kujaribu tena.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Hitilafu ya mtandao: Imeshindwa kuwasiliana na seva ya Supabase.';
  }

  return err.message || 'Hitilafu ya kuingia imetokea. Tafadhali jaribu tena.';
}
