/**
 * Application configuration and constants
 * 
 * This file contains all configuration used throughout the application:
 * - Tier definitions
 * - Game elements and their emoji/colors
 * - API endpoints and OAuth settings
 * - Google Form field mappings
 * - Local storage keys
 * - UI constants
 */

// ============================================================================
// TIER DEFINITIONS
// ============================================================================

/**
 * Tier labels - all users must distribute characters into these tiers
 */
export const TIERS = ['S', 'A', 'B', 'C', 'D'] as const;
export type TierLevel = typeof TIERS[number];

/**
 * Tier colors for visual distinction (tiermaker.com colors - RGB format)
 */
export const TIER_COLORS: Record<TierLevel, string> = {
  S: 'rgb(255, 127, 127)', // Red - Best
  A: 'rgb(255, 201, 95)', // Orange
  B: 'rgb(255, 238, 77)', // Yellow
  C: 'rgb(255, 241, 157)', // Light Yellow
  D: 'rgb(157, 201, 109)', // Green - Worst
};

// ============================================================================
// GAME ELEMENTS
// ============================================================================

export const ELEMENTS = ['pyro', 'hydro', 'electro', 'cryo', 'anemo', 'geo', 'dendro'] as const;
export type Element = typeof ELEMENTS[number];

/**
 * Element emoji for display in tier list
 */
export const ELEMENT_EMOJIS: Record<Element, string> = {
  pyro: '🔥',
  hydro: '💧',
  electro: '⚡',
  cryo: '❄️',
  anemo: '🌪️',
  geo: '⛰️',
  dendro: '🌱',
};

// ============================================================================
// GOOGLE OAUTH CONFIGURATION
// ============================================================================

/**
 * Google OAuth Configuration
 * 
 * Environment variables needed:
 * - VITE_GOOGLE_OAUTH_CLIENT_ID: OAuth client ID from Google Cloud Console
 */
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '',
  redirectUri:
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  scopes: ['openid', 'profile', 'email'],
  
  // OAuth endpoints
  authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
} as const;

// ============================================================================
// GOOGLE FORM CONFIGURATION
// ============================================================================

/**
 * Google Form Configuration
 * 
 * Environment variable needed:
 * - VITE_GOOGLE_FORM_ID: Form ID from Google Forms URL
 * 
 * To find entry IDs:
 * 1. Open the form
 * 2. Use browser DevTools to inspect the form
 * 3. Or use Google Forms pre-fill URL feature
 */
export const GOOGLE_FORM_CONFIG = {
  formId: import.meta.env.VITE_GOOGLE_FORM_ID || '',
  baseUrl: 'https://docs.google.com/forms/d',
  formResponseEndpoint: (formId: string) =>
    `${GOOGLE_FORM_CONFIG.baseUrl}/${formId}/formResponse`,
  
  // Form field entry IDs (obtained from form inspection)
  // Format: entry.XXXXXXXXXX where X are digits from the form's internal structure
  // These MUST be updated to match your actual Google Form structure
  formFields: {
    // User information
    userName: import.meta.env.VITE_FORM_ENTRY_NAME || 'entry.1234567890',
    userEmail: import.meta.env.VITE_FORM_ENTRY_EMAIL || 'entry.0987654321',
    
    // Tier assignments (each tier has one field containing character list)
    sTier: import.meta.env.VITE_FORM_ENTRY_S_TIER || 'entry.1111111111',
    aTier: import.meta.env.VITE_FORM_ENTRY_A_TIER || 'entry.2222222222',
    bTier: import.meta.env.VITE_FORM_ENTRY_B_TIER || 'entry.3333333333',
    cTier: import.meta.env.VITE_FORM_ENTRY_C_TIER || 'entry.4444444444',
    dTier: import.meta.env.VITE_FORM_ENTRY_D_TIER || 'entry.5555555555',
    
    // Metadata
    timestamp: import.meta.env.VITE_FORM_ENTRY_TIMESTAMP || 'entry.6666666666',
  },
} as const;

// ============================================================================
// CHARACTER DATA
// ============================================================================

/**
 * Character data source (local JSON file)
 */
export const CHARACTER_DATA_URL = `${import.meta.env.BASE_URL}data/characters.json`;

/**
 * Asset paths
 */
export const ASSET_PATHS = {
  avatars: `${import.meta.env.BASE_URL}assets/avatars/`,
  travelers: `${import.meta.env.BASE_URL}assets/travelers/`,
};

// ============================================================================
// APPLICATION METADATA
// ============================================================================

/**
 * Application metadata
 */
