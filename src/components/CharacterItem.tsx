import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { Character } from '@/types';
import { ELEMENT_EMOJIS } from '@/config';
import styles from './CharacterItem.module.css';

interface CharacterItemProps {
  character: Character;
  index: number;
  onClick?: (character: Character) => void;
}

/**
 * CharacterItem component - a draggable character card
 * 
 * Displays character avatar, name, element, and rarity.
 * Can be dragged between tier rows or back to the unassigned pool.
 */
export function CharacterItem({ character, index, onClick }: CharacterItemProps) {
  const handleClick = () => {
    onClick?.(character);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  // Construct image URL - prefer imageUrl first, then avatarId
  const getImageUrl = (): string => {
    if (character.imageUrl) {
      return character.imageUrl;
    }

    if (character.avatarId) {
      return `/assets/avatars/${character.avatarId}.webp`;
    }

    return '/assets/placeholder-avatar.png';
  };

  const elementEmoji = ELEMENT_EMOJIS[character.element as keyof typeof ELEMENT_EMOJIS] || '?';

  return (
    <Draggable draggableId={character.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.characterItem} ${snapshot.isDragging ? styles.dragging : ''}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`${character.name} - ${character.rarity} star ${character.element}`}
        >
          {/* Character Avatar */}
          <div className={styles.imageWrapper}>
            <img
              src={getImageUrl()}
              alt={character.name}
              className={styles.image}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/placeholder-avatar.png';
              }}
            />

            {/* Rarity indicator */}
            <div className={styles.rarityBadge}>
              {'★'.repeat(character.rarity)}
            </div>

            {/* Element indicator */}
            <div className={styles.elementBadge}>{elementEmoji}</div>
          </div>

          {/* Character Info */}
          <div className={styles.info}>
            <h4 className={styles.name}>{character.name}</h4>

            <div className={styles.meta}>
              <span className={styles.element}>{character.element}</span>
            </div>
          </div>

          {/* Drag hint */}
          <div className={styles.dragHandle} title="Drag to assign">
            ≡
          </div>
        </div>
      )}
    </Draggable>
  );
}
