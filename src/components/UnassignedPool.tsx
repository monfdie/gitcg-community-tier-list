import { useMemo } from 'react';
import type { Character } from '@/types';
import styles from './UnassignedPool.module.css';

interface UnassignedPoolProps {
  characters: Character[];
  searchQuery?: string;
  onCharacterClick?: (character: Character) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onCharacterDragStart?: (character: Character) => (e: React.DragEvent<HTMLDivElement>) => void;
}

/**
 * UnassignedPool component - displays characters available for assignment
 */
export function UnassignedPool({
  characters,
  searchQuery = '',
  onCharacterClick,
  onDragOver,
  onDrop,
  onCharacterDragStart,
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
    <div
      className={styles.unassignedPool}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className={styles.header}>
        <h3>Available Characters</h3>
        <span className={styles.count}>{filteredCharacters.length} left</span>
      </div>

      <div className={styles.grid}>
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            className={styles.characterItem}
            onClick={() => onCharacterClick?.(character)}
            draggable
            onDragStart={onCharacterDragStart?.(character)}
            role="button"
            tabIndex={0}
            aria-label={`${character.name} - ${character.rarity} star ${character.element}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCharacterClick?.(character);
              }
            }}
          >
            {character.imageUrl && (
              <img
                src={character.imageUrl}
                alt={character.name}
                className={styles.image}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}assets/placeholder-avatar.png`;
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
