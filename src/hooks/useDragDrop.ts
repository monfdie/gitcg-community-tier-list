import { useCallback } from 'react';
import type { Character, TierKey, TierList } from '@/types';
import { TIERS } from '@/config';

interface DragData {
  characterId: string;
  sourceType: 'tier' | 'unassigned';
  sourceTier?: string;
}

const DRAG_DATA_TYPE = 'application/json';

/**
 * Custom hook for managing drag-and-drop operations in tier list
 */
export function useDragDrop(
  moveCharacterToTier: (char: Character, tier: TierKey) => void,
  _swapInTier: (tier: keyof TierList, fromIdx: number, toIdx: number) => void,
  _reorderUnassigned: (fromIdx: number, toIdx: number) => void,
  tierList: TierList,
  unassignedCharacters: Character[]
) {
  // Start drag: encode character data
  const handleDragStart = useCallback(
    (character: Character, sourceType: 'tier' | 'unassigned', sourceTier?: string) =>
      (e: React.DragEvent<HTMLDivElement>) => {
        const dragData: DragData = { characterId: character.id, sourceType, sourceTier };
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData(DRAG_DATA_TYPE, JSON.stringify(dragData));
        // Optional: Set drag image to the character image
        if (character.imageUrl) {
          const img = new Image();
          img.src = character.imageUrl;
          e.dataTransfer.setDragImage(img, 25, 25);
        }
      },
    []
  );

  // Allow drop on tier row
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop on a tier
  const handleDropOnTier = useCallback(
    (tier: string) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const data = e.dataTransfer.getData(DRAG_DATA_TYPE);
      if (!data) return;

      try {
        const dragData: DragData = JSON.parse(data);
        const character = findCharacterById(
          dragData.characterId,
          dragData.sourceType,
          dragData.sourceTier,
          tierList,
          unassignedCharacters
        );

        if (character) {
          moveCharacterToTier(character, tier as TierKey);
        }
      } catch (err) {
        console.error('Drop failed:', err);
      }
    },
    [moveCharacterToTier, tierList, unassignedCharacters]
  );

  // Handle drop on unassigned pool
  const handleDropOnUnassigned = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const data = e.dataTransfer.getData(DRAG_DATA_TYPE);
      if (!data) return;

      try {
        const dragData: DragData = JSON.parse(data);
        const character = findCharacterById(
          dragData.characterId,
          dragData.sourceType,
          dragData.sourceTier,
          tierList,
          unassignedCharacters
        );

        if (character) {
          moveCharacterToTier(character, 'unassigned');
        }
      } catch (err) {
        console.error('Drop failed:', err);
      }
    },
    [moveCharacterToTier, tierList, unassignedCharacters]
  );

  return {
    handleDragStart,
    handleDragOver,
    handleDropOnTier,
    handleDropOnUnassigned,
  };
}

/**
 * Helper function to find a character by ID from tier or unassigned pool
 */
function findCharacterById(
  characterId: string,
  sourceType: 'tier' | 'unassigned',
  sourceTier: string | undefined,
  tierList: TierList,
  unassignedCharacters: Character[]
): Character | null {
  if (sourceType === 'unassigned') {
    return unassignedCharacters.find((c) => c.id === characterId) || null;
  }

  if (sourceTier && sourceTier in tierList) {
    return tierList[sourceTier as keyof TierList].find((c) => c.id === characterId) || null;
  }

  // Search all tiers
  for (const tier of TIERS) {
    const found = tierList[tier]?.find((c) => c.id === characterId);
    if (found) return found;
  }

  return null;
}
