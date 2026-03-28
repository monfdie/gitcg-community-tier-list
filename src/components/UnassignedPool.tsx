import { useMemo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import type { Character } from '@/types';
import { CharacterItem } from './CharacterItem';
import styles from './UnassignedPool.module.css';

interface UnassignedPoolProps {
  characters: Character[];
  searchQuery?: string;
  onCharacterClick?: (character: Character) => void;
}

/**
 * UnassignedPool component - displays characters available for assignment
 * 
 * Shows a grid of unassigned characters that can be dragged to tier rows.
 * Supports filtering by name or element.
 */
export function UnassignedPool({
  characters,
  searchQuery = '',
  onCharacterClick,
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
    <Droppable droppableId="unassigned-pool" type="CHARACTER">
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`${styles.unassignedPool} ${
            snapshot.isDraggingOver ? styles.draggedOver : ''
          }`}
        >
          <div className={styles.header}>
            <h3>Available Characters</h3>
            <span className={styles.count}>{filteredCharacters.length} left</span>
          </div>

          <div className={styles.grid}>
            {filteredCharacters.map((character, index) => (
              <CharacterItem
                key={character.id}
                character={character}
                index={index}
                onClick={onCharacterClick}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
