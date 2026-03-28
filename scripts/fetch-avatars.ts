/**
 * Script to download character avatars from Lunaris API
 * 
 * Usage:
 * npm run scripts:fetch-avatars
 * 
 * Output: /tmp/avatars/ (not committed)
 * 
 * This script:
 * 1. Reads character list from public/data/characters.json
 * 2. Uses avatarId to download avatars from Lunaris API
 * 3. Saves to /tmp/avatars/ for review
 * 4. Shows download report
 * 
 * For production, select needed avatars and copy to public/assets/avatars/
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface Character {
  id: string;
  name: string;
  element: string;
  rarity: number;
  avatarId?: string;
}

/**
 * Convert character ID to Lunaris API avatar ID
 * Examples:
 *   "nahida" → "UI_AvatarIcon_Nahida" (from avatarId in characters.json)
 *   "traveler-anemo" → "UI_AvatarIcon_PlayerBoy" (hardcoded fallback)
 */
function getAvatarId(char: Character): string | null {
  // If avatarId is present in character data, use it
  if (char.avatarId) {
    return char.avatarId;
  }

  // Special case: Traveler uses standard icon
  if (char.id.startsWith('traveler-')) {
    return 'UI_AvatarIcon_PlayerBoy';
  }

  // No avatar ID available
  return null;
}

/**
 * Downloads a single avatar image
 */
async function downloadAvatar(
  char: Character,
  apiBaseUrl: string
): Promise<{ success: boolean; message: string }> {
  try {
    const avatarId = getAvatarId(char);
    
    if (!avatarId) {
      return {
        success: false,
        message: `⚠️ [${char.name}] No avatarId available`,
      };
    }

    const avatarUrl = `${apiBaseUrl}${avatarId}.webp`;

    const response = await fetch(avatarUrl);
    if (!response.ok) {
      return {
        success: false,
        message: `⚠️ [${char.name}] Not found (404): ${avatarId}`,
      };
    }

    const buffer = await response.arrayBuffer();
    const tempDir = join(process.cwd(), 'tmp', 'avatars');
    mkdirSync(tempDir, { recursive: true });

    const filePath = join(tempDir, `${char.id}.webp`);
    writeFileSync(filePath, Buffer.from(buffer));

    return {
      success: true,
      message: `✅ [${char.name}] Downloaded`,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ [${char.name}] Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Fetches all character avatars
 */
async function fetchAvatars() {
  try {
    const charactersPath = join(process.cwd(), 'public', 'data', 'characters.json');
    const charactersJson = readFileSync(charactersPath, 'utf-8');
    const characters: Character[] = JSON.parse(charactersJson);

    if (!characters || characters.length === 0) {
      console.error('❌ No characters found in characters.json');
      process.exit(1);
    }

    const apiBaseUrl = 'https://api.lunaris.moe/data/assets/avataricon/';

    console.log(`📥 Downloading ${characters.length} character avatars...\n`);
    console.log(`📡 API: ${apiBaseUrl}\n`);

    let successCount = 0;
    let failureCount = 0;

    // Download avatars sequentially with small delays to avoid rate limiting
    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      const result = await downloadAvatar(char, apiBaseUrl);
      
      console.log(result.message);
      
      if (result.success) {
        successCount++;
      } else {
        failureCount++;
      }

      // Add small delay between requests to avoid rate limiting
      if (i < characters.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    const tempDir = join(process.cwd(), 'tmp', 'avatars');
    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Downloaded: ${successCount}`);
    console.log(`  ⚠️ Failed/Skipped: ${failureCount}`);
    console.log(`  📁 Location: ${tempDir}`);

    console.log(`\n💡 Next steps:`);
    console.log(`1. Review avatars in /tmp/avatars/`);
    console.log(`2. Copy avatars you want to use to public/assets/avatars/`);
    console.log(`3. Update character records with imageUrl if needed`);
    console.log(`4. Run: npm run scripts:generate-form-questions`);

    if (failureCount > 0) {
      console.log(
        `\n⚠️ Note: Some avatars failed or skipped. Check /tmp/avatars/ for what was downloaded.`
      );
    }
  } catch (error) {
    console.error('❌ Error fetching avatars:', error);
    process.exit(1);
  }
}

fetchAvatars();
