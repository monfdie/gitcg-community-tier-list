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
    // drake declared outside setTimeout so the cleanup function can destroy it
    // even after the 100ms delay has fired
    let drake: dragula.Drake | undefined;

    const timer = setTimeout(() => {
      try {
        drake = dragula({
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
          const siblingId = sibling?.id ?? null;

          if (source !== target) {
            // Cross-container drop: revert el to source so React can remove it cleanly.
            // Without this, React would call source.removeChild(el) when el is already
            // in target — causing a DOM error.
            source.appendChild(el);
          }
          // Same-container drop: Dragula already placed el at the correct position.
          // Do NOT revert. React's lastPlacedIndex algorithm treats "old index > lastPlaced"
          // as "no move needed" — if we append el to end, React leaves it there (WRONG).
          // Leaving el at Dragula's position, React's insertBefore calls are no-ops. ✓

          if (characterId) {
            callbacksRef.current.onCharacterMoved(characterId, targetTier, siblingId);
          }

          callbacksRef.current.onDragEnd?.();
        });

        drake.on('dragend', (el: Element) => {
          if (el) el.classList.remove('dragging');
          callbacksRef.current.onDragEnd?.();
        });
      } catch (error) {
        console.error('[useDragula] Failed to initialize:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      drake?.destroy();
    };
  }, []);
}
