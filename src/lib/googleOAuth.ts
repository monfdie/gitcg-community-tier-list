/**
 * Google OAuth utilities for Sign-In 2.0
 * ID token decoding and user profile extraction
 */

/**
 * Google user profile from ID token claims
 */
export interface GoogleUserProfile {
  sub: string; // User ID
  name: string;
  email: string;
  picture?: string;
  email_verified?: boolean;
}

/** Full set of standard claims in a Google ID token */
interface GoogleIdTokenClaims extends GoogleUserProfile {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
}

/**
 * Decode JWT token (without signature verification — client-side only)
 */
export function decodeJWT<T = Record<string, unknown>>(token: string): T {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  try {
    // Decode payload (second part)
    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return decoded as T;
  } catch {
    throw new Error('Failed to decode token');
  }
}

/**
 * Validate a Google ID token and extract the user profile.
 *
 * Checks:
 * - iss: must be "https://accounts.google.com"
 * - aud: must match the app's OAuth client ID
 * - exp: token must not be expired
 * - sub + email: required profile claims must be present
 *
 * NOTE: Signature verification requires the public key and must be done
 * server-side. These checks protect against the most common client-side
 * mistakes (wrong audience, expired token, malformed payload).
 */
export function validateIdToken(idToken: string, expectedClientId: string): GoogleUserProfile {
  const claims = decodeJWT<GoogleIdTokenClaims>(idToken);

  if (claims.iss !== 'https://accounts.google.com') {
    throw new Error('Invalid token issuer');
  }

  if (claims.aud !== expectedClientId) {
    throw new Error('Token audience does not match client ID');
  }

  if (isTokenExpired(claims.exp)) {
    throw new Error('Token is expired');
  }

  if (!claims.sub || !claims.email) {
    throw new Error('Missing required token claims (sub, email)');
  }

  return {
    sub: claims.sub,
    name: claims.name,
    email: claims.email,
    picture: claims.picture,
    email_verified: claims.email_verified,
  };
}

/**
 * Check if token is expired (JWT exp claim is seconds since epoch)
 */
export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt * 1000;
}

