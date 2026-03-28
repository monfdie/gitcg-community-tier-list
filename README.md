# Genshin Impact Community Tier List

A single-page web application that allows the Genshin Impact community to create and submit personalized tier lists via Google authentication.

**Status**: Under Development 🚧  
**Tech Stack**: React 18 + TypeScript + Vite  
**Hosting**: GitHub Pages  

---

## Features

- 🔐 **Google OAuth Authentication** - Secure login with Google account
- 🎨 **Drag-and-Drop Tier List** - Intuitive interface for ranking characters
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 💾 **Auto-Save** - Tier list persists across page reloads
- 📝 **Direct Form Submission** - Responses go directly to Google Form
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

---

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone repository
git clone https://github.com/aurceive/20260328-public-gi-tier-list.git
cd 20260328-public-gi-tier-list

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your Google OAuth credentials
```

### Running Locally

```bash
# Start development server
npm run dev
# Open http://localhost:5173
```

### Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # Check TypeScript
npm run test         # Run tests
npm run test:watch   # Watch mode
```

---

## Architecture

### Project Structure

```
src/
├── components/      # React components
├── hooks/          # Custom React hooks  
├── utils/          # Utility functions
├── lib/            # Library wrappers
├── styles/         # CSS modules
├── types.ts        # TypeScript definitions
├── config.ts       # Configuration
└── main.tsx        # Entry point
```

For detailed guidelines, see [AGENTS.md](./AGENTS.md).

---

## Configuration

### Environment Variables

Create `.env.local`:

```bash
VITE_GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
VITE_GOOGLE_FORM_ID=your_form_id_here
```

See `.env.example` for all available variables.

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Identity API
4. Create OAuth 2.0 credentials (Web Application)
5. Add `http://localhost:5173` to Authorized JavaScript origins
6. Add `https://aurceive.github.io/20260328-public-gi-tier-list/` for production
7. Copy Client ID to `.env.local`

---

## Google Form Integration

The app submits tier list responses directly to a Google Form.

### Setup Instructions

1. Create a Google Form for tier list responses
2. Add form fields (field IDs needed for submission)
3. Get form ID from URL: `https://docs.google.com/forms/d/FORM_ID/viewform`
4. Update `VITE_GOOGLE_FORM_ID` in `.env.local`

For detailed field mapping instructions, see the [Google Form Integration Guide](./docs/GOOGLE_FORM_SETUP.md).

---

## Character Data

Characters are loaded from `public/data/characters.json`.

### Updating Character List

```bash
# Fetch latest characters from external API
npm run scripts:fetch-characters

# Validate character data
npm run scripts:validate-characters

# Commit changes
git add public/data/characters.json
git commit -m "chore: update character list"
```

---

## Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

Tests are located in the `tests/` directory. Aim for:
- **Utilities**: 100% coverage
- **Hooks**: 80% coverage  
- **Components**: 60% coverage

---

## Deployment

### Automatic (GitHub Pages)

Every push to `main` triggers automatic deployment:

1. GitHub Actions runs linter and tests
2. Builds with Vite
3. Deploys to GitHub Pages

Check deployment status: https://github.com/aurceive/20260328-public-gi-tier-list/actions

### Manual Deployment

```bash
npm run build
npm run deploy
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Mobile: iOS Safari 14+, Android Chrome 90+

---

## Performance

Target metrics:
- ⚡ Lighthouse Score: >90
- 📦 Bundle Size: <200KB
- ⏱️ Load Time: <2s on 4G
- 🎯 Time to Interactive: <1.5s

---

## Contributing

Before contributing, please read [AGENTS.md](./AGENTS.md) for:
- Code standards
- Commit message format  
- Testing requirements
- PR workflow

Quick start:
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes, test, commit
npm run test && npm run lint

# Push and create PR
git push origin feature/your-feature
```

---

## Roadmap

- [ ] Phase 1: Project Setup & Infrastructure
- [ ] Phase 2: Core Data Layer
- [ ] Phase 3: Google Authentication
- [ ] Phase 4: Tier List UI & State Management
- [ ] Phase 5: Form Submission
- [ ] Phase 6: Styling & Responsive Design
- [ ] Phase 7: Testing & QA
- [ ] Phase 8: Documentation & Deployment

See [plan.md](./docs/PLAN.md) for detailed implementation phases.

---

## Troubleshooting

### Google OAuth Not Working
- Verify Client ID in `.env.local`
- Check origin in Google Cloud Console
- Clear browser cache and cookies
- Check browser console for CORS errors

### Form Submission Failing
- Verify Google Form ID is correct
- Confirm field IDs match form configuration
- Check browser Network tab for POST request details

### Characters Not Loading
- Verify `public/data/characters.json` exists
- Check browser console for file not found error
- Ensure no CORS issues with local file loading

---

## License

[MIT License](./LICENSE)

---

## Support

- 📖 Read [AGENTS.md](./AGENTS.md) for detailed guides
- 🐛 Report issues on [GitHub Issues](https://github.com/aurceive/20260328-public-gi-tier-list/issues)
- 💬 Discuss on [GitHub Discussions](https://github.com/aurceive/20260328-public-gi-tier-list/discussions)

---

**Live Site**: https://aurceive.github.io/20260328-public-gi-tier-list/  
**Repository**: https://github.com/aurceive/20260328-public-gi-tier-list  
**Last Updated**: 2026-03-28
