# AGENTS.md - Contributor & Maintainer Guidelines

This document outlines the structure, coding standards, and deployment workflow for the **Genshin Impact Community Tier List** project.

## Project Overview

A single-page web application that allows the Genshin Impact community to create and submit personalized tier lists through Google OAuth authentication and direct Google Form submission.

**Live Site**: https://aurceive.github.io/20260328-gi-community-tier-list/

---

## Repository Structure

```
src/
├── components/          # React components (UI building blocks)
├── hooks/              # Custom React hooks (logic abstraction)
├── utils/              # Utilities (pure functions, helpers)
├── lib/                # Libraries (wrappers, configurations)
├── styles/             # CSS modules (scoped styles)
├── types.ts            # TypeScript interfaces & types
├── config.ts           # Constants & configuration
└── main.tsx            # Entry point

public/
├── data/
│   └── characters.json # Static character list (production)
└── index.html          # HTML template

tests/
├── setup.ts            # Test configuration
├── utils/              # Utility tests
└── hooks/              # Hook tests

scripts/
├── fetch-characters.ts # Dev: Fetch from external API
└── validate-characters.ts # Validate character data integrity
```

---

## Code Standards

### TypeScript
- **Strict Mode**: Enabled (`strict: true` in tsconfig.json)
- **No `any`**: Use proper types or generics instead
- **File Extension**: Always `.ts` or `.tsx`

### React
- **Functional Components Only**: No class components
- **Hooks**: Use custom hooks to abstract logic from components
- **Props**: Define prop types with `interface Props { ... }`
- **No Inline Styles**: Use CSS modules or classes instead

### File Naming
- **Components**: PascalCase (`TierList.tsx`, `CharacterItem.tsx`)
- **Hooks**: camelCase with `use` prefix (`useGoogleAuth.ts`, `useTierListState.ts`)
- **Utils**: camelCase (`characterLoader.ts`, `googleFormEncoder.ts`)
- **Styles**: Match component name or descriptive camelCase (`tierList.module.css`)

### Imports
```typescript
// Order: 1. React, 2. Third-party libs, 3. Internal (with absolute paths), 4. Styles
import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { useTierListState } from '@/hooks/useTierListState';
import TierRow from '@/components/TierRow';

import styles from './TierList.module.css';
```

### Functions & Utilities
- Use arrow functions
- Keep functions pure (no side effects in utils)
- Prefix boolean functions with `is` or `should` (`isValidTierList`, `shouldShowError`)
- Export named functions (avoid default exports in utils)

### Comments
- Comment **why**, not **what** (code should be self-documenting)
- Use JSDoc for public utilities and hooks
- No commented-out code; use git history instead

Example:
```typescript
// ✅ Good: Explains the reasoning
// Characters must be sorted by rarity first to match API response order
const sortedCharacters = characters.sort((a, b) => b.rarity - a.rarity);

// ❌ Bad: States the obvious
// Sort characters
const sortedCharacters = characters.sort(...);
```

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test

