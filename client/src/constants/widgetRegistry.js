/**
 * WIDGET_REGISTRY — Central registry of all desktop widgets
 *
 * Phase 12C Part 3 — Desktop Widget Framework
 *
 * Mirrors the structure of APP_REGISTRY (constants/appRegistry.js) so the
 * two systems feel consistent, but widgets are lighter-weight desktop
 * "gadgets" rather than full windowed apps:
 *
 *  - rendered directly on the desktop surface (not inside #window-layer)
 *  - draggable, optionally resizable
 *  - can be minimized down to just their header bar
 *  - persisted independently via widgetStore (localStorage)
 *
 * Each entry below is pure metadata — no component references live here,
 * exactly like APP_REGISTRY doesn't import app components. WidgetRenderer
 * (components/widgets/WidgetRenderer.jsx) owns the widgetId -> component
 * map, lazy-loaded, mirroring AppRenderer's appComponents map.
 *
 * ── Adding a new widget (Feature 8 — future-proofing) ──────────────────────
 *   1. Add an entry below with a unique id, title, icon, sizing, etc.
 *   2. Build the widget's content component under src/components/widgets/
 *      (e.g. WeatherWidget.jsx) — it only needs to render its own content;
 *      WidgetContainer supplies the header, drag, resize, minimize & glass.
 *   3. Register it in WidgetRenderer's `widgetComponents` map.
 *   4. Flip `available: true` — it will automatically appear in the
 *      desktop right-click menu's "Add Widget" section.
 *
 * No changes to widgetStore, WidgetManager, or WidgetContainer are needed
 * to add a new widget — that's the whole point of this architecture.
 */

export const WIDGET_IDS = {
  CLOCK:          'clock',
  WEATHER:        'weather',
  CALENDAR:       'calendar',
  SYSTEM_MONITOR: 'system-monitor',
  NOTES:          'notes',
  MUSIC:          'music',
}

export const WIDGET_REGISTRY = {
  [WIDGET_IDS.CLOCK]: {
    id: WIDGET_IDS.CLOCK,
    title: 'Clock',
    icon: 'clock',
    description: 'Live local time and date, with locale switching',
    accentColor: '#6366f1',
    category: 'system',
    defaultPosition: { x: 32, y: 32 },
    defaultSize:     { width: 264, height: 192 },
    minSize:         { width: 220, height: 168 },
    resizable: false,
    available: true,
  },

  // ── Future widgets (Feature 8 extension examples) ─────────────────────────
  // Registered now so they're discoverable in the framework and the
  // desktop's "Add Widget" menu can show what's coming, but `available`
  // stays false until a content component exists in WidgetRenderer.
  [WIDGET_IDS.WEATHER]: {
    id: WIDGET_IDS.WEATHER,
    title: 'Weather',
    icon: 'cloud-sun',
    description: 'Local conditions and short-term forecast',
    accentColor: '#22d3ee',
    category: 'info',
    defaultPosition: { x: 32, y: 248 },
    defaultSize:     { width: 264, height: 224 },
    minSize:         { width: 220, height: 184 },
    resizable: false,
    available: false,
  },

  [WIDGET_IDS.CALENDAR]: {
    id: WIDGET_IDS.CALENDAR,
    title: 'Calendar',
    icon: 'calendar-days',
    description: 'Month view with upcoming events',
    accentColor: '#34d399',
    category: 'productivity',
    defaultPosition: { x: 320, y: 32 },
    defaultSize:     { width: 304, height: 324 },
    minSize:         { width: 264, height: 284 },
    resizable: true,
    available: false,
  },

  [WIDGET_IDS.SYSTEM_MONITOR]: {
    id: WIDGET_IDS.SYSTEM_MONITOR,
    title: 'System Monitor',
    icon: 'activity',
    description: 'Live CPU, memory and network graphs',
    accentColor: '#fbbf24',
    category: 'system',
    defaultPosition: { x: 648, y: 32 },
    defaultSize:     { width: 320, height: 240 },
    minSize:         { width: 280, height: 200 },
    resizable: true,
    available: false,
  },

  [WIDGET_IDS.NOTES]: {
    id: WIDGET_IDS.NOTES,
    title: 'Sticky Notes',
    icon: 'sticky-note',
    description: 'Quick notes that stay on the desktop',
    accentColor: '#f59e0b',
    category: 'productivity',
    defaultPosition: { x: 648, y: 296 },
    defaultSize:     { width: 240, height: 240 },
    minSize:         { width: 180, height: 180 },
    resizable: true,
    available: false,
  },

  [WIDGET_IDS.MUSIC]: {
    id: WIDGET_IDS.MUSIC,
    title: 'Music Player',
    icon: 'music',
    description: 'Now-playing mini player',
    accentColor: '#f43f5e',
    category: 'media',
    defaultPosition: { x: 32, y: 496 },
    defaultSize:     { width: 320, height: 116 },
    minSize:         { width: 280, height: 110 },
    resizable: false,
    available: false,
  },
}

/** Flat list, e.g. for iterating in menus */
export const WIDGET_LIST = Object.values(WIDGET_REGISTRY)

/** Widgets that can currently be added from the desktop's "Add Widget" menu */
export const AVAILABLE_WIDGETS = WIDGET_LIST.filter(w => w.available)
