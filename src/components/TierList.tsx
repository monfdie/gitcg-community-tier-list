import { useState } from 'react';
import type { Character } from '@/types';
import { useTierListState } from '@/hooks/useTierListState';
import { useDragDrop } from '@/hooks/useDragDrop';
import { TIERS } from '@/config';
import { TierRow } from './TierRow';
import { UnassignedPool } from './UnassignedPool';
import styles from './TierList.module.css';

interface TierListProps {
  characters: Character[];
  isAuthenticated: boolean;
  onSubmit?: () => void;
}

/**
 * Main tier list component with all tiers and unassigned pool
 */
export function TierList({ characters, isAuthenticated, onSubmit }: TierListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    tierList,
    unassignedCharacters,
    moveCharacterToTier,
    swapInTier,
    reorderUnassigned,
    isComplete,
    getTierCount,
    reset,
  } = useTierListState(characters);

  const { handleDragStart, handleDragOver, handleDropOnTier, handleDropOnUnassigned } =
    useDragDrop(moveCharacterToTier, swapInTier, reorderUnassigned, tierList, unassignedCharacters);

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
      <div className={styles.controls}>
        <h2>Create Your Tier List</h2>
        
        <div className={styles.controlsRow}>
          <input
            type="text"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search characters by name or element"
          />

          <div className={styles.actionButtons}>
            <button
              onClick={reset}
              className={styles.buttonSecondary}
              disabled={unassignedCharacters.length === characters.length}
            >
              Reset
            </button>

            <button
              onClick={onSubmit}
              className={`${styles.buttonPrimary} ${
                !isAuthenticated || !isComplete() ? styles.disabled : ''
              }`}
              disabled={!isAuthenticated || !isComplete()}
              title={
                !isAuthenticated
                  ? 'Please sign in to submit'
                  : !isComplete()
                  ? 'All characters must be assigned'
                  : 'Submit your tier list'
              }
            >
              {!isComplete() ? `${characters.length - (unassignedCharacters.length)} of ${characters.length}` : 'Submit'}
            </button>
          </div>
        </div>

        {!isComplete() && (
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${((characters.length - unassignedCharacters.length) / characters.length) * 100}%`,
                }}
              />
            </div>
            <span className={styles.progressText}>
              {characters.length - unassignedCharacters.length} of {characters.length} assigned
            </span>
          </div>
        )}
      </div>

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
        searchQuery={searchQuery}
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
