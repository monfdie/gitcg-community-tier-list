/**
 * Generate character-to-entry-id mapping for Google Form submission
 * 
 * This script:
 * 1. Reads characters.json
 * 2. Reads form-entry-ids.json (extracted from pre-fill URL)
 * 3. Creates a mapping: character_id → entry_id
 * 4. Outputs as form-character-mapping.json
 * 
 * Usage:
 * npm run scripts:generate-form-mapping
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Character {
  id: string;
  name: string;
  element: string;
  rarity: number;
}

function generateFormMapping() {
  try {
    // Load characters
    const charactersPath = join(process.cwd(), 'public', 'data', 'characters.json');
    const charactersJson = readFileSync(charactersPath, 'utf-8');
    const characters: Character[] = JSON.parse(charactersJson);

    // Load entry IDs
    const entryIdsPath = join(process.cwd(), 'scripts', 'form-entry-ids.json');
    const entryIdsJson = readFileSync(entryIdsPath, 'utf-8');
    const entryIdsArray = JSON.parse(entryIdsJson);
    
    // Handle both array and object formats
    let entryIds: string[] = [];
    let formId = '';
    let formUrl = '';
    
    if (Array.isArray(entryIdsArray) && entryIdsArray.length > 0) {
      const entryIdsData = entryIdsArray[0];
      entryIds = entryIdsData.entryIds || [];
      formId = entryIdsData.formId || '';
      formUrl = entryIdsData.formUrl || '';
    } else if (!Array.isArray(entryIdsArray)) {
      entryIds = entryIdsArray.entryIds || [];
      formId = entryIdsArray.formId || '';
      formUrl = entryIdsArray.formUrl || '';
    }

    if (!characters || characters.length === 0) {
      console.error('❌ No characters found');
      process.exit(1);
    }

    if (!entryIds || entryIds.length === 0) {
      console.error('❌ No entry IDs found');
      process.exit(1);
    }

    if (characters.length !== entryIds.length) {
      console.warn(
        `⚠️ Warning: ${characters.length} characters but ${entryIds.length} entry IDs`
      );
    }

    // Create mapping: character_id → entry_id
    const mapping: Record<string, string> = {};
    characters.forEach((char, index) => {
      if (index < entryIds.length) {
        mapping[char.id] = `entry.${entryIds[index]}`;
      }
    });

    // Also create character name → entry_id for reference
    const nameToEntry: Record<string, string> = {};
    characters.forEach((char, index) => {
      if (index < entryIds.length) {
        nameToEntry[char.name] = `entry.${entryIds[index]}`;
      }
    });

    const output = {
      formId: formId || '1FAIpQLSc3ZtNbJV5SkDvsu1zpU54COaqQ2l1K0KGlVVSuBi_489QiZA',
      formUrl: formUrl,
      totalCharacters: characters.length,
      totalEntries: entryIds.length,
      characterToEntry: mapping,
      nameToEntry: nameToEntry,
      timestamp: new Date().toISOString(),
    };

    // Write mapping
    const mappingPath = join(process.cwd(), 'scripts', 'form-character-mapping.json');
    writeFileSync(mappingPath, JSON.stringify(output, null, 2));

    console.log(`✅ Generated character-to-entry mapping`);
    console.log(`📁 Output: ${mappingPath}`);
    console.log(`   - ${characters.length} characters mapped to entry IDs`);
  } catch (error) {
    console.error('❌ Error generating mapping:', error);
    process.exit(1);
  }
}

generateFormMapping();
