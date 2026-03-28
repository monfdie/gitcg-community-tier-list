import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TierRow } from '@/components/TierRow';
import { CharacterItem } from '@/components/CharacterItem';
import { UnassignedPool } from '@/components/UnassignedPool';
import type { Character } from '@/types';

const createMockCharacters = (): Character[] => [
  { id: 'nahida', name: 'Nahida', element: 'dendro', rarity: 5 },
  { id: 'fischl', name: 'Fischl', element: 'electro', rarity: 4 },
  { id: 'bennett', name: 'Bennett', element: 'pyro', rarity: 4 },
];

describe('Tier List Components', () => {
  describe('TierRow', () => {
    it('should render tier label and title', () => {
      const mockCharacters = createMockCharacters();
      render(
        <TierRow
          tier="S"
          characters={[mockCharacters[0]]}
          count={1}
          onCharacterClick={vi.fn()}
        />
      );

      expect(screen.getByText('S')).toBeInTheDocument();
      expect(screen.getByText('Nahida')).toBeInTheDocument();
    });

    it('should display character count', () => {
      const mockCharacters = createMockCharacters();
      render(
        <TierRow
          tier="A"
          characters={mockCharacters.slice(0, 2)}
          count={2}
          onCharacterClick={vi.fn()}
        />
      );

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should show empty state when no characters', () => {
      render(
        <TierRow
          tier="B"
          characters={[]}
          count={0}
          onCharacterClick={vi.fn()}
        />
      );

      expect(screen.getByText('Drop characters here')).toBeInTheDocument();
    });

    it('should call onCharacterClick when character clicked', () => {
      const mockCharacters = createMockCharacters();
      const onClick = vi.fn();
      render(
        <TierRow
          tier="S"
          characters={[mockCharacters[0]]}
          count={1}
          onCharacterClick={onClick}
        />
      );

      const characterSlot = screen.getByLabelText(
        /Remove Nahida from tier S/
      );
      characterSlot.click();

      expect(onClick).toHaveBeenCalledWith(mockCharacters[0]);
    });

    it('should render all tier colors correctly', () => {
      const tiers = ['S', 'A', 'B', 'C', 'D'];
      const { rerender } = render(
        <TierRow
          tier="S"
          characters={[]}
          count={0}
          onCharacterClick={vi.fn()}
        />
      );

      for (const tier of tiers) {
        rerender(
          <TierRow
            tier={tier}
            characters={[]}
            count={0}
            onCharacterClick={vi.fn()}
          />
        );
        expect(screen.getByText(tier)).toBeInTheDocument();
      }
    });
  });

  describe('CharacterItem', () => {
    it('should render character name and element', () => {
      const mockCharacters = createMockCharacters();
      render(
        <CharacterItem
          character={mockCharacters[0]}
          onClick={vi.fn()}
        />
      );

      expect(screen.getByText('Nahida')).toBeInTheDocument();
      expect(screen.getByText('dendro')).toBeInTheDocument();
    });

    it('should display character rarity as stars', () => {
      const mockCharacters = createMockCharacters();
      render(
        <CharacterItem
          character={mockCharacters[0]}
          onClick={vi.fn()}
        />
      );

      expect(screen.getByText('★★★★★')).toBeInTheDocument();
    });

    it('should display correct rarity count', () => {
      const mockCharacters = createMockCharacters();
      render(
        <CharacterItem
          character={mockCharacters[1]}
          onClick={vi.fn()}
        />
      );

      expect(screen.getByText('★★★★')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const mockCharacters = createMockCharacters();
      const onClick = vi.fn();
      render(
        <CharacterItem
          character={mockCharacters[0]}
          onClick={onClick}
        />
      );

      screen.getByRole('button').click();

      expect(onClick).toHaveBeenCalledWith(mockCharacters[0]);
    });

    it('should be draggable by default', () => {
      const mockCharacters = createMockCharacters();
      const { container } = render(
        <CharacterItem
          character={mockCharacters[0]}
          onClick={vi.fn()}
        />
      );

      const element = container.querySelector('[draggable]');
      expect(element).toHaveAttribute('draggable', 'true');
    });

    it('should not be draggable when disabled', () => {
      const mockCharacters = createMockCharacters();
      const { container } = render(
        <CharacterItem
          character={mockCharacters[0]}
          onClick={vi.fn()}
          draggable={false}
        />
      );

      const element = container.querySelector('[draggable]');
      expect(element).toHaveAttribute('draggable', 'false');
    });
  });

  describe('UnassignedPool', () => {
    it('should render all characters', () => {
      const mockCharacters = createMockCharacters();
      render(
        <UnassignedPool
          characters={mockCharacters}
        />
      );

      expect(screen.getByText('Nahida')).toBeInTheDocument();
      expect(screen.getByText('Fischl')).toBeInTheDocument();
      expect(screen.getByText('Bennett')).toBeInTheDocument();
    });

    it('should display character count', () => {
      const mockCharacters = createMockCharacters();
      render(
        <UnassignedPool
          characters={mockCharacters}
        />
      );

      expect(screen.getByText('3 left')).toBeInTheDocument();
    });

    it('should filter characters by search query', () => {
      const mockCharacters = createMockCharacters();
      render(
        <UnassignedPool
          characters={mockCharacters}
          searchQuery="fischl"
        />
      );

      expect(screen.getByText('Fischl')).toBeInTheDocument();
      expect(screen.queryByText('Nahida')).not.toBeInTheDocument();
      expect(screen.queryByText('Bennett')).not.toBeInTheDocument();
    });

    it('should filter by element type', () => {
      const mockCharacters = createMockCharacters();
      render(
        <UnassignedPool
          characters={mockCharacters}
          searchQuery="pyro"
        />
      );

      expect(screen.getByText('Bennett')).toBeInTheDocument();
      expect(screen.queryByText('Fischl')).not.toBeInTheDocument();
    });

    it('should show no results message when no matches', () => {
      const mockCharacters = createMockCharacters();
      render(
        <UnassignedPool
          characters={mockCharacters}
          searchQuery="nonexistent"
        />
      );

      expect(screen.getByText(/No characters match/)).toBeInTheDocument();
    });

    it('should show empty state when no characters', () => {
      render(
        <UnassignedPool
          characters={[]}
        />
      );

      expect(screen.getByText(/All characters assigned/)).toBeInTheDocument();
    });

    it('should call onCharacterClick when character clicked', () => {
      const mockCharacters = createMockCharacters();
      const onClick = vi.fn();
      render(
        <UnassignedPool
          characters={[mockCharacters[0]]}
          onCharacterClick={onClick}
        />
      );

      const characterButton = screen.getAllByRole('button')[0];
      characterButton.click();

      expect(onClick).toHaveBeenCalledWith(mockCharacters[0]);
    });

    it('should update count when filtered', () => {
      const mockCharacters = createMockCharacters();
      const { rerender } = render(
        <UnassignedPool
          characters={mockCharacters}
        />
      );

      expect(screen.getByText('3 left')).toBeInTheDocument();

      rerender(
        <UnassignedPool
          characters={mockCharacters}
          searchQuery="pyro"
        />
      );

      expect(screen.getByText('1 left')).toBeInTheDocument();
    });
  });
});
