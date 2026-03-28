/**
 * Script to validate character data integrity
 * 
 * Usage:
 * npm run scripts:validate-characters
 * 
 * Checks:
 * - Required fields (id, name, element, rarity)
 * - Valid element types
 * - Valid rarity values
 * - No duplicate IDs
 * - Proper formatting
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface Character {
  id?: string;
  name?: string;
  element?: string;
  rarity?: number;
}

const VALID_ELEMENTS = ['pyro', 'hydro', 'electro', 'cryo', 'anemo', 'geo', 'dendro'];
const VALID_RARITIES = [4, 5];

function validateCharacters() {
  try {
    const charactersPath = join(process.cwd(), 'public', 'data', 'characters.json');
    const data = readFileSync(charactersPath, 'utf-8');
    const characters: Character[] = JSON.parse(data);

    if (!Array.isArray(characters)) {
      console.error('❌ characters.json must contain an array');
      process.exit(1);
    }

    let errors = 0;
    let warnings = 0;
    const seenIds = new Set<string>();

    console.log(`🔍 Validating ${characters.length} characters...\n`);

    characters.forEach((char, index) => {
      const errors_before = errors;

      // Check required fields
      if (!char.id) {
        console.error(`❌ [${index}] Missing required field: id`);
        errors++;
      } else if (typeof char.id !== 'string') {
        console.error(`❌ [${index}] Invalid type for id (expected string)`);
        errors++;
      } else if (char.id !== char.id.toLowerCase()) {
        console.warn(`⚠️ [${index}] id "${char.id}" should be lowercase`);
        warnings++;
      } else if (seenIds.has(char.id)) {
        console.error(`❌ [${index}] Duplicate id: "${char.id}"`);
        errors++;
      } else {
        seenIds.add(char.id);
      }

      if (!char.name) {
        console.error(`❌ [${index}] Missing required field: name`);
        errors++;
      } else if (typeof char.name !== 'string') {
        console.error(`❌ [${index}] Invalid type for name (expected string)`);
        errors++;
      }

      if (!char.element) {
        console.error(`❌ [${index}] Missing required field: element`);
        errors++;
      } else if (!VALID_ELEMENTS.includes(String(char.element).toLowerCase())) {
        console.error(
          `❌ [${index}] Invalid element: "${char.element}" (valid: ${VALID_ELEMENTS.join(', ')})`
        );
        errors++;
      }

      if (char.rarity === undefined || char.rarity === null) {
        console.error(`❌ [${index}] Missing required field: rarity`);
        errors++;
      } else if (!VALID_RARITIES.includes(Number(char.rarity))) {
        console.error(
          `❌ [${index}] Invalid rarity: ${char.rarity} (valid: ${VALID_RARITIES.join(', ')})`
        );
        errors++;
      }

      // Check for extra fields (warning only)
      const allowedFields = new Set(['id', 'name', 'element', 'rarity', 'imageUrl']);
      Object.keys(char).forEach((key) => {
        if (!allowedFields.has(key)) {
          console.warn(`⚠️ [${index}] Unexpected field: "${key}"`);
          warnings++;
        }
      });

      if (errors === errors_before) {
        console.log(`✅ [${index}] ${char.name} (${char.element} • ${char.rarity}★)`);
      }
    });

    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Valid characters: ${characters.length - errors}`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log(`  ⚠️ Warnings: ${warnings}`);

    if (errors > 0) {
      console.log(`\n❌ Validation failed. Please fix the errors above.`);
      process.exit(1);
    } else if (warnings > 0) {
      console.log(`\n⚠️ Validation passed with warnings. Consider fixing them.`);
      process.exit(0);
    } else {
      console.log(`\n✨ All characters are valid!`);
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error validating characters:', error);
    process.exit(1);
  }
}

validateCharacters();
