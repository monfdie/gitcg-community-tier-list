/**
 * Google Apps Script для добавления вопросов в Google Form
 * 
 * Инструкция:
 * 1. Откройте вашу Google Form в браузере
 * 2. Нажмите на три точки → Скрипты Apps
 * 3. Скопируйте этот код в редактор скриптов
 * 4. Измените QUESTIONS_URL на URL к файлу form-questions.json из репозитория
 * 5. Выберите функцию addQuestionsFromJSON и нажмите "Выполнить"
 * 
 * URL файла можно получить, если выложить form-questions.json в GitHub:
 * https://raw.githubusercontent.com/aurceive/20260328-gi-community-tier-list/main/scripts/form-questions.json
 */

// Замените на ваш URL файла с вопросами
const QUESTIONS_URL = 'https://raw.githubusercontent.com/aurceive/20260328-gi-community-tier-list/main/scripts/form-questions.json';

/**
 * Загружает вопросы из JSON файла и добавляет их в форму
 */
function addQuestionsFromJSON() {
  try {
    // Загружаем JSON с вопросами
    const response = UrlFetchApp.fetch(QUESTIONS_URL, { muteHttpExceptions: true });
    
    if (response.getResponseCode() !== 200) {
      Logger.log('❌ Ошибка загрузки файла. Статус: ' + response.getResponseCode());
      Logger.log('URL: ' + QUESTIONS_URL);
      return;
    }
    
    const questions = JSON.parse(response.getContentText());
    const form = FormApp.getActiveForm();
    
    Logger.log('📝 Начинаем добавлять ' + questions.length + ' вопросов...');
    
    // Добавляем каждый вопрос в форму
    questions.forEach((q, index) => {
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
        
        Logger.log('✅ ' + (index + 1) + '. ' + q.title + ' добавлен');
      } catch (error) {
        Logger.log('⚠️ Ошибка при добавлении вопроса "' + q.title + '": ' + error);
      }
    });
    
    Logger.log('✨ Готово! Все ' + questions.length + ' вопросов добавлены в форму');
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
}
