import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ExternalLink, RefreshCw, Globe } from 'lucide-react'
import { isFuturosUrl, FUTUROS_PAGES } from './browserData'

// Lazy-load portfolio apps for futuros:// pages
const INLINE_APPS = {
  about:    lazy(() => import('@apps/AboutMe/AboutMe')),
  projects: lazy(() => import('@apps/Projects/Projects')),
  terminal: lazy(() => import('@apps/Terminal/Terminal')),
  settings: lazy(() => import('@apps/Settings/Settings')),
}

function ErrorPage({ url, onRetry, onOpenExternal }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(10,10,20,0.98)', gap: 16,
      padding: 32, textAlign: 'center',
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <AlertTriangle size={28} color="#f87171" strokeWidth={1.5} />
      </motion.div>

      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
          color: 'rgba(255,255,255,0.9)', marginBottom: 8,
        }}>
          Can't reach this page
        </div>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 13, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.45)', maxWidth: 340,
        }}>
          {url} refused to connect. This is common with sites that block
          embedding via X-Frame-Options or Content-Security-Policy.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onRetry}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 10, cursor: 'pointer',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.75)',
            fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
          }}
        >
          <RefreshCw size={14} strokeWidth={2} />
          Retry
        </button>
        <button
          onClick={() => onOpenExternal(url)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
          }}
        >
          <ExternalLink size={14} strokeWidth={2} />
          Open in new tab
        </button>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>
        ERR_CONNECTION_REFUSED  ·  net::ERR_BLOCKED_BY_RESPONSE
      </div>
    </div>
  )
}

function LoadingPage() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a14',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '3px solid rgba(99,102,241,0.2)',
            borderTopColor: '#6366f1',
          }}
        />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          Loading...
        </span>
      </div>
    </div>
  )
}

function FuturosInlinePage({ url }) {
  const pageConfig = FUTUROS_PAGES[url]
  if (!pageConfig || pageConfig.component === 'home') return null

  const Component = INLINE_APPS[pageConfig.component]
  if (!Component) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', flexDirection: 'column', gap: 12,
        color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-ui)', fontSize: 13,
      }}>
        <Globe size={32} color="rgba(255,255,255,0.15)" strokeWidth={1.25} />
        Page not found: {url}
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* In-browser app banner */}
      <div style={{
        height: 28, display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 12px',
        background: 'rgba(99,102,241,0.08)',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
        flexShrink: 0,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 6px #6366f1' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#818cf8' }}>
          futuros:// · {pageConfig.title} · Rendered inline
        </span>
      </div>
      <div style={{ height: 'calc(100% - 28px)', overflow: 'hidden' }}>
        <Suspense fallback={<LoadingPage />}>
          <Component />
        </Suspense>
      </div>
    </div>
  )
}

export default function BrowserContent({ url, onLoaded, onError }) {
  const [loadState, setLoadState] = useState('loading') // 'loading' | 'loaded' | 'error'
  const [retryKey, setRetryKey]   = useState(0)
  const iframeRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!url || url.startsWith('futuros://')) {
      setLoadState('loaded')
      onLoaded?.()
      return
    }

    setLoadState('loading')

    // Timeout — if iframe doesn't respond in 8s, show error
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setLoadState('error')
      onError?.()
    }, 8000)

    return () => clearTimeout(timeoutRef.current)
  }, [url, retryKey])

  const handleLoad = () => {
    clearTimeout(timeoutRef.current)
    // Try to detect if iframe actually loaded (CORS issues prevent this sometimes)
    try {
      const doc = iframeRef.current?.contentDocument
      if (doc && doc.title !== '') {
        setLoadState('loaded')
        onLoaded?.()
      } else {
        // X-Frame-Options likely blocked it
        setLoadState('error')
        onError?.()
      }
    } catch {
      // Cross-origin: assume loaded if no CSP error
      setLoadState('loaded')
      onLoaded?.()
    }
  }

  const handleError = () => {
    clearTimeout(timeoutRef.current)
    setLoadState('error')
    onError?.()
  }

  const handleRetry = () => {
    setRetryKey(k => k + 1)
    setLoadState('loading')
  }

  const openExternal = (u) => {
    window.open(u, '_blank', 'noopener,noreferrer')
  }

  // futuros:// internal pages
  if (isFuturosUrl(url)) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        >
          <FuturosInlinePage url={url} />
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0a0a14' }}>
      {/* Loading state */}
      <AnimatePresence>
        {loadState === 'loading' && (
          <motion.div
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, zIndex: 2 }}
          >
            <LoadingPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {loadState === 'error' && (
        <ErrorPage url={url} onRetry={handleRetry} onOpenExternal={openExternal} />
      )}

      {/* iframe */}
      {loadState !== 'error' && url && (
        <iframe
          key={`${url}-${retryKey}`}
          ref={iframeRef}
          src={url}
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          style={{
            width: '100%', height: '100%', border: 'none',
            display: loadState === 'loaded' ? 'block' : 'none',
            background: '#fff',
          }}
          title="Browser content"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  )
}
