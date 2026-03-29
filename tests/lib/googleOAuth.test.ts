import { describe, it, expect } from 'vitest';
import {
  decodeJWT,
  isTokenExpired,
  validateIdToken,
  type GoogleUserProfile,
} from '@/lib/googleOAuth';

/** Encode a payload as a fake JWT (no valid signature — sufficient for unit tests) */
function makeToken(payload: Record<string, unknown>): string {
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=+$/, '');
  return `header.${encodedPayload}.signature`;
}

describe('googleOAuth', () => {
  describe('decodeJWT', () => {
    it('should decode valid JWT', () => {
      const payload = { sub: '123', name: 'Test User', email: 'test@example.com' };
      const decoded = decodeJWT(makeToken(payload));
      expect(decoded).toEqual(payload);
    });

    it('should throw on invalid JWT format', () => {
      expect(() => decodeJWT('invalid')).toThrow('Invalid token');
      expect(() => decodeJWT('invalid.token')).toThrow();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for future timestamp', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      expect(isTokenExpired(futureTime)).toBe(false);
    });

    it('should return true for past timestamp', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      expect(isTokenExpired(pastTime)).toBe(true);
    });

    it('should return true for current timestamp', () => {
      const now = Math.floor(Date.now() / 1000);
      expect(isTokenExpired(now)).toBe(true);
    });
  });

  describe('validateIdToken', () => {
    const CLIENT_ID = 'test-client-id.apps.googleusercontent.com';
    const futureExp = Math.floor(Date.now() / 1000) + 3600;

    const validClaims = {
      iss: 'https://accounts.google.com',
      aud: CLIENT_ID,
      exp: futureExp,
      iat: Math.floor(Date.now() / 1000),
      sub: '123456',
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'https://example.com/pic.jpg',
      email_verified: true,
    };

    it('should extract user profile from valid token', () => {
      const result = validateIdToken(makeToken(validClaims), CLIENT_ID);

      const expected: GoogleUserProfile = {
        sub: '123456',
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'https://example.com/pic.jpg',
        email_verified: true,
      };
      expect(result).toEqual(expected);
    });

    it('should throw if iss is wrong', () => {
      const token = makeToken({ ...validClaims, iss: 'https://evil.example.com' });
      expect(() => validateIdToken(token, CLIENT_ID)).toThrow('Invalid token issuer');
    });

    it('should throw if aud does not match client ID', () => {
      const token = makeToken({ ...validClaims, aud: 'other-client-id' });
      expect(() => validateIdToken(token, CLIENT_ID)).toThrow('Token audience does not match');
    });

    it('should throw if token is expired', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const token = makeToken({ ...validClaims, exp: pastExp });
      expect(() => validateIdToken(token, CLIENT_ID)).toThrow('Token is expired');
    });

    it('should throw if token missing sub claim', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sub: _sub, ...withoutSub } = validClaims;
      expect(() => validateIdToken(makeToken(withoutSub), CLIENT_ID)).toThrow(
        'Missing required token claims'
      );
    });

    it('should throw if token missing email claim', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email: _email, ...withoutEmail } = validClaims;
      expect(() => validateIdToken(makeToken(withoutEmail), CLIENT_ID)).toThrow(
        'Missing required token claims'
      );
    });
  });
});
