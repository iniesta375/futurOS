/**
 * OS Constants — wallpapers, keybinds, accent colors
 */

export const WALLPAPERS = [
  {
    id: 'gradient-nebula',
    name: 'Nebula',
    type: 'css',
    value: 'radial-gradient(ellipse at 20% 50%, #1a0533 0%, #08080f 50%, #0a1628 100%)',
    thumbnail: null,
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora',
    type: 'css',
    value: 'radial-gradient(ellipse at 80% 20%, #064e3b 0%, #083344 40%, #08080f 100%)',
    thumbnail: null,
  },
  {
    id: 'gradient-ember',
    name: 'Ember',
    type: 'css',
    value: 'radial-gradient(ellipse at 60% 80%, #1c0a00 0%, #1a0533 40%, #08080f 100%)',
    thumbnail: null,
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean',
    type: 'css',
    value: 'radial-gradient(ellipse at 30% 30%, #0c2340 0%, #050d1a 50%, #08080f 100%)',
    thumbnail: null,
  },
  {
    id: 'gradient-midnight',
    name: 'Midnight',
    type: 'css',
    value: 'linear-gradient(135deg, #08080f 0%, #0e0e1a 50%, #0a0a14 100%)',
    thumbnail: null,
  },
]

export const ACCENT_COLORS = [
  { id: 'indigo',  name: 'Indigo',  value: '#6366f1' },
  { id: 'cyan',    name: 'Cyan',    value: '#22d3ee' },
  { id: 'violet',  name: 'Violet',  value: '#8b5cf6' },
  { id: 'rose',    name: 'Rose',    value: '#f43f5e' },
  { id: 'amber',   name: 'Amber',   value: '#f59e0b' },
  { id: 'emerald', name: 'Emerald', value: '#10b981' },
  { id: 'sky',     name: 'Sky',     value: '#0ea5e9' },
]

export const KEYBINDS = {
  OPEN_START:    { key: 'Meta', label: '⊞' },
  CLOSE_WINDOW:  { key: 'w', ctrl: true, label: 'Ctrl+W' },
  MINIMIZE_WIN:  { key: 'h', ctrl: true, label: 'Ctrl+H' },
  SEARCH:        { key: 'k', ctrl: true, label: 'Ctrl+K' },
  TERMINAL:      { key: '`', ctrl: true, label: 'Ctrl+`' },
  SCREENSHOT:    { key: 's', ctrl: true, shift: true, label: 'Ctrl+Shift+S' },
}

export const TASKBAR_HEIGHT = 52

export const WINDOW_Z_BASE = 200
