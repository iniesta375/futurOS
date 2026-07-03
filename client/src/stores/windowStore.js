import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// Analytics — dynamic import to keep store lean and avoid circular deps
function trackAppLaunch(appId) {
  import('@utils/analytics').then(m => m.Analytics.appLaunch(appId)).catch(() => {})
}
function trackAppClose(appId) {
  import('@utils/analytics').then(m => m.Analytics.appClose(appId)).catch(() => {})
}

/**
 * useWindowStore — Central OS window management state
 *
 * Window schema:
 * {
 *   id:                  string   — unique window ID (appId-timestamp)
 *   appId:               string   — matches APP_REGISTRY key
 *   title:               string   — displayed in title bar
 *   isMinimized:         boolean
 *   isMaximized:         boolean
 *   isFocused:           boolean
 *   zIndex:              number   — managed by module-level counter
 *   position:            { x, y }
 *   size:                { width, height }
 *   minSize:             { width, height }
 *   props:               object   — passed into the app component
 *   preMaximizePosition: { x, y } | null   — saved before maximize/snap
 *   preMaximizeSize:     { width, height } | null
 *   snapZone:            string | null  — active snap zone ID or null
 * }
 */

// ── Z-index counter ─────────────────────────────────────────────────────────
// Module-level for performance — avoids a store read on every focus event.
// Starts at 200 to sit above desktop icons (z:5) and widgets (z:10–50) while
// staying safely below #overlay-layer (z:500) and #window-layer (z:100).
// Reset on logout via resetZCounter() to prevent unbounded growth.
let zCounter = 200

export function resetZCounter() {
  zCounter = 200
}

// ── Last-focused tracker ────────────────────────────────────────────────────
// O(n) linear scan — avoids sorting the entire array on every close/minimize.
function findNextFocus(windows) {
  let best = null
  for (const w of windows) {
    if (w.isMinimized) continue
    if (!best || w.zIndex > best.zIndex) best = w
  }
  return best ?? null
}

