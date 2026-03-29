import { useState, useCallback } from 'react';
import { type CredentialResponse } from '@react-oauth/google';
import { validateIdToken, type GoogleUserProfile } from '@/lib/googleOAuth';
import { GOOGLE_OAUTH_CONFIG, DEBUG } from '@/config';

/**
 * Auth state for Google OAuth
 */
export interface AuthState {
  user: GoogleUserProfile | null;
  idToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * Custom hook for Google Sign-In 2.0 authentication
 * Handles login/logout and user profile management
 */
export function useGoogleAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    idToken: null,
    isAuthenticated: false,
    error: null,
  });

  /**
   * Handle successful Google Sign-In (called by GoogleLogin component)
   */
  const handleLoginSuccess = useCallback((credentialResponse: CredentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) {
        throw new Error('No credential received from Google');
      }

      // Validate JWT claims: iss, aud, exp, sub, email
      const user = validateIdToken(idToken, GOOGLE_OAUTH_CONFIG.clientId);

      setState({
        user,
        idToken,
        isAuthenticated: true,
        error: null,
      });

      if (DEBUG) {
        console.log('[useGoogleAuth] Login successful', { user });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setState((prev) => ({
        ...prev,
        error: message,
      }));
      console.error('[useGoogleAuth] Login error:', message);
    }
  }, []);

  /**
   * Handle Google Sign-In error
   */
  const handleLoginError = useCallback(() => {
    const message = 'Google Sign-In failed. Please try again.';
    setState((prev) => ({
      ...prev,
      error: message,
    }));
    console.error('[useGoogleAuth] Sign-in error');
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(() => {
    setState({
      user: null,
      idToken: null,
      isAuthenticated: false,
      error: null,
    });

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
    idToken: state.idToken,
    isAuthenticated: state.isAuthenticated,
    error: state.error,

    // Actions
    handleLoginSuccess,
    handleLoginError,
    logout,
    clearError,
  };
}
