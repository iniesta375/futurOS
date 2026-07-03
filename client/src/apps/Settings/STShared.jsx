/**
 * STShared.jsx — Reusable Settings UI components:
 * SectionHeader, SettingRow, Toggle, Slider, SegmentControl
 */

import { motion } from 'framer-motion'

/* ── Section header ─────────────────────────────────────────────────── */
export function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20, fontWeight: 800,
        color: 'rgba(255,255,255,0.92)',
        letterSpacing: '-0.02em', lineHeight: 1,
        marginBottom: subtitle ? 4 : 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>
          {subtitle}
        </p>
      )}
      <div style={{ marginTop: 10, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    </div>
  )
}

/* ── Setting card container ─────────────────────────────────────────── */
export function SettingCard({ children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, overflow: 'hidden',
      marginBottom: 12,
    }}>
      {children}
    </div>
  )
}

/* ── Individual setting row ─────────────────────────────────────────── */
export function SettingRow({ label, description, children, noBorder, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 16px',
      borderBottom: noBorder ? 'none' : '1px solid rgba(255,255,255,0.05)',
      minHeight: 52,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
          color: danger ? '#f87171' : 'rgba(255,255,255,0.85)',
          marginBottom: description ? 2 : 0,
        }}>
          {label}
        </div>
        {description && (
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>
            {description}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>
        {children}
      </div>
    </div>
  )
}

/* ── Animated toggle switch ─────────────────────────────────────────── */
export function Toggle({ value, onChange, accent = '#6366f1' }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      animate={{
        background: value ? accent : 'rgba(255,255,255,0.12)',
      }}
      transition={{ duration: 0.2 }}
      style={{
        width: 42, height: 24, borderRadius: 12,
        border: 'none', cursor: 'pointer', padding: 0,
        position: 'relative', flexShrink: 0,
        boxShadow: value ? `0 0 12px ${accent}55` : 'none',
      }}
    >
      <motion.div
        animate={{ x: value ? 19 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{
          position: 'absolute', top: 3,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      />
    </motion.button>
  )
}

/* ── Slider with gradient fill ──────────────────────────────────────── */
export function SettingSlider({ value, onChange, min = 0, max = 100, accent = '#6366f1', suffix = '' }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 200 }}>
      <div style={{ flex: 1, position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        <input
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            width: '100%', appearance: 'none', height: 4, borderRadius: 99, cursor: 'pointer',
            background: `linear-gradient(to right, ${accent} 0%, ${accent} ${pct}%, rgba(255,255,255,0.12) ${pct}%, rgba(255,255,255,0.12) 100%)`,
            outline: 'none', border: 'none',
          }}
        />
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 12,
        color: 'rgba(255,255,255,0.5)', minWidth: 36, textAlign: 'right',
      }}>
        {value}{suffix}
      </span>
    </div>
  )
}

/* ── Segment control (radio group) ─────────────────────────────────── */
export function SegmentControl({ options, value, onChange, accent = '#6366f1' }) {
  return (
    <div style={{
      display: 'flex', gap: 2, padding: 3,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 10,
    }}>
      {options.map(opt => {
        const active = value === opt.value
        return (
          <motion.button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            animate={{
              background: active ? accent : 'transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.55)',
            }}
            transition={{ duration: 0.15 }}
            style={{
              padding: '5px 14px', borderRadius: 7, border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: active ? 600 : 400,
              boxShadow: active ? `0 2px 8px ${accent}44` : 'none',
            }}
          >
            {opt.label}
          </motion.button>
        )
      })}
    </div>
  )
}

/* ── Divider ────────────────────────────────────────────────────────── */
export function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 12px' }}>
      {label && (
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    </div>
  )
}
