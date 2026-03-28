# 📋 Scripts Directory

Утилиты для управления данными и генерирования конфигураций формы.

## 📂 Файлы

### Source Files (отслеживаются в git)
- **sync-characters.ts** — Загружает персонажей из API, валидирует их, показывает отчет
- **generate-form-questions.ts** — Генерирует вопросы для формы И Google Apps Script
- **README.md** — Эта документация

### Generated Files (НЕ отслеживаются в git)
- **form-questions.json** — Вопросы в JSON формате (артефакт генерации)
- **characters-full.json** — Полный список символов из API (артефакт)
- **google-form-importer.gs** — Google Apps Script для форм (⚠️ АВТОГЕНЕРИРУЕТСЯ)

---

## 🚀 Основной Workflow

### 1️⃣ Синхронизировать персонажей (fetch + validate в одном)

```bash
npm run scripts:fetch-characters
```

Это один скрипт который:
- Загружает персонажей из API
- Валидирует структуру данных
- Показывает подробный отчет
- Сохраняет в `scripts/characters-full.json` (не коммитится)

**Результат:**
- Полная валидация во время загрузки
- Статистика по редкости и элементам
- Готовые к использованию данные

### 2️⃣ Обновить characters.json

Скопируйте персонажей из `scripts/characters-full.json` в `public/data/characters.json`:

```bash
# После редактирования, проверьте данные новой загрузкой:
npm run scripts:fetch-characters
```

### 3️⃣ Сгенерировать вопросы и Google Apps Script

```bash
npm run scripts:generate-form-questions
```

**Генерирует:**
- ✅ `scripts/form-questions.json` — Все вопросы в JSON
- ✅ `scripts/google-form-importer.gs` — Google Apps Script (АВТОГЕНЕРИРУЕТСЯ)

## 🔌 Google Form Integration (Быстрый способ)

### Подготовка

1. Убедитесь, что вы запустили генерацию скрипта:

```bash
npm run scripts:generate-form-questions
```

Это создаст `scripts/google-form-importer.gs` с актуальными вопросами.

### Шаг за шагом

1. Откройте вашу **Google Form** в браузере
2. Нажмите на **три точки** (⋮) → **Скрипты** (или Tools → Script editor)
3. **Удалите весь текущий код** в редакторе
4. **Скопируйте весь файл** `scripts/google-form-importer.gs`
5. **Вставьте** его полностью в Google Apps Script редактор
6. **Сохраните** скрипт (Ctrl+S / Cmd+S)
7. В выпадающем меню выберите функцию **`addQuestionsToForm`**
8. **Нажмите "Run"** (▶️ кнопка)
9. **Авторизируйте скрипт** (первый запуск, нужно разрешить доступ)
10. **Проверьте логи** (View → Logs) для статуса

### Результат

Все 118+ вопросов добавятся в вашу форму за несколько секунд!

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

---

## 🔧 Обслуживание

### Как обновить вопросы в форме, если изменились персонажи

1. Запустите синхронизацию:
   ```bash
   npm run scripts:fetch-characters
   ```
2. Обновите `public/data/characters.json` (если нужно)
3. Переган форму-скрипты:
   ```bash
   npm run scripts:generate-form-questions
   ```
4. В Google Form: Tools → Script editor
5. Запустите `clearAllQuestions()` чтобы удалить старые вопросы
6. Копируйте новый `scripts/google-form-importer.gs`
7. Запустите `addQuestionsToForm()` чтобы добавить новые

---

## ⚠️ Important Notes

- **form-questions.json**, **characters-full.json**, и **google-form-importer.gs** не коммитятся в git (артефакты)
- **public/data/characters.json** — это source of truth для production
- Всегда переган форму-скрипты после изменения списка персонажей
- Google Apps Script требует авторизации при первом запуске
- Все dev скрипты работают только локально (Node.js environment)

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
