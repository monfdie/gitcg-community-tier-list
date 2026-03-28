/**
 * Application configuration and constants
 */

/**
 * Tier definitions - all users must distribute characters into these tiers
 */
export const TIERS = ['S', 'A', 'B', 'C', 'D'] as const;
export type TierLevel = typeof TIERS[number];

/**
 * Google OAuth Configuration
 */
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
  redirectUri:
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  scopes: ['openid', 'profile', 'email'],
} as const;

/**
 * Google Form Configuration
 */
export const GOOGLE_FORM_CONFIG = {
  formId: import.meta.env.VITE_GOOGLE_FORM_ID,
  baseUrl: 'https://docs.google.com/forms/d',
  formResponseEndpoint: (formId: string) =>
    `${GOOGLE_FORM_CONFIG.baseUrl}/${formId}/formResponse`,
  formFields: {
    // Map form field names to entry IDs (from Google Forms pre-fill URL)
    // These should be updated based on your actual form structure
    userName: 'entry.1234567890', // Replace with actual entry ID
    userEmail: 'entry.0987654321', // Replace with actual entry ID
    sTier: 'entry.1111111111',     // Replace with actual entry ID
    aTier: 'entry.2222222222',     // Replace with actual entry ID
    bTier: 'entry.3333333333',     // Replace with actual entry ID
    cTier: 'entry.4444444444',     // Replace with actual entry ID
    dTier: 'entry.5555555555',     // Replace with actual entry ID
    timestamp: 'entry.6666666666', // Replace with actual entry ID
  },
} as const;

/**
 * Character data source
 */
export const CHARACTER_DATA_URL = '/data/characters.json';

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
} as const;

/**
 * Debug mode - check environment
 */
export const DEBUG = import.meta.env.VITE_DEBUG === 'true';

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  LOAD_CHARACTERS_FAILED: 'Failed to load character data. Please refresh the page.',
  OAUTH_FAILED: 'Failed to authenticate with Google. Please try again.',
  SUBMISSION_FAILED: 'Failed to submit tier list. Please try again.',
  INVALID_TIER_LIST: 'All characters must be assigned to a tier.',
  MISSING_CONFIG: 'Application configuration is incomplete.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SUBMISSION_SUCCESS:
    'Your tier list has been submitted successfully! Thank you for participating.',
} as const;
