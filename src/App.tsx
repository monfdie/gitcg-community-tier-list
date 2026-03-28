import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { TierList } from '@/components/TierList';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { loadCharacters } from '@/utils/characterLoader';
import type { Character } from '@/types';
import styles from './App.module.css';

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useGoogleAuth();

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

  const handleSubmitTierList = () => {
    if (!isAuthenticated || !user) {
      setError('Please sign in to submit your tier list');
      return;
    }
    // TODO: Implement form submission
    console.log('Submitting tier list for', user.name);
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

          {!isLoading && !error && characters.length > 0 && (
            <TierList
              characters={characters}
              isAuthenticated={isAuthenticated}
              onSubmit={handleSubmitTierList}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
