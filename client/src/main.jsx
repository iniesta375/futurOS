import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@styles/globals.css'
import App from './App'
import { initAnalytics } from '@utils/analytics'

// Init analytics before first render (non-blocking, no-op in dev)
initAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// ── PWA Service Worker ────────────────────────────────────────────────────
// Only register in production to avoid dev cache confusion.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(reg => {
        console.info('[FuturOS] Service worker registered:', reg.scope)
      })
      .catch(err => {
        console.warn('[FuturOS] Service worker registration failed:', err)
      })
  })
}
