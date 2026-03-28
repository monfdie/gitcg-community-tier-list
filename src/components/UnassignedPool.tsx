import { useMemo } from 'react';
import type { Character } from '@/types';
import { CharacterItem } from './CharacterItem';
import styles from './UnassignedPool.module.css';

interface UnassignedPoolProps {
  characters: Character[];
  searchQuery?: string;
  onCharacterClick?: (character: Character) => void;
  onCharacterDragStart?: (character: Character) => (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

/**
 * Displays the pool of unassigned characters with optional search/filter
 */
export function UnassignedPool({
  characters,
  searchQuery = '',
  onCharacterClick,
  onCharacterDragStart,
  onDragOver,
  onDrop,
}: UnassignedPoolProps) {
  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) {
      return characters;
    }

    const query = searchQuery.toLowerCase();
    return characters.filter(
      (char) =>
        char.name.toLowerCase().includes(query) ||
        char.element.toLowerCase().includes(query)
    );
  }, [characters, searchQuery]);

  if (characters.length === 0) {
    return (
      <div className={styles.emptyPool}>
        <p>🎉 All characters assigned!</p>
      </div>
    );
  }

  if (filteredCharacters.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>No characters match "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className={styles.unassignedPool} onDragOver={onDragOver} onDrop={onDrop}>
      <div className={styles.header}>
        <h3>Available Characters</h3>
        <span className={styles.count}>{filteredCharacters.length} left</span>
      </div>

      <div className={styles.grid}>
        {filteredCharacters.map((character) => (
          <CharacterItem
            key={character.id}
            character={character}
            onClick={onCharacterClick}
            onDragStart={onCharacterDragStart?.(character)}
          />
        ))}
      </div>
    </div>
  );
}
