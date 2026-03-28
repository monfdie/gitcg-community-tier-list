import type { Character } from '@/types';
import styles from './CharacterItem.module.css';

interface CharacterItemProps {
  character: Character;
  onClick?: (character: Character) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

/**
 * Displays a single character card in the unassigned pool
 */
export function CharacterItem({
  character,
  onClick,
  draggable = true,
  onDragStart,
}: CharacterItemProps) {
  const handleClick = () => {
    onClick?.(character);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  return (
    <div
      className={styles.characterItem}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${character.name} - ${character.rarity} star ${character.element}`}
    >
      {character.imageUrl && (
        <img
          src={character.imageUrl}
          alt={character.name}
          className={styles.image}
          loading="lazy"
        />
      )}

      <div className={styles.info}>
        <h4 className={styles.name}>{character.name}</h4>

        <div className={styles.meta}>
          <span className={`${styles.element} ${styles[`element-${character.element}` as keyof typeof styles]}`}>
            {character.element}
          </span>
          <span className={styles.rarity}>
            {'★'.repeat(character.rarity)}
          </span>
        </div>
      </div>

      <div className={styles.dragHandle} title="Drag to assign">
        ≡
      </div>
    </div>
  );
}
