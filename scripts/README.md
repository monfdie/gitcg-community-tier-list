# 📋 Google Form Questions Import Guide

Это руководство поможет вам добавить вопросы для рейтинга персонажей в вашу Google Form.

## 📂 Файлы в этой папке

- **form-questions.json** — Файл с вопросами для импорта (генерируется автоматически)
- **google-form-importer.gs** — Google Apps Script для добавления вопросов в форму
- **generate-form-questions.ts** — Скрипт для генерирования questions.json из characters.json

## 🚀 Быстрый старт

### Шаг 1: Подготовить файл с вопросами

```bash
npm run scripts:generate-form-questions
```

Это создаст/обновит `form-questions.json` с текущим списком персонажей.

### Шаг 2: Загрузить файл на GitHub (для доступа скрипту)

Убедитесь, что файл `scripts/form-questions.json` есть в вашем GitHub репозитории на ветке `main`.

### Шаг 3: Добавить скрипт в Google Form

1. Откройте вашу **Google Form** в браузере
2. Нажмите на **три точки** (⋮) → **Скрипты** (или **Tools** → **Script editor**)
3. Скопируйте содержимое файла **google-form-importer.gs**
4. Вставьте в редактор Google Apps Script
5. Замените `QUESTIONS_URL` на URL вашего файла:

```javascript
const QUESTIONS_URL = 'https://raw.githubusercontent.com/aurceive/20260328-gi-community-tier-list/main/scripts/form-questions.json';
```

### Шаг 4: Запустить скрипт

1. Выберите функцию **`addQuestionsFromJSON`** в выпадающем меню
2. Нажмите **Run** (▶)
3. Разрешите доступ скрипту (первый запуск)
4. Проверьте логи (внизу консоли)

### ✅ Готово!

Все вопросы должны появиться в вашей форме.

---

## 🔄 Обновление вопросов

Если вы добавили новых персонажей в `public/data/characters.json`:

```bash
npm run scripts:generate-form-questions
```

Затем снова запустите скрипт `addQuestionsFromJSON()` в Google Form.

---

## ⚠️ Важно

- **Очистка формы**: Если нужно удалить старые вопросы, используйте функцию **`clearAllQuestions()`**
- **Резервная копия**: Перед импортом создайте копию вашей формы
- **Доступность**: Убедитесь, что URL файла `form-questions.json` доступен по HTTPS

---

## 📊 Структура form-questions.json

```json
[
  {
    "title": "Название персонажа",
    "description": "Элемент • Редкость",
    "choices": ["S", "A", "B", "C", "D"],
    "required": true
  }
]
```

Каждый вопрос — это выпадающий список (multiple choice) с вариантами ответов S, A, B, C, D.

---

## 🐛 Troubleshooting

**Проблема**: Скрипт не может загрузить файл
- Проверьте URL в `QUESTIONS_URL`
- Убедитесь, что файл есть в GitHub репозитории
- Используйте `raw.githubusercontent.com` а не обычный GitHub URL

**Проблема**: Вопросы не добавляются
- Проверьте логи (View → Logs)
- Убедитесь, что Google Form имеет правильные прав доступа

**Проблема**: Форма уже содержит вопросы
- Используйте `clearAllQuestions()` для удаления старых вопросов перед импортом

---

## 📞 Поддержка

Если у вас есть вопросы, обратитесь к документации проекта в `docs/`.
