/**
 * Script to generate Google Form questions and Google Apps Script from characters.json
 * 
 * Usage:
 * npm run scripts:generate-form-questions
 * 
 * Outputs:
 * - scripts/form-questions.json (questions in JSON format)
 * - scripts/google-form-importer.gs (Google Apps Script with embedded questions)
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
    const questionsPath = join(process.cwd(), 'scripts', 'form-questions.json');
    writeFileSync(questionsPath, JSON.stringify(questions, null, 2));

    // Generate Google Apps Script with embedded questions
    const gsScript = generateGoogleAppsScript(questions);
    const gsPath = join(process.cwd(), 'scripts', 'google-form-importer.gs');
    writeFileSync(gsPath, gsScript);

    console.log(`✅ Generated ${questions.length} form questions`);
    console.log(`📁 Output:`);
    console.log(`   - ${questionsPath} (JSON questions)`);
    console.log(`   - ${gsPath} (Google Apps Script)`);
    console.log(`\nTo use in Google Forms:`);
    console.log(`1. Open your Google Form`);
    console.log(`2. Go to Tools → Script Editor`);
    console.log(`3. Copy entire contents from scripts/google-form-importer.gs`);
    console.log(`4. Click Run button and select addQuestionsToForm function`);
  } catch (error) {
    console.error('❌ Error generating form questions:', error);
    process.exit(1);
  }
}

function generateGoogleAppsScript(questions: FormQuestion[]): string {
  // Escape quotes for JavaScript string
  const questionsJson = JSON.stringify(questions);
  
  return `/**
 * Google Apps Script для добавления вопросов в Google Form
 * АВТОМАТИЧЕСКИ СГЕНЕРИРОВАН - НЕ РЕДАКТИРУЙТЕ ВРУЧНУЮ
 * Пересгенерируйте используя: npm run scripts:generate-form-questions
 * 
 * USAGE:
 * 1. Откройте вашу Google Form в браузере
 * 2. Нажмите на три точки → Скрипты (Tools → Script editor)
 * 3. Скопируйте весь код этого файла
 * 4. Вставьте в Google Apps Script редактор
 * 5. Выберите функцию "addQuestionsToForm" и нажмите "Run"
 * 6. Авторизируйте скрипт (первый запуск)
 * 7. Проверьте логи (View → Logs) для статуса
 * 
 * Вопросы встроены прямо в этот скрипт, не требуется внешних файлов.
 */

// QUESTIONS DATA - встроено прямо в скрипт
const FORM_QUESTIONS = ${questionsJson};

/**
 * Добавляет вопросы в форму из встроенных данных
 */
function addQuestionsToForm() {
  try {
    const form = FormApp.getActiveForm();
    
    if (!FORM_QUESTIONS || FORM_QUESTIONS.length === 0) {
      Logger.log('❌ No questions found in FORM_QUESTIONS');
      return;
    }

    Logger.log('📝 Начинаем добавлять ' + FORM_QUESTIONS.length + ' вопросов...');
    
    // Добавляем каждый вопрос в форму
    FORM_QUESTIONS.forEach((q, index) => {
      try {
        // Создаем раскрывающийся список (dropdown)
        const item = form.addMultipleChoiceItem();
        item.setTitle(q.title);
        
        // Добавляем описание (элемент и редкость)
        if (q.description) {
          item.setHelpText(q.description);
        }
        
        // Добавляем варианты ответов
        item.setChoiceValues(q.choices);
        
        // Делаем обязательным если требуется
        if (q.required) {
          item.setRequired(true);
        }
        
        if ((index + 1) % 20 === 0) {
          Logger.log('✅ ' + (index + 1) + '/' + FORM_QUESTIONS.length + ' вопросов добавлено');
        }
      } catch (error) {
        Logger.log('⚠️ Ошибка при добавлении вопроса "' + q.title + '": ' + error);
      }
    });
    
    Logger.log('✨ Готово! Все ' + FORM_QUESTIONS.length + ' вопросов добавлены в форму');
  } catch (error) {
    Logger.log('❌ Критическая ошибка: ' + error);
  }
}

/**
 * Удаляет все вопросы из формы (для переделки)
 * ОСТОРОЖНО: это удалит все вопросы!
 */
function clearAllQuestions() {
  const form = FormApp.getActiveForm();
  const items = form.getItems();
  
  Logger.log('⚠️ Удаляем ' + items.length + ' вопросов...');
  
  // Удаляем в обратном порядке, чтобы избежать проблем с индексами
  for (let i = items.length - 1; i >= 0; i--) {
    form.deleteItem(i);
  }
  
  Logger.log('✅ Все вопросы удалены');
}`;
}

generateFormQuestions();
