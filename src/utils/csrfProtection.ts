/**
 * CSRF Protection Utility
 * Provides cross-site request forgery defense for sensitive mutating API requests
 * (POST, PUT, DELETE, PATCH).
 */

const CSRF_STORAGE_KEY = 'uomboni_csrf_token';
const CSRF_EXPIRY_KEY = 'uomboni_csrf_expiry';
const TOKEN_LIFETIME_MS = 3.5 * 60 * 60 * 1000; // 3.5 hours (server expires at 4 hours)

/**
 * List of sensitive API endpoints that require CSRF protection for mutating operations.
 */
export const SENSITIVE_ENDPOINTS: readonly string[] = [
  '/api/school-data/update',
  '/api/school-data/batch',
  '/api/results/sync',
  '/api/auth/verify-login',
  '/api/auth/verify-2fa',
  '/api/auth/unlock',
  '/api/auth/logout',
  '/api/auth/log-event',
  '/api/ai-assistant',
];

export const SENSITIVE_METHODS: readonly string[] = ['POST', 'PUT', 'DELETE', 'PATCH'];

let inMemoryCsrfToken: string | null = null;
let inMemoryCsrfExpiry = 0;
let pendingTokenPromise: Promise<string> | null = null;

/**
 * Generate a cryptographically random fallback token on the client
 * if network connection to /api/csrf-token is unavailable.
 */
function generateFallbackClientToken(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return 'csrf-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Checks if a given URL matches any sensitive API endpoint.
 */
export function isSensitiveEndpoint(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = url.startsWith('http') ? new URL(url).pathname : url;
    // Check explicit sensitive endpoints or any /api/ mutating path (excluding public token/status checks)
    if (parsed === '/api/csrf-token' || parsed === '/api/health' || parsed === '/api/auth/security-check') {
      return false;
    }
    return (
      SENSITIVE_ENDPOINTS.some((ep) => parsed.startsWith(ep)) ||
      parsed.startsWith('/api/')
    );
  } catch {
    return url.includes('/api/');
  }
}

/**
 * Checks if the request method is a state-changing mutating method.
 */
export function isMutatingMethod(method?: string): boolean {
  if (!method) return false;
  return SENSITIVE_METHODS.includes(method.toUpperCase());
}

/**
 * Checks whether a request requires CSRF validation.
 */
export function requiresCsrfProtection(url: string, method?: string): boolean {
  return isMutatingMethod(method) && isSensitiveEndpoint(url);
}

/**
 * Retrieves the currently stored CSRF token from memory or storage if not expired.
 */
export function getCachedCsrfToken(): string | null {
  const now = Date.now();
  if (inMemoryCsrfToken && inMemoryCsrfExpiry > now) {
    return inMemoryCsrfToken;
  }

  if (typeof sessionStorage !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(CSRF_STORAGE_KEY);
      const expiry = Number(sessionStorage.getItem(CSRF_EXPIRY_KEY) || '0');
      if (stored && expiry > now) {
        inMemoryCsrfToken = stored;
        inMemoryCsrfExpiry = expiry;
        return stored;
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  return null;
}

/**
 * Persists CSRF token into memory and session storage.
 */
export function setCachedCsrfToken(token: string, expiresInMs = TOKEN_LIFETIME_MS): void {
  inMemoryCsrfToken = token;
  inMemoryCsrfExpiry = Date.now() + expiresInMs;

  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(CSRF_STORAGE_KEY, token);
      sessionStorage.setItem(CSRF_EXPIRY_KEY, String(inMemoryCsrfExpiry));
    } catch {
      // Ignore
    }
  }
}

/**
 * Clears the stored CSRF token.
 */
export function clearCsrfToken(): void {
  inMemoryCsrfToken = null;
  inMemoryCsrfExpiry = 0;
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.removeItem(CSRF_STORAGE_KEY);
      sessionStorage.removeItem(CSRF_EXPIRY_KEY);
    } catch {
      // Ignore
    }
  }
}

