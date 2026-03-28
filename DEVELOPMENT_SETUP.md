# Development Setup Guide

Complete setup instructions for developing the Genshin Impact Community Tier List project.

## Prerequisites

- Node.js 18+ and npm 9+
- Git for version control
- A code editor (VS Code recommended)
- Google Cloud Console account (for OAuth)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aurceive/20260328-gi-community-tier-list.git
cd 20260328-gi-community-tier-list
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies including React, TypeScript, Vite, and testing libraries.

**Note:** The project uses React 19 with `react-beautiful-dnd`, which requires the `--legacy-peer-deps` flag. This is already configured in `.npmrc`.

### 3. Configure Environment Variables

Create a `.env.local` file (not committed to git):

```bash
# Google OAuth Configuration
VITE_GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
VITE_GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5173/callback

# Google Form Configuration
VITE_GOOGLE_FORM_ID=your_form_id_here

# Development Character API
VITE_CHARACTER_API_URL=https://api.lunaris.moe/data/6.4.54/charlist.json
VITE_AVATAR_BASE_URL=https://api.lunaris.moe/data/assets/avataricon
```

See `.env.example` for complete variable reference and setup instructions.

## Development Workflow

### Start Development Server

```bash
npm run dev
```

Starts Vite dev server on `http://localhost:5173` with hot module replacement (HMR).

### Run Tests

```bash
# Run all tests (watch mode)
npm run test

# Run tests once
npm run test -- --run

# Run tests with coverage
npm run test -- --coverage
```

### Linting and Formatting

```bash
# Check ESLint issues
npm run lint

# Format code with Prettier
npm run format

# Type check with TypeScript
npm run type-check
```

### Build for Production

```bash
npm run build
```

Creates optimized production build in `/dist` directory.

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally on `http://localhost:5173`.

## Character Data Management

### Fetch Latest Character Data

```bash
npm run scripts:fetch-characters
```

This script:
1. Fetches character list from Lunaris API
2. Deduplicates Traveler variants (Lumine/Aether)
3. Generates form questions
4. Saves to `public/data/characters.json`

The script requires:
- `VITE_CHARACTER_API_URL` in `.env.local`
- Creates `tmp/` directory for temporary files
- Outputs 118 unique characters

### Download Character Avatars

```bash
npm run scripts:fetch-avatars
```

This script:
1. Downloads all character avatar images
2. Stores in `tmp/avatars/` (not committed)
3. Can be manually curated into `public/assets/`

The script uses:
- `VITE_AVATAR_BASE_URL` in `.env.local`
- Lunaris API avatar endpoint

### Validate Character Data

The fetch-characters script automatically validates data, but you can run it separately:

```bash
npm run scripts:validate-characters
```

Checks for:
- Required fields (id, name, element, rarity)
- Valid element types
- Valid rarity (4 or 5)
- Duplicate entries

## Google OAuth Setup

### Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:5173/callback` (development)
   - `https://aurceive.github.io/20260328-gi-community-tier-list/callback` (production)
7. Copy the **Client ID** and add to `.env.local`:
   ```
   VITE_GOOGLE_OAUTH_CLIENT_ID=your_client_id
   ```

### Test OAuth Locally

1. Start dev server: `npm run dev`
2. Click "Sign in with Google"
3. Authorize the app
4. Verify user profile displays in console

## Google Form Setup

### Create a Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Create a new form
3. Add short answer fields for:
   - **User Name**
   - **User Email**
   - **S Tier** (comma-separated character names)
   - **A Tier**
   - **B Tier**
   - **C Tier**
   - **D Tier**
4. Publish the form
5. Copy form ID from URL: `https://docs.google.com/forms/d/FORM_ID/viewform`
6. Add to `.env.local`: `VITE_GOOGLE_FORM_ID=FORM_ID`

### Get Form Entry IDs

1. Open form in edit mode
2. For each field, right-click → **Get pre-filled link**
3. Copy the URL
4. Extract entry IDs like `entry.123456789`
5. Update `src/config.ts` `GOOGLE_FORM_CONFIG.formFields` with actual IDs

### Test Form Submission

1. Create and submit a tier list in dev server
2. Check Google Form responses
3. Verify all fields populated correctly

## Project Structure

