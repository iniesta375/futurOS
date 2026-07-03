import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import DynamicIcon from '@components/ui/DynamicIcon'
import APP_REGISTRY from '@constants/appRegistry'
import { AppErrorBoundary } from '@components/error/ErrorBoundary'

/**
 * Lazy-loaded app components.
 * Vite will code-split each app into its own chunk.
 * Placeholder components used until each app is built in later phases.
 */
const appComponents = {
  about:    lazy(() => import('@apps/AboutMe/AboutMe')),
  projects: lazy(() => import('@apps/Projects/Projects')),
  terminal: lazy(() => import('@apps/Terminal/Terminal')),
  files:    lazy(() => import('@apps/FileExplorer/FileExplorer')),
  browser:  lazy(() => import('@apps/Browser/Browser')),
  settings: lazy(() => import('@apps/Settings/Settings')),
  contact:  lazy(() => import('@apps/Contact/Contact')),
}

/** Shown while the lazy chunk is loading */
function AppLoadingFallback({ appId }) {
  const app = APP_REGISTRY[appId]
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full gap-3"
      style={{ background: 'var(--color-os-surface)' }}
    >
      <Loader2
        size={28}
        strokeWidth={1.5}
        color={app?.accentColor || 'var(--color-accent)'}
        style={{ animation: 'spin 1s linear infinite' }}
      />
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-ui)' }}>
        Loading {app?.title || appId}...
      </span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/** Placeholder for apps not yet built */
function PlaceholderApp({ appId }) {
  const app = APP_REGISTRY[appId] || {}

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full gap-4 selectable"
      style={{ background: 'var(--color-os-surface)' }}
    >
      <div
        className="flex items-center justify-center rounded-3xl"
        style={{
          width: 72, height: 72,
          background: `${app.accentColor || '#6366f1'}18`,
          border: `1px solid ${app.accentColor || '#6366f1'}33`,
          boxShadow: `0 0 40px ${app.accentColor || '#6366f1'}22`,
        }}
      >
        <DynamicIcon
          name={app.icon || 'box'}
          size={32}
          color={app.accentColor || '#6366f1'}
          strokeWidth={1.25}
        />
      </div>

      <div className="text-center" style={{ maxWidth: 280 }}>
        <div
          className="font-display text-xl font-bold mb-2"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          {app.title || appId}
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-ui)', lineHeight: 1.6 }}>
          {app.description || 'This app will be built in an upcoming phase.'}
        </p>
      </div>

      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: `${app.accentColor || '#6366f1'}15`,
          border: `1px solid ${app.accentColor || '#6366f1'}30`,
        }}
      >
        <div
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: app.accentColor || '#6366f1',
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}
        />
        <span style={{ fontSize: 11, color: app.accentColor || '#6366f1', fontFamily: 'var(--font-mono)' }}>
          COMING IN NEXT PHASE
        </span>
      </div>
    </div>
  )
}

/**
 * AppRenderer — resolves and renders the correct app component.
 * Falls back to PlaceholderApp if the module isn't built yet.
 */
export default function AppRenderer({ win }) {
  const Component = appComponents[win.appId]

  if (!Component) {
    return <PlaceholderApp appId={win.appId} />
  }

  return (
    <AppErrorBoundary appId={win.appId}>
      <Suspense fallback={<AppLoadingFallback appId={win.appId} />}>
        <Component windowId={win.id} {...win.props} />
      </Suspense>
    </AppErrorBoundary>
  )
}
