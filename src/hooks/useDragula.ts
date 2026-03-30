import { useEffect, useLayoutEffect, useRef } from 'react';
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
  // Update ref after every render so event handlers always see the latest callbacks
  // without causing the drake instance to be recreated. useLayoutEffect runs
  // synchronously after DOM mutations and before Dragula fires any event.
  useLayoutEffect(() => {
    callbacksRef.current = options;
  });

  useEffect(() => {
    // Track mouse/touch position for 2D shadow placement correction in flex-wrap containers
    let mouseX = 0;
    let mouseY = 0;
    
    const onMouseMove = (e: MouseEvent) => { 
      mouseX = e.clientX; 
      mouseY = e.clientY; 
    };
    
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        mouseX = touch.clientX;
        mouseY = touch.clientY;
      }
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove, false);

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

        // Correct shadow position for flex-wrap containers using 2D hit detection.
        // Dragula's default only checks Y-midpoints (1D), which fails for multi-row grids.
        //
        // Algorithm per item (DOM order):
        //   - cursor BELOW item's row (mouseY >= rect.bottom) → skip
        //   - cursor ON/ABOVE item's row AND left of X-midpoint → insert before item
        //   - cursor right of X-midpoint → check if next item starts a new row:
        //       yes → place shadow at end of current row (= before first item of next row)
        //       no  → continue to next item on same row
        //   - no match → append to end
        drake.on('shadow', (el: Element, container: Element) => {
          if (!container.classList.contains('sort')) return;

          const items = Array.from(container.children).filter(
            (c) => c !== el && c.classList.contains('character')
          ) as HTMLElement[];

          if (items.length === 0) return;

          let ref: Element | null = null;
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const rect = item.getBoundingClientRect();

            if (mouseY >= rect.bottom) continue; // cursor is below this row, skip

            if (mouseX < rect.left + rect.width / 2) {
              ref = item;
              break;
            }

            // Cursor is right of this item's midpoint — check if next item is a new row
            const nextItem = items[i + 1];
            if (!nextItem) break; // last item; cursor right of it → append to end

            const nextRect = nextItem.getBoundingClientRect();
            // 1px tolerance for subpixel rendering
            if (nextRect.top > rect.bottom - 1) {
              // Next item is on a new row → end of current row is the right spot
              ref = nextItem;
              break;
            }
            // Same row → continue
          }

          if (ref !== null) {
            if (el.nextSibling !== ref) container.insertBefore(el, ref);
          } else {
            if (el.nextSibling !== null) container.appendChild(el);
          }
        });

        drake.on('drop', (el: Element, target: Element | null, source: Element) => {
          el.classList.remove('dragging');

          if (!target) return;

          const characterId = el.id;
          const targetTier = target.getAttribute('data-tier') || 'unassigned';

          // Read sibling from the DOM at drop time — reflects our corrected shadow position,
          // not Dragula's 1D-computed sibling passed as the 4th argument.
          // Skip non-character nodes (e.g. mirror, placeholder) when finding sibling.
          let domSibling: Element | null = el.nextElementSibling;
          while (domSibling && !domSibling.classList.contains('character')) {
            domSibling = domSibling.nextElementSibling;
          }
          const siblingId = domSibling?.id ?? null;

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
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove, false);
    };
  }, []);
}
