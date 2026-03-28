# Genshin Impact Community Tier List 🎮

A modern single-page web application that allows the Genshin Impact community to create and submit personalized tier lists through Google Forms integration.

**Live Site**: [aurceive.github.io/20260328-gi-community-tier-list](https://aurceive.github.io/20260328-gi-community-tier-list/)

---

## 🌟 Features

✨ **Interactive Tier List Creator**
- Drag-and-drop interface to assign 118 Genshin Impact characters to tiers (S, A, B, C, D)
- Real-time validation and progress tracking
- All characters must be assigned before submission

🔐 **Google OAuth Authentication**
- Secure sign-in with your Google account
- No backend server required
- Tokens stored securely in browser session

📋 **Form Submission**
- Direct integration with Google Forms
- Submits your tier list from your authenticated account
- Automatic timestamp recording

📱 **Fully Responsive**
- Works perfectly on desktop, tablet, and mobile
- Touch-friendly drag-and-drop
- Optimized layouts for all screen sizes

🎨 **Modern UI/UX**
- Clean, intuitive interface
- Smooth animations and transitions
- Dark mode support (via system preferences)
- Accessibility features (keyboard navigation, ARIA labels)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/aurceive/20260328-gi-community-tier-list.git
cd 20260328-gi-community-tier-list

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Configuration

Edit `.env.local` and add your credentials:

```env
# Google OAuth
VITE_GOOGLE_OAUTH_CLIENT_ID=your_client_id_here.apps.googleusercontent.com

# Google Form
VITE_GOOGLE_FORM_ID=your_form_id_here
VITE_FORM_ENTRY_NAME=entry.XXXXXXXXXX
VITE_FORM_ENTRY_EMAIL=entry.YYYYYYYYYY
VITE_FORM_ENTRY_S_TIER=entry.1111111111
# ... (see .env.example for all fields)
```

**How to get these values:**
- See `.env.example` for detailed instructions
- Check `AGENTS.md` for step-by-step setup guide

### Development

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

### Building

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📦 Project Structure

```
src/
├── components/              # React components
│   ├── Navbar.tsx          # Authentication header
│   ├── TierList.tsx        # Main tier list container
│   ├── TierRow.tsx         # Individual tier row
│   ├── CharacterItem.tsx   # Draggable character card
│   ├── UnassignedPool.tsx  # Available characters pool
│   └── SubmitButton.tsx    # Form submission button
│
├── hooks/                   # Custom React hooks
│   ├── useGoogleAuth.ts    # Google OAuth logic
│   ├── useTierListState.ts # Tier list state management
│   └── useGoogleFormSubmit.ts # Form submission
│
├── lib/                     # Libraries
│   └── googleOAuth.ts      # OAuth utilities
│
├── utils/                   # Utilities
│   ├── characterLoader.ts  # Load character data
│   └── googleFormEncoder.ts # Encode form submissions
│
├── styles/                  # CSS modules
│   ├── App.module.css
│   ├── components/
│   └── index.css
│
├── types.ts                 # TypeScript interfaces
├── config.ts               # App configuration
├── App.tsx                 # Root component
├── main.tsx                # Entry point
└── index.css               # Global styles

public/
└── data/
    └── characters.json     # Character list (118 characters)

scripts/
├── fetch-characters.ts     # Download latest characters
└── generate-form-questions.ts # Generate form questions
```

---

## 🔧 Technology Stack

- **Frontend**: React 18 + TypeScript 5
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **Drag & Drop**: react-beautiful-dnd
- **Authentication**: Google OAuth 2.0 (PKCE flow)
- **State Management**: React Hooks + Context
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier
- **Hosting**: GitHub Pages

---

## 📝 Development Scripts

```bash
npm run dev                  # Start development server
npm run build              # Build for production
npm run preview            # Preview production build
npm run type-check         # Check TypeScript types
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
npm run test               # Run tests
npm run test:coverage      # Test coverage report

# Character management
npm run scripts:fetch-characters     # Download latest character data
npm run scripts:fetch-avatars        # Download character avatars
npm run scripts:generate-form-questions # Generate Google Form questions
```

---

## 🎯 How to Use

1. **Visit the app** and click "Sign in with Google"
2. **Authorize** with your Google account
3. **Create your tier list**:
   - Drag characters from the "Available Characters" section
   - Drop them into your preferred tier (S, A, B, C, or D)
   - Use search to filter characters by name or element
4. **Assign all characters** (the progress bar shows your progress)
5. **Submit** your tier list - it goes directly to Google Form

---

## 🔐 Security

- **No backend required** - everything runs in your browser
- **OAuth 2.0 PKCE flow** - secure authentication without exposing client secret
- **Tokens stored in sessionStorage** - cleared when browser closes
- **No personal data stored** - only form submission data sent to Google

---

## 📊 Character Data

- **118 unique characters** from Genshin Impact v6.5.0
- **6 rarities**: 74 5-star, 50 4-star, 6 Traveler variants
- **7 elements**: Pyro, Hydro, Electro, Cryo, Anemo, Geo, Dendro
- **Data source**: Updated from official API (Lunaris)
- **Avatar images**: Optional local or CDN-hosted images

### Character ID Format
- Lowercase with hyphens: `raiden-shogun`, `nahida`, `traveler-anemo`
- Traveler variants: `traveler-{element}` for unified display

---

## 🐛 Troubleshooting

**"Failed to load character data"**
- Check browser console for CORS errors
- Verify `public/data/characters.json` exists and is valid

**"Failed to authenticate with Google"**
- Verify `VITE_GOOGLE_OAUTH_CLIENT_ID` in `.env.local`
- Check that localhost/deployed URL is in Google Cloud Console authorized origins

**"Failed to submit form"**
- Verify `VITE_GOOGLE_FORM_ID` is correct
- Check that form entry IDs match your Google Form structure
- Ensure Google Form is published and accepting responses

---

## 📖 Documentation

- **[AGENTS.md](./AGENTS.md)** - Contributor guidelines & development standards
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed architecture
- **[.env.example](./.env.example)** - Environment variable setup

---

## 🤝 Contributing

This project follows conventional commits. See [AGENTS.md](./AGENTS.md) for:
- Code standards and best practices
- Git workflow and branch naming
- Pull request requirements
- Testing expectations
- Deployment process

---

## 📄 License

[MIT](./LICENSE) - Feel free to use this project for your own tier list apps!

---

## 🔗 Links

- **GitHub**: [20260328-gi-community-tier-list](https://github.com/aurceive/20260328-gi-community-tier-list)
- **Live Site**: [aurceive.github.io/20260328-gi-community-tier-list](https://aurceive.github.io/20260328-gi-community-tier-list/)
- **Issues**: [Report bugs](https://github.com/aurceive/20260328-gi-community-tier-list/issues)

---

**Made with ❤️ by aurceive**
