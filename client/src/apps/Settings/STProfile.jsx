import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Edit2, User } from 'lucide-react'
import useOSStore from '@stores/osStore'
import { PROFILE } from '@apps/AboutMe/aboutData'
import { SectionHeader, SettingCard, SettingRow, Divider } from './STShared'

const AVATAR_COLORS = [
  { from: '#6366f1', to: '#8b5cf6' },
  { from: '#22d3ee', to: '#0ea5e9' },
  { from: '#34d399', to: '#10b981' },
  { from: '#f97316', to: '#ef4444' },
  { from: '#fbbf24', to: '#f59e0b' },
  { from: '#a78bfa', to: '#ec4899' },
]

export default function STProfile() {
  const { userName, login, logout, accentColor } = useOSStore()
  const [editing, setEditing]       = useState(false)
  const [nameVal, setNameVal]       = useState(userName)
  const [avatarColor, setAvatarColor] = useState(0)

  const handleSave = () => {
    if (nameVal.trim()) login(nameVal.trim())
    setEditing(false)
  }

  const gradient = `linear-gradient(135deg, ${AVATAR_COLORS[avatarColor].from}, ${AVATAR_COLORS[avatarColor].to})`

  return (
    <div className="selectable">
      <SectionHeader
        title="Profile"
        subtitle="Manage your FuturOS account and personal information"
      />

      {/* Avatar card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '20px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, marginBottom: 16,
      }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <motion.div
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 32px ${AVATAR_COLORS[avatarColor].from}55`,
              border: '3px solid rgba(255,255,255,0.12)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#fff' }}>
              {userName.charAt(0).toUpperCase()}
            </span>
          </motion.div>
          <div style={{
            position: 'absolute', bottom: 2, right: 2,
            width: 16, height: 16, borderRadius: '50%',
            background: '#34d399', border: '2px solid rgba(10,10,22,0.9)',
            boxShadow: '0 0 6px rgba(52,211,153,0.6)',
          }} />
        </div>

        {/* Name + role */}
        <div style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  autoFocus
                  value={nameVal}
                  onChange={e => setNameVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
                  style={{
                    fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
                    color: 'rgba(255,255,255,0.9)',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(99,102,241,0.5)',
                    borderRadius: 8, padding: '4px 10px', outline: 'none',
                    width: 180,
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  style={{
                    width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Check size={14} color="#fff" strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>
                    {userName}
                  </span>
                  <button onClick={() => setEditing(true)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                    color: 'rgba(255,255,255,0.35)',
                    padding: 4, borderRadius: 6,
                  }}>
                    <Edit2 size={13} strokeWidth={2} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.42)', marginTop: 2 }}>
            {PROFILE.title} · FuturOS Local Account
          </div>
          <div style={{
            marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '2px 8px', borderRadius: 99,
            background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 4px #34d399' }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, color: '#34d399', letterSpacing: '0.04em' }}>
              OPEN TO WORK
            </span>
          </div>
        </div>
      </div>

      {/* Avatar color picker */}
      <Divider label="AVATAR COLOR" />
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {AVATAR_COLORS.map((c, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.93 }}
            onClick={() => setAvatarColor(i)}
            style={{
              width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
              boxShadow: avatarColor === i
                ? `0 0 0 3px rgba(255,255,255,0.2), 0 0 0 5px ${c.from}88`
                : `0 2px 8px ${c.from}44`,
            }}
          />
        ))}
      </div>

      {/* Account info */}
      <Divider label="ACCOUNT DETAILS" />
      <SettingCard>
        {[
          { label: 'Full Name',    value: userName },
          { label: 'Role',         value: PROFILE.title },
          { label: 'Email',        value: PROFILE.email },
          { label: 'Location',     value: PROFILE.location },
          { label: 'Account Type', value: 'Local Administrator' },
        ].map(({ label, value }, i, arr) => (
          <SettingRow key={label} label={label} noBorder={i === arr.length - 1}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              {value}
            </span>
          </SettingRow>
        ))}
      </SettingCard>

      {/* Sign out */}
      <Divider />
      <button
        onClick={logout}
        style={{
          width: '100%', padding: '11px 16px', borderRadius: 10,
          border: '1px solid rgba(248,113,113,0.25)',
          background: 'rgba(248,113,113,0.08)',
          color: '#f87171', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.15)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.25)' }}
      >
        Sign Out & Return to Login
      </button>
    </div>
  )
}
