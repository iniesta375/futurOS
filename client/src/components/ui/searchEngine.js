/**
 * searchEngine.js — FuturOS in-memory search index.
 *
 * Architecture:
 * - Three-tier scoring: exact > prefix > substring > fuzzy char-sequence
 * - Type priority ensures Apps rank above Files in mixed results
 * - The index is built once at module load from: APP_REGISTRY, ACTION_LIST, static files
 * - `search(query)` is pure — no side effects, safe to call in render
 * - `QUICK_SUGGESTIONS` are curated entries shown before user types
 *
 * Extending:
 * - Add entries to ACTION_LIST in actionsRegistry.js → auto-indexed
 * - Pass `dynamicEntries` to search() for per-session items (open windows, recent files)
 */

import APP_REGISTRY from '@constants/appRegistry'
import { ACTION_LIST } from '@constants/actionsRegistry'

// ── Result type identifiers ───────────────────────────────────────────────

export const RESULT_TYPES = {
  APP:     'app',
  ACTION:  'action',
  FILE:    'file',
  SETTING: 'setting',
  COMMAND: 'command',
}

// ── Type display config ───────────────────────────────────────────────────

export const TYPE_META = {
  [RESULT_TYPES.APP]:     { label: 'App',     color: '#818cf8', priority: 5 },
  [RESULT_TYPES.ACTION]:  { label: 'Action',  color: '#34d399', priority: 4 },
  [RESULT_TYPES.COMMAND]: { label: 'Command', color: '#34d399', priority: 4 },
  [RESULT_TYPES.SETTING]: { label: 'Setting', color: '#fbbf24', priority: 3 },
  [RESULT_TYPES.FILE]:    { label: 'File',    color: '#60a5fa', priority: 2 },
}

// ── Static indices ────────────────────────────────────────────────────────

// Apps — built from APP_REGISTRY
const APP_INDEX = Object.values(APP_REGISTRY).map(app => ({
  id:       `app.${app.id}`,
  type:     RESULT_TYPES.APP,
  title:    app.title,
  subtitle: app.description,
  icon:     app.icon,
  accent:   app.accentColor,
  keywords: [app.title, app.description, app.category],
  // Action to run
  actionId: `app.${app.id}`,
  appId:    app.id,
}))

// Actions — built from ACTION_LIST
const ACTION_INDEX = ACTION_LIST.map(action => ({
  id:       action.id,
  type:     action.category === 'Apps'
              ? RESULT_TYPES.APP
              : action.category === 'Settings' || action.category === 'Appearance'
                ? RESULT_TYPES.SETTING
                : RESULT_TYPES.ACTION,
  title:    action.label,
  subtitle: action.subtitle || '',
  icon:     action.icon,
  accent:   null,
  shortcut: action.shortcut,
  keywords: [action.label, action.subtitle || '', ...(action.keywords || []), action.category],
  actionId: action.id,
}))

