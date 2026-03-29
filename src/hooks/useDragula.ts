import { useEffect, useRef } from 'react';
import dragula from 'dragula';

interface UseDragulaOptions {
  onCharacterMoved: (characterId: string, targetTier: string, siblingId: string | null) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

/**
 * Dragula-based drag-and-drop hook following TierMaker's pattern:
 * - Uses isContainer callback (not explicit container array)
 * - Characters are direct children of .sort containers
 * - Manually reverts DOM moves, lets React re-render from state
 */
export function useDragula(options: UseDragulaOptions) {
  const callbacksRef = useRef(options);
  callbacksRef.current = options;

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const drake = dragula({
          isContainer: (el) => {
            return el?.classList.contains('sort') ?? false;
          },
          moves: (el) => {
            return el?.classList.contains('character') ?? false;
          },
          copy: false,
          revertOnSpill: false,
          mirrorContainer: document.body,
        });

        drake.on('drag', (el: Element) => {
          el.classList.add('dragging');
          callbacksRef.current.onDragStart?.();
        });

        drake.on('drop', (el: Element, target: Element | null, source: Element, sibling: Element | null) => {
          el.classList.remove('dragging');

          if (!target) return;

          const characterId = el.id;
          const targetTier = target.getAttribute('data-tier') || 'unassigned';
          // Capture sibling BEFORE reverting DOM — it tells us the insertion point
          const siblingId = sibling?.id ?? null;

          // Revert Dragula's DOM move: put element back in source
          // so React can reconcile cleanly from state update
          source.appendChild(el);

          if (characterId) {
            callbacksRef.current.onCharacterMoved(characterId, targetTier, siblingId);
          }

          callbacksRef.current.onDragEnd?.();
        });

        drake.on('dragend', (el: Element) => {
          if (el) el.classList.remove('dragging');
          callbacksRef.current.onDragEnd?.();
        });

        return () => {
          drake.destroy();
        };
      } catch (error) {
        console.error('[useDragula] Failed to initialize:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}
