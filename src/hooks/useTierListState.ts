import { useState, useCallback, useMemo } from 'react';
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

  // Build a lookup map so we can enrich stored character objects with the
  // latest data from props (e.g. imageUrl computed after the JSON loads).
  // This replaces the old useEffect+setState sync — no extra render needed.
  const charMap = useMemo(() => {
    const map = new Map<string, Character>();
    allCharacters.forEach((char) => map.set(char.id, char));
    return map;
  }, [allCharacters]);

  const enrich = useCallback(
    (chars: Character[]) => chars.map((c) => charMap.get(c.id) ?? c),
    [charMap]
  );

  const enrichedTierList = useMemo<TierList>(
    () => ({
      S: enrich(state.tierList.S),
      A: enrich(state.tierList.A),
      B: enrich(state.tierList.B),
      C: enrich(state.tierList.C),
      D: enrich(state.tierList.D),
    }),
    [state.tierList, enrich]
  );

  const enrichedUnassigned = useMemo(
    () => enrich(state.unassignedCharacters),
    [state.unassignedCharacters, enrich]
  );

  // Persist state to localStorage
  const saveState = useCallback((newState: TierListState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      if (DEBUG) console.log('[useTierListState] Saved to localStorage');
    } catch (err) {
      console.error('[useTierListState] Failed to save state:', err);
    }
  }, []);

  // Move character from one tier to another, optionally inserting before a sibling
  const moveCharacterToTier = useCallback(
    (character: Character, tierKey: TierKey, insertBeforeId?: string | null) => {
      setState((prevState) => {
        // Deep-copy tierList to avoid mutating prevState (important for React StrictMode
        // double-invocations, which pass the same prevState reference both times)
        const newState = {
          ...prevState,
          tierList: { ...prevState.tierList },
        };

        // Remove character from current location
        if (newState.unassignedCharacters.some((c) => c.id === character.id)) {
          newState.unassignedCharacters = newState.unassignedCharacters.filter(
            (c) => c.id !== character.id
          );
        } else {
          for (const tier of TIERS) {
            if (newState.tierList[tier].some((c) => c.id === character.id)) {
              newState.tierList[tier] = newState.tierList[tier].filter((c) => c.id !== character.id);
              break;
            }
          }
        }

        const insertBefore = (arr: Character[]): Character[] => {
          if (!insertBeforeId) return [...arr, character];
          const idx = arr.findIndex((c) => c.id === insertBeforeId);
          if (idx < 0) return [...arr, character];
          return [...arr.slice(0, idx), character, ...arr.slice(idx)];
        };

        // Add to new location at the correct position
        if (tierKey === 'unassigned') {
          if (!newState.unassignedCharacters.some((c) => c.id === character.id)) {
            newState.unassignedCharacters = insertBefore(newState.unassignedCharacters);
          }
        } else {
          if (!newState.tierList[tierKey].some((c) => c.id === character.id)) {
            newState.tierList[tierKey] = insertBefore(newState.tierList[tierKey]);
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
        const tier = prevState.tierList[tierKey];
        if (fromIndex < 0 || fromIndex >= tier.length || toIndex < 0 || toIndex >= tier.length) {
          return prevState;
        }
        const newTier = [...tier];
        [newTier[fromIndex], newTier[toIndex]] = [newTier[toIndex], newTier[fromIndex]];
        const newState = {
          ...prevState,
          tierList: { ...prevState.tierList, [tierKey]: newTier },
        };
        saveState(newState);
        if (DEBUG) console.log(`[useTierListState] Swapped items in ${tierKey}`);
        return newState;
      });
    },
    [saveState]
  );

  // Reorder unassigned characters
  const reorderUnassigned = useCallback(
    (fromIndex: number, toIndex: number) => {
      setState((prevState) => {
        const chars = prevState.unassignedCharacters;
        if (fromIndex < 0 || fromIndex >= chars.length || toIndex < 0 || toIndex >= chars.length) {
          return prevState;
        }
        const newChars = [...chars];
        [newChars[fromIndex], newChars[toIndex]] = [newChars[toIndex], newChars[fromIndex]];
        const newState = { ...prevState, unassignedCharacters: newChars };
        saveState(newState);
        if (DEBUG) console.log('[useTierListState] Reordered unassigned characters');
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
    tierList: enrichedTierList,
    unassignedCharacters: enrichedUnassigned,
    moveCharacterToTier,
    swapInTier,
    reorderUnassigned,
    isComplete,
    getTierCount,
    reset,
  };
}
