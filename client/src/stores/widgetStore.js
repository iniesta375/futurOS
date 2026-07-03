import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WIDGET_REGISTRY } from '@constants/widgetRegistry'

/**
 * useWidgetStore — Desktop widget state
 *
 * Phase 12C Part 3 — Desktop Widget Framework
 *
 * Widget instance schema:
 * {
 *   instanceId: string   — unique per instance. Equals widgetId for the
 *                           default (first) instance of a widget type;
 *                           `${widgetId}-${timestamp}` for forced extra
 *                           instances (future multi-instance widgets,
 *                           e.g. multiple Weather cards for different cities).
 *   widgetId:   string   — matches a WIDGET_REGISTRY key
 *   position:   { x, y } — top-left corner, desktop-relative px
 *   size:       { width, height }
 *   minimized:  boolean  — collapsed to header bar only
 *   zIndex:     number   — local stacking order among widgets
 * }
 *
 * ── Z-index strategy (Feature 7 — window manager integration) ─────────────
 * Widgets are rendered directly inside Desktop's content (see
 * WidgetManager.jsx), NOT portaled into #window-layer. Per globals.css,
 * #window-layer sits at z-index 100 and #overlay-layer at 500, both at the
 * document root, while Desktop's own stacking context sits at z-index 1.
 * That means ANY z-index a widget uses internally (this store starts them
 * at 10 and counts up) is still contained within Desktop's "1" — windows
 * and OS overlays always render above widgets, by construction. This store
 * only needs to track *relative* order between widgets themselves.
 *
 * ── Persistence ─────────────────────────────────────────────────────────
 * Widgets persist to localStorage under 'futuros-widget-state' (Feature 2).
 * The z-index counter is module-level (not persisted, mirroring the
 * windowStore.js pattern) and is reseeded above the highest persisted
 * zIndex on rehydration so newly focused/added widgets always land on top.
 */

const WIDGET_Z_BASE = 10

let zCounter = WIDGET_Z_BASE

const useWidgetStore = create(
  persist(
    (set, get) => ({
      widgets: [],
      activeWidgetId: null,

      // ── Add ──────────────────────────────────────────────────────────────
      // Adds a widget by registry id. If an instance of that widget already
      // exists (default single-instance behavior), it's restored (if
      // minimized) and focused instead of creating a duplicate — same
      // dedup philosophy as windowStore.openWindow().
      //
      // Pass { forceNew: true } to always create a new instance (for future
      // widgets that support multiple instances, e.g. Weather per city).
      // Pass { position, size } to override the registry defaults.
      addWidget: (widgetId, overrides = {}) => {
        const def = WIDGET_REGISTRY[widgetId]
        if (!def) {
          console.warn(`[widgetStore] Unknown widget id: "${widgetId}"`)
          return null
        }

        const { widgets } = get()
        const existing = overrides.forceNew
          ? null
          : widgets.find(w => w.widgetId === widgetId)

        if (existing) {
          if (existing.minimized) {
            set(state => ({
              widgets: state.widgets.map(w =>
                w.instanceId === existing.instanceId ? { ...w, minimized: false } : w
              ),
            }))
          }
          get().focusWidget(existing.instanceId)
          return existing.instanceId
        }

        zCounter += 1
        const instanceId = overrides.forceNew
          ? `${widgetId}-${Date.now()}`
          : widgetId

        const newWidget = {
          instanceId,
          widgetId,
          position:  overrides.position || def.defaultPosition || { x: 32, y: 32 },
          size:      overrides.size     || def.defaultSize     || { width: 260, height: 200 },
          minimized: false,
          zIndex:    zCounter,
        }

        set(state => ({
          widgets: [...state.widgets, newWidget],
          activeWidgetId: instanceId,
        }))

        return instanceId
      },

      // ── Remove ───────────────────────────────────────────────────────────
      removeWidget: (instanceId) => {
        set(state => ({
          widgets: state.widgets.filter(w => w.instanceId !== instanceId),
          activeWidgetId: state.activeWidgetId === instanceId ? null : state.activeWidgetId,
        }))
      },

      // ── Move ─────────────────────────────────────────────────────────────
      // Called once on drag end (not on every pointer move) — see
      // WidgetContainer for the controlled-drag pattern that makes this
      // safe to call infrequently without any visual snap-back.
      moveWidget: (instanceId, position) => {
        set(state => ({
          widgets: state.widgets.map(w =>
            w.instanceId === instanceId ? { ...w, position } : w
          ),
        }))
      },

      // ── Resize ───────────────────────────────────────────────────────────
      // Called once on resize-handle release — see WidgetContainer.
      resizeWidget: (instanceId, size) => {
        set(state => ({
          widgets: state.widgets.map(w =>
            w.instanceId === instanceId ? { ...w, size } : w
          ),
        }))
      },

      // ── Minimize / restore (collapse to header bar) ─────────────────────
      toggleVisibility: (instanceId) => {
        set(state => ({
          widgets: state.widgets.map(w =>
            w.instanceId === instanceId ? { ...w, minimized: !w.minimized } : w
          ),
        }))
      },

      // ── Focus (bring to front among widgets) ────────────────────────────
      focusWidget: (instanceId) => {
        zCounter += 1
        set(state => ({
          widgets: state.widgets.map(w =>
            w.instanceId === instanceId ? { ...w, zIndex: zCounter } : w
          ),
          activeWidgetId: instanceId,
        }))
      },

      // ── Reset ────────────────────────────────────────────────────────────
      // Removes every widget from the desktop and resets the z-index
      // counter. Exposed for Settings ("Reset desktop widgets") and the
      // desktop context menu.
      resetWidgets: () => {
        zCounter = WIDGET_Z_BASE
        set({ widgets: [], activeWidgetId: null })
      },

      // ── Getters ──────────────────────────────────────────────────────────
      isWidgetActive: (widgetId) => get().widgets.some(w => w.widgetId === widgetId),
      getWidget:      (instanceId) => get().widgets.find(w => w.instanceId === instanceId),
    }),
    {
      name: 'futuros-widget-state',
      partialize: (state) => ({ widgets: state.widgets }),
      onRehydrateStorage: () => (state) => {
        // Reseed the module-level z-counter above the highest persisted
        // zIndex so the first focus/add after reload always lands on top
        // of whatever was restored from localStorage.
        const maxZ = (state?.widgets || []).reduce(
          (m, w) => Math.max(m, w.zIndex || 0),
          WIDGET_Z_BASE
        )
        zCounter = maxZ
      },
    }
  )
)

export default useWidgetStore
