/**
 * Google Apps Script для добавления вопросов в Google Form
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
const FORM_QUESTIONS = [
  { "title": "Albedo", "description": "⛰️ Geo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Alhaitham", "description": "🌱 Dendro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Arataki Itto", "description": "⛰️ Geo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Arlecchino", "description": "🔥 Pyro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Baizhu", "description": "🌱 Dendro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Chasca", "description": "🌪️ Anemo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Chiori", "description": "⛰️ Geo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Citlali", "description": "❄️ Cryo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Clorinde", "description": "⚡ Electro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Columbina", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Cyno", "description": "⚡ Electro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Dehya", "description": "🔥 Pyro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Diluc", "description": "🔥 Pyro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Durin", "description": "🔥 Pyro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Emilie", "description": "🌱 Dendro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Escoffier", "description": "❄️ Cryo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Eula", "description": "❄️ Cryo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Flins", "description": "⚡ Electro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Furina", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Ganyu", "description": "❄️ Cryo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Hu Tao", "description": "🔥 Pyro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Ineffa", "description": "⚡ Electro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Jean", "description": "🌪️ Anemo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Kaedehara Kazuha", "description": "🌪️ Anemo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Kamisato Ayaka", "description": "❄️ Cryo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Kamisato Ayato", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Keqing", "description": "⚡ Electro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Kinich", "description": "🌱 Dendro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Klee", "description": "🔥 Pyro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Lauma", "description": "🌱 Dendro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Linnea", "description": "⛰️ Geo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Lyney", "description": "🔥 Pyro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Mavuika", "description": "🔥 Pyro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Mona", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Mualani", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Nahida", "description": "🌱 Dendro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Navia", "description": "⛰️ Geo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Nefer", "description": "🌱 Dendro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Neuvillette", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Nilou", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Qiqi", "description": "❄️ Cryo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Raiden Shogun", "description": "⚡ Electro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Sangonomiya Kokomi", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Shenhe", "description": "❄️ Cryo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Sigewinne", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Skirk", "description": "❄️ Cryo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Tartaglia", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Tighnari", "description": "🌱 Dendro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Traveler (Anemo)", "description": "🌪️ Anemo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Traveler (Cryo)", "description": "❄️ Cryo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Traveler (Dendro)", "description": "🌱 Dendro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Traveler (Electro)", "description": "⚡ Electro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Traveler (Geo)", "description": "⛰️ Geo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Traveler (Hydro)", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Traveler (Pyro)", "description": "🔥 Pyro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Varesa", "description": "⚡ Electro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Varka", "description": "🌪️ Anemo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Venti", "description": "🌪️ Anemo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Wanderer", "description": "🌪️ Anemo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Wriothesley", "description": "❄️ Cryo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Xianyun", "description": "🌪️ Anemo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Xiao", "description": "🌪️ Anemo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Xilonen", "description": "⛰️ Geo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Yae Miko", "description": "⚡ Electro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Yelan", "description": "💧 Hydro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Yoimiya", "description": "🔥 Pyro • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Yumemizuki Mizuki", "description": "🌪️ Anemo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Zhongli", "description": "⛰️ Geo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Zibai", "description": "⛰️ Geo • 5★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Aino", "description": "💧 Hydro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Aloy", "description": "❄️ Cryo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Amber", "description": "🔥 Pyro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Barbara", "description": "💧 Hydro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Beidou", "description": "⚡ Electro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Bennett", "description": "🔥 Pyro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Candace", "description": "💧 Hydro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Charlotte", "description": "❄️ Cryo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Chevreuse", "description": "🔥 Pyro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Chongyun", "description": "❄️ Cryo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Collei", "description": "🌱 Dendro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Dahlia", "description": "💧 Hydro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Diona", "description": "❄️ Cryo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Dori", "description": "⚡ Electro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Faruzan", "description": "🌪️ Anemo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Fischl", "description": "⚡ Electro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Freminet", "description": "❄️ Cryo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Gaming", "description": "🔥 Pyro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Gorou", "description": "⛰️ Geo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Iansan", "description": "⚡ Electro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Ifa", "description": "🌪️ Anemo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Illuga", "description": "⛰️ Geo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Jahoda", "description": "🌪️ Anemo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Kachina", "description": "⛰️ Geo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Kaeya", "description": "❄️ Cryo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Kaveh", "description": "🌱 Dendro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Kirara", "description": "🌱 Dendro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Kujou Sara", "description": "⚡ Electro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Kuki Shinobu", "description": "⚡ Electro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Lan Yan", "description": "🌪️ Anemo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Layla", "description": "❄️ Cryo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Lisa", "description": "⚡ Electro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Lynette", "description": "🌪️ Anemo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Mika", "description": "❄️ Cryo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Ningguang", "description": "⛰️ Geo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Noelle", "description": "⛰️ Geo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Ororon", "description": "⚡ Electro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Razor", "description": "⚡ Electro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Rosaria", "description": "❄️ Cryo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Sayu", "description": "🌪️ Anemo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Sethos", "description": "⚡ Electro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Shikanoin Heizou", "description": "🌪️ Anemo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Sucrose", "description": "🌪️ Anemo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Thoma", "description": "🔥 Pyro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Xiangling", "description": "🔥 Pyro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Xingqiu", "description": "💧 Hydro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Xinyan", "description": "🔥 Pyro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Yanfei", "description": "🔥 Pyro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Yaoyao", "description": "🌱 Dendro • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true },
  { "title": "Yun Jin", "description": "⛰️ Geo • 4★", "choices": ["S", "A", "B", "C", "D"], "required": true }
];

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
}
