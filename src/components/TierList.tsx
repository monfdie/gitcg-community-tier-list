import { useEffect } from 'react';
import type { Character } from '@/types';
import { useTierListState } from '@/hooks/useTierListState';
import { useDragDrop } from '@/hooks/useDragDrop';
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
    swapInTier,
    reorderUnassigned,
    isComplete,
    getTierCount,
  } = useTierListState(characters);

  const { handleDragStart, handleDragOver, handleDropOnTier, handleDropOnUnassigned } =
    useDragDrop(moveCharacterToTier, swapInTier, reorderUnassigned, tierList, unassignedCharacters);

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
            onDragOver={handleDragOver}
            onDrop={handleDropOnTier(tier)}
            onCharacterDragStart={(char) => handleDragStart(char, 'tier', tier)}
          />
        ))}
      </div>

      <UnassignedPool
        characters={unassignedCharacters}
        onCharacterClick={handleCharacterClick}
        onCharacterDragStart={(char) => handleDragStart(char, 'unassigned')}
        onDragOver={handleDragOver}
        onDrop={handleDropOnUnassigned}
      />

      {isComplete() && (
        <div className={styles.completionMessage}>
          <p>✅ All characters assigned! Ready to submit your tier list.</p>
        </div>
      )}
    </div>
  );
}
