/**
 * Core TypeScript interfaces and types for the application
 */

/**
 * Represents a playable character in Genshin Impact
 */
export interface Character {
  id: string;
  name: string;
  element: 'pyro' | 'hydro' | 'electro' | 'cryo' | 'anemo' | 'geo' | 'dendro';
  rarity: 4 | 5;
  imageUrl?: string;
}

/**
 * Represents user information from Google OAuth
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Represents the current state of the tier list
 */
export interface TierList {
  S: Character[];
  A: Character[];
  B: Character[];
  C: Character[];
  D: Character[];
}

/**
 * Represents a complete tier list response ready for submission
 */
export interface FormSubmissionPayload {
  userName: string;
  userEmail: string;
  sTier: string;
  aTier: string;
  bTier: string;
  cTier: string;
  dTier: string;
  timestamp: string;
}

/**
 * Application state shape
 */
export interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  tierList: TierList;
  allCharacters: Character[];
  isLoading: boolean;
  error: string | null;
}
