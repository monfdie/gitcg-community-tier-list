import { useEffect } from 'react';
import type { Character } from '@/types';
import { useTierListState } from '@/hooks/useTierListState';
import { useDragula } from '@/hooks/useDragula';
import { TIERS } from '@/config';
import { TierRow } from './TierRow';
import { UnassignedPool } from './UnassignedPool';
import type { TierList as TierListType } from '@/types';
import styles from './TierList.module.css';

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

  // Set up dragula for drag-drop functionality
  useDragula({
    onCharacterMoved: (characterId: string, targetTierId: string) => {
      // Find the character from either tier or unassigned
      let character: Character | null = null;

      // Search in unassigned first
      character = unassignedCharacters.find((c) => c.id === characterId) || null;

      // Search in tiers if not found
      if (!character) {
        for (const tier of TIERS) {
          character = tierList[tier as keyof typeof tierList].find((c) => c.id === characterId) || null;
          if (character) break;
        }
      }

      // Move character to target tier
      if (character) {
        moveCharacterToTier(character, targetTierId as any);
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
    // If character is in a tier, move to unassigned
    for (const tier of TIERS) {
      if (tierList[tier].some((c) => c.id === character.id)) {
        moveCharacterToTier(character, 'unassigned');
        return;
      }
    }

    // If unassigned, move to first tier (S by default)
    if (unassignedCharacters.some((c) => c.id === character.id)) {
      moveCharacterToTier(character, 'S');
    }
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

      <UnassignedPool
        characters={unassignedCharacters}
        onCharacterClick={handleCharacterClick}
      />

      {isComplete() && (
        <div className={styles.completionMessage}>
          <p>✅ All characters assigned! Ready to submit your tier list.</p>
        </div>
      )}
    </div>
  );
}
