import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { TierList } from '@/components/TierList';
import { SubmitButton } from '@/components/SubmitButton';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useTierListState } from '@/hooks/useTierListState';
import { loadCharacters } from '@/utils/characterLoader';
import type { Character, UserProfile } from '@/types';
import styles from './App.module.css';

/**
 * Main App component
 * Orchestrates character loading, auth, tier list state, and submission
 */
function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  // Google Auth
  const { user: googleUser, isAuthenticated } = useGoogleAuth();

  // Tier List State
  const { tierList, isComplete } = useTierListState(characters);

  // Convert Google profile to UserProfile type
  const user: UserProfile | null = isAuthenticated && googleUser
    ? {
        id: googleUser.sub,
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
      }
    : null;

  /**
   * Load character data on mount
   */
  useEffect(() => {
    loadCharacters()
      .then((chars) => {
        setCharacters(chars);
        setIsLoadingCharacters(false);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load characters';
        setError(message);
        setIsLoadingCharacters(false);
      });
  }, []);

  /**
   * Handle successful submission
   */
  const handleSubmitSuccess = () => {
    setSubmissionMessage('✅ Your tier list has been submitted successfully!');
    setTimeout(() => {
      setSubmissionMessage(null);
    }, 5000);
  };

  /**
   * Handle submission error
   */
  const handleSubmitError = (errorMsg: string) => {
    setError(errorMsg);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  return (
    <div className={styles.app}>
      {/* Navigation bar with auth */}
      <Navbar />

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Loading state */}
          {isLoadingCharacters && (
            <div className={styles.statusContainer}>
              <div className={styles.status}>
                <p>⏳ Loading character data...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className={styles.statusContainer}>
              <div className={styles.errorMessage}>
                <p>❌ {error}</p>
              </div>
            </div>
          )}

          {/* Success message */}
          {submissionMessage && (
            <div className={styles.statusContainer}>
              <div className={styles.successMessage}>
                <p>{submissionMessage}</p>
              </div>
            </div>
          )}

          {/* Tier list and submission (when characters loaded) */}
          {!isLoadingCharacters && !error && characters.length > 0 && (
            <>
              <TierList characters={characters} />

              {user && (
                <SubmitButton
                  tierList={tierList}
                  user={user}
                  isComplete={isComplete()}
                  onSuccess={handleSubmitSuccess}
                  onError={handleSubmitError}
                />
              )}
            </>
          )}

          {/* Empty state - no characters loaded but no error */}
          {!isLoadingCharacters && !error && characters.length === 0 && (
            <div className={styles.statusContainer}>
              <div className={styles.errorMessage}>
                <p>❌ No characters found. Please check the data source.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
