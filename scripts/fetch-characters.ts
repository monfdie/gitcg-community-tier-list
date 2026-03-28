/**
 * Script to fetch full character list from external API
 * 
 * Usage:
 * npm run scripts:fetch-characters
 * 
 * Output: scripts/characters-full.json (not committed)
 * 
 * This script is for development only to gather character data.
 * For production, use public/data/characters.json instead.
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

interface RawCharacter {
  id: string;
  name: string;
  element: string;
  rarity: number;
}

interface Character {
  id: string;
  name: string;
  element: 'pyro' | 'hydro' | 'electro' | 'cryo' | 'anemo' | 'geo' | 'dendro';
  rarity: 4 | 5;
}

const VALID_ELEMENTS = ['pyro', 'hydro', 'electro', 'cryo', 'anemo', 'geo', 'dendro'];
const VALID_RARITIES = [4, 5];

/**
 * Validates and normalizes character data
 */
function validateCharacter(char: any): Character | null {
  if (!char.id || !char.name || !char.element || !char.rarity) {
    console.warn(`⚠️ Skipping character with missing fields:`, char);
    return null;
  }

  const element = String(char.element).toLowerCase();
  const rarity = Number(char.rarity);

  if (!VALID_ELEMENTS.includes(element)) {
    console.warn(`⚠️ Skipping character "${char.name}": invalid element "${element}"`);
    return null;
  }

  if (!VALID_RARITIES.includes(rarity)) {
    console.warn(`⚠️ Skipping character "${char.name}": invalid rarity "${rarity}"`);
    return null;
  }

  return {
    id: String(char.id).toLowerCase().replace(/\s+/g, '-'),
    name: String(char.name),
    element: element as Character['element'],
    rarity: rarity as 4 | 5,
  };
}

/**
 * Fetches characters from API
 * Configure API_URL to match your data source
 */
async function fetchCharacters() {
  try {
    // Default: Lunaris API (for development only)
    // You can configure this via environment variable or hardcode your API
    const API_URL = process.env.CHARACTER_API_URL || 'https://api.lunaris.moe/data/6.4.54/charlist.json';

    console.log(`📡 Fetching characters from: ${API_URL}`);
    console.log(`⚠️ This is development-only. Production uses public/data/characters.json\n`);

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();

    // Handle different API response formats
    const items = Array.isArray(rawData) ? rawData : rawData.items || rawData.data || [];

    if (items.length === 0) {
      throw new Error('No characters found in API response');
    }

    // Validate and normalize each character
    const characters: Character[] = [];
    for (const item of items) {
      const char = validateCharacter(item);
      if (char) {
        characters.push(char);
      }
    }

    if (characters.length === 0) {
      throw new Error('No valid characters after validation');
    }

    // Sort by rarity (5-star first) then by name
    characters.sort((a, b) => {
      if (b.rarity !== a.rarity) return b.rarity - a.rarity;
      return a.name.localeCompare(b.name);
    });

    // Save to scripts/characters-full.json
    const outputPath = join(process.cwd(), 'scripts', 'characters-full.json');
    writeFileSync(outputPath, JSON.stringify(characters, null, 2));

    console.log(`✅ Fetched and validated ${characters.length} characters`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`\n📊 Breakdown:`);

    const by5Star = characters.filter((c) => c.rarity === 5).length;
    const by4Star = characters.filter((c) => c.rarity === 4).length;
    console.log(`  • 5⭐: ${by5Star}`);
    console.log(`  • 4⭐: ${by4Star}`);

    const byElement = {} as Record<string, number>;
    characters.forEach((c) => {
      byElement[c.element] = (byElement[c.element] || 0) + 1;
    });
    console.log(`\n  By Element:`);
    Object.entries(byElement)
      .sort((a, b) => b[1] - a[1])
      .forEach(([element, count]) => {
        console.log(`    • ${element}: ${count}`);
      });

    console.log(`\n💡 Next steps:`);
    console.log(`1. Review scripts/characters-full.json`);
    console.log(`2. Copy valid characters to public/data/characters.json`);
    console.log(`3. Run: npm run scripts:generate-form-questions`);
  } catch (error) {
    console.error('❌ Error fetching characters:', error);
    process.exit(1);
  }
}

fetchCharacters();
