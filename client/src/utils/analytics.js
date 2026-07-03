/**
 * analytics.js — FuturOS Privacy-Friendly Analytics Abstraction
 *
 * Architecture:
 *  - Single track() function consumed everywhere
 *  - Environment-gated: disabled in dev, no-ops when VITE_ANALYTICS_ID unset
 *  - No PII collected — only event names + safe metadata
 *  - Supports Google Analytics 4 (gtag) and a console fallback for dev
 *  - Easy to swap provider: change the _send() implementation
 *
 * Usage (call anywhere via getState() — no React hook needed):
 *   import { track } from '@utils/analytics'
 *   track('app_launch',    { appId: 'projects' })
 *   track('project_view',  { projectId: 'my-os', projectTitle: 'FuturOS' })
 *   track('contact_submit')
 *   track('resume_download')
 *   track('search_used',   { query: 'react', resultCount: 3 })
 *
 * Tracked events:
 *   app_launch         — { appId }
 *   app_close          — { appId }
 *   project_view       — { projectId, projectTitle }
 *   project_link_click — { projectId, url, type: 'github' | 'live' }
 *   contact_submit     — {}
 *   resume_download    — {}
 *   start_menu_open    — {}
 *   search_used        — { query?, resultCount }
 *   search_result_click — { type, label }
 *   shortcut_used      — { shortcut }
 *   error_boundary     — { tier, message } (from ErrorBoundary)
 */

// ── Config ────────────────────────────────────────────────────────────────
const ANALYTICS_ID = import.meta.env.VITE_ANALYTICS_ID     // e.g. G-XXXXXXXXXX
const IS_PROD      = import.meta.env.PROD
const ENABLED      = IS_PROD && !!ANALYTICS_ID

// ── Session data (anonymous) ──────────────────────────────────────────────
const SESSION_START = Date.now()
function sessionSeconds() {
  return Math.round((Date.now() - SESSION_START) / 1000)
}

// ── Internal send ──────────────────────────────────────────────────────────
function _send(name, params = {}) {
  const payload = {
    ...params,
    session_s: sessionSeconds(),
  }

  if (ENABLED && typeof window.gtag === 'function') {
    // Google Analytics 4
    window.gtag('event', name, payload)
    return
  }

  if (!IS_PROD) {
    // Dev-only console logging (structured, easy to filter)
    console.info(`[Analytics] ${name}`, payload)
  }
}

// ── Public API ────────────────────────────────────────────────────────────
/**
 * Track a named event with optional metadata.
 * @param {string} name  — snake_case event name
 * @param {object} params — safe metadata (no PII)
 */
export function track(name, params = {}) {
  try {
    _send(name, params)
  } catch {
    // Analytics must never throw into app code
  }
}

// ── GA4 script loader (call once on app init if ANALYTICS_ID is set) ──────
export function initAnalytics() {
  if (!ENABLED) return
  if (document.getElementById('ga-script')) return

  const script = document.createElement('script')
  script.id    = 'ga-script'
  script.async = true
  script.src   = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', ANALYTICS_ID, {
    // Privacy: disable ad personalization signals
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    // Redact IP
    anonymize_ip: true,
    // Don't send page_view automatically — we control it
    send_page_view: false,
  })

  // Expose to error boundary (non-blocking)
  window.__futuros_analytics = { track }
}

// ── Convenience event helpers ──────────────────────────────────────────────
export const Analytics = {
  appLaunch:        (appId)          => track('app_launch',          { appId }),
  appClose:         (appId)          => track('app_close',           { appId }),
  projectView:      (id, title)      => track('project_view',        { projectId: id, projectTitle: title }),
  projectLinkClick: (id, url, type)  => track('project_link_click',  { projectId: id, url, type }),
  contactSubmit:    ()               => track('contact_submit'),
  resumeDownload:   ()               => track('resume_download'),
  startMenuOpen:    ()               => track('start_menu_open'),
  searchUsed:       (q, count)       => track('search_used',         { query: q?.slice(0, 80), resultCount: count }),
  searchClick:      (type, label)    => track('search_result_click', { type, label }),
  shortcutUsed:     (shortcut)       => track('shortcut_used',       { shortcut }),
  recruiterTour:    ()               => track('recruiter_tour_start'),
}
