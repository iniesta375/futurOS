import { create } from 'zustand'
import { SNAP_ZONE } from '@constants/snapConstants'

/**
 * useSnapStore — Phase 12C snap session state.
 *
 * Kept SEPARATE from windowStore intentionally:
 *  - Snap drag state is transient (changes 60x/sec during drag)
 *  - windowStore is persistent (position, size, snapZone survive navigation)
 *  - Separating them means drag state changes don't trigger WindowManager
 *    and all sibling Window re-renders
 *
 * State shape:
 *  activeDragWindowId  — which window is currently being dragged
 *  activeZone          — zone the cursor is hovering (during drag)
 *  previewVisible      — whether the snap preview ghost is shown
 *  assistWindowId      — which window triggered snap assist (post-snap)
 *  assistVisible       — whether the snap assist panel is open
 *  assistTargetZones   — which zones the assist panel should offer
 */
const useSnapStore = create((set, get) => ({
  // ── Drag session state ───────────────────────────────────────────────────
  activeDragWindowId: null,
  activeZone:         SNAP_ZONE.NONE,
  previewVisible:     false,

  // ── Snap Assist state ────────────────────────────────────────────────────
  assistWindowId:    null,
  assistVisible:     false,
  assistTargetZones: [],

  // ── Drag lifecycle ───────────────────────────────────────────────────────

  startDrag: (windowId) => {
    set({
      activeDragWindowId: windowId,
      activeZone:         SNAP_ZONE.NONE,
      previewVisible:     false,
      assistVisible:      false,
    })
  },

  // Called on every mousemove — equality check prevents re-renders
  updateDragZone: (zone) => {
    set(state => {
      if (state.activeZone === zone) return state  // bail — no change
      return {
        activeZone:     zone,
        previewVisible: zone !== SNAP_ZONE.NONE,
      }
    })
  },

  endDrag: () => {
    set({
      activeDragWindowId: null,
      activeZone:         SNAP_ZONE.NONE,
      previewVisible:     false,
    })
  },

  // ── Snap Assist ──────────────────────────────────────────────────────────

  showSnapAssist: (windowId, targetZones) => {
    set({
      assistWindowId:    windowId,
      assistVisible:     true,
      assistTargetZones: targetZones,
    })
  },

  hideSnapAssist: () => {
    set({
      assistWindowId:    null,
      assistVisible:     false,
      assistTargetZones: [],
    })
  },

  // ── Selectors (called externally, avoid hook overhead) ──────────────────
  getActiveZone:     ()  => get().activeZone,
  isDragging:        ()  => get().activeDragWindowId !== null,
  isPreviewVisible:  ()  => get().previewVisible,
}))

export default useSnapStore