const useWindowStore = create(
  subscribeWithSelector((set, get) => ({
    windows:       [],
    activeWindowId: null,

    // ── Open / Launch ────────────────────────────────────────────────────────
    // Deduplication: if the app is already open, focus it (and restore if
    // minimized). Pass forceNew: true in overrides to always open a new instance.
    openWindow: (appId, overrides = {}) => {
      const { windows } = get()

      const existing = overrides.forceNew
        ? null
        : windows.find(w => w.appId === appId)

      if (existing) {
        if (existing.isMinimized) {
          set(state => ({
            windows: state.windows.map(w =>
              w.id === existing.id ? { ...w, isMinimized: false } : w
            ),
          }))
        }
        get().focusWindow(existing.id)
        return existing.id
      }

      const id          = `${appId}-${Date.now()}`
      const defaultSize = overrides.defaultSize || { width: 900, height: 600 }
      const centerX     = Math.max(40, (window.innerWidth  - defaultSize.width)  / 2)
      const centerY     = Math.max(40, (window.innerHeight - defaultSize.height - 52) / 2)

      zCounter += 1

      const newWindow = {
        id,
        appId,
        title:               overrides.title   || appId,
        isMinimized:         false,
        isMaximized:         false,
        isFocused:           true,
        zIndex:              zCounter,
        position:            overrides.position || { x: centerX, y: centerY },
        size:                defaultSize,
        minSize:             overrides.minSize  || { width: 400, height: 300 },
        props:               overrides.props    || {},
        preMaximizePosition: null,
        preMaximizeSize:     null,
        snapZone:            null,
      }

      set(state => ({
        windows: [
          ...state.windows.map(w => ({ ...w, isFocused: false })),
          newWindow,
        ],
        activeWindowId: id,
      }))

      trackAppLaunch(appId)
      return id
    },

    // ── Close ────────────────────────────────────────────────────────────────
    closeWindow: (id) => {
      const win = get().windows.find(w => w.id === id)
      if (win) trackAppClose(win.appId)
      set(state => {
        const remaining    = state.windows.filter(w => w.id !== id)
        const lastFocused  = findNextFocus(remaining)
        return {
          windows:        remaining,
          activeWindowId: lastFocused?.id ?? null,
        }
      })
    },

    // ── Focus ────────────────────────────────────────────────────────────────
    focusWindow: (id) => {
      zCounter += 1
      set(state => ({
        windows: state.windows.map(w => ({
          ...w,
          isFocused: w.id === id,
          zIndex:    w.id === id ? zCounter : w.zIndex,
        })),
        activeWindowId: id,
      }))
    },

    // ── Minimize ─────────────────────────────────────────────────────────────
    minimizeWindow: (id) => {
      set(state => {
        const updated     = state.windows.map(w =>
          w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
        )
        const lastFocused = findNextFocus(updated)
        return {
          windows:        updated,
          activeWindowId: lastFocused?.id ?? null,
        }
      })
    },

    // ── Restore minimized ────────────────────────────────────────────────────
    restoreWindow: (id) => {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? { ...w, isMinimized: false } : w
        ),
      }))
      get().focusWindow(id)
    },

    // ── Maximize / Restore ───────────────────────────────────────────────────
    // Saves position+size into preMaximize* fields before expanding so
    // un-maximize restores correctly. State lives in the store (not a ref)
    // so it survives component remounts.
    toggleMaximize: (id) => {
      set(state => ({
        windows: state.windows.map(w => {
          if (w.id !== id) return w

          if (!w.isMaximized) {
            return {
              ...w,
              isMaximized:         true,
              snapZone:            null,
              preMaximizePosition: w.position,
              preMaximizeSize:     w.size,
            }
          }

          return {
            ...w,
            isMaximized:         false,
            position:            w.preMaximizePosition ?? w.position,
            size:                w.preMaximizeSize     ?? w.size,
            preMaximizePosition: null,
            preMaximizeSize:     null,
          }
        }),
      }))
    },

    // ── Snap zone ────────────────────────────────────────────────────────────
    // Records which snap zone a window occupies. Used by the snap UI
    // (SnapZoneIndicator, SnapLayoutPicker) and by useSnapRestore.
    setSnapZone: (id, zone) => {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? { ...w, snapZone: zone } : w
        ),
      }))
    },

    // ── Move / Resize (single-axis) ──────────────────────────────────────────
    // Kept for API compatibility. Prefer setWindowGeometry for combined updates.
    setWindowPosition: (id, position) => {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? { ...w, position } : w
        ),
      }))
    },

    setWindowSize: (id, size) => {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? { ...w, size } : w
        ),
      }))
    },

    // ── Atomic geometry setter ───────────────────────────────────────────────
    // Combines position + size + snap fields into a single set() call
    // (one re-render vs. two). All drag-stop and snap paths use this.
    setWindowGeometry: (id, {
      position,
      size,
      snapZone            = undefined,
      preMaximizePosition = undefined,
      preMaximizeSize     = undefined,
    }) => {
      set(state => ({
        windows: state.windows.map(w => {
          if (w.id !== id) return w
          return {
            ...w,
            ...(position            !== undefined && { position            }),
            ...(size                !== undefined && { size                }),
            ...(snapZone            !== undefined && { snapZone            }),
            ...(preMaximizePosition !== undefined && { preMaximizePosition }),
            ...(preMaximizeSize     !== undefined && { preMaximizeSize     }),
          }
        }),
      }))
    },

    // ── Title ────────────────────────────────────────────────────────────────
    setWindowTitle: (id, title) => {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === id ? { ...w, title } : w
        ),
      }))
    },

    // ── Minimize all ─────────────────────────────────────────────────────────
    minimizeAll: () => {
      set(state => ({
        windows:        state.windows.map(w => ({ ...w, isMinimized: true, isFocused: false })),
        activeWindowId: null,
      }))
    },

    // ── Reset (call on logout) ───────────────────────────────────────────────
    resetWindows: () => {
      resetZCounter()
      set({ windows: [], activeWindowId: null })
    },

    // ── Getters ──────────────────────────────────────────────────────────────
    getWindow:       (id)    => get().windows.find(w => w.id === id),
    getWindowsByApp: (appId) => get().windows.filter(w => w.appId === appId),
    getOpenWindows:  ()      => get().windows.filter(w => !w.isMinimized),
  }))
)

export default useWindowStore
