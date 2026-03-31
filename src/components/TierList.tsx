import { useEffect, useState } from 'react';
import type { Character, TierKey } from '@/types';
import { useTierListState } from '@/hooks/useTierListState';
import { useDragula } from '@/hooks/useDragula';
import { TIERS } from '@/config';
import type { TierLevel } from '@/config';
import { TierRow } from './TierRow';
import { UnassignedPool } from './UnassignedPool';
import { SubmitButton } from './SubmitButton';
import type { TierList as TierListType } from '@/types';
import styles from './TierList.module.css';

const VALID_TIER_KEYS = new Set<TierKey>([...TIERS, 'unassigned']);

function toTierKey(value: string | null): TierKey {
  if (value !== null && VALID_TIER_KEYS.has(value as TierKey)) {
    return value as TierKey;
  }
  return 'unassigned';
}

interface TierListProps {
  characters: Character[];
  onStateChange?: (tierList: TierListType, isComplete: boolean) => void;
}

/**
 * TierList component - main tier list container
 */
export function TierList({ characters, onStateChange }: TierListProps) {
  const {
    tierList,
    unassignedCharacters,
    moveCharacterToTier,
    isComplete,
    getTierCount,
  } = useTierListState(characters);

  const [defaultTier, setDefaultTier] = useState<TierLevel>('S');

  // Set up dragula for drag-drop functionality
  useDragula({
    onCharacterMoved: (characterId: string, targetTierId: string, siblingId: string | null) => {
      let character: Character | null = null;

      character = unassignedCharacters.find((c) => c.id === characterId) || null;

      if (!character) {
        for (const tier of TIERS) {
          character = tierList[tier as keyof typeof tierList].find((c) => c.id === characterId) || null;
          if (character) break;
        }
      }

      if (character) {
        moveCharacterToTier(character, toTierKey(targetTierId), siblingId);
      }
    },
  });

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(tierList, isComplete());
    }
  }, [tierList, onStateChange, isComplete]);

  const handleCharacterClick = (character: Character) => {
    // Characters in tiers move back to unassigned on click
    for (const tier of TIERS) {
      if (tierList[tier].some((c) => c.id === character.id)) {
        moveCharacterToTier(character, 'unassigned');
        return;
      }
    }
    // Unassigned characters go to the currently selected default tier
    moveCharacterToTier(character, defaultTier);
  };

  return (
    <div className={styles.tierList}>
      <div className={styles.tiersContainer}>
        {TIERS.map((tier) => (
          <TierRow
            key={tier}
            tier={tier}
            characters={tierList[tier as keyof typeof tierList]}
            count={getTierCount(tier as keyof typeof tierList)}
            onCharacterClick={handleCharacterClick}
          />
        ))}
      </div>

      <div className={styles.scrollBuffer}>
        <UnassignedPool
          characters={unassignedCharacters}
          defaultTier={defaultTier}
          onDefaultTierChange={setDefaultTier}
          onCharacterClick={handleCharacterClick}
        />

        <SubmitButton
          tierList={tierList}
          isComplete={isComplete()}
        />
      </div>
    </div>
  );
}
