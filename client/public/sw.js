/**
 * FuturOS Service Worker
 *
 * Strategy: Network-first for navigation, cache-first for assets.
 * The OS shell must always be fresh; assets can be cached aggressively.
 *
 * Cache tiers:
 *   SHELL_CACHE  — HTML, core JS/CSS (invalidated on new deploy via cache name versioning)
 *   ASSET_CACHE  — fonts, images, icons (long-lived, content-addressed filenames)
 *   OFFLINE_PAGE — shown when navigation fails entirely
 */

const VERSION        = 'v1.0.0'
const SHELL_CACHE    = `futuros-shell-${VERSION}`
const ASSET_CACHE    = `futuros-assets-${VERSION}`

// Files to pre-cache on install (the minimal shell)
const SHELL_FILES = [
  '/',
  '/manifest.webmanifest',
  '/offline.html',
]

// ── Install ───────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  )
})

// ── Activate — clean old caches ───────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== SHELL_CACHE && k !== ASSET_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// ── Fetch — network-first for navigation, cache-first for assets ──────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // Navigation requests: network-first, fallback to offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone()
          caches.open(SHELL_CACHE).then(cache => cache.put(request, clone))
          return response
        })
        .catch(() =>
          caches.match(request).then(cached =>
            cached || caches.match('/offline.html')
          )
        )
    )
    return
  }

  // Versioned assets (hashed filenames) — cache-first, long TTL
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(ASSET_CACHE).then(cache => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  )
})
