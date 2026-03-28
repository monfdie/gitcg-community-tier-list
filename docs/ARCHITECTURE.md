# Architecture Decision Records

This document captures key architectural decisions and their rationale.

## 1. Frontend Framework: React + TypeScript

**Decision**: Use React 18 with TypeScript and Vite as the build tool.

**Rationale**:
- React has mature ecosystem and large community
- TypeScript provides type safety and developer experience
- Vite offers fast build times and dev server
- Single-page app is appropriate for this use case
- No backend required keeps deployment simple

**Alternatives Considered**:
- Vue 3: More opinionated, slightly smaller bundle
- Svelte: Smaller output, but less ecosystem support
- Next.js: Overkill for SPA, requires Node.js server

**Trade-offs**: Slightly larger bundle (~200KB) compared to Svelte, but better for team familiarity.

---

## 2. State Management: React Context + localStorage

**Decision**: Use React Context for application state, localStorage for persistence.

**Rationale**:
- Context is sufficient for this app's complexity
- Avoids external state library dependency
- localStorage provides persistence without backend
- Automatic recovery on page reload
- Simple to test and understand

**Alternative**: Zustand
- Would add ~5KB to bundle
- Slightly better developer experience for complex state
- Could be adopted later if state becomes complex

**Implementation**:
```
useGoogleAuth (context)
  → Current user & auth token

useTierListState (context)
  → Tier assignments for all characters
  → Persisted to localStorage
```

---

## 3. Character Data: Static JSON in Production

**Decision**: Bundle character list as static JSON (`public/data/characters.json`).

**Rationale**:
- No dependency on external API in production
- No CORS issues
- Instant load, no API call latency
- Data updates only with new releases
- Dev script to fetch from external API

**Alternatives Considered**:
- Direct API calls to external character data API:
  - Risk of API downtime or changes
  - CORS issues possible
  - External dependency in production
  
- AWS/Firebase database:
  - Adds infrastructure cost
  - Overkill for static data
  - Adds deployment complexity

**Development Workflow**:
```
npm run scripts:fetch-characters
  → Fetches from configured character data API
  → Saves to public/data/characters.json
  → Vite bundles it at build time
```

---

## 4. Google Authentication: OAuth 2.0 with PKCE

**Decision**: Use Google OAuth 2.0 with PKCE (Proof Key for Code Exchange) for web app flow.

**Rationale**:
- Secure, industry-standard authentication
- No backend server required
- PKCE prevents authorization code interception
- Google SDK handles token refresh
- User data available for form prefilling

**Flow**:
```
User clicks "Login with Google"
  → Redirects to Google consent screen
  → User grants permission
  → Redirects back with auth code
  → Exchange code for access token (with PKCE)
  → Store token in memory + sessionStorage
  → Auto-logout on page close
```

**Security Considerations**:
- Token stored in memory (cleared on page close)
- sessionStorage as fallback (auto-clears on browser close)
- No localStorage for tokens (stays logged in across sessions, security risk)
- HTTPS required in production

---

## 5. Form Submission: Direct POST to Google Form

**Decision**: POST tier list directly to Google Form from frontend.

**Rationale**:
- No backend required
- Serverless architecture (fully static on GitHub Pages)
- Simpler deployment
- Faster form submission
- User data available for prefilling

**How It Works**:
```
Tier list state
  ↓ (googleFormEncoder.ts)
  ↓ Convert to form field values
  ↓
POST to https://docs.google.com/forms/d/FORM_ID/formResponse
  with entries: {
    'entry.123456789': 'S_tier_characters',
    'entry.987654321': 'A_tier_characters',
    ...
  }
```

**Advantages**:
- No backend infrastructure
- No database
- Fully client-side
- Data stored directly in Google Sheets

**Limitations**:
- Google Form must be public
- Form field IDs must be known (obtained by submitting empty form)
- No server-side validation
- Rate limiting by Google (minimal impact for this use case)

---

## 6. Component Architecture

**Decision**: Functional components with custom hooks for logic abstraction.

**Pattern**:
```
Component (pure presentation)
  ↓
Custom Hook (business logic)
  ↓
Utility functions (pure functions)
  ↓
External APIs (Google OAuth, Google Forms)
```

**Example: TierList Component**
```typescript
// Component: Just renders UI
export function TierList() {
  const { tiers, moveCharacter, characters } = useTierListState();
  return <div>...</div>;
}

// Hook: Manages state
function useTierListState() {
  const [state, setState] = useState(...);
  const moveCharacter = (id, tier) => { ... };
  return { tiers, moveCharacter, characters };
}

// Utils: Pure functions
export function validateTierList(tiers) { ... }
export function serializeTierList(tiers) { ... }
```

**Rationale**:
- Separation of concerns
- Easier to test logic independently
- Reusable hooks
- Components focus on UI rendering
- Better code organization

---

## 7. Drag & Drop: react-beautiful-dnd

**Decision**: Use react-beautiful-dnd library for drag-and-drop.

**Rationale**:
- Mature, battle-tested library
- Excellent mobile touch support
- Smooth animations out of the box
- Good accessibility support
- 80KB (~20KB gzipped)

**Alternatives Considered**:
- HTML5 drag-drop: More verbose, worse mobile support
- dnd-kit: Lighter (~30KB), but less proven
- React DnD: More powerful, but overkill here

**Performance**:
- Only dragged items re-render
- Uses virtualization for large lists
- Handles 100+ items smoothly

---

## 8. Styling: CSS Modules

**Decision**: Use CSS Modules for component styling.

**Rationale**:
- Scoped styles, no naming conflicts
- Works great with Vite
- No build configuration needed
- Good developer experience
- Tree-shakeable unused styles

