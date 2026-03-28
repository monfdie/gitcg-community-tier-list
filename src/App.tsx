import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { loadCharacters } from '@/utils/characterLoader';
import type { Character } from '@/types';
import styles from './App.module.css';

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className={styles.app}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          <h2>Genshin Impact Community Tier List</h2>

          {isLoading && <div className={styles.status}>Loading characters...</div>}

          {error && <div className={styles.error}>Error: {error}</div>}

          {!isLoading && !error && (
            <div className={styles.info}>
              <p>Ready to create your tier list!</p>
              <p>{characters.length} characters loaded.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
