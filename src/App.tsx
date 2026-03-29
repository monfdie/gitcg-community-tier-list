import { useEffect, useState, useCallback } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Navbar } from '@/components/Navbar';
import { TierList } from '@/components/TierList';
import { SubmitButton } from '@/components/SubmitButton';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { loadCharacters } from '@/utils/characterLoader';
import type { Character, UserProfile, TierList as TierListType } from '@/types';
import styles from './App.module.css';

/**
 * Main App component
 * Orchestrates character loading, auth, tier list state, and submission
 */
function AppContent() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [tierList, setTierList] = useState<TierListType>({ S: [], A: [], B: [], C: [], D: [] });
  const [isTierListComplete, setIsTierListComplete] = useState(false);

  // Google Auth
  const { user: googleUser, isAuthenticated } = useGoogleAuth();

  // Callback for TierList state changes
  const handleTierListStateChange = useCallback((newTierList: TierListType, isComplete: boolean) => {
    setTierList(newTierList);
    setIsTierListComplete(isComplete);
  }, []);

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
      {isLoadingCharacters && (
        <p className={styles.loadingMessage}>⏳ Loading character data...</p>
      )}

      {error && (
        <p className={styles.errorMessage}>❌ {error}</p>
      )}

      {!isLoadingCharacters && !error && characters.length > 0 && (
        <div className={styles.mainContent}>
          {/* Tier list on the left/center */}
          <TierList characters={characters} onStateChange={handleTierListStateChange} />

          {/* Submit button on the right */}
          {user && (
            <SubmitButton
              tierList={tierList}
              user={user}
              isComplete={isTierListComplete}
              onSuccess={handleSubmitSuccess}
              onError={handleSubmitError}
            />
          )}
        </div>
      )}

      {submissionMessage && (
        <div className={styles.successMessage}>
          {submissionMessage}
        </div>
      )}
    </div>
  );
}

/**
 * Wrapped App with GoogleOAuthProvider
 */
function App() {
  // Get Google OAuth Client ID from environment
  const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '';

  if (!clientId) {
    return (
      <div className={styles.configError}>
        ❌ Google OAuth Client ID not configured. Please set VITE_GOOGLE_OAUTH_CLIENT_ID in .env.local
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}

export default App;
