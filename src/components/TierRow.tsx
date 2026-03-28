import type { Character } from '@/types';
import styles from './TierRow.module.css';

interface TierRowProps {
  tier: string;
  characters: Character[];
  count: number;
  onCharacterClick: (character: Character) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onCharacterDragStart?: (character: Character) => (e: React.DragEvent<HTMLDivElement>) => void;
}

/**
 * Displays a single tier row (S, A, B, C, or D) with assigned characters
 */
export function TierRow({
  tier,
  characters,
  count,
  onCharacterClick,
  onDragOver,
  onDrop,
  onCharacterDragStart,
}: TierRowProps) {
  return (
    <div className={styles.tierRow}>
      <div className={`${styles.tierLabel} ${styles[`tier${tier.toLowerCase()}` as keyof typeof styles]}`}>
        <span className={styles.tierText}>{tier}</span>
        <span className={styles.tierCount}>{count}</span>
      </div>

      <div className={styles.tierContent} onDragOver={onDragOver} onDrop={onDrop}>
        {characters.length === 0 ? (
          <div className={styles.empty}>
            <span>Drop characters here</span>
          </div>
        ) : (
          <div className={styles.characterGrid}>
            {characters.map((char) => (
              <div
                key={char.id}
                className={styles.characterSlot}
                onClick={() => onCharacterClick(char)}
                draggable
                onDragStart={onCharacterDragStart?.(char)}
                role="button"
                tabIndex={0}
                aria-label={`Remove ${char.name} from tier ${tier}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onCharacterClick(char);
                  }
                }}
              >
                {char.imageUrl && (
                  <img
                    src={char.imageUrl}
                    alt={char.name}
                    className={styles.characterImage}
                    loading="lazy"
                  />
                )}
                <div className={styles.characterInfo}>
                  <p className={styles.characterName}>{char.name}</p>
                  <span className={styles.rarity}>
                    {'★'.repeat(char.rarity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
