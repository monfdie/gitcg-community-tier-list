import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { TierList } from '@/components/TierList';
import { SubmitButton } from '@/components/SubmitButton';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useTierListState } from '@/hooks/useTierListState';
import { loadCharacters } from '@/utils/characterLoader';
import type { Character, UserProfile } from '@/types';
import styles from './App.module.css';

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const { user: googleUser } = useGoogleAuth();
  const { tierList, isComplete } = useTierListState(characters);

  // Map Google profile to UserProfile (sub -> id, picture -> avatar)
  const user: UserProfile | null = googleUser
    ? {
        id: googleUser.sub,
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
      }
    : null;

  useEffect(() => {
    loadCharacters()
      .then((chars) => {
        setCharacters(chars);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load characters');
        setIsLoading(false);
      });
  }, []);

  const handleSubmitSuccess = () => {
    setSubmissionMessage('✅ Your tier list has been submitted successfully!');
    setTimeout(() => {
      setSubmissionMessage(null);
    }, 5000);
  };

  const handleSubmitError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <div className={styles.app}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          {isLoading && (
            <div className={styles.status}>
              <p>Loading characters...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>Error: {error}</p>
            </div>
          )}

          {submissionMessage && (
            <div className={styles.status}>
              <p>{submissionMessage}</p>
            </div>
          )}

          {!isLoading && !error && characters.length > 0 && (
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
        </div>
      </main>
    </div>
  );
}

export default App;
