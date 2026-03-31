import { useMemo } from 'react';
import type { Character } from '@/types';
import { TIERS, TIER_COLORS } from '@/config';
import type { TierLevel } from '@/config';
import { CharacterItem } from './CharacterItem';
import styles from './UnassignedPool.module.css';

interface UnassignedPoolProps {
  characters: Character[];
  searchQuery?: string;
  defaultTier: TierLevel;
  onDefaultTierChange: (tier: TierLevel) => void;
  onCharacterClick?: (character: Character) => void;
}

/**
 * UnassignedPool component - displays characters available for assignment
 */
export function UnassignedPool({
  characters,
  searchQuery = '',
  defaultTier,
  onDefaultTierChange,
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
    <div
      className={styles.unassignedPool}
      id="unassigned-pool"
    >
      <div className={styles.tierSelector}>
        {TIERS.map((tier) => (
          <button
            key={tier}
            className={`${styles.tierBtn} ${defaultTier === tier ? styles.tierBtnActive : ''}`}
            style={defaultTier === tier ? { background: TIER_COLORS[tier] } : undefined}
            onClick={() => onDefaultTierChange(tier)}
            aria-pressed={defaultTier === tier}
            aria-label={`Click sends to ${tier} tier`}
          >
            {tier}
          </button>
        ))}
      </div>

      <div className={`${styles.grid} sort`} data-tier="unassigned">
        {filteredCharacters.map((character) => (
          <CharacterItem
            key={character.id}
            character={character}
            onClick={onCharacterClick}
          />
        ))}
      </div>
    </div>
  );
}
