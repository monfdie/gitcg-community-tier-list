import type { Character } from '@/types';
import { TIER_COLORS } from '@/config';
import styles from './TierRow.module.css';

interface TierRowProps {
  tier: string;
  characters: Character[];
  count: number;
  onCharacterClick?: (character: Character) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onCharacterDragStart?: (character: Character) => (e: React.DragEvent<HTMLDivElement>) => void;
}

/**
 * TierRow component - displays a single tier row (S, A, B, C, or D)
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
  const tierColor = TIER_COLORS[tier as keyof typeof TIER_COLORS] || '#999';

  return (
    <div className={styles.tierRow}>
      {/* Tier Label */}
      <div
        className={styles.tierLabel}
        style={{ backgroundColor: tierColor }}
      >
        <span className={styles.tierText}>{tier}</span>
        <span className={styles.tierCount}>{count}</span>
      </div>

      {/* Tier Content (Droppable) */}
      <div
        className={styles.tierContent}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {characters.length === 0 ? (
          <div className={styles.empty}>
            <span>⬆️ Drop characters here</span>
          </div>
        ) : (
          <div className={styles.characterGrid}>
            {characters.map((char) => (
              <div
                key={char.id}
                className={styles.characterItem}
                onClick={() => onCharacterClick?.(char)}
                draggable
                onDragStart={onCharacterDragStart?.(char)}
                role="button"
                tabIndex={0}
                aria-label={`${char.name} - ${char.rarity} star ${char.element}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onCharacterClick?.(char);
                  }
                }}
              >
                {char.imageUrl && (
                  <img
                    src={char.imageUrl}
                    alt={char.name}
                    className={styles.image}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}assets/placeholder-avatar.png`;
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
