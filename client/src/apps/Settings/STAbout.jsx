import { motion } from 'framer-motion'
import { Heart, ExternalLink, Github, Globe } from 'lucide-react'
import { SectionHeader, SettingCard, SettingRow, Divider } from './STShared'

const TECH_CREDITS = [
  { name: 'React 18',      role: 'UI Framework',        color: '#61dafb', url: 'https://react.dev' },
  { name: 'Vite 5',        role: 'Build Tool',          color: '#646cff', url: 'https://vitejs.dev' },
  { name: 'Tailwind CSS v4', role: 'Styling',           color: '#38bdf8', url: 'https://tailwindcss.com' },
  { name: 'Framer Motion', role: 'Animations',          color: '#bb4ad8', url: 'https://framer.com/motion' },
  { name: 'Zustand',       role: 'State Management',    color: '#eba234', url: 'https://zustand-demo.pmnd.rs' },
  { name: 'Lucide React',  role: 'Icons',               color: '#f06292', url: 'https://lucide.dev' },
  { name: 'react-rnd',     role: 'Window Drag/Resize',  color: '#34d399', url: 'https://github.com/bokuweb/react-rnd' },
  { name: 'Firebase',      role: 'Auth & Database',     color: '#ffca28', url: 'https://firebase.google.com' },
]

export default function STAbout() {
  const uptime = Math.floor(performance.now() / 1000)
  const hrs  = Math.floor(uptime / 3600)
  const mins = Math.floor((uptime % 3600) / 60)
  const secs = uptime % 60
  const uptimeStr = hrs > 0 ? `${hrs}h ${mins}m ${secs}s` : mins > 0 ? `${mins}m ${secs}s` : `${secs}s`

  return (
    <div className="selectable">
      <SectionHeader
        title="About FuturOS"
        subtitle="System information and technology credits"
      />

      {/* OS card */}
      <div style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(34,211,238,0.05) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 16, marginBottom: 16,
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* OS Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(99,102,241,0.4)',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4"  y="4"  width="10" height="10" rx="2.5" fill="rgba(255,255,255,0.95)" />
            <rect x="18" y="4"  width="10" height="10" rx="2.5" fill="rgba(255,255,255,0.75)" />
            <rect x="4"  y="18" width="10" height="10" rx="2.5" fill="rgba(255,255,255,0.75)" />
            <rect x="18" y="18" width="10" height="10" rx="2.5" fill="rgba(255,255,255,0.5)" />
          </svg>
        </motion.div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.02em' }}>
          FuturOS
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
          Portfolio Edition · Version 1.0.0
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
          Build 2025.06 · React 18.3 · Vite 5.2
        </div>
      </div>

      {/* System info */}
      <Divider label="SYSTEM" />
      <SettingCard>
        {[
          { label: 'OS Name',       value: 'FuturOS 1.0.0'       },
          { label: 'Build Date',    value: 'June 2025'            },
          { label: 'Kernel',        value: 'futuros-6.8.0-react'  },
          { label: 'Architecture',  value: 'Browser (x86_64)'     },
          { label: 'Session Uptime', value: uptimeStr             },
          { label: 'Viewport',      value: `${window.innerWidth}×${window.innerHeight}` },
          { label: 'User Agent',    value: navigator.userAgent.split(' ').slice(-2).join(' '), mono: true },
        ].map(({ label, value, mono }, i, arr) => (
          <SettingRow key={label} label={label} noBorder={i === arr.length - 1}>
            <span style={{
              fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
              fontSize: mono ? 10 : 12,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: 200, textAlign: 'right',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {value}
            </span>
          </SettingRow>
        ))}
      </SettingCard>

      {/* Tech stack credits */}
      <Divider label="POWERED BY" />
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16,
      }}>
        {TECH_CREDITS.map(tech => (
          <a
            key={tech.name}
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${tech.color}0e`; e.currentTarget.style.borderColor = `${tech.color}33` }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: tech.color, boxShadow: `0 0 6px ${tech.color}`,
            }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.82)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {tech.name}
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'rgba(255,255,255,0.38)' }}>
                {tech.role}
              </div>
            </div>
            <ExternalLink size={11} color="rgba(255,255,255,0.2)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
          </a>
        ))}
      </div>

      {/* Made with love */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '14px', borderRadius: 10,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Made with
        </span>
        <Heart size={13} color="#f87171" fill="#f87171" />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          by a developer who cares about craft
        </span>
      </div>
    </div>
  )
}
