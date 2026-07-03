import { Component } from 'react'
import { AlertTriangle, RefreshCw, X, Terminal } from 'lucide-react'

/**
 * ErrorBoundary — Three-tier error isolation for FuturOS
 *
 * Tier 1: GlobalErrorBoundary  — wraps entire app root
 * Tier 2: WindowErrorBoundary  — wraps each Window instance
 * Tier 3: AppErrorBoundary     — wraps app content inside chrome
 */

function logError(error, info, context = {}) {
  const payload = {
    message:   error?.message,
    stack:     error?.stack,
    component: info?.componentStack,
    ...context,
    timestamp: new Date().toISOString(),
  }
  console.group(`[FuturOS] Error Boundary — ${context.tier || 'Unknown'}`)
  console.error('Error:', error)
  if (info?.componentStack) console.error('Component tree:', info.componentStack)
  console.groupEnd()
  try { window.__futuros_analytics?.track('error_boundary', payload) } catch { /* ok */ }
}

// ── Shared button style ───────────────────────────────────────────────────
const btn = (accent = false) => ({
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 18px', borderRadius: 9, cursor: 'pointer',
  background: accent ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
  border: `1px solid ${accent ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.1)'}`,
  color: accent ? '#818cf8' : 'rgba(255,255,255,0.45)',
  fontSize: 13, fontWeight: accent ? 600 : 400, fontFamily: 'inherit',
})

// ── 1. Global Error Boundary ──────────────────────────────────────────────
export class GlobalErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) { return { hasError: true, error } }

  componentDidCatch(error, info) { logError(error, info, { tier: 'Global' }) }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0a0a12 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 24, padding: 32,
        fontFamily: 'system-ui, sans-serif', color: 'rgba(255,255,255,0.88)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(248,113,113,0.18)',
        }}>
          <AlertTriangle size={32} color="#f87171" strokeWidth={1.5} />
        </div>

        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            FuturOS encountered a critical error
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
            An unexpected error caused the OS to stop responding.
            Your saved state will be preserved on reload.
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: 16, textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                Dev details
              </summary>
              <pre style={{
                fontSize: 11, color: '#fca5a5', marginTop: 8, overflow: 'auto', maxHeight: 200,
                background: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 8,
              }}>
                {this.state.error.message}{'\n\n'}{this.state.error.stack?.slice(0, 600)}
              </pre>
            </details>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => window.location.reload()} style={{ ...btn(true), color: '#fca5a5', borderColor: 'rgba(248,113,113,0.35)', background: 'rgba(248,113,113,0.12)' }}>
            <RefreshCw size={15} /> Reload FuturOS
          </button>
          <button onClick={() => { localStorage.clear(); window.location.reload() }} style={btn()}>
            Reset all state
          </button>
        </div>
      </div>
    )
  }
}

// ── 2. Window Error Boundary ──────────────────────────────────────────────
export class WindowErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) { return { hasError: true, error } }

  componentDidCatch(error, info) {
    logError(error, info, { tier: 'Window', appId: this.props.appId, winId: this.props.windowId })
  }

  render() {
    if (!this.state.hasError) return this.props.children
    const { appTitle = 'App', onClose, onRestart } = this.props

    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 20, padding: 32,
        background: 'rgba(10,10,20,0.97)', fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle size={22} color="#f87171" strokeWidth={1.5} />
        </div>

        <div style={{ textAlign: 'center', maxWidth: 300 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: 6 }}>
            {appTitle} crashed
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>
            This app encountered an error. Other windows are unaffected.
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: 10, textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Dev details</summary>
              <pre style={{ fontSize: 10, color: '#fca5a5', marginTop: 6, overflow: 'auto', maxHeight: 120, background: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 6 }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {onRestart && (
            <button onClick={() => { this.setState({ hasError: false, error: null }); onRestart?.() }} style={btn(true)}>
              <RefreshCw size={13} /> Restart
            </button>
          )}
          {onClose && (
            <button onClick={onClose} style={btn()}>
              <X size={13} /> Close
            </button>
          )}
        </div>
      </div>
    )
  }
}

// ── 3. App Content Error Boundary ─────────────────────────────────────────
export class AppErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() { return { hasError: true } }

  componentDidCatch(error, info) {
    logError(error, info, { tier: 'AppContent', appId: this.props.appId })
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div style={{
        width: '100%', height: '100%', minHeight: 120,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 12, background: 'rgba(10,10,20,0.5)',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <Terminal size={20} color="rgba(248,113,113,0.6)" strokeWidth={1.5} />
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>
          Content failed to render
        </span>
        <button onClick={() => this.setState({ hasError: false })} style={btn()}>
          Retry
        </button>
      </div>
    )
  }
}
