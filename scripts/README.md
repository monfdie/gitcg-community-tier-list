# 📋 Scripts Directory

Утилиты для управления данными и генерирования конфигураций формы.

## 📂 Файлы

- **fetch-characters.ts** — Загружает полный список персонажей из API
- **validate-characters.ts** — Проверяет целостность данных персонажей
- **generate-form-questions.ts** — Генерирует вопросы для Google Form из characters.json
- **google-form-importer.gs** — Google Apps Script для добавления вопросов в форму
- **form-questions.json** — Артефакт генерации (не отслеживается в git)
- **characters-full.json** — Артефакт загрузки (не отслеживается в git)

---

## 🚀 Workflow

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

### 4️⃣ Сгенерировать вопросы для Google Form

```bash
npm run scripts:generate-form-questions
```

Это создаст `scripts/form-questions.json` из текущего `public/data/characters.json`.

---

## 🔌 Google Form Integration

### Подготовка

1. Запустите скрипты с шага 3️⃣
2. Откройте вашу **Google Form**
3. Перейдите в **Tools → Script editor**
4. Скопируйте содержимое `google-form-importer.gs`

### Конфигурация скрипта

Измените `QUESTIONS_URL` на путь к вашему файлу:

```javascript
const QUESTIONS_URL = 'https://raw.githubusercontent.com/aurceive/20260328-gi-community-tier-list/main/scripts/form-questions.json';
```

### Запуск

1. Выберите функцию `addQuestionsFromJSON`
2. Нажмите **Run** (▶)
3. Авторизируйте скрипт (первый запуск)
4. Проверьте логи

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

---

## ⚠️ Important Notes

- **form-questions.json** и **characters-full.json** не коммитятся в git (артефакты)
- **public/data/characters.json** — это source of truth для production
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
- Убедитесь, что URL доступен через HTTPS
- Используйте raw.githubusercontent.com для GitHub файлов

---

## 📖 Related Documentation

- **AGENTS.md** — Developer guidelines
- **docs/ARCHITECTURE.md** — System architecture
- **README.md** — Project overview

