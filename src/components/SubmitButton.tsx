import { useState } from 'react';
import { submitTierListForm } from '@/utils/googleFormEncoder';
import type { TierList, UserProfile } from '@/types';
import styles from './SubmitButton.module.css';

interface SubmitButtonProps {
  tierList: TierList;
  user: UserProfile | null;
  isComplete: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

/**
 * Button component for submitting tier list to Google Form
 */
export function SubmitButton({
  tierList,
  user,
  isComplete,
  onSuccess,
  onError,
  disabled = false,
}: SubmitButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user || !isComplete || disabled) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitTierListForm(tierList, user);
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Submission failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.submitted}>
        <p>✅ Your tier list has been submitted successfully!</p>
        <small>Thank you for participating in the community tier list voting.</small>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        onClick={handleSubmit}
        disabled={!user || !isComplete || disabled || isSubmitting}
        className={styles.button}
        aria-label="Submit tier list"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Tier List'}
      </button>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {!user && (
        <p className={styles.message}>Please sign in to submit your tier list</p>
      )}

      {user && !isComplete && (
        <p className={styles.message}>Please assign all characters before submitting</p>
      )}
    </div>
  );
}
