/**
 * Represents a playable character in Genshin Impact
 */
export interface Character {
  id: string;
  name: string;
  element: 'pyro' | 'hydro' | 'electro' | 'cryo' | 'anemo' | 'geo' | 'dendro';
  rarity: 4 | 5;
  imageUrl?: string;
  avatarId?: string;
}

/**
 * Represents user information from Google OAuth
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
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
 * Union type for tier keys including unassigned pool
 */
export type TierKey = keyof TierList | 'unassigned';

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
