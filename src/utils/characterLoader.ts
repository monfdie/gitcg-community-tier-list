import type { Character } from '@/types';
import { CHARACTER_DATA_URL, DEBUG } from '@/config';

/**
 * Load character data from static JSON file
 * @returns Promise resolving to array of characters
 * @throws Error if loading fails
 */
export async function loadCharacters(): Promise<Character[]> {
  try {
    if (DEBUG) {
      console.log('[CharacterLoader] Loading characters from', CHARACTER_DATA_URL);
    }

    const response = await fetch(CHARACTER_DATA_URL);

    if (!response.ok) {
      throw new Error(
        `Failed to load characters: ${response.status} ${response.statusText}`
      );
    }

    const characters: Character[] = await response.json();

    if (!Array.isArray(characters)) {
      throw new Error('Invalid character data format: expected array');
    }

    // Validate character data
    const validCharacters = characters.filter(validateCharacter);

    if (DEBUG) {
      console.log(`[CharacterLoader] Loaded ${validCharacters.length} valid characters`);
    }

    return validCharacters;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error loading characters';
    console.error('[CharacterLoader] Error:', message);
    throw new Error(`Failed to load characters: ${message}`);
  }
}

/**
 * Validate if a character has required fields
 */
function validateCharacter(character: unknown): character is Character {
  if (typeof character !== 'object' || character === null) {
    return false;
  }

  const obj = character as Record<string, unknown>;

  const hasRequiredFields =
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.element === 'string' &&
    typeof obj.rarity === 'number' &&
    (obj.rarity === 4 || obj.rarity === 5);

  const validElements = [
    'pyro',
    'hydro',
    'electro',
    'cryo',
    'anemo',
    'geo',
    'dendro',
  ];
  const hasValidElement = validElements.includes(obj.element as string);

  return hasRequiredFields && hasValidElement;
}

/**
 * Sort characters by rarity (descending) then by name
 */
export function sortCharactersByRarity(characters: Character[]): Character[] {
  return [...characters].sort((a, b) => {
    if (b.rarity !== a.rarity) {
      return b.rarity - a.rarity;
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Group characters by rarity
 */
export function groupCharactersByRarity(
  characters: Character[]
): Record<string, Character[]> {
  return characters.reduce(
    (groups, character) => {
      const rarity = String(character.rarity);
      if (!groups[rarity]) {
        groups[rarity] = [];
      }
      groups[rarity].push(character);
      return groups;
    },
    {} as Record<string, Character[]>
  );
}

/**
 * Search characters by name or id
 */
export function searchCharacters(
  characters: Character[],
  query: string
): Character[] {
  const lowerQuery = query.toLowerCase();
  return characters.filter(
    (char) =>
      char.name.toLowerCase().includes(lowerQuery) ||
      char.id.toLowerCase().includes(lowerQuery)
  );
}
