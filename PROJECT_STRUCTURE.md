# Project Structure Guide

This document describes the repository organization and purpose of each directory and file.

## Directory Tree

```
20260328-public-gi-tier-list/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD pipeline
├── docs/                           # Documentation files
│   ├── GOOGLE_FORM_SETUP.md        # Guide for Google Form configuration
│   ├── ARCHITECTURE.md             # Architecture decision records
│   └── API_REFERENCE.md            # Component & utility API docs
├── public/
│   ├── index.html                  # HTML entry point
│   ├── manifest.json               # PWA manifest (if applicable)
│   └── data/
│       └── characters.json         # Static character list (production)
├── src/
│   ├── main.tsx                    # React app entry point
│   ├── index.css                   # Global styles
│   ├── App.tsx                     # Root component
│   ├── types.ts                    # TypeScript interfaces & types
│   ├── config.ts                   # Constants & configuration
│   ├── components/
│   │   ├── Navbar.tsx              # Header with login button
│   │   ├── TierList.tsx            # Main tier list container
│   │   ├── TierRow.tsx             # Individual tier row
│   │   ├── CharacterItem.tsx       # Draggable character card
│   │   ├── UnassignedPool.tsx      # Pool of unassigned characters
│   │   ├── SubmitButton.tsx        # Form submission button
│   │   └── __tests__/              # Component tests
│   ├── hooks/
│   │   ├── useGoogleAuth.ts        # Google OAuth logic
│   │   ├── useTierListState.ts     # Tier list state management
│   │   ├── useGoogleFormSubmit.ts  # Form submission logic
│   │   └── __tests__/              # Hook tests
│   ├── utils/
│   │   ├── characterLoader.ts      # Load & parse character data
│   │   ├── googleFormEncoder.ts    # Encode tier list for Google Form
│   │   ├── localStorage.ts         # localStorage utilities
│   │   ├── validation.ts           # Tier list validation
│   │   └── __tests__/              # Utility tests
│   ├── lib/
│   │   └── googleOAuth.ts          # Google OAuth configuration & helpers
│   └── styles/
│       ├── tierList.module.css     # Tier list styles
│       ├── dragdrop.module.css     # Drag-drop styles
│       ├── responsive.module.css   # Responsive design styles
│       └── variables.css           # CSS variables (colors, spacing)
├── tests/
│   ├── setup.ts                    # Test configuration
│   └── mocks/
│       ├── characterData.ts        # Mock character data
│       └── googleForms.ts          # Mock Google Forms API
├── scripts/
│   ├── fetch-characters.ts         # Dev: Download characters from API
│   └── validate-characters.ts      # Validate character data integrity
├── .env.example                    # Environment variables template
├── .eslintrc.cjs                   # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── package.json                    # Project dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── vitest.config.ts                # Vitest configuration
├── AGENTS.md                       # Contributor guidelines
├── README.md                       # Project overview & setup
├── LICENSE                         # MIT License
└── .gitignore                      # Git ignore rules
```

## File Descriptions

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Project metadata, dependencies, npm scripts |
| `tsconfig.json` | TypeScript compiler options (strict mode enabled) |
| `vite.config.ts` | Vite bundler configuration |
| `vitest.config.ts` | Vitest test runner configuration |
| `.eslintrc.cjs` | ESLint rules and plugins |
| `.prettierrc` | Code formatting rules |
| `.env.example` | Template for environment variables |
| `.gitignore` | Files to exclude from git |

### Source Code (`src/`)

#### `main.tsx`
Application entry point. Renders the React app into the DOM.

#### `App.tsx`
Root component. Handles layout, routing (if needed), and main state initialization.

#### `types.ts`
Central TypeScript definitions:
```typescript
interface Character { }
interface TierAssignment { }
interface TierListState { }
interface UserProfile { }
interface FormSubmissionPayload { }
```

#### `config.ts`
Application constants and configuration:
```typescript
export const TIERS = ['S', 'A', 'B', 'C', 'D'];
export const GOOGLE_FORM_ID = process.env.VITE_GOOGLE_FORM_ID;
export const CHARACTER_DATA_URL = '/data/characters.json';
```

### Components (`src/components/`)

Each component is a functional React component with:
- Props interface defined
- TypeScript types
- Local CSS module
- Unit tests in `__tests__/` subfolder

**Example component structure:**
```
CharacterItem.tsx         # Component logic
CharacterItem.module.css  # Component styles
__tests__/
  CharacterItem.test.tsx  # Component tests
```