**Structure**:
```
Component.tsx
Component.module.css
__tests__/Component.test.tsx
```

**Not using**:
- Tailwind CSS: Adds ~250KB (uncompressed), overkill for this small app
- Styled Components: Runtime overhead, more complex
- SASS/SCSS: CSS Modules work fine for this project

---

## 9. Deployment: GitHub Pages + GitHub Actions

**Decision**: Deploy to GitHub Pages with automated CI/CD via GitHub Actions.

**Pipeline**:
```
Push to main
  ↓
GitHub Actions trigger
  ↓
npm install
npm run lint
npm run test
npm run build
  ↓
Deploy dist/ to gh-pages branch
  ↓
GitHub Pages serves from https://aurceive.github.io/20260328-gi-community-tier-list/
```

**Rationale**:
- Free hosting
- Zero configuration
- Automatic SSL/HTTPS
- Familiar workflow
- No vendor lock-in

**Why not**:
- Vercel/Netlify: Added complexity, less control
- AWS S3: More overhead, less integrated
- VPS: Unnecessary for static site

---

## 10. Testing Strategy

**Decision**: Test pyramid approach - many unit tests, some integration, few E2E.

**Breakdown**:
- **Unit Tests (60%)**: Utils, hooks, helpers
- **Integration Tests (30%)**: Components, hooks together
- **E2E Tests (10%)**: Full user flow (if time permits)

**Coverage Targets**:
- Utilities: 100%
- Hooks: 80%
- Components: 60%

**Why this approach**:
- Utils are easiest to test, most critical
- Component tests are slower, less valuable
- E2E tests catch integration issues
- Practical balance for small team

**Tools**:
- Vitest: Fast, ESM-native unit testing
- React Testing Library: Test behavior, not implementation
- Playwright (optional): E2E testing

---

## 11. TypeScript Configuration

**Decision**: Strict mode enabled, no implicit any.

**Config**:
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "esModuleInterop": true,
  "skipLibCheck": true,
  "forceConsistentCasingInFileNames": true
}
```

**Rationale**:
- Prevents entire categories of bugs
- Better IDE support and autocomplete
- Easier refactoring
- Better documentation via types

**Trade-off**: Slightly more verbose code, but worth it for correctness.

---

## 12. Character Image Handling

**Decision**: Store image URLs, load from public folder or external API in dev.

**Production**:
```json
{
  "id": "nahida",
  "name": "Nahida",
  "imageUrl": "/data/avatars/UI_AvatarIcon_Nahida.webp"
}
```

**Development**:
```
npm run scripts:fetch-characters
  → Downloads images from configured API endpoint
  → Saves to public/data/avatars/
  → Commits to git
```

**Why bundled images**:
- No external API calls in production
- Faster load times
- Offline support possible
- Consistent availability
- Small size (~50KB per 100 characters)

---

## 13. Environment Variables Management

**Decision**: Use Vite's environment variables with .env files.

**Structure**:
```
.env.example           # Template (committed)
.env.local             # Local development (gitignored)
.env.production        # Production secrets (gitignored)
```

**Accessed in code**:
```typescript
import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
```

**Rationale**:
- Secure secrets not in version control
- Different values for dev/prod
- Standard approach in React ecosystem

---

## 14. Accessibility Strategy

**Decision**: WCAG 2.1 Level AA compliance with keyboard navigation support.

**Implementation**:
- Semantic HTML (`<button>`, `<main>`, `<nav>`)
- ARIA labels for icons
- Keyboard navigation (Tab, Enter, Arrow keys)
- Color contrast >= 4.5:1
- Focus indicators visible
- Screen reader support

**Not targeting**:
- WCAG AAA (gold standard, expensive)
- Perfect screen reader experience (not required for tier list)

**Testing**:
- axe DevTools browser extension
- Manual keyboard testing
- Screen reader testing (NVDA on Windows)

---

## 15. Mobile Responsiveness

**Decision**: Mobile-first approach with responsive design.

**Breakpoints**:
```css
320px  - Mobile (iPhone SE)
768px  - Tablet (iPad)
1024px - Desktop (standard)
1920px - Large desktop (4K)
```

**Touch Support**:
- 44x44px minimum touch targets
- Drag-drop works with touch
- No hover-only interactions
- Swipe gestures (if time permits)

**Testing**:
- Chrome DevTools device emulation
- Physical testing on iOS and Android
- Responsive design tests in automation

---

## Future Considerations

### If Data Volume Grows
Consider move to Zustand or Redux for state if tier list becomes very complex.

### If Performance Degrades
- Implement code splitting with React.lazy()
- Use image optimization (WebP, AVIF)
- Consider virtual scrolling for character list
- Profile with Chrome DevTools

### If User Base Grows
- Add Sentry for error tracking
- Add Google Analytics for usage metrics
- Consider CDN for assets
- Monitor Google Form submission limits

### For Production Scalability
- Could add backend for analytics
- Could add leaderboard/statistics
- Could add social sharing
- Could add historical comparisons

---

## Trade-offs Summary

| Decision | Gain | Cost |
|----------|------|------|
| React + TS | Type safety, ecosystem | ~200KB bundle |
| Context + localStorage | Simplicity | Limited to front-end |
| Static character data | No API dependency | Manual updates |
| OAuth2 with PKCE | Security | Requires Google setup |
| Direct form POST | No backend needed | Limited features |
| CSS Modules | Scoped styles | No utility classes |
| GitHub Pages | Free hosting | Static only |
| Strict TypeScript | Correctness | More verbose |

---

**Last Updated**: 2026-03-28  
**Maintained By**: aurceive