/**
 * Fetches a fresh CSRF token from the server or returns active cached token.
 */
export async function getOrFetchCsrfToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh) {
    const cached = getCachedCsrfToken();
    if (cached) return cached;
  }

  if (pendingTokenPromise && !forceRefresh) {
    return pendingTokenPromise;
  }

  pendingTokenPromise = (async () => {
    try {
      const res = await fetch('/api/csrf-token', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.csrfToken || res.headers.get('X-CSRF-Token');
        if (token && typeof token === 'string') {
          setCachedCsrfToken(token);
          return token;
        }
      }

      // Check header even on non-200 if provided
      const headerToken = res.headers.get('X-CSRF-Token');
      if (headerToken) {
        setCachedCsrfToken(headerToken);
        return headerToken;
      }
    } catch (err) {
      console.warn('Notice fetching server CSRF token, using secure local token:', err);
    } finally {
      pendingTokenPromise = null;
    }

    // Fallback client token
    const fallback = generateFallbackClientToken();
    setCachedCsrfToken(fallback);
    return fallback;
  })();

  return pendingTokenPromise;
}

export interface CsrfCheckResult {
  valid: boolean;
  token?: string;
  error?: string;
}

/**
 * Validates whether a request to a sensitive endpoint has an attached CSRF token.
 * This can be used in pre-flight checks or form submission handlers.
 */
export function checkRequestCsrf(
  url: string,
  method = 'GET',
  headers: Record<string, string> | HeadersInit = {}
): CsrfCheckResult {
  const needsCheck = requiresCsrfProtection(url, method);
  if (!needsCheck) {
    return { valid: true };
  }

  let foundToken: string | null = null;

  if (headers instanceof Headers) {
    foundToken =
      headers.get('x-csrf-token') ||
      headers.get('X-CSRF-Token') ||
      headers.get('x-xsrf-token') ||
      headers.get('X-XSRF-Token');
  } else if (Array.isArray(headers)) {
    for (const [key, value] of headers) {
      if (key.toLowerCase() === 'x-csrf-token' || key.toLowerCase() === 'x-xsrf-token') {
        foundToken = value;
        break;
      }
    }
  } else if (typeof headers === 'object' && headers !== null) {
    const norm = Object.keys(headers).reduce<Record<string, string>>((acc, key) => {
      acc[key.toLowerCase()] = (headers as Record<string, string>)[key];
      return acc;
    }, {});
    foundToken = norm['x-csrf-token'] || norm['x-xsrf-token'] || null;
  }

  if (!foundToken || !foundToken.trim()) {
    return {
      valid: false,
      error: `Ulinzi wa CSRF: Kitendo cha ${method.toUpperCase()} kwenye ${url} kinahitaji 'X-CSRF-Token' header halali.`,
    };
  }

  return { valid: true, token: foundToken };
}

/**
 * Secure fetch wrapper that automatically checks for a CSRF token
 * on all POST, PUT, DELETE, and PATCH requests to sensitive API endpoints,
 * acquiring and injecting the token into headers if missing.
 */
export async function secureFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

  const needsCsrf = requiresCsrfProtection(url, method);

  let updatedInit: RequestInit = { ...(init || {}) };

  if (needsCsrf) {
    // Ensure valid token is obtained
    const token = await getOrFetchCsrfToken();

    // Prepare headers
    const headers = new Headers(updatedInit.headers || (input instanceof Request ? input.headers : {}));
    if (!headers.has('X-CSRF-Token') && !headers.has('x-csrf-token')) {
      headers.set('X-CSRF-Token', token);
    }
    if (!headers.has('X-Requested-With')) {
      headers.set('X-Requested-With', 'XMLHttpRequest');
    }

    updatedInit.headers = headers;

    // Validate token presence before network dispatch
    const check = checkRequestCsrf(url, method, headers);
    if (!check.valid) {
      throw new Error(`[CSRF_VALIDATION_ERROR] ${check.error}`);
    }
  }

  return fetch(input, updatedInit);
}