// Files — curated static entries (augmented at runtime by file system)
const FILE_INDEX = [
  { id: 'file.readme',       type: RESULT_TYPES.FILE, title: 'readme.md',       subtitle: '/Desktop',           icon: 'file-text', accent: '#6b9fff', path: '/Desktop/readme.md',               actionId: 'app.files' },
  { id: 'file.resume',       type: RESULT_TYPES.FILE, title: 'resume.pdf',      subtitle: '/Documents',         icon: 'file-text', accent: '#f40f02', path: '/Documents/resume.pdf',            actionId: 'app.files' },
  { id: 'file.coverletter',  type: RESULT_TYPES.FILE, title: 'cover-letter.md', subtitle: '/Documents',         icon: 'file-text', accent: '#6b9fff', path: '/Documents/cover-letter.md',      actionId: 'app.files' },
  { id: 'file.ideas',        type: RESULT_TYPES.FILE, title: 'ideas.md',        subtitle: '/Documents/Notes',   icon: 'file-text', accent: '#6b9fff', path: '/Documents/Notes/ideas.md',       actionId: 'app.files' },
  { id: 'file.todo',         type: RESULT_TYPES.FILE, title: 'todo.md',         subtitle: '/Documents/Notes',   icon: 'file-text', accent: '#6b9fff', path: '/Documents/Notes/todo.md',        actionId: 'app.files' },
  { id: 'file.futuros',      type: RESULT_TYPES.FILE, title: 'FuturOS/',        subtitle: '/Projects',          icon: 'folder',    accent: '#fbbf24', path: '/Projects/FuturOS',               actionId: 'app.files' },
  { id: 'file.dataflow',     type: RESULT_TYPES.FILE, title: 'DataFlow/',       subtitle: '/Projects',          icon: 'folder',    accent: '#fbbf24', path: '/Projects/DataFlow',              actionId: 'app.files' },
  { id: 'file.snippets',     type: RESULT_TYPES.FILE, title: 'Code Snippets/',  subtitle: '/Documents',         icon: 'folder',    accent: '#fbbf24', path: '/Documents/Code Snippets',        actionId: 'app.files' },
  { id: 'file.debounce',     type: RESULT_TYPES.FILE, title: 'debounce.js',     subtitle: '/Documents/Code Snippets', icon: 'file-code', accent: '#f7df1e', path: '/Documents/Code Snippets/debounce.js', actionId: 'app.files' },
]

// The full static index
const STATIC_INDEX = [
  ...APP_INDEX,
  ...ACTION_INDEX.filter(a => !APP_INDEX.find(app => app.actionId === a.actionId)), // dedupe
  ...FILE_INDEX,
]

// ── Scoring ───────────────────────────────────────────────────────────────

/**
 * Score an item against a query.
 * Returns 0 if no match, or a positive integer for ranking.
 */
function scoreItem(item, q) {
  const lower = q.toLowerCase()
  const title = item.title.toLowerCase()
  const sub   = (item.subtitle || '').toLowerCase()
  const kw    = (item.keywords || []).join(' ').toLowerCase()

  // Exact title match
  if (title === lower) return 100
  // Title starts with query
  if (title.startsWith(lower)) return 85
  // Title contains query as a word boundary
  if (title.includes(` ${lower}`) || title.includes(`${lower} `)) return 75
  // Title contains query anywhere
  if (title.includes(lower)) return 65
  // Keywords contain query
  if (kw.includes(lower)) return 45
  // Subtitle contains query
  if (sub.includes(lower)) return 30
  // Fuzzy: all characters appear in order in title
  let pos = 0
  for (const ch of lower) {
    const found = title.indexOf(ch, pos)
    if (found === -1) return 0
    pos = found + 1
  }
  // Fuzzy match bonus: higher if characters are more contiguous
  return 15 + Math.round((lower.length / title.length) * 10)
}

// ── Main search ───────────────────────────────────────────────────────────

/**
 * Search the OS index.
 * @param {string} query
 * @param {object[]} [dynamic=[]] - additional runtime items (e.g. open windows)
 * @param {number}  [limit=10]
 * @returns {SearchResult[]}
 */
export function search(query, dynamic = [], limit = 10) {
  if (!query?.trim()) return []

  const q = query.trim()
  const all = [...STATIC_INDEX, ...dynamic]

  return all
    .map(item => {
      const s = scoreItem(item, q)
      if (s === 0) return null
      // Boost by type priority
      const typePriority = TYPE_META[item.type]?.priority ?? 1
      return { ...item, _score: s + typePriority }
    })
    .filter(Boolean)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
}

// ── Quick suggestions (shown when query is empty) ─────────────────────────

export const QUICK_SUGGESTIONS = [
  APP_INDEX.find(a => a.appId === 'about'),
  APP_INDEX.find(a => a.appId === 'projects'),
  APP_INDEX.find(a => a.appId === 'terminal'),
  ACTION_INDEX.find(a => a.actionId === 'os.shortcuts'),
  ACTION_INDEX.find(a => a.actionId === 'appearance.wallpaper'),
  ACTION_INDEX.find(a => a.actionId === 'account.logout'),
].filter(Boolean)
