/**
 * SystemTray.jsx — Taskbar right section
 *
 * Layout (right to left): Clock | NotificationBell | Wifi+Volume button
 * NotificationBell is NOW included and wired to notificationStore.
 */

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Volume2, VolumeX } from 'lucide-react'
import useOSStore from '@stores/osStore'
import TaskbarClock from './TaskbarClock'
import SystemTrayPanel from './SystemTrayPanel'
import NotificationBell from './NotificationBell'

export default function SystemTray() {
  const [panelOpen, setPanelOpen] = useState(false)
  // Fine-grained selectors — was useOSStore() (subscribes to entire store)
  const wifi   = useOSStore(s => s.wifi)
  const volume = useOSStore(s => s.volume)

  const iconStyle = { color: 'rgba(255,255,255,0.62)', cursor: 'pointer' }

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}>

      {/* ── Notification Bell ─────────────────────── */}
      <NotificationBell />

      {/* ── Wifi + Volume quick icons ─────────────── */}
      <button
        onClick={() => setPanelOpen(p => !p)}
        aria-label="Quick settings"
        aria-expanded={panelOpen}
        aria-haspopup="dialog"
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '0 8px', height: 36,
          background: panelOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
          border: 'none', cursor: 'pointer', borderRadius: 8,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!panelOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
        onMouseLeave={e => { if (!panelOpen) e.currentTarget.style.background = 'transparent' }}
      >
        {wifi
          ? <Wifi   size={14} strokeWidth={2} style={iconStyle} />
          : <WifiOff size={14} strokeWidth={2} style={{ ...iconStyle, color: 'rgba(248,113,113,0.7)' }} />
        }
        {volume === 0
          ? <VolumeX size={14} strokeWidth={2} style={iconStyle} />
          : <Volume2 size={14} strokeWidth={2} style={iconStyle} />
        }
      </button>

      {/* ── Clock ─────────────────────────────────── */}
      <div
        onClick={() => setPanelOpen(p => !p)}
        style={{
          background: panelOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
          padding: '2px 8px', borderRadius: 8, cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!panelOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
        onMouseLeave={e => { if (!panelOpen) e.currentTarget.style.background = 'transparent' }}
      >
        <TaskbarClock />
      </div>

      {/* ── Quick settings panel ──────────────────── */}
      <AnimatePresence>
        {panelOpen && (
          <SystemTrayPanel onClose={() => setPanelOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
