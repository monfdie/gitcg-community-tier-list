import { useEffect } from 'react';
import dragula from 'dragula';
import { TIERS } from '@/config';

interface UseDragulaSetupOptions {
  onCharacterMoved: (characterId: string, targetTierId: string) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

/**
 * Custom hook for managing drag-and-drop with Dragula library
 * Handles drag-drop between tiers and unassigned pool
 */
export function useDragula(options: UseDragulaSetupOptions) {
  const { onCharacterMoved, onDragStart, onDragEnd } = options;

  useEffect(() => {
    // Wait for DOM to be fully available
    const timer = setTimeout(() => {
      try {
        // Collect all drop containers
        const containers: Element[] = [];

        // Add unassigned pool container
        const unassignedPool = document.getElementById('unassigned-pool');
        if (unassignedPool) containers.push(unassignedPool);

        // Add all tier containers
        TIERS.forEach((tier) => {
          const tierContainer = document.getElementById(`tier-${tier}`);
          if (tierContainer) containers.push(tierContainer);
        });

        // Need at least 2 containers to initialize dragula
        if (containers.length < 2) return;

        // Initialize dragula with options
        const drake = dragula(containers, {
          // Only elements with 'character' class are draggable
          moves: (el: Element | undefined) => {
            if (!el) return false;
            return el.classList.contains('character');
          },

          // All containers accept all items
          accepts: () => {
            return true;
          },

          // Move mode (not copy)
          copy: false,

          // Horizontal direction for character arrangement
          direction: 'horizontal',

          // Don't revert if dropped outside containers
          revertOnSpill: false,

          // Smooth animations
          mirrorContainer: document.body,
        });

        // Handle drag start
        drake.on('drag', (el: Element) => {
          el.classList.add('dragging');
          onDragStart?.();
        });

        // Handle drop
        drake.on('drop', (el: Element, target: Element | null) => {
          el.classList.remove('dragging');

          if (!target) return;

          // Determine target tier based on container ID
          const targetId = target.id;
          let targetTierId = 'unassigned';

          // Parse tier ID (format: "tier-S", "tier-A", etc.)
          if (targetId.startsWith('tier-')) {
            targetTierId = targetId.replace('tier-', '');
          }

          // Get character ID from element
          const characterId = el.id;
          if (!characterId) {
            console.warn('Character element missing ID');
            return;
          }

          // Notify parent of character move
          onCharacterMoved(characterId, targetTierId);

          onDragEnd?.();
        });

        // Handle drag end (no drop, reverted or cancelled)
        drake.on('dragend', (el: Element) => {
          el.classList.remove('dragging');
          onDragEnd?.();
        });

        // Cleanup on unmount
        return () => {
          drake.destroy();
        };
      } catch (error) {
        console.error('Failed to initialize dragula:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [onCharacterMoved, onDragStart, onDragEnd]);
}
