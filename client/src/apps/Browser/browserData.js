/**
 * browserData.js — Browser app configuration and data.
 */

export const DEFAULT_BOOKMARKS = [
  { id: 'github',    title: 'GitHub',      url: 'https://github.com',          icon: '🐙', color: '#fff'    },
  { id: 'mdn',       title: 'MDN Docs',    url: 'https://developer.mozilla.org', icon: '📚', color: '#0097fc' },
  { id: 'npm',       title: 'npm',         url: 'https://npmjs.com',            icon: '📦', color: '#cb3837' },
  { id: 'vercel',    title: 'Vercel',      url: 'https://vercel.com',           icon: '▲',  color: '#fff'    },
  { id: 'tailwind',  title: 'Tailwind',    url: 'https://tailwindcss.com',      icon: '💨', color: '#38bdf8' },
  { id: 'react',     title: 'React',       url: 'https://react.dev',            icon: '⚛',  color: '#61dafb' },
  { id: 'vite',      title: 'Vite',        url: 'https://vitejs.dev',           icon: '⚡', color: '#646cff' },
  { id: 'framer',    title: 'Framer',      url: 'https://framer.com/motion',    icon: '✦',  color: '#bb4ad8' },
]

export const QUICK_LINKS = [
  { title: 'GitHub',       url: 'https://github.com',            icon: '🐙' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com',   icon: '📋' },
  { title: 'CodePen',      url: 'https://codepen.io',            icon: '✏️' },
  { title: 'MDN',          url: 'https://developer.mozilla.org', icon: '📚' },
  { title: 'Can I Use',    url: 'https://caniuse.com',           icon: '🔍' },
  { title: 'Bundlephobia', url: 'https://bundlephobia.com',      icon: '📦' },
  { title: 'Excalidraw',   url: 'https://excalidraw.com',        icon: '✏️' },
  { title: 'Ray.so',       url: 'https://ray.so',                icon: '🎨' },
]

export const SEARCH_ENGINES = {
  google: { name: 'Google', url: 'https://www.google.com/search?q=', icon: '🔍' },
  bing:   { name: 'Bing',   url: 'https://www.bing.com/search?q=',   icon: '🔎' },
  ddg:    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=',   icon: '🦆' },
}

export const FUTUROS_PAGES = {
  'futuros://newtab':    { title: 'New Tab',    component: 'home'       },
  'futuros://about':     { title: 'About Me',   component: 'about'      },
  'futuros://projects':  { title: 'Projects',   component: 'projects'   },
  'futuros://terminal':  { title: 'Terminal',   component: 'terminal'   },
  'futuros://settings':  { title: 'Settings',   component: 'settings'   },
}

// ── URL helpers ─────────────────────────────────────────────────────────────

/**
 * Determine if input is a URL or search query.
 * Returns the final URL to navigate to.
 */
export function resolveUrl(input, engine = 'google') {
  const trimmed = input.trim()
  if (!trimmed) return 'futuros://newtab'

  // futuros:// protocol
  if (trimmed.startsWith('futuros://')) return trimmed

  // Explicit URL patterns
  if (
    /^https?:\/\//i.test(trimmed) ||
    /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)
  ) {
    const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    return url
  }

  // Default to search
  const searchUrl = SEARCH_ENGINES[engine]?.url || SEARCH_ENGINES.google.url
  return searchUrl + encodeURIComponent(trimmed)
}

/**
 * Get a clean display URL (strip https://, trailing slash)
 */
export function displayUrl(url) {
  if (!url || url.startsWith('futuros://')) return url || ''
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

/**
 * Get a page title from URL for tab display
 */
export function urlToTitle(url) {
  if (!url) return 'New Tab'
  if (url.startsWith('futuros://')) {
    return FUTUROS_PAGES[url]?.title || 'FuturOS'
  }
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    return hostname.charAt(0).toUpperCase() + hostname.slice(1)
  } catch {
    return 'Loading...'
  }
}

/**
 * Check if URL is a futuros:// internal page
 */
export function isFuturosUrl(url) {
  return url?.startsWith('futuros://')
}
