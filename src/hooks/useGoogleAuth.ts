import { useState, useCallback, useEffect } from 'react';
import {
  generatePKCE,
  generateAuthorizationUrl,
  exchangeCodeForToken,
  getUserProfileFromToken,
  type GoogleUserProfile,
} from '@/lib/googleOAuth';
import { DEBUG } from '@/config';

/**
 * Auth state for Google OAuth
 */
export interface AuthState {
  user: GoogleUserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for Google OAuth authentication
 * Handles login, logout, token refresh, and user profile management
 */
export function useGoogleAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  /**
   * Initialize auth from URL parameters (callback from Google)
   */
  useEffect(() => {
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (!code || !state) return;

      if (DEBUG) {
        console.log('[useGoogleAuth] Auth callback detected');
      }

      // Get stored PKCE state from sessionStorage
      const storedState = sessionStorage.getItem('oauth_state');
      const codeVerifier = sessionStorage.getItem('oauth_code_verifier');

      if (!storedState || state !== storedState || !codeVerifier) {
        setState((prev) => ({
          ...prev,
          error: 'Invalid auth state. Please try logging in again.',
        }));
        return;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Exchange code for token
        const { accessToken, idToken } = await exchangeCodeForToken(
          code,
          codeVerifier
        );

        if (!idToken) {
          throw new Error('No ID token received');
        }

        // Get user profile from ID token
        const user = getUserProfileFromToken(idToken);

        // Store token in sessionStorage (cleared on browser close)
        sessionStorage.setItem('auth_token', accessToken);

        setState((prev) => ({
          ...prev,
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Clean up storage
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_code_verifier');

        if (DEBUG) {
          console.log('[useGoogleAuth] Authentication successful', { user });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Authentication failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        console.error('[useGoogleAuth] Auth error:', message);
      }
    };

    handleAuthCallback();
  }, []);

  /**
   * Restore auth from sessionStorage
   */
  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    if (token && !state.isAuthenticated) {
      // Token exists but user not loaded - skip auto-restore for security
      // User must complete OAuth flow to set user profile
      if (DEBUG) {
        console.log('[useGoogleAuth] Token found but no user profile');
      }
    }
  }, [state.isAuthenticated]);

  /**
   * Start login flow
   */
  const login = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Generate PKCE
      const { codeVerifier, codeChallenge } = await generatePKCE();

      // Generate random state for CSRF protection
      const randomState = Math.random().toString(36).substring(7);

      // Store in sessionStorage (cleared on browser close)
      sessionStorage.setItem('oauth_state', randomState);
      sessionStorage.setItem('oauth_code_verifier', codeVerifier);

      // Generate authorization URL
      const authUrl = generateAuthorizationUrl(codeChallenge, randomState);

      if (DEBUG) {
        console.log('[useGoogleAuth] Redirecting to Google auth:', authUrl);
      }

      // Redirect to Google
      window.location.href = authUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      console.error('[useGoogleAuth] Login error:', message);
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(() => {
    // Clear auth state
    setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // Clear storage
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_code_verifier');

    if (DEBUG) {
      console.log('[useGoogleAuth] Logged out');
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    user: state.user,
    accessToken: state.accessToken,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    logout,
    clearError,
  };
}