### Custom Hooks (`src/hooks/`)

Custom hooks abstract logic from components:

- **`useGoogleAuth.ts`** - Google OAuth flow (login, token refresh, logout)
- **`useTierListState.ts`** - Tier list state (CRUD operations)
- **`useGoogleFormSubmit.ts`** - Form submission (POST to Google Form)

Each hook includes error handling and optional dependencies.

### Utilities (`src/utils/`)

Pure utility functions with no side effects:

- **`characterLoader.ts`** - Load and parse character JSON
- **`googleFormEncoder.ts`** - Convert tier list to form submission format
- **`localStorage.ts`** - Save/load state from browser storage
- **`validation.ts`** - Validate tier list completeness and integrity

Each utility has 100% test coverage.

### Styles (`src/styles/`)

CSS Modules for scoped styling:

- **`tierList.module.css`** - Tier list layout and tier rows
- **`dragdrop.module.css`** - Drag-and-drop feedback styles
- **`responsive.module.css`** - Media queries and responsive breakpoints
- **`variables.css`** - CSS custom properties (colors, spacing, fonts)

### Public Assets (`public/`)

Static files served by Vite:

- **`index.html`** - HTML template
- **`data/characters.json`** - Static character list (bundled in production)

No external character data dependency in production.

### Testing (`tests/`)

Test infrastructure and mocks:

- **`setup.ts`** - Vitest configuration and global test utilities
- **`mocks/`** - Mock data and API responses for testing

Test files are colocated with source (`__tests__/` folders).

### Development Scripts (`scripts/`)

Utilities for development workflow:

- **`fetch-characters.ts`** - Download character list from external API
- **`validate-characters.ts`** - Verify character data integrity

Run with: `npm run scripts:fetch-characters`

### Documentation (`docs/`)

Supplementary documentation:

- **`GOOGLE_FORM_SETUP.md`** - Google Form configuration guide
- **`ARCHITECTURE.md`** - Architecture decisions and design patterns
- **`API_REFERENCE.md`** - Component and utility API documentation

### CI/CD (`.github/workflows/`)

GitHub Actions automation:

- **`deploy.yml`** - Build, test, and deploy pipeline
  - Runs on every push to main
  - Runs tests and linter
  - Builds with Vite
  - Deploys to GitHub Pages

---

## Naming Conventions

### Files & Folders

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `TierRow.tsx`, `CharacterItem.tsx` |
| Hooks | camelCase, `use` prefix | `useGoogleAuth.ts` |
| Utilities | camelCase | `characterLoader.ts` |
| Styles | kebab-case or matching component | `tierList.module.css` |
| Tests | source name + `.test.ts` | `characterLoader.test.ts` |
| Folders | kebab-case (multi-word) | `dragdrop.module.css` |

### Code

- **Classes**: PascalCase (rarely used)
- **Functions**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Boolean functions**: `is*`, `should*`, `has*` prefix
- **Private variables**: `_prefix` (rarely needed in modern React)

---

## Module Imports

Use absolute imports with `@/` alias (configured in `tsconfig.json` and `vite.config.ts`):

```typescript
// ✅ Good
import { TierList } from '@/components/TierList';
import { useTierListState } from '@/hooks/useTierListState';
import { loadCharacters } from '@/utils/characterLoader';

// ❌ Avoid
import { TierList } from '../../../components/TierList';
```

---

## Environment Variables

See `.env.example` for all variables:

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client ID | Yes |
| `VITE_GOOGLE_FORM_ID` | Google Form ID for submissions | Yes |
| `VITE_API_CHARACTER_LIST` | Dev: External character API URL | No |

---

## Build Output

Production build outputs to `dist/`:

```
dist/
├── index.html          # Bundled HTML
├── assets/
│   ├── index.*.js      # Bundled JavaScript
│   └── index.*.css     # Bundled CSS
└── data/
    └── characters.json # Character data (bundled)
```

Deployed to GitHub Pages by GitHub Actions.

---

## Key Principles

1. **Modularity**: Each component/hook has single responsibility
2. **Type Safety**: 100% TypeScript coverage with strict mode
3. **Testing**: Utilities tested first, then hooks, then components
4. **Performance**: Minimize dependencies, lazy load where possible
5. **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels
6. **Maintainability**: Clear naming, proper documentation, no technical debt

---

See [AGENTS.md](../AGENTS.md) for coding standards and contribution guidelines.
