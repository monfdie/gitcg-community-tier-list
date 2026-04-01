import React from 'react';
import type { Character } from '@/types';
import { ELEMENT_EMOJIS } from '@/config';
import styles from './CharacterItem.module.css';

interface CharacterItemProps {
  character: Character;
  onClick?: (character: Character) => void;
  draggable?: boolean;
  'aria-label'?: string;
}

/**
 * CharacterItem component - a draggable character card for Dragula DnD.
 *
 * Must be a direct child of a `.sort` container.
 * Dragula identifies draggable items by the `character` CSS class on the root div.
 */
export function CharacterItem({
  character,
  onClick,
  draggable = true,
  'aria-label': ariaLabel,
}: CharacterItemProps) {
  const handleClick = () => {
    onClick?.(character);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  const getImageUrl = (): string => {
    return `${import.meta.env.BASE_URL}${character.imageUrl}`;
  };

  const elementEmoji = ELEMENT_EMOJIS[character.element as keyof typeof ELEMENT_EMOJIS] || '?';

  return (
    <div
      id={character.id}
      className={`${styles.characterItem}${character.wideIcon ? ` ${styles.wide}` : ''} character`}
      role="button"
      tabIndex={0}
      draggable={draggable}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel ?? `${character.name} - ${character.rarity} star ${character.element}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={getImageUrl()}
          alt={character.name}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}assets/placeholder-avatar.png`;
          }}
        />
        <div className={styles.rarityBadge}>{'★'.repeat(character.rarity)}</div>
        <div className={styles.elementBadge}>{elementEmoji}</div>
      </div>

      <div className={styles.info}>
        <h4 className={styles.name}>{character.name}</h4>
        <div className={styles.meta}>
          <span className={styles.element}>{character.element}</span>
        </div>
      </div>
    </div>
  );
}
