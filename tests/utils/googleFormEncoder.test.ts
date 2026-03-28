import { describe, it, expect, vi } from 'vitest';
import {
  encodeFormSubmission,
  validateTierListCompletion,
  generateTierListSummary,
} from '@/utils/googleFormEncoder';
import type { TierList, UserProfile } from '@/types';

const mockUser: UserProfile = {
  id: '123456',
  name: 'John Doe',
  email: 'john@example.com',
};

const mockTierList: TierList = {
  S: [
    { id: 'nahida', name: 'Nahida', element: 'dendro', rarity: 5 },
    { id: 'fischl', name: 'Fischl', element: 'electro', rarity: 4 },
  ],
  A: [
    { id: 'bennett', name: 'Bennett', element: 'pyro', rarity: 4 },
  ],
  B: [],
  C: [],
  D: [],
};

describe('googleFormEncoder', () => {
  describe('encodeFormSubmission', () => {
    it('should encode user information', () => {
      const params = encodeFormSubmission(mockTierList, mockUser);

      expect(params.has('entry.1234567890')).toBe(true); // userName
      expect(params.get('entry.1234567890')).toBe('John Doe');
      expect(params.has('entry.0987654321')).toBe(true); // userEmail
      expect(params.get('entry.0987654321')).toBe('john@example.com');
    });

    it('should encode S tier characters', () => {
      const params = encodeFormSubmission(mockTierList, mockUser);

      expect(params.has('entry.1111111111')).toBe(true);
      const sTierValue = params.get('entry.1111111111');
      expect(sTierValue).toContain('Nahida');
      expect(sTierValue).toContain('Fischl');
    });

    it('should encode A tier characters', () => {
      const params = encodeFormSubmission(mockTierList, mockUser);

      expect(params.has('entry.2222222222')).toBe(true);
      const aTierValue = params.get('entry.2222222222');
      expect(aTierValue).toContain('Bennett');
    });

    it('should encode empty tiers as empty strings', () => {
      const params = encodeFormSubmission(mockTierList, mockUser);

      expect(params.get('entry.3333333333')).toBe(''); // B tier
      expect(params.get('entry.4444444444')).toBe(''); // C tier
      expect(params.get('entry.5555555555')).toBe(''); // D tier
    });

    it('should encode timestamp', () => {
      const params = encodeFormSubmission(mockTierList, mockUser);

      expect(params.has('entry.6666666666')).toBe(true);
      const timestamp = params.get('entry.6666666666');
      // Should be ISO format
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should handle user with missing optional fields', () => {
      const userWithoutEmail: UserProfile = {
        id: '123',
        name: 'John',
        email: '',
      };

      const params = encodeFormSubmission(mockTierList, userWithoutEmail);

      expect(params.get('entry.1234567890')).toBe('John');
      expect(params.get('entry.0987654321')).toBe('');
    });

    it('should join multiple characters with comma and space', () => {
      const params = encodeFormSubmission(mockTierList, mockUser);

      const sTierValue = params.get('entry.1111111111');
      expect(sTierValue).toBe('Nahida, Fischl');
    });

    it('should return URLSearchParams instance', () => {
      const params = encodeFormSubmission(mockTierList, mockUser);

      expect(params instanceof URLSearchParams).toBe(true);
    });
  });

  describe('validateTierListCompletion', () => {
    it('should validate complete tier list', () => {
      const result = validateTierListCompletion(mockTierList, 3);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject incomplete tier list', () => {
      const result = validateTierListCompletion(mockTierList, 5);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Please assign all 5 characters');
      expect(result.error).toContain('Currently assigned: 3');
    });

    it('should handle empty tier list', () => {
      const emptyTierList: TierList = {
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
      };

      const result = validateTierListCompletion(emptyTierList, 10);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Currently assigned: 0');
    });

    it('should handle over-assigned characters', () => {
      const overAssignedTierList: TierList = {
        S: [
          { id: '1', name: 'Char1', element: 'pyro', rarity: 5 },
          { id: '2', name: 'Char2', element: 'hydro', rarity: 5 },
          { id: '3', name: 'Char3', element: 'electro', rarity: 5 },
        ],
        A: [],
        B: [],
        C: [],
        D: [],
      };

      const result = validateTierListCompletion(overAssignedTierList, 2);

      expect(result.isValid).toBe(false);
    });
  });

  describe('generateTierListSummary', () => {
    it('should generate readable summary', () => {
      const summary = generateTierListSummary(mockTierList);

      expect(summary).toContain('S Tier (2)');
      expect(summary).toContain('A Tier (1)');
      expect(summary).toContain('B Tier (0)');
      expect(summary).toContain('Nahida');
      expect(summary).toContain('Bennett');
    });

    it('should show None for empty tiers', () => {
      const summary = generateTierListSummary(mockTierList);

      expect(summary).toContain('B Tier (0): None');
      expect(summary).toContain('C Tier (0): None');
    });

    it('should separate characters with commas', () => {
      const summary = generateTierListSummary(mockTierList);

      expect(summary).toContain('Nahida, Fischl');
    });

    it('should include all tiers in order', () => {
      const summary = generateTierListSummary(mockTierList);
      const lines = summary.split('\n');

      expect(lines).toHaveLength(5);
      expect(lines[0]).toContain('S Tier');
      expect(lines[1]).toContain('A Tier');
      expect(lines[2]).toContain('B Tier');
      expect(lines[3]).toContain('C Tier');
      expect(lines[4]).toContain('D Tier');
    });

    it('should handle all tiers filled', () => {
      const fullTierList: TierList = {
        S: [{ id: '1', name: 'S-char', element: 'pyro', rarity: 5 }],
        A: [{ id: '2', name: 'A-char', element: 'hydro', rarity: 5 }],
        B: [{ id: '3', name: 'B-char', element: 'electro', rarity: 5 }],
        C: [{ id: '4', name: 'C-char', element: 'cryo', rarity: 5 }],
        D: [{ id: '5', name: 'D-char', element: 'anemo', rarity: 5 }],
      };

      const summary = generateTierListSummary(fullTierList);

      expect(summary).toContain('S-char');
      expect(summary).toContain('A-char');
      expect(summary).toContain('B-char');
      expect(summary).toContain('C-char');
      expect(summary).toContain('D-char');
    });
  });
});
