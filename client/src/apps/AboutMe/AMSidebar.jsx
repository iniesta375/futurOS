import { motion } from 'framer-motion'
import { User, Code2, Briefcase, Layers, GitBranch, Mail, ChevronRight, Download } from 'lucide-react'
import { PROFILE } from './aboutData'
import { IDENTITY } from '@content/portfolio'
import { executeAction } from '@constants/actionsRegistry'

const NAV_ITEMS = [
  { id: 'profile',    label: 'Profile',      icon: User },
  { id: 'skills',     label: 'Skills',       icon: Code2 },
  { id: 'experience', label: 'Experience',   icon: Briefcase },
  { id: 'stack',      label: 'Tech Stack',   icon: Layers },
  { id: 'oss',        label: 'Open Source',  icon: GitBranch },
  { id: 'contact',    label: 'Contact',      icon: Mail },
]

export default function AMSidebar({ activeSection, onSelect }) {
  return (
    <div style={{
      width: 200,
      flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(8,8,18,0.6)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0 16px',
    }}>

      {/* Avatar block */}
      <div style={{ padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{
            width: 56, height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(99,102,241,0.45)',
            border: '2px solid rgba(255,255,255,0.12)',
            marginBottom: 10,
            position: 'relative',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22, fontWeight: 700, color: '#fff',
          }}>
            {PROFILE.avatarInitial}
          </span>

          {/* Available dot */}
          {PROFILE.available && (
            <div style={{
              position: 'absolute', bottom: 1, right: 1,
              width: 12, height: 12, borderRadius: '50%',
              background: '#34d399',
              border: '2px solid rgba(8,8,18,0.9)',
              boxShadow: '0 0 8px rgba(52,211,153,0.7)',
            }} />
          )}
        </motion.div>

        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
          color: 'rgba(255,255,255,0.88)',
          marginBottom: 2,
        }}>
          {PROFILE.name}
        </div>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 11,
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.4,
        }}>
          {PROFILE.title}
        </div>

        {PROFILE.available && (
          <div style={{
            marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 8px', borderRadius: 20,
            background: 'rgba(52,211,153,0.12)',
            border: '1px solid rgba(52,211,153,0.3)',
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#34d399',
              animation: 'glow-pulse 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600,
              color: '#34d399', letterSpacing: '0.04em',
            }}>
              OPEN TO WORK
            </span>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }, i) => {
          const active = activeSection === id
          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04, duration: 0.2 }}
              onClick={() => onSelect(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                width: '100%', textAlign: 'left',
                transition: 'background 0.15s',
                position: 'relative',
                outline: 'none',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="am-nav-active"
                  style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: 99,
                    background: '#6366f1',
                    boxShadow: '0 0 8px rgba(99,102,241,0.6)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                size={15} strokeWidth={active ? 2 : 1.75}
                color={active ? '#818cf8' : 'rgba(255,255,255,0.4)'}
              />
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 13,
                color: active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)',
                fontWeight: active ? 600 : 400,
                flex: 1,
              }}>
                {label}
              </span>
              {active && <ChevronRight size={12} color="rgba(99,102,241,0.6)" strokeWidth={2} />}
            </motion.button>
          )
        })}
      </nav>

      {/* Resume download — must be findable within 5 seconds */}
      <div style={{ padding: '12px 10px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => executeAction('resume.download')}
          aria-label="Download resume PDF"
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '9px 12px',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: 9, cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
            color: '#818cf8',
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(99,102,241,0.25)'
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.55)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'
          }}
        >
          <Download size={13} strokeWidth={2.5} aria-hidden="true" />
          Download Resume
        </motion.button>
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 16px',
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'rgba(255,255,255,0.2)',
      }}>
        FuturOS v1.0 · Portfolio
      </div>
    </div>
  )
}
