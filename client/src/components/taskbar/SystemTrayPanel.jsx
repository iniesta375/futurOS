import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Volume2, Sun, Bluetooth, Bell, BellOff } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import useOSStore            from '@stores/osStore'
import useNotificationStore  from '@stores/notificationStore'
import { useGlassEffect, useOSAnimations } from '@contexts/GlassEffectContext'
import { useClickOutside }   from '@hooks/useClickOutside'

/**
 * SystemTrayPanel — Quick-settings flyout panel.
 *
 * Phase 13B:
 *  - Fixed stale bug: was reading notifications from osStore (legacy API
 *    removed in Phase 12.5). Now reads from notificationStore.
 *  - All store subscriptions narrowed to fine-grained selectors.
 *  - Panel entrance/exit animation gated on useOSAnimations().enabled.
 *  - ARIA: aria-label on sliders, role on toggle buttons.
 */
export default function SystemTrayPanel({ onClose }) {
  const panelRef = useRef(null)
  useClickOutside(panelRef, onClose)
  const glass    = useGlassEffect('panel')
  const { enabled } = useOSAnimations()

  // Fine-grained OS settings selectors
  const wifi            = useOSStore(s => s.wifi)
  const toggleWifi      = useOSStore(s => s.toggleWifi)
  const bluetooth       = useOSStore(s => s.bluetooth)
  const toggleBluetooth = useOSStore(s => s.toggleBluetooth)
  const volume          = useOSStore(s => s.volume)
  const setVolume       = useOSStore(s => s.setVolume)
  const brightness      = useOSStore(s => s.brightness)
  const setBrightness   = useOSStore(s => s.setBrightness)

  // Notifications from the correct store
  const unreadCount = useNotificationStore(s => s.getUnreadCount())
  const markAllRead = useNotificationStore(s => s.markAllRead)
  const recentNotifs = useNotificationStore(
    useShallow(s => s.notifications.slice(0, 3))
  )

  const QuickToggle = ({ icon: Icon, label, active, onToggle, accent = '#6366f1' }) => (
    <button
      onClick={onToggle}
      aria-label={`${label} — ${active ? 'on' : 'off'}`}
      aria-pressed={active}
      className="flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-150"
      style={{
        width: 72, height: 60,
        background: active ? `${accent}22` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${active ? accent + '44' : 'rgba(255,255,255,0.08)'}`,
        cursor: 'pointer',
        color: active ? accent : 'rgba(255,255,255,0.5)',
      }}
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      <span style={{ fontSize: 10, fontFamily: 'var(--font-ui)', fontWeight: 500 }}>{label}</span>
    </button>
  )

  const SliderRow = ({ icon: Icon, value, onChange, color, label }) => (
    <div className="flex items-center gap-3">
      <Icon size={15} color="rgba(255,255,255,0.5)" strokeWidth={1.75} aria-hidden="true" />
      <div className="flex-1 relative flex items-center" style={{ height: 20 }}>
        <input
          type="range" min={0} max={100} value={value}
          aria-label={label}
          aria-valuenow={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full appearance-none cursor-pointer"
          style={{
            height: 4, borderRadius: 99,
            background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, rgba(255,255,255,0.12) ${value}%, rgba(255,255,255,0.12) 100%)`,
            outline: 'none', border: 'none',
          }}
        />
      </div>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', minWidth: 28, textAlign: 'right' }}>
        {value}
      </span>
    </div>
  )

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-label="Quick settings"
      initial={enabled ? { opacity: 0, y: 8, scale: 0.97 } : { opacity: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={enabled ? { opacity: 0, y: 8, scale: 0.97 } : { opacity: 0 }}
      transition={enabled ? { duration: 0.18, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
      className="absolute"
      style={{
        bottom: 58, right: 0, width: 280,
        ...glass,
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 14,
        boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        padding: 16, zIndex: 600,
      }}
    >
      {/* Quick toggles */}
      <div className="flex gap-2 mb-4">
        <QuickToggle icon={wifi ? Wifi : WifiOff} label="Wi-Fi"    active={wifi}       onToggle={toggleWifi}       accent="#22d3ee" />
        <QuickToggle icon={Bluetooth}              label="BT"       active={bluetooth}  onToggle={toggleBluetooth}  accent="#818cf8" />
        <QuickToggle
          icon={unreadCount > 0 ? Bell : BellOff}
          label={unreadCount > 0 ? `${unreadCount} New` : 'Silent'}
          active={unreadCount > 0}
          onToggle={markAllRead}
          accent="#fbbf24"
        />
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 14 }} />

      <div className="flex flex-col gap-4">
        <SliderRow icon={Volume2} value={volume}     onChange={setVolume}     color="#6366f1" label="Volume" />
        <SliderRow icon={Sun}     value={brightness} onChange={setBrightness} color="#fbbf24" label="Brightness" />
      </div>

      {/* Recent notifications — sourced from notificationStore */}
      {recentNotifs.length > 0 && (
        <>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '14px 0' }} />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 8, fontFamily: 'var(--font-ui)' }}>
            RECENT
          </div>
          <div className="flex flex-col gap-1" style={{ maxHeight: 100, overflowY: 'auto' }}>
            {recentNotifs.map(n => (
              <div
                key={n.id}
                className="text-xs rounded-lg px-3 py-2"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: n.read ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.82)',
                  fontFamily: 'var(--font-ui)', fontSize: 12,
                }}
              >
                {n.message || n.title}
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
