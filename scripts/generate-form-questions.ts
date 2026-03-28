/**
 * Script to generate Google Form questions from characters.json
 * 
 * Usage:
 * npm run scripts:generate-form-questions
 * 
 * Output: scripts/form-questions.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Character {
  id: string;
  name: string;
  element: string;
  rarity: number;
}

interface FormQuestion {
  title: string;
  description: string;
  choices: string[];
  required: boolean;
}

const ELEMENTS: Record<string, string> = {
  pyro: '🔥 Pyro',
  hydro: '💧 Hydro',
  electro: '⚡ Electro',
  cryo: '❄️ Cryo',
  anemo: '🌪️ Anemo',
  geo: '⛰️ Geo',
  dendro: '🌱 Dendro',
};

function generateFormQuestions() {
  try {
    // Load characters from public/data/characters.json
    const charactersPath = join(process.cwd(), 'public', 'data', 'characters.json');
    const charactersJson = readFileSync(charactersPath, 'utf-8');
    const characters: Character[] = JSON.parse(charactersJson);

    if (!characters || characters.length === 0) {
      console.error('❌ No characters found in characters.json');
      process.exit(1);
    }

    // Generate questions from characters
    const questions: FormQuestion[] = characters.map((char) => ({
      title: char.name,
      description: `${ELEMENTS[char.element] || char.element} • ${char.rarity}★`,
      choices: ['S', 'A', 'B', 'C', 'D'],
      required: true,
    }));

    // Write to scripts/form-questions.json
    const outputPath = join(process.cwd(), 'scripts', 'form-questions.json');
    writeFileSync(outputPath, JSON.stringify(questions, null, 2));

    console.log(`✅ Generated ${questions.length} form questions`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`\nTo use in Google Forms:`);
    console.log(`1. Open your Google Form`);
    console.log(`2. Go to Tools → Script Editor`);
    console.log(`3. Copy contents from scripts/google-form-importer.gs`);
    console.log(`4. Run addQuestionsFromJSON() function`);
  } catch (error) {
    console.error('❌ Error generating form questions:', error);
    process.exit(1);
  }
}

generateFormQuestions();
