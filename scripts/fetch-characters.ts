/**
 * Script to fetch and validate character data from external API
 * 
 * Usage:
 * npm run scripts:sync-characters
 * 
 * This script:
 * 1. Fetches characters from Lunaris API
 * 2. Validates and normalizes the data
 * 3. Saves to scripts/characters-full.json for review
 * 4. Shows validation report
 * 
 * For production, review and copy valid characters to public/data/characters.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Character {
  id: string;
  name: string;
  element: 'pyro' | 'hydro' | 'electro' | 'cryo' | 'anemo' | 'geo' | 'dendro';
  rarity: 4 | 5;
  imageUrl?: string;
}

const VALID_ELEMENTS = ['pyro', 'hydro', 'electro', 'cryo', 'anemo', 'geo', 'dendro'];
const VALID_RARITIES = [4, 5];

/**
 * Validates and normalizes character data from Lunaris API
 */
function validateCharacterFromAPI(char: any, id: string): Character | null {
  const name = char.enName || char.ptName || char.name || '';
  const element = char.element || '';
  
  if (!name || !element) {
    return null;
  }

  const elementLower = String(element).toLowerCase();
  if (!VALID_ELEMENTS.includes(elementLower)) {
    return null;
  }

  // Parse rarity from qualityType (QUALITY_ORANGE = 5-star, QUALITY_PURPLE = 4-star)
  let rarity: 4 | 5 = 4;
  if (char.qualityType === 'QUALITY_ORANGE' || char.qualityType === 'QUALITY_5') {
    rarity = 5;
  } else if (char.qualityType === 'QUALITY_PURPLE' || char.qualityType === 'QUALITY_4') {
    rarity = 4;
  }

  return {
    id: id.toLowerCase().replace(/[_\s]+/g, '-').replace(/-anemo|-cryo|-dendro|-electro|-geo|-hydro|-pyro$/, ''),
    name: name,
    element: elementLower as Character['element'],
    rarity: rarity,
  };
}

/**
 * Validates character data structure
 */
function validateCharacterStructure(char: Character, index: number): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!char.id || typeof char.id !== 'string') {
    errors.push(`Invalid or missing id`);
  } else if (char.id !== char.id.toLowerCase()) {
    errors.push(`id "${char.id}" should be lowercase`);
  }

  if (!char.name || typeof char.name !== 'string') {
    errors.push(`Invalid or missing name`);
  }

  if (!char.element || !VALID_ELEMENTS.includes(char.element)) {
    errors.push(`Invalid element "${char.element}"`);
  }

  if (!VALID_RARITIES.includes(char.rarity)) {
    errors.push(`Invalid rarity ${char.rarity}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Fetches characters from API and validates them
 */
async function syncCharacters() {
  try {
    const API_URL = process.env.CHARACTER_API_URL || 'https://api.lunaris.moe/data/6.4.54/charlist.json';

    console.log(`📡 Fetching characters from: ${API_URL}\n`);

    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();

    // Handle different API response formats
    let items: any[] = [];
    if (Array.isArray(rawData)) {
      items = rawData;
    } else if (typeof rawData === 'object' && rawData !== null) {
      items = Object.values(rawData);
    }

    if (items.length === 0) {
      throw new Error('No characters found in API response');
    }

    // Fetch and validate
    const characters: Character[] = [];
    const seenCharacters = new Set<string>();
    let fetchErrors = 0;

    for (const [charId, item] of Object.entries(items)) {
      // Skip duplicate elements for the same character
      if (charId.match(/_[A-Z]+$/)) {
        continue;
      }

      const char = validateCharacterFromAPI(item, charId);
      if (char) {
        // For Traveler, use combined ID like "traveler-anemo"
        if (char.name === 'Traveler') {
          char.id = `traveler-${char.element}`;
        }
        
        if (!seenCharacters.has(char.id)) {
          characters.push(char);
          seenCharacters.add(char.id);
        }
      } else {
        fetchErrors++;
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

    // Validate structure of all characters
    console.log(`🔍 Validating ${characters.length} characters...\n`);

    let structureErrors = 0;
    let validCharacters = 0;

    characters.forEach((char, index) => {
      const validation = validateCharacterStructure(char, index);
      if (validation.valid) {
        console.log(`✅ [${index}] ${char.name} (${char.element} • ${char.rarity}★)`);
        validCharacters++;
      } else {
        console.error(`❌ [${index}] ${char.name}: ${validation.errors.join(', ')}`);
        structureErrors++;
      }
    });

    // Save to scripts/characters-full.json
    const outputPath = join(process.cwd(), 'scripts', 'characters-full.json');
    writeFileSync(outputPath, JSON.stringify(characters, null, 2));

    console.log(`\n📊 Summary:`);
    console.log(`  📥 Fetched: ${items.length} items from API`);
    console.log(`  ✅ Valid: ${characters.length} characters`);
    console.log(`  ⚠️ Skipped during fetch: ${fetchErrors}`);
    console.log(`  ❌ Structure errors: ${structureErrors}`);
    console.log(`  ✨ Ready for production: ${validCharacters}`);

    console.log(`\n📈 Breakdown:`);
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

    console.log(`\n📁 Output: ${outputPath}`);
    console.log(`\n💡 Next steps:`);
    console.log(`1. Review scripts/characters-full.json`);
    console.log(`2. Copy valid characters to public/data/characters.json`);
    console.log(`3. Run: npm run scripts:generate-form-questions`);

    if (structureErrors > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error syncing characters:', error);
    process.exit(1);
  }
}

syncCharacters();
