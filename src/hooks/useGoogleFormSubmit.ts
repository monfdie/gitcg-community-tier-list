import { useState, useCallback } from 'react';
import type { TierList } from '@/types';
import type { GoogleUserProfile } from '@/lib/googleOAuth';
import {
  submitTierListForm,
  validateTierListCompletion,
} from '@/utils/googleFormEncoder';
import { DEBUG } from '@/config';

export interface SubmitState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  lastSubmittedAt: number | null;
}

/**
 * Custom hook for handling Google Form submission
 * Manages form submission state, validation, and error handling
 */
export function useGoogleFormSubmit(totalCharacters: number) {
  const [state, setState] = useState<SubmitState>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    lastSubmittedAt: null,
  });

  /**
   * Submit tier list to Google Form
   */
  const submit = useCallback(
    async (tierList: TierList, user: GoogleUserProfile | null) => {
      // Validation
      if (!user) {
        setState((prev) => ({
          ...prev,
          error: 'User must be authenticated to submit',
        }));
        return false;
      }

      const validation = validateTierListCompletion(tierList, totalCharacters);
      if (!validation.isValid) {
        setState((prev) => ({
          ...prev,
          error: validation.error || 'Tier list validation failed',
        }));
        if (DEBUG) {
          console.warn('[useGoogleFormSubmit] Validation failed:', validation.error);
        }
        return false;
      }

      setState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
      }));

      try {
        if (DEBUG) {
          console.log('[useGoogleFormSubmit] Submitting tier list for:', user.email);
        }

        await submitTierListForm(tierList);

        setState({
          isSubmitting: false,
          isSubmitted: true,
          error: null,
          lastSubmittedAt: Date.now(),
        });

        if (DEBUG) {
          console.log('[useGoogleFormSubmit] Submission successful');
        }

        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Submission failed';
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: message,
        }));

        if (DEBUG) {
          console.error('[useGoogleFormSubmit] Submission error:', message);
        }

        return false;
      }
    },
    [totalCharacters]
  );

  /**
   * Reset submission state
   */
  const reset = useCallback(() => {
    setState({
      isSubmitting: false,
      isSubmitted: false,
      error: null,
      lastSubmittedAt: null,
    });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    isSubmitting: state.isSubmitting,
    isSubmitted: state.isSubmitted,
    error: state.error,
    lastSubmittedAt: state.lastSubmittedAt,

    // Actions
    submit,
    reset,
    clearError,
  };
}
