# 📋 Scripts Directory

Утилиты для управления данными и генерирования конфигураций формы.

## 📂 Файлы

### Source Files (отслеживаются в git)
- **fetch-characters.ts** — Загружает персонажей из API, валидирует их, показывает отчет
- **fetch-avatars.ts** — Загружает аватары персонажей из API в temp папку
- **generate-form-questions.ts** — Генерирует вопросы для формы И Google Apps Script
- **README.md** — Эта документация

### Generated Files (НЕ отслеживаются в git)
- **form-questions.json** — Вопросы в JSON формате (артефакт генерации)
- **characters-full.json** — Полный список символов из API (артефакт)
- **google-form-importer.gs** — Google Apps Script для форм (⚠️ АВТОГЕНЕРИРУЕТСЯ)

### Temporary Files (корневой /tmp/ НЕ отслеживается)
- **/tmp/avatars/** — Загруженные аватары персонажей (для обзора и выбора)

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

### 2️⃣ Загрузить аватары персонажей

```bash
npm run scripts:fetch-avatars
```

Это:
- Загружает иконки из Lunaris API (используя avatarId из characters.json)
- Сохраняет в `/tmp/avatars/` (не коммитится)
- Показывает статистику загрузки

**Результат:**
- Временная папка с аватарами для обзора
- Готовы к использованию в production

### 3️⃣ Обновить characters.json

Скопируйте персонажей из `scripts/characters-full.json` в `public/data/characters.json`:

```bash
# После редактирования, проверьте данные новой загрузкой:
npm run scripts:fetch-characters
```

### 4️⃣ Сгенерировать Google Apps Script (Checkbox Grid)

```bash
npm run scripts:generate-form-questions
```

**Генерирует:**
- ✅ `scripts/google-form-importer.gs` — Google Apps Script (АВТОГЕНЕРИРУЕТСЯ)

## 🖼️ Avatar Management

### Downloading Avatars

```bash
npm run scripts:fetch-avatars
```

Скрипт:
1. Читает список персонажей из `public/data/characters.json` (включая `avatarId`)
2. Загружает иконки из Lunaris API используя avatarId
3. Сохраняет в `/tmp/avatars/` для обзора
4. Показывает статистику

### Using Downloaded Avatars

После загрузки:
1. Откройте `/tmp/avatars/` и посмотрите иконки
2. Скопируйте нужные в `public/assets/avatars/`
3. (Опционально) Обновите `public/data/characters.json` с `imageUrl`
4. Используйте в компонентах

## 🔌 Google Form Integration

### Структура формы

Форма использует **один вопрос типа Checkbox Grid**:
- **Строки** = 118 персонажей (Путешественники: "Traveler (Anemo)", "Traveler (Geo)" и т.д.)
- **Столбцы** = S / A / B / C / D

Каждая строка сетки имеет свой `entry.XXXXXXX` ID — формат pre-fill URL не изменился.

### Шаг за шагом

1. Сгенерируйте скрипт:
   ```bash
   npm run scripts:generate-form-questions
   ```
2. Откройте вашу **Google Form** → **три точки** (⋮) → **Редактор скриптов**
3. **Удалите** весь текущий код, **вставьте** `scripts/google-form-importer.gs`
4. Сохраните (Ctrl+S) и **авторизируйте** скрипт при первом запуске
5. Запустите **`clearAllQuestions()`** — удалит старые вопросы
6. Запустите **`addCheckboxGridToForm()`** — создаст Checkbox Grid с 118 строками
7. Запустите **`exportFormMapping()`** — выведет JSON в логах (View → Logs)
8. Скопируйте JSON из логов → `public/form-character-mapping.json`
9. Закоммитьте обновлённый `form-character-mapping.json`

**Готово! ✨** Форма пересоздана и SPA готов к работе с новой структурой.

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

1. Синхронизируйте персонажей:
   ```bash
   npm run scripts:fetch-characters
   ```
2. Обновите `public/data/characters.json` (если нужно)
3. Пересгенерируйте GAS скрипт:
   ```bash
   npm run scripts:generate-form-questions
   ```
4. В Google Form: Редактор скриптов
5. Запустите `clearAllQuestions()` — удалит старую сетку
6. Вставьте новый `scripts/google-form-importer.gs`
7. Запустите `addCheckboxGridToForm()` — создаст новую сетку
8. Запустите `exportFormMapping()` — выведет новые entry IDs
9. Скопируйте JSON → `public/form-character-mapping.json` и закоммитьте

---

## ⚠️ Important Notes

- **characters-full.json** и **google-form-importer.gs** не коммитятся в git (артефакты)
- **public/data/characters.json** — source of truth для production
- **public/form-character-mapping.json** — обновляется после каждого пересоздания формы
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
