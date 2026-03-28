import { describe, it, expect } from 'vitest';
import {
  generatePKCE,
  generateAuthorizationUrl,
  decodeJWT,
  isTokenExpired,
  getUserProfileFromToken,
  type GoogleUserProfile,
} from '@/lib/googleOAuth';

describe('googleOAuth', () => {
  describe('generatePKCE', () => {
    it('should generate code verifier and challenge', async () => {
      const { codeVerifier, codeChallenge } = await generatePKCE();

      expect(codeVerifier).toBeTruthy();
      expect(codeVerifier.length).toBe(128);
      expect(codeChallenge).toBeTruthy();
      expect(codeChallenge.length).toBeGreaterThan(0);
    });

    it('should generate different values each time', async () => {
      const { codeVerifier: v1 } = await generatePKCE();
      const { codeVerifier: v2 } = await generatePKCE();

      expect(v1).not.toBe(v2);
    });

    it('should generate valid base64url code challenge', async () => {
      const { codeChallenge } = await generatePKCE();

      // Base64url should only contain: A-Z, a-z, 0-9, -, _
      const base64urlRegex = /^[A-Za-z0-9_-]+$/;
      expect(base64urlRegex.test(codeChallenge)).toBe(true);
    });
  });

  describe('generateAuthorizationUrl', () => {
    it('should generate valid authorization URL', () => {
      const url = generateAuthorizationUrl('testChallenge', 'testState');

      expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
      expect(url).toContain('client_id=');
      expect(url).toContain('code_challenge=testChallenge');
      expect(url).toContain('state=testState');
      expect(url).toContain('code_challenge_method=S256');
    });

    it('should include all required scopes', () => {
      const url = generateAuthorizationUrl('challenge', 'state');

      expect(url).toContain('openid');
      expect(url).toContain('profile');
      expect(url).toContain('email');
    });
  });

  describe('decodeJWT', () => {
    it('should decode valid JWT', () => {
      // Sample JWT (header.payload.signature)
      const payload = { sub: '123', name: 'Test User', email: 'test@example.com' };
      const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
      const token = `header.${encodedPayload}.signature`;

      const decoded = decodeJWT(token);

      expect(decoded).toEqual(payload);
    });

    it('should throw on invalid JWT format', () => {
      expect(() => decodeJWT('invalid')).toThrow('Invalid token');
      expect(() => decodeJWT('invalid.token')).toThrow();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for future timestamp', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      expect(isTokenExpired(futureTime)).toBe(false);
    });

    it('should return true for past timestamp', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      expect(isTokenExpired(pastTime)).toBe(true);
    });

    it('should return true for current timestamp', () => {
      const now = Math.floor(Date.now() / 1000);
      expect(isTokenExpired(now)).toBe(true);
    });
  });

  describe('getUserProfileFromToken', () => {
    it('should extract user profile from valid token', () => {
      const profile: GoogleUserProfile = {
        sub: '123456',
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'https://example.com/pic.jpg',
        email_verified: true,
      };

      const encodedPayload = btoa(JSON.stringify(profile)).replace(/=/g, '');
      const token = `header.${encodedPayload}.signature`;

      const result = getUserProfileFromToken(token);

      expect(result).toEqual(profile);
    });

    it('should throw if token missing sub claim', () => {
      const profile = { name: 'John Doe', email: 'john@example.com' };
      const encodedPayload = btoa(JSON.stringify(profile)).replace(/=/g, '');
      const token = `header.${encodedPayload}.signature`;

      expect(() => getUserProfileFromToken(token)).toThrow(
        'Invalid token: missing required claims'
      );
    });

    it('should throw if token missing email claim', () => {
      const profile = { sub: '123', name: 'John Doe' };
      const encodedPayload = btoa(JSON.stringify(profile)).replace(/=/g, '');
      const token = `header.${encodedPayload}.signature`;

      expect(() => getUserProfileFromToken(token)).toThrow(
        'Invalid token: missing required claims'
      );
    });
  });
});
