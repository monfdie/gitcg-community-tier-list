import type { Character } from '@/types';
import { CharacterItem } from './CharacterItem';
import { TIER_COLORS } from '@/config';
import styles from './TierRow.module.css';

interface TierRowProps {
  tier: string;
  characters: Character[];
  count: number;
  onCharacterClick?: (character: Character) => void;
}

/**
 * TierRow component - displays a single tier row (S, A, B, C, or D)
 */
export function TierRow({
  tier,
  characters,
  count,
  onCharacterClick,
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

      {/* Tier Content — .sort container for Dragula, characters are direct children */}
      <div
        className={`${styles.tierContent} sort`}
        id={`tier-${tier}`}
        data-tier={tier}
      >
        {characters.length === 0 && (
          <span className={styles.empty}>Drop characters here</span>
        )}
        {characters.map((char) => (
          <CharacterItem
            key={char.id}
            character={char}
            onClick={onCharacterClick}
            aria-label={`Remove ${char.name} from tier ${tier}`}
          />
        ))}
      </div>
    </div>
  );
}