# Lint & format
npm run lint
npm run format
```

### Committing

```bash
# Stage & commit
git add .
git commit -m "feat: add drag-drop support to tier list"
```

**Commit Message Format** (Conventional Commits):
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring (no feature/bug changes)
- `test:` Add or update tests
- `docs:` Documentation changes
- `chore:` Build, deps, or tooling (no code changes)
- `perf:` Performance improvements
- `style:` Formatting/style (no logic changes)

Examples:
- ✅ `feat: implement Google OAuth authentication`
- ✅ `fix: resolve tier list validation bug`
- ✅ `docs: update README with setup instructions`
- ❌ `update` (too vague)
- ❌ `added new feature` (not conventional format)

### Branches

- `main` - Production branch (auto-deploys to GitHub Pages)
- `feature/*` - Feature branches (e.g., `feature/google-oauth`)
- `fix/*` - Bugfix branches (e.g., `fix/form-submission`)
- `docs/*` - Documentation branches (e.g., `docs/api-reference`)

Never commit directly to `main`. Create a feature branch and submit a PR.

### Pull Requests

**Before submitting a PR:**
1. Run `npm run lint` and `npm run test` locally
2. Ensure TypeScript compiles with no errors
3. Test your changes in browser
4. Update tests if you changed logic
5. Update documentation if needed

**PR Template** (auto-filled):
```markdown
## Description
What does this PR do?

## Type
- [ ] Feature
- [ ] Bugfix
- [ ] Refactor
- [ ] Documentation

## Testing
How should reviewers test this?

## Checklist
- [ ] Tests pass locally
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Documentation updated (if needed)
```

---

## Testing Requirements

### Coverage Goals
- **Utilities**: 100% coverage (pure functions, easy to test)
- **Hooks**: 80% coverage (integration with React)
- **Components**: 60% coverage (focus on critical paths)

### Test Structure

```typescript
// Arrange - Set up test data
// Act - Execute the function/component
// Assert - Verify the result

describe('characterLoader', () => {
  it('should load and parse character JSON correctly', () => {
    // Arrange
    const mockData = [{ id: 'test', name: 'Test' }];
    
    // Act
    const result = parseCharacterData(mockData);
    
    // Assert
    expect(result).toEqual(mockData);
  });
});
```

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

---

## Performance & Best Practices

### Bundle Size
- Keep component dependencies minimal
- Lazy load non-critical components (if app grows)
- Avoid large libraries without justification

### React Performance
- Memoize components only if necessary (measure first)
- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive computations

### Accessibility (a11y)
- Semantic HTML (`<button>`, `<label>`, `<main>`, etc.)
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast >= 4.5:1 for text
- Alt text for images

### Mobile
- Touch-friendly targets (min 44x44px)
- Test on mobile browsers
- Responsive design (mobile-first)
- No hover-only interactions

---

## Google Form Integration

### Setup
1. Create a Google Form for tier list submissions
2. Get the form ID from the URL: `https://docs.google.com/forms/d/FORM_ID/viewform`
3. Update `.env.example` with the form ID

### Adding Form Fields
1. Right-click form field → Get pre-filled link
2. Copy the field parameter names
3. Update `googleFormEncoder.ts` with field mappings

### Testing Form Submission
```bash
# Post to the form manually
curl -X POST "https://docs.google.com/forms/d/FORM_ID/formResponse" \
  -d "entry.123456789=S_Tier_Value&entry.987654321=Submitted_By"
```

---

## Character Data Management

### Adding New Characters
The character list is stored in `public/data/characters.json`.

To update with the latest characters:

```bash
# Run dev script to fetch from API
npm run scripts:fetch-characters

# Validate the data
npm run scripts:validate-characters

# Commit changes
git add public/data/characters.json
git commit -m "chore: update character list to v6.5.0"
```

### Character Schema
```typescript
interface Character {
  id: string;              // Unique ID (e.g., "nahida")
  name: string;            // English name
  element: string;         // pyro, hydro, electro, cryo, anemo, geo, dendro
  rarity: number;          // 4 or 5
  imageUrl?: string;       // Optional: local image path
}
```

---

## Deployment

### Automatic Deployment
Every push to `main` triggers GitHub Actions:
1. Install dependencies
2. Run linter & tests
3. Build with Vite
4. Deploy to GitHub Pages

### Manual Deployment (if needed)
```bash
npm run build
npm run deploy
```

### Monitoring
- Check GitHub Actions for build status: https://github.com/aurceive/20260328-gi-community-tier-list/actions
- Monitor browser console for errors
- Test form submissions weekly

---

## Issue Reporting & Bug Fixes

### Reporting Issues
Include:
1. Browser & OS
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable

### Priority Levels
- **P0 (Critical)**: App won't load, OAuth broken, form doesn't submit
- **P1 (High)**: Major feature not working (e.g., drag-drop broken)
- **P2 (Medium)**: Minor bugs, UI issues
- **P3 (Low)**: Polish, nice-to-haves

---

## Release Checklist

Before tagging a release:

- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Lighthouse score > 90
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile (iOS Safari, Android Chrome)
- [ ] README updated with any new features
- [ ] Character data is latest version
- [ ] No console warnings
- [ ] No FIXME or TODO comments

```bash
# Tag release
git tag -a v1.0.0 -m "Release v1.0.0: Initial launch"
git push origin v1.0.0
```

---

## Useful Commands

```bash
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # Check TypeScript types
npm run test             # Run Vitest
npm run test:coverage    # Test coverage report
npm run scripts:fetch-characters # Download latest character list
```

---

## Environment Variables

Create `.env.local` (not committed):
```bash
VITE_GOOGLE_OAUTH_CLIENT_ID=your_oauth_client_id
VITE_GOOGLE_FORM_ID=your_google_form_id
```

See `.env.example` for all available variables.

---

## Questions or Issues?

1. Check existing GitHub issues
2. Review the README and documentation
3. Ask in pull request comments
4. Open a new GitHub issue with details

---

**Last Updated**: 2026-03-28  
**Maintained By**: aurceive  
**License**: MIT
