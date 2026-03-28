import { DragDropContext } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import type { Character, TierKey } from '@/types';
import { useTierListState } from '@/hooks/useTierListState';
import { TIERS } from '@/config';
import { TierRow } from './TierRow';
import { UnassignedPool } from './UnassignedPool';
import styles from './TierList.module.css';

interface TierListProps {
  characters: Character[];
}

/**
 * TierList component - main tier list container
 * 
 * Manages the complete tier list UI with:
 * - All tier rows (S, A, B, C, D)
 * - Unassigned character pool
 * - Drag and drop functionality
 * - Search filtering
 * - Validation and progress tracking
 */
export function TierList({ characters }: TierListProps) {
  const {
    tierList,
    unassignedCharacters,
    moveCharacterToTier,
  } = useTierListState(characters);

  /**
   * Handle drag and drop events
   */
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // No destination = dropped outside droppable area
    if (!destination) {
      return;
    }

    // Same position = no change
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the character being dragged
    const character = characters.find((c) => c.id === draggableId);
    if (!character) {
      return;
    }

    // Determine destination tier
    let destinationTier: TierKey;
    if (destination.droppableId === 'unassigned-pool') {
      destinationTier = 'unassigned';
    } else {
      // Extract tier from droppableId: "tier-s" → "S"
      destinationTier = destination.droppableId.replace('tier-', '').toUpperCase() as TierKey;
    }

    // Move character to destination
    moveCharacterToTier(character, destinationTier);
  };

  /**
   * Handle character click to move between tiers and unassigned
   */
  const handleCharacterClick = (character: Character) => {
    // If character is in a tier, move to unassigned
    for (const tier of TIERS) {
      if (tierList[tier as keyof typeof tierList].some((c) => c.id === character.id)) {
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.tierList}>
        {/* Tiers Section */}
        <div className={styles.tiersContainer}>
          {TIERS.map((tier) => (
            <TierRow
              key={tier}
              tier={tier}
              characters={tierList[tier as keyof typeof tierList]}
              onCharacterClick={handleCharacterClick}
            />
          ))}
        </div>

        {/* Unassigned Pool */}
        <UnassignedPool
          characters={unassignedCharacters}
          onCharacterClick={handleCharacterClick}
        />
      </div>
    </DragDropContext>
  );
}
