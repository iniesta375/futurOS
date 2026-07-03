/**
 * Terminal Output Node System
 *
 * Every command handler returns an array of OutputNode objects.
 * The TerminalOutput component renders them with optional streaming delay.
 *
 * OutputNode shape:
 * {
 *   id:      string     — unique id for React key
 *   type:    string     — 'text' | 'line' | 'table' | 'bar' | 'link' | 'divider' | 'json'
 *   content: string     — main text content
 *   color:   string     — 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'error'
 *                         | 'warn' | 'info' | 'cyan' | 'violet' | 'yellow' | any hex
 *   bold:    boolean
 *   dim:     boolean
 *   indent:  number     — left indent in spaces
 *   delay:   number     — ms delay before this node starts streaming
 *   noStream: boolean   — render immediately, no character streaming
 *   // For 'bar' type:
 *   percent: number
 *   barColor: string
 *   label:   string
 *   // For 'table' type:
 *   rows:    string[][]
 *   headers: string[]
 *   // For 'link' type:
 *   href:    string
 * }
 */

let _id = 0
const id = () => `o${++_id}`

// ── Node constructors ─────────────────────────────────────────────────────

export const line = (content = '', opts = {}) =>
  ({ id: id(), type: 'text', content, ...opts })

export const blank = () =>
  ({ id: id(), type: 'text', content: '', noStream: true })

export const divider = (char = '─', len = 56) =>
  ({ id: id(), type: 'text', content: char.repeat(len), color: 'muted', dim: true, noStream: true })

export const header = (content, color = 'accent') =>
  ({ id: id(), type: 'text', content, color, bold: true, noStream: true })

export const success = (content) =>
  ({ id: id(), type: 'text', content, color: 'success' })

export const error = (content) =>
  ({ id: id(), type: 'text', content: `✗ ${content}`, color: 'error' })

export const warn = (content) =>
  ({ id: id(), type: 'text', content: `⚠ ${content}`, color: 'warn' })

export const info = (content) =>
  ({ id: id(), type: 'text', content: `ℹ ${content}`, color: 'info' })

export const dim = (content) =>
  ({ id: id(), type: 'text', content, color: 'muted', dim: true })

export const accent = (content, indent = 0) =>
  ({ id: id(), type: 'text', content, color: 'accent', indent })

export const cyan = (content, indent = 0) =>
  ({ id: id(), type: 'text', content, color: 'cyan', indent })

export const link = (label, href) =>
  ({ id: id(), type: 'link', content: label, href })

export const bar = (label, percent, color = '#6366f1') =>
  ({ id: id(), type: 'bar', label, percent, barColor: color, noStream: true })

export const table = (headers, rows) =>
  ({ id: id(), type: 'table', headers, rows, noStream: true })

export const json = (data) =>
  ({ id: id(), type: 'json', content: JSON.stringify(data, null, 2), noStream: true })

// ── Color map for CSS rendering ──────────────────────────────────────────

export const COLOR_MAP = {
  primary:  'rgba(255,255,255,0.88)',
  secondary:'rgba(255,255,255,0.65)',
  muted:    'rgba(255,255,255,0.28)',
  accent:   '#818cf8',
  success:  '#34d399',
  error:    '#f87171',
  warn:     '#fbbf24',
  info:     '#60a5fa',
  cyan:     '#22d3ee',
  violet:   '#c084fc',
  yellow:   '#fbbf24',
  green:    '#34d399',
  red:      '#f87171',
  blue:     '#60a5fa',
}

export const resolveColor = (color) =>
  COLOR_MAP[color] || color || COLOR_MAP.primary
