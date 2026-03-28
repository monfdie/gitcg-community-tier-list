# 📋 Scripts Directory

Утилиты для управления данными и генерирования конфигураций формы.

## 📂 Файлы

- **fetch-characters.ts** — Загружает полный список персонажей из API
- **validate-characters.ts** — Проверяет целостность данных персонажей
- **generate-form-questions.ts** — Генерирует вопросы для Google Form из characters.json (вспомогательный)
- **google-form-importer.gs** — Google Apps Script для добавления вопросов в форму (со встроенными вопросами)
- **form-questions.json** — Артефакт генерации (не отслеживается в git)
- **characters-full.json** — Артефакт загрузки (не отслеживается в git)

---

## 🚀 Основной Workflow

### 1️⃣ Получить полный список персонажей

```bash
npm run scripts:fetch-characters
```

Это загрузит персонажей из API и сохранит в `scripts/characters-full.json` (не коммитится).

**Результат:**
- Валидирует данные
- Сортирует по редкости и имени
- Показывает статистику по элементам

### 2️⃣ Валидировать данные

```bash
npm run scripts:validate-characters
```

Проверяет `public/data/characters.json` на:
- Обязательные поля
- Корректные значения
- Отсутствие дубликатов
- Правильное форматирование

### 3️⃣ Обновить characters.json

Скопируйте нужных персонажей из `scripts/characters-full.json` в `public/data/characters.json`:

```bash
# После редактирования, валидируйте:
npm run scripts:validate-characters
```

### 4️⃣ Сгенерировать вопросы для Google Form (опционально)

```bash
npm run scripts:generate-form-questions
```

**Примечание**: Вопросы уже встроены в `google-form-importer.gs`, поэтому этот шаг нужен только если вы:
- Обновили список персонажей
- Хотите посмотреть JSON структуру вопросов
- Нужно синхронизировать данные

---

## 🔌 Google Form Integration (Быстрый способ)

### Подготовка

Откройте вашу **Google Form** и добавьте вопросы.

### Шаг за шагом

1. Откройте вашу **Google Form** в браузере
2. Перейдите в **Tools → Script editor** (или три точки → Скрипты)
3. **Скопируйте весь код** из `scripts/google-form-importer.gs`
4. **Вставьте** в Google Apps Script редактор
5. **Выберите функцию** `addQuestionsToForm` в выпадающем меню
6. **Нажмите "Run"** (▶️ кнопка)
7. **Авторизируйте скрипт** (первый запуск)
8. **Проверьте логи** (View → Logs) для статуса

### Результат

Все 118 вопросов добавятся в вашу форму за несколько секунд!

**Готово! ✨** Форма заполнена и готова к публикации.

---

## 📊 Структура данных

### Character Interface

```typescript
interface Character {
  id: string;           // lowercase, no spaces (e.g., "raiden-shogun")
  name: string;         // Display name (e.g., "Raiden Shogun")
  element: string;      // pyro, hydro, electro, cryo, anemo, geo, dendro
  rarity: 4 | 5;        // 4-star or 5-star
  imageUrl?: string;    // Optional: local or remote image URL
}
```

### Form Question Structure

```json
{
  "title": "Character Name",
  "description": "Element • Rarity",
  "choices": ["S", "A", "B", "C", "D"],
  "required": true
}
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Override default API URL
CHARACTER_API_URL=https://your-api.com/characters.json npm run scripts:fetch-characters
```

### API Compatibility

Скрипты поддерживают разные форматы API ответов:
- `[{ ... }]` — прямой массив
- `{ items: [...] }` — объект с полем items
- `{ data: [...] }` — объект с полем data
- `{ 10000002: {...}, 10000003: {...} }` — объект с ключами (Lunaris API)

---

## ⚠️ Important Notes

- **form-questions.json** и **characters-full.json** не коммитятся в git (артефакты)
- **public/data/characters.json** — это source of truth для production
- **google-form-importer.gs** содержит встроенные вопросы (не требует внешних URL)
- Все скрипты работают только в dev environment
- Google Apps Script требует авторизации при первом запуске

---

## 🐛 Troubleshooting

**Проблема**: "Cannot fetch characters from API"
- Проверьте URL в `CHARACTER_API_URL` или коде скрипта
- Убедитесь, что API доступен и возвращает JSON

**Проблема**: "Invalid element" ошибки при валидации
- Проверьте орфографию элементов (должны быть lowercase)
- Допустимые: pyro, hydro, electro, cryo, anemo, geo, dendro

**Проблема**: "Duplicate id"
- Убедитесь, что у каждого персонажа уникальный id
- ID должен быть lowercase и без пробелов

**Проблема**: Google Form скрипт не добавляет вопросы
- Проверьте логи в Script Editor (View → Logs)
- Убедитесь, что выбрали функцию **addQuestionsToForm**
- Авторизируйте скрипт, если запрашивает доступ

**Проблема**: Authorization error при запуске скрипта
- Это нормально при первом запуске
- Нажмите "Review permissions"
- Выберите свой Google аккаунт
- Нажмите "Allow" для разрешений

---

## 📖 Related Documentation

- **AGENTS.md** — Developer guidelines
- **docs/ARCHITECTURE.md** — System architecture
- **README.md** — Project overview
