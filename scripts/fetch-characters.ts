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
 * Validates and normalizes character data from Lunaris API
 */
function validateCharacter(char: any, id: string): Character | null {
  // Extract English name - API uses enName, ptName, or ruName
  const name = char.enName || char.ptName || char.name || '';
  const element = char.element || '';
  
  if (!name || !element) {
    console.warn(`⚠️ Skipping character ${id}: missing name or element`);
    return null;
  }

  // Parse element (API returns "Cryo", "Pyro", etc.)
  const elementLower = String(element).toLowerCase();
  if (!VALID_ELEMENTS.includes(elementLower)) {
    console.warn(`⚠️ Skipping character "${name}": invalid element "${element}"`);
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
    let items: any[] = [];
    
    if (Array.isArray(rawData)) {
      items = rawData;
    } else if (typeof rawData === 'object' && rawData !== null) {
      // Convert object with character IDs as keys to array
      items = Object.values(rawData);
    }

    if (items.length === 0) {
      throw new Error('No characters found in API response');
    }

    // Validate and normalize each character
    const characters: Character[] = [];
    const seenCharacters = new Set<string>();
    
    for (const [charId, item] of Object.entries(items)) {
      // Skip duplicate elements for the same character (e.g., 10000005_ANEMO, 10000005_CRYO)
      if (charId.match(/_[A-Z]+$/)) {
        // This is a variant, skip for now (keep only main version)
        continue;
      }
      const char = validateCharacter(item, charId);
      if (char) {
        // For Traveler, use combined ID like "traveler-anemo"
        if (char.name === 'Traveler') {
          char.id = `traveler-${char.element}`;
        }
        
        // Check if we already have this exact character (by combined id)
        if (!seenCharacters.has(char.id)) {
          characters.push(char);
          seenCharacters.add(char.id);
        }
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
