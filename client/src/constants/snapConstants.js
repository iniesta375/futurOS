/**
 * snapConstants.js — Phase 12C Snap System Constants
 *
 * Single source of truth for:
 *  - Zone identifiers (8 zones + NONE)
 *  - Detection thresholds (edge and corner)
 *  - Geometry calculators for every zone
 *  - Visual metadata (labels, preview rectangles)
 */

export const TASKBAR_H = 52

// Zone identifiers — string constants so they serialize cleanly in Zustand
export const SNAP_ZONE = {
  LEFT:         'left',
  RIGHT:        'right',
  TOP:          'top',
  TOP_LEFT:     'top-left',
  TOP_RIGHT:    'top-right',
  BOTTOM_LEFT:  'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  CENTER:       'center',
  NONE:         null,
}

export const SNAP_THRESHOLD = {
  EDGE:   24,
  CORNER: 80,
}

// Geometry calculators — all read window dimensions at call time
export function getSnapGeometry(zone) {
  const vw = window.innerWidth
  const vh = window.innerHeight - TASKBAR_H
  switch (zone) {
    case SNAP_ZONE.LEFT:         return { x: 0,      y: 0,      width: vw / 2, height: vh     }
    case SNAP_ZONE.RIGHT:        return { x: vw / 2, y: 0,      width: vw / 2, height: vh     }
    case SNAP_ZONE.TOP:          return { x: 0,      y: 0,      width: vw,     height: vh     }
    case SNAP_ZONE.TOP_LEFT:     return { x: 0,      y: 0,      width: vw / 2, height: vh / 2 }
    case SNAP_ZONE.TOP_RIGHT:    return { x: vw / 2, y: 0,      width: vw / 2, height: vh / 2 }
    case SNAP_ZONE.BOTTOM_LEFT:  return { x: 0,      y: vh / 2, width: vw / 2, height: vh / 2 }
    case SNAP_ZONE.BOTTOM_RIGHT: return { x: vw / 2, y: vh / 2, width: vw / 2, height: vh / 2 }
    case SNAP_ZONE.CENTER: {
      const w = Math.min(960, vw * 0.7)
      const h = Math.min(640, vh * 0.8)
      return { x: (vw - w) / 2, y: (vh - h) / 2, width: w, height: h }
    }
    default: return null
  }
}

// Zone detection from cursor position — corners take priority over edges
export function detectSnapZone(cursorX, cursorY) {
  const vw = window.innerWidth
  const vh = window.innerHeight - TASKBAR_H
  const { EDGE, CORNER } = SNAP_THRESHOLD

  if (cursorX <= CORNER && cursorY <= CORNER)               return SNAP_ZONE.TOP_LEFT
  if (cursorX >= vw - CORNER && cursorY <= CORNER)          return SNAP_ZONE.TOP_RIGHT
  if (cursorX <= CORNER && cursorY >= vh - CORNER)          return SNAP_ZONE.BOTTOM_LEFT
  if (cursorX >= vw - CORNER && cursorY >= vh - CORNER)     return SNAP_ZONE.BOTTOM_RIGHT
  if (cursorY <= EDGE)   return SNAP_ZONE.TOP
  if (cursorX <= EDGE)   return SNAP_ZONE.LEFT
  if (cursorX >= vw - EDGE) return SNAP_ZONE.RIGHT
  return SNAP_ZONE.NONE
}

// Visual metadata — used by SnapPreviewOverlay and SnapLayoutPicker
export const SNAP_ZONE_META = {
  [SNAP_ZONE.LEFT]:         { label: 'Left Half',     preview: { left: '0%',  top: '0%',  width: '50%',  height: '100%' } },
  [SNAP_ZONE.RIGHT]:        { label: 'Right Half',    preview: { left: '50%', top: '0%',  width: '50%',  height: '100%' } },
  [SNAP_ZONE.TOP]:          { label: 'Maximize',      preview: { left: '0%',  top: '0%',  width: '100%', height: '100%' } },
  [SNAP_ZONE.TOP_LEFT]:     { label: 'Top Left',      preview: { left: '0%',  top: '0%',  width: '50%',  height: '50%'  } },
  [SNAP_ZONE.TOP_RIGHT]:    { label: 'Top Right',     preview: { left: '50%', top: '0%',  width: '50%',  height: '50%'  } },
  [SNAP_ZONE.BOTTOM_LEFT]:  { label: 'Bottom Left',   preview: { left: '0%',  top: '50%', width: '50%',  height: '50%'  } },
  [SNAP_ZONE.BOTTOM_RIGHT]: { label: 'Bottom Right',  preview: { left: '50%', top: '50%', width: '50%',  height: '50%'  } },
  [SNAP_ZONE.CENTER]:       { label: 'Center',        preview: { left: '15%', top: '10%', width: '70%',  height: '80%'  } },
}

// Snap Assist complement zones — which zones can fill the space next to a snapped window
export const SNAP_COMPLEMENTS = {
  [SNAP_ZONE.LEFT]:         [SNAP_ZONE.RIGHT],
  [SNAP_ZONE.RIGHT]:        [SNAP_ZONE.LEFT],
  [SNAP_ZONE.TOP_LEFT]:     [SNAP_ZONE.TOP_RIGHT, SNAP_ZONE.BOTTOM_LEFT, SNAP_ZONE.BOTTOM_RIGHT],
  [SNAP_ZONE.TOP_RIGHT]:    [SNAP_ZONE.TOP_LEFT,  SNAP_ZONE.BOTTOM_LEFT, SNAP_ZONE.BOTTOM_RIGHT],
  [SNAP_ZONE.BOTTOM_LEFT]:  [SNAP_ZONE.BOTTOM_RIGHT, SNAP_ZONE.TOP_LEFT, SNAP_ZONE.TOP_RIGHT],
  [SNAP_ZONE.BOTTOM_RIGHT]: [SNAP_ZONE.BOTTOM_LEFT,  SNAP_ZONE.TOP_LEFT, SNAP_ZONE.TOP_RIGHT],
}

// Layout templates for future Snap Assist panel
export const SNAP_TEMPLATES = [
  { id: 'side-by-side', label: 'Side by Side',    zones: [SNAP_ZONE.LEFT, SNAP_ZONE.RIGHT] },
  { id: 'main-sidebar', label: 'Main + Sidebar',  zones: [SNAP_ZONE.LEFT, SNAP_ZONE.TOP_RIGHT, SNAP_ZONE.BOTTOM_RIGHT] },
  { id: 'quad',         label: 'Quad Grid',       zones: [SNAP_ZONE.TOP_LEFT, SNAP_ZONE.TOP_RIGHT, SNAP_ZONE.BOTTOM_LEFT, SNAP_ZONE.BOTTOM_RIGHT] },
]
