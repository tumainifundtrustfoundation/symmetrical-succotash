import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getOrFetchCsrfToken,
  getCachedCsrfToken,
  clearCsrfToken,
  checkRequestCsrf,
  requiresCsrfProtection,
  isSensitiveEndpoint,
  isMutatingMethod,
  secureFetch as utilitySecureFetch,
  SENSITIVE_ENDPOINTS,
  SENSITIVE_METHODS,
  CsrfCheckResult,
} from '../utils/csrfProtection';

export interface UseCsrfProtectionReturn {
  csrfToken: string | null;
  isLoading: boolean;
  error: string | null;
  /**
   * Refreshes and returns a newly fetched CSRF token from the server
   */
  refreshCsrfToken: () => Promise<string>;
  /**
   * Returns a valid CSRF token, fetching from server if not cached
   */
  getToken: () => Promise<string>;
  /**
   * Checks for a CSRF token on all POST, PUT, and DELETE requests to sensitive API endpoints.
   * Returns validation result with any error message.
   */
  validateRequest: (
    url: string,
    method?: string,
    headers?: Record<string, string> | HeadersInit
  ) => CsrfCheckResult;
  /**
   * Secure fetch wrapper that verifies the CSRF token on mutating requests
   * (POST, PUT, DELETE) to sensitive endpoints, injecting the header before dispatch.
   */
  secureFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  /**
   * Returns standard headers object containing the active X-CSRF-Token
   */
  getCsrfHeaders: () => Promise<Record<string, string>>;
  /**
   * Checks if an endpoint and method pair is considered sensitive
   */
  isSensitive: (url: string, method?: string) => boolean;
}

/**
 * Custom React Hook: useCsrfProtection
 *
 * Implements client-side Cross-Site Request Forgery (CSRF) protection.
 * Checks for a CSRF token on all POST, PUT, and DELETE requests to sensitive API endpoints,
 * providing secure fetch wrappers, validation functions, and token refresh capabilities.
 */
export function useCsrfProtection(): UseCsrfProtectionReturn {
  const [csrfToken, setCsrfToken] = useState<string | null>(() => getCachedCsrfToken());
  const [isLoading, setIsLoading] = useState<boolean>(!csrfToken);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // Initialize or hydrate CSRF token on component mount
  useEffect(() => {
    isMountedRef.current = true;

    async function initializeToken() {
      try {
        const token = await getOrFetchCsrfToken();
        if (isMountedRef.current) {
          setCsrfToken(token);
          setError(null);
        }
      } catch (err: any) {
        if (isMountedRef.current) {
          setError(err?.message || 'Failed to initialize CSRF token');
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    initializeToken();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refreshCsrfToken = useCallback(async (): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      clearCsrfToken();
      const freshToken = await getOrFetchCsrfToken(true);
      if (isMountedRef.current) {
        setCsrfToken(freshToken);
      }
      return freshToken;
    } catch (err: any) {
      const msg = err?.message || 'Hitilafu ya kupata CSRF token mpya.';
      if (isMountedRef.current) {
        setError(msg);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const getToken = useCallback(async (): Promise<string> => {
    const token = await getOrFetchCsrfToken();
    if (isMountedRef.current && token !== csrfToken) {
      setCsrfToken(token);
    }
    return token;
  }, [csrfToken]);

  const validateRequest = useCallback(
    (
      url: string,
      method = 'GET',
      headers: Record<string, string> | HeadersInit = {}
    ): CsrfCheckResult => {
      return checkRequestCsrf(url, method, headers);
    },
    []
  );

  const getCsrfHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getToken();
    return {
      'X-CSRF-Token': token,
      'X-Requested-With': 'XMLHttpRequest',
    };
  }, [getToken]);

  const secureFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.toString()
          : input.url;
      const method = (
        init?.method ||
        (input instanceof Request ? input.method : 'GET')
      ).toUpperCase();

      // Check if this request targets a sensitive mutating endpoint
      if (requiresCsrfProtection(url, method)) {
        // Ensure token is fetched and validated
        const token = await getToken();

        // Inject headers
        const headers = new Headers(
          init?.headers || (input instanceof Request ? input.headers : {})
        );
        if (!headers.has('X-CSRF-Token')) {
          headers.set('X-CSRF-Token', token);
        }
        if (!headers.has('X-Requested-With')) {
          headers.set('X-Requested-With', 'XMLHttpRequest');
        }

        // Verify CSRF token presence before sending
        const check = validateRequest(url, method, headers);
        if (!check.valid) {
          throw new Error(
            `[CSRF_SECURITY_VIOLATION] Ombi la ${method} kwenye ${url} limezuiliwa: ${check.error}`
          );
        }

        return utilitySecureFetch(input, { ...init, headers });
      }

      return utilitySecureFetch(input, init);
    },
    [getToken, validateRequest]
  );

  const isSensitive = useCallback((url: string, method?: string): boolean => {
    return requiresCsrfProtection(url, method);
  }, []);

  return {
    csrfToken,
    isLoading,
    error,
    refreshCsrfToken,
    getToken,
    validateRequest,
    secureFetch,
    getCsrfHeaders,
    isSensitive,
  };
}

export { SENSITIVE_ENDPOINTS, SENSITIVE_METHODS };
export default useCsrfProtection;
