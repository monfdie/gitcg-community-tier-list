# Development Setup Template

This is a template for local development setup. Copy this to `DEVELOPMENT_SETUP.md` in your local environment and fill in your API details.

## Character Data Setup

### Fetching Initial Character Data

For development, you need to fetch character data from a source and convert it to the required format.

**Setup Steps:**
1. Find a Genshin Impact character data API source
2. Add the API URL to `.env.local`:
   ```bash
   VITE_API_CHARACTER_LIST=your_api_url_here
   VITE_API_AVATAR_BASE=your_avatar_base_url_here
   ```
3. Run the fetch script:
   ```bash
   npm run scripts:fetch-characters
   ```

### Expected Character Data Format

The `public/data/characters.json` file should have this schema:

```json
[
  {
    "id": "character_id",
    "name": "Character Name",
    "element": "element_type",
    "rarity": 4 or 5
  }
]
```

### Validating Character Data

After fetching, validate the data:

```bash
npm run scripts:validate-characters
```

## Development Environment Variables

Create `.env.local` for local development (this file is gitignored):

```bash
# Required for development and production
VITE_GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
VITE_GOOGLE_FORM_ID=your_form_id_here

# Development-only: Character data API endpoints
# Find a Genshin Impact character data source and add here
VITE_API_CHARACTER_LIST=your_character_list_api_url
VITE_API_AVATAR_BASE=your_avatar_images_base_url

# Optional: Enable debug logging
VITE_DEBUG=true
```

## Finding Character Data Sources

You'll need to find a Genshin Impact character data API. Some options:
- Community APIs (search for "Genshin Impact API")
- Official HoYo APIs (with restrictions)
- Custom data collections

**Note**: The app is production-ready with bundled static data, so you only need this for development/updates.

## Setup Workflow

1. **First Time**
   ```bash
   npm install
   cp .env.example .env.local
   # Edit .env.local with your API details
   npm run scripts:fetch-characters
   npm run test
   npm run dev
   ```

2. **Update Character Data**
   ```bash
   npm run scripts:fetch-characters
   npm run scripts:validate-characters
   git add public/data/
   git commit -m "chore: update character data"
   ```

## Important Notes

✅ **Do**:
- Keep `.env.local` in your local directory only (it's gitignored)
- Validate data before committing
- Document which API source you're using
- Update character data periodically

❌ **Don't**:
- Commit `.env.local` or files with API endpoints
- Rely on external APIs in production (use bundled data)
- Commit temporary development files
- Share API credentials in git

## Files to Know

- `.env.example` - Public template (no specific API URLs)
- `.env.local` - Your local config (gitignored)
- `DEVELOPMENT_SETUP_TEMPLATE.md` - This template
- `DEVELOPMENT_SETUP.md` - Your local setup notes (gitignored)
- `public/data/characters.json` - Production data (committed to git)
- `scripts/fetch-characters.ts` - Data fetching script
- `scripts/validate-characters.ts` - Data validation script

---

**Key Principle**: Development configuration and temporary tools stay local. Only production-ready code and bundled data go to git.
