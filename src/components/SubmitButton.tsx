import { useState } from 'react';
import { submitTierListForm } from '@/utils/googleFormEncoder';
import type { TierList } from '@/types';
import styles from './SubmitButton.module.css';

interface SubmitButtonProps {
  tierList: TierList;
  isComplete: boolean;
}

/**
 * Button component that opens a pre-filled Google Form in a new tab.
 * Always visible — shows hint when tier list is not yet complete.
 */
export function SubmitButton({ tierList, isComplete }: SubmitButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!isComplete) {
      setHint('Please assign all characters to tiers before submitting.');
      return;
    }

    setHint(null);
    setIsSubmitting(true);

    try {
      await submitTierListForm(tierList);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.submitted}>
        <p>✅ Google Form opened in a new tab!</p>
        <small>Please click Submit in that tab to record your tier list.</small>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {hint && (
        <p className={styles.hint}>{hint}</p>
      )}

      <button
        onClick={handleSubmit}
        className={`${styles.button} ${!isComplete ? styles.inactive : ''}`}
        aria-label="Submit tier list"
        aria-disabled={!isComplete || isSubmitting}
      >
        {isSubmitting ? 'Opening Form...' : 'Submit Tier List'}
      </button>
    </div>
  );
}
