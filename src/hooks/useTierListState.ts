import { useState, useCallback, useEffect } from 'react';
import type { Character, TierList, TierKey } from '@/types';
import { TIERS, DEBUG } from '@/config';

const STORAGE_KEY = 'gi_tier_list_draft';

interface TierListState {
  tierList: TierList;
  unassignedCharacters: Character[];
}

/**
 * Custom hook for managing tier list state
 * Handles character assignments, reordering, and persistence to localStorage
 */
export function useTierListState(allCharacters: Character[]) {
  // Initialize from localStorage or with all characters unassigned
  const [state, setState] = useState<TierListState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        if (DEBUG) console.log('[useTierListState] Loaded draft from localStorage');
        return JSON.parse(stored);
      } catch (err) {
        if (DEBUG) console.warn('[useTierListState] Failed to parse stored state:', err);
      }
    }

    // Initialize with all characters unassigned
    const initialState: TierListState = {
      tierList: {
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
      },
      unassignedCharacters: allCharacters,
    };
    return initialState;
  });

  // Update unassigned characters with new data when allCharacters changes
  // This ensures imageUrl and other properties are synced from props
  useEffect(() => {
    if (allCharacters.length > 0) {
      setState((prevState) => {
        // Create a map of character IDs with their full data from allCharacters
        const charMap = new Map<string, Character>();
        allCharacters.forEach(char => charMap.set(char.id, char));

        // Update unassigned characters with fresh data (preserves assignments)
        const updatedUnassigned = prevState.unassignedCharacters.map(char => {
          const freshChar = charMap.get(char.id);
          return freshChar || char;
        });

        // Update all tiers with fresh data (preserves assignments)
        const updatedTierList: TierList = { ...prevState.tierList };
        TIERS.forEach(tier => {
          updatedTierList[tier] = prevState.tierList[tier].map(char => {
            const freshChar = charMap.get(char.id);
            return freshChar || char;
          });
        });

        // Only update if something actually changed
        const hasChanged = 
          updatedUnassigned !== prevState.unassignedCharacters ||
          TIERS.some(tier => updatedTierList[tier] !== prevState.tierList[tier]);

        if (hasChanged) {
          const newState = {
            tierList: updatedTierList,
            unassignedCharacters: updatedUnassigned,
          };
          if (DEBUG) console.log('[useTierListState] Synced character data from props');
          return newState;
        }

        return prevState;
      });
    }
  }, [allCharacters]);

  // Persist state to localStorage
  const saveState = useCallback((newState: TierListState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      if (DEBUG) console.log('[useTierListState] Saved to localStorage');
    } catch (err) {
      console.error('[useTierListState] Failed to save state:', err);
    }
  }, []);

  // Move character from one tier to another
  const moveCharacterToTier = useCallback(
    (character: Character, tierKey: TierKey) => {
      setState((prevState) => {
        const newState = { ...prevState };

        // Remove character from current location
        if (newState.unassignedCharacters.some((c) => c.id === character.id)) {
          newState.unassignedCharacters = newState.unassignedCharacters.filter(
            (c) => c.id !== character.id
          );
        } else {
          for (const tier of TIERS) {
            newState.tierList[tier] = newState.tierList[tier].filter(
              (c) => c.id !== character.id
            );
          }
        }

        // Add to new location (only if not already there)
        if (tierKey === 'unassigned') {
          if (!newState.unassignedCharacters.some((c) => c.id === character.id)) {
            newState.unassignedCharacters.push(character);
          }
        } else {
          if (!newState.tierList[tierKey].some((c) => c.id === character.id)) {
            newState.tierList[tierKey].push(character);
          }
        }

        saveState(newState);
        if (DEBUG) console.log(`[useTierListState] Moved ${character.name} to ${tierKey}`);
        return newState;
      });
    },
    [saveState]
  );

  // Swap positions of two characters in the same tier
  const swapInTier = useCallback(
    (tierKey: keyof TierList, fromIndex: number, toIndex: number) => {
      setState((prevState) => {
        const newState = { ...prevState };
        const tier = newState.tierList[tierKey];

        if (fromIndex >= 0 && fromIndex < tier.length && toIndex >= 0 && toIndex < tier.length) {
          [tier[fromIndex], tier[toIndex]] = [tier[toIndex], tier[fromIndex]];
          saveState(newState);
          if (DEBUG) console.log(`[useTierListState] Swapped items in ${tierKey}`);
        }

        return newState;
      });
    },
    [saveState]
  );

  // Reorder unassigned characters
  const reorderUnassigned = useCallback(
    (fromIndex: number, toIndex: number) => {
      setState((prevState) => {
        const newState = { ...prevState };
        const chars = newState.unassignedCharacters;

        if (fromIndex >= 0 && fromIndex < chars.length && toIndex >= 0 && toIndex < chars.length) {
          [chars[fromIndex], chars[toIndex]] = [chars[toIndex], chars[fromIndex]];
          saveState(newState);
          if (DEBUG) console.log('[useTierListState] Reordered unassigned characters');
        }

        return newState;
      });
    },
    [saveState]
  );

  // Check if all characters are assigned
  const isComplete = useCallback((): boolean => {
    const assigned = TIERS.reduce((sum, tier) => sum + state.tierList[tier].length, 0);
    return assigned === allCharacters.length && state.unassignedCharacters.length === 0;
  }, [state, allCharacters]);

  // Get character count for a tier
  const getTierCount = useCallback(
    (tierKey: keyof TierList): number => {
      return state.tierList[tierKey].length;
    },
    [state]
  );

  // Clear all assignments
  const reset = useCallback(() => {
    const newState: TierListState = {
      tierList: {
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
      },
      unassignedCharacters: [...allCharacters],
    };
    setState(newState);
    saveState(newState);
    if (DEBUG) console.log('[useTierListState] Reset tier list');
  }, [allCharacters, saveState]);

  return {
    tierList: state.tierList,
    unassignedCharacters: state.unassignedCharacters,
    moveCharacterToTier,
    swapInTier,
    reorderUnassigned,
    isComplete,
    getTierCount,
    reset,
  };
}
