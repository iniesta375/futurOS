import { motion } from 'framer-motion'
import {
  Palette, Monitor, Volume2, Wifi, User, Keyboard, Info, ChevronRight,
} from 'lucide-react'

const SECTIONS = [
  { id: 'appearance', label: 'Appearance',    icon: Palette,   accent: '#818cf8' },
  { id: 'display',    label: 'Display',       icon: Monitor,   accent: '#22d3ee' },
  { id: 'sound',      label: 'Sound',         icon: Volume2,   accent: '#34d399' },
  { id: 'network',    label: 'Network',       icon: Wifi,      accent: '#60a5fa' },
  { id: 'profile',    label: 'Profile',       icon: User,      accent: '#f97316' },
  { id: 'keyboard',   label: 'Keyboard',      icon: Keyboard,  accent: '#fbbf24' },
  { id: 'about',      label: 'About FuturOS', icon: Info,      accent: '#a78bfa' },
]

export { SECTIONS }

export default function STSidebar({ active, onSelect }) {
  return (
    <div style={{
      width: 210, flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(8,8,18,0.5)',
      display: 'flex', flexDirection: 'column',
      padding: '16px 8px',
      overflowY: 'auto',
    }}>
      <div style={{
        fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700,
        color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em',
        padding: '4px 10px 10px',
      }}>
        SYSTEM PREFERENCES
      </div>

      {SECTIONS.map((sec, i) => {
        const Icon = sec.icon
        const isActive = active === sec.id
        return (
          <motion.button
            key={sec.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelect(sec.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '9px 10px', borderRadius: 9,
              border: 'none', cursor: 'pointer',
              background: isActive ? `${sec.accent}18` : 'transparent',
              width: '100%', textAlign: 'left',
              marginBottom: 2,
              position: 'relative',
              outline: 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="settings-nav-active"
                style={{
                  position: 'absolute', left: 0, top: '20%', bottom: '20%',
                  width: 3, borderRadius: 99, background: sec.accent,
                  boxShadow: `0 0 8px ${sec.accent}88`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {/* Icon */}
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: isActive ? `${sec.accent}22` : 'rgba(255,255,255,0.06)',
              border: `1px solid ${isActive ? sec.accent + '44' : 'rgba(255,255,255,0.08)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, border-color 0.15s',
            }}>
              <Icon size={15} color={isActive ? sec.accent : 'rgba(255,255,255,0.5)'} strokeWidth={1.75} />
            </div>

            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: 13,
              color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.58)',
              fontWeight: isActive ? 600 : 400,
              flex: 1,
            }}>
              {sec.label}
            </span>

            {isActive && (
              <ChevronRight size={13} color={`${sec.accent}88`} strokeWidth={2} />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