export const APP_META = {
  name: 'Genshin Impact Community Tier List',
  version: '1.0.0',
  description:
    'Create and submit your personalized tier list for Genshin Impact characters',
  repository: 'https://github.com/aurceive/20260328-gi-community-tier-list',
  liveUrl: 'https://aurceive.github.io/20260328-gi-community-tier-list/',
  author: 'aurceive',
} as const;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

/**
 * Local storage key prefixes for data persistence
 */
export const STORAGE_KEYS = {
  // Tier list state
  tierList: 'gi-tier-list:tier-list',
  tierListMeta: 'gi-tier-list:tier-list-meta',
  
  // User data
  userProfile: 'gi-tier-list:user-profile',
  userToken: 'gi-tier-list:user-token',
  userTokenExpiry: 'gi-tier-list:user-token-expiry',
  
  // Settings
  theme: 'gi-tier-list:theme',
  language: 'gi-tier-list:language',
  
  // Cache
  characterCache: 'gi-tier-list:characters-cache',
  characterCacheTime: 'gi-tier-list:characters-cache-time',
} as const;

// ============================================================================
// UI CONFIGURATION
// ============================================================================

/**
 * UI constants and responsive breakpoints
 */
export const UI_CONFIG = {
  // Responsive breakpoints (pixels)
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
  
  // Character grid size (responsive)
  charactersPerRow: {
    mobile: 3,
    tablet: 4,
    desktop: 6,
  },
  
  // Tier column width (responsive)
  tierColumnWidth: {
    mobile: 100,
    tablet: 150,
    desktop: 200,
  },
  
  // Animation durations (milliseconds)
  animations: {
    quick: 150,
    normal: 300,
    slow: 500,
  },
  
  // Image sizes
  avatarSize: {
    small: 48,
    medium: 64,
    large: 96,
  },
};

// ============================================================================
// VALIDATION RULES
// ============================================================================

/**
 * Validation configuration for tier lists
 */
export const VALIDATION_CONFIG = {
  // All characters must be assigned
  requireAllCharacters: true,
  
  // No duplicate assignments
  noDuplicates: true,
  
  // Maximum characters per tier (null = no limit)
  maxPerTier: null,
  
  // Minimum characters per tier (null = no limit)
  minPerTier: null,
};

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

/**
 * Cache TTL (time to live) in milliseconds
 */
export const CACHE_CONFIG = {
  characters: 24 * 60 * 60 * 1000, // 24 hours
  userProfile: 7 * 24 * 60 * 60 * 1000, // 7 days
  oauthToken: 60 * 60 * 1000, // 1 hour (tokens usually expire in 1 hour)
};

// ============================================================================
// ERROR & SUCCESS MESSAGES
// ============================================================================

/**
 * Error messages shown to user
 */
export const ERROR_MESSAGES = {
  LOAD_CHARACTERS_FAILED: 'Failed to load character data. Please refresh the page.',
  OAUTH_FAILED: 'Failed to authenticate with Google. Please try again.',
  OAUTH_POPUP_BLOCKED: 'Popup blocked. Please allow popups and try again.',
  SUBMISSION_FAILED: 'Failed to submit tier list. Please try again.',
  INVALID_TIER_LIST: 'All characters must be assigned to a tier.',
  MISSING_CONFIG: 'Application configuration is incomplete. Please check .env variables.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

/**
 * Success messages shown to user
 */
export const SUCCESS_MESSAGES = {
  SUBMISSION_SUCCESS:
    'Your tier list has been submitted successfully! Thank you for participating.',
  LOGIN_SUCCESS: 'Welcome! You are now signed in.',
  LOGOUT_SUCCESS: 'You have been signed out.',
} as const;

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================

/**
 * Debug mode - enabled in development
 */
export const DEBUG = import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true';

/**
 * Debug configuration
 */
export const DEBUG_CONFIG = {
  // Enable console logging
  logging: DEBUG,
  
  // Log API calls
  logApi: DEBUG,
  
  // Log state changes
  logState: DEBUG,
  
  // Log form submissions
  logSubmission: DEBUG,
  
  // Mock OAuth for development
  mockOAuth: false,
  mockUserId: 'dev-user-123',
  mockUserEmail: 'dev@example.com',
};

// ============================================================================
// TIER LIST STATE TYPE
// ============================================================================

/**
 * Tier list state structure
 */
export interface TierListState {
  // User info
  userId: string;
  userEmail: string;
  userName: string;
  
  // Tier assignments: Map of character ID to tier label
  assignments: Record<string, TierLevel | null>;
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
  submittedAt?: number;
  
  // Metadata
  version: number;
  submitted: boolean;
}

/**
 * Create initial tier list state
 */
export function createInitialTierListState(
  userId: string = '',
  userEmail: string = '',
  userName: string = ''
): TierListState {
  return {
    userId,
    userEmail,
    userName,
    assignments: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1,
    submitted: false,
  };
}