```
src/
├── components/        # React UI components
├── hooks/            # Custom React hooks
├── lib/              # Library utilities
├── utils/            # Pure utility functions
├── types.ts          # TypeScript interfaces
├── config.ts         # Application configuration
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── index.css         # Global styles

tests/
├── utils/            # Utility function tests
├── hooks/            # React hook tests
├── components/       # Component tests
└── setup.ts          # Test configuration

public/
├── data/
│   └── characters.json    # Character database
└── index.html             # HTML template

scripts/
├── fetch-characters.ts    # Download characters from API
├── fetch-avatars.ts       # Download character images
└── README.md              # Script documentation
```

## Testing Strategy

### Unit Tests
- Test utilities with high coverage (>90%)
- Test hooks with React Testing Library
- Mock external APIs

### Component Tests
- Test UI interactions
- Test drag-drop functionality
- Test form submission

### E2E Tests (Manual)
- Login flow with Google OAuth
- Create and submit tier list
- Form data validation

### Running Tests

```bash
# Watch mode (re-run on file changes)
npm run test

# Single run
npm run test -- --run

# With coverage report
npm run test -- --coverage

# Specific test file
npm run test -- googleFormEncoder.test.ts

# Update snapshots
npm run test -- -u
```

## Common Tasks

### Add a New Component

1. Create `src/components/YourComponent.tsx`
2. Create `src/components/YourComponent.module.css`
3. Export from `src/components/index.ts` (if exists)
4. Write tests in `tests/components/YourComponent.test.tsx`

### Add a New Hook

1. Create `src/hooks/useYourHook.ts`
2. Write tests in `tests/hooks/useYourHook.test.ts`
3. Document hook parameters and return types
4. Export from hook file

### Add a New Utility

1. Create `src/utils/yourUtility.ts`
2. Write comprehensive tests in `tests/utils/yourUtility.test.ts`
3. Aim for >90% test coverage

### Update Configuration

1. Edit `src/config.ts`
2. Add proper TypeScript types
3. Document new constants with comments
4. Update `.env.example` if environment-dependent

## Deployment

### Deploy to GitHub Pages

The project auto-deploys on push to `main` via GitHub Actions:

1. Push changes to main branch
2. GitHub Actions workflow runs automatically
3. Runs linting, tests, and build
4. Deploys to GitHub Pages
5. Available at `https://aurceive.github.io/20260328-gi-community-tier-list/`

### Manual Deployment

```bash
# Build production version
npm run build

# The dist/ folder is ready to deploy
```

## Troubleshooting

### "Cannot find module react-beautiful-dnd"

Make sure dependencies are installed:
```bash
npm install
```

The `.npmrc` file with `legacy-peer-deps=true` is required for React 19 compatibility.

### Tests fail with "Could not find context"

Component tests require providers. Make sure test setup includes:
- DragDropContext for drag-drop components
- Redux Provider for react-beautiful-dnd

### OAuth redirect not working

1. Check `VITE_GOOGLE_OAUTH_REDIRECT_URI` in `.env.local`
2. Verify redirect URI is registered in Google Cloud Console
3. Clear browser cookies and try again

### Character data not loading

1. Check that `public/data/characters.json` exists
2. Run `npm run scripts:fetch-characters` to regenerate
3. Verify JSON is valid: `npm run scripts:validate-characters`

### CSS modules not working

Ensure you're importing with `.module.css`:
```typescript
import styles from './Component.module.css';
```

Not:
```typescript
import './Component.css';
```

## Performance Tips

- Use React DevTools Profiler to identify slow components
- Lazy load components that aren't immediately visible
- Memoize expensive computations with `useMemo`
- Use `useCallback` for event handlers passed to child components
- Check bundle size: `npm run build` and check dist size

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and run tests: `npm run test -- --run`
3. Run linter: `npm run lint`
4. Commit with conventional commit format
5. Push and create a pull request

See `AGENTS.md` for detailed contributing guidelines.

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev)
- [react-beautiful-dnd Documentation](https://beautiful-dnd.dev)
- [Google OAuth 2.0 PKCE Flow](https://tools.ietf.org/html/rfc7636)

---

**Last Updated**: 2026-03-28
**Node Version**: 18+
**npm Version**: 9+
