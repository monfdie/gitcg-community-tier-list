import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildPrefilledUrl,
  validateTierListCompletion,
  generateTierListSummary,
} from '@/utils/googleFormEncoder';
import type { TierList } from '@/types';

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

const mockMapping = {
  formId: 'test-form-id',
  characterToEntry: {
    nahida: 'entry.1111111111',
    fischl: 'entry.2222222222',
    bennett: 'entry.3333333333',
  },
};

describe('googleFormEncoder', () => {
  describe('buildPrefilledUrl', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMapping),
      }));
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      // Reset module-level mapping cache so each test starts fresh
      vi.resetModules();
    });

    it('should build a viewform URL with correct base', async () => {
      const url = await buildPrefilledUrl(mockTierList);
      expect(url).toContain('https://docs.google.com/forms/d/e/test-form-id/viewform');
    });

    it('should include usp=pp_url param', async () => {
      const url = await buildPrefilledUrl(mockTierList);
      expect(url).toContain('usp=pp_url');
    });

    it('should encode S tier characters with their entry IDs', async () => {
      const url = await buildPrefilledUrl(mockTierList);
      expect(url).toContain('entry.1111111111=S');
      expect(url).toContain('entry.2222222222=S');
    });

    it('should encode A tier characters with their entry IDs', async () => {
      const url = await buildPrefilledUrl(mockTierList);
      expect(url).toContain('entry.3333333333=A');
    });

    it('should omit characters not in mapping without throwing', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const tierListWithUnknown: TierList = {
        ...mockTierList,
        B: [{ id: 'unknown-char', name: 'Unknown', element: 'pyro', rarity: 4 }],
      };
      const url = await buildPrefilledUrl(tierListWithUnknown);
      expect(url).toContain('viewform');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unknown-char'));
      warnSpy.mockRestore();
    });

    it('should throw if mapping fetch fails', async () => {
      vi.resetModules();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
      const { buildPrefilledUrl: freshBuild } = await import('@/utils/googleFormEncoder');
      await expect(freshBuild(mockTierList)).rejects.toThrow(
        'Failed to load form-character-mapping.json'
      );
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
