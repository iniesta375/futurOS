import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Github, Linkedin, Twitter, Globe, Mail,
  Download, Monitor, MapPin, Briefcase,
} from 'lucide-react'
import { IDENTITY, SOCIALS, SKILLS, EXPERIENCE } from '@content/portfolio'
import { Analytics } from '@utils/analytics'

/**
 * MobileLanding — Phase 14 mobile experience.
 *
 * Shown on screens < 768px wide. Renders a clean, fast-loading profile
 * card that gives recruiters on mobile everything they need:
 *   - Identity + availability status
 *   - Resume download
 *   - Social links
 *   - Top skills summary
 *   - Most recent role
 *   - "View full desktop portfolio" button
 *
 * Data is sourced entirely from src/content/portfolio.js — no duplication.
 * Reuses the same IDENTITY, SOCIALS, SKILLS, and EXPERIENCE constants.
 */

const ICON_MAP = {
  github:   Github,
  linkedin: Linkedin,
  twitter:  Twitter,
  globe:    Globe,
  mail:     Mail,
}

function SocialRow({ social }) {
  const Icon = ICON_MAP[social.icon] || Globe
  return (
    <a
      href={social.url}
      target={social.icon !== 'mail' ? '_blank' : undefined}
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', borderRadius: 12, textDecoration: 'none',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.15s',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: `${social.color}18`,
        border: `1px solid ${social.color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color={social.color} strokeWidth={1.75} />
      </div>
      <span style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 14, fontWeight: 500,
        color: 'rgba(255,255,255,0.78)',
      }}>
        {social.label}
      </span>
    </a>
  )
}

export default function MobileLanding({ onViewDesktop }) {
  const [resumeClicked, setResumeClicked] = useState(false)

  const topSkills = SKILLS[0]?.items?.slice(0, 5) ?? []
  const latestRole = EXPERIENCE.find(e => e.type !== 'Education')

  const handleResume = () => {
    setResumeClicked(true)
    Analytics.resumeDownload()
    const a = document.createElement('a')
    a.href     = IDENTITY.resumeUrl
    a.download = `${IDENTITY.name.replace(/\s+/g, '-')}-Resume.pdf`
    a.target   = '_blank'
    a.rel      = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => setResumeClicked(false), 2500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.12) 0%, transparent 60%), #0a0a0f',
      padding: '32px 20px 48px',
      overflowY: 'auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'rgba(255,255,255,0.88)',
    }}>
      {/* Avatar + Identity */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ textAlign: 'center', marginBottom: 28 }}
      >
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)',
          border: '2px solid rgba(255,255,255,0.12)',
          boxShadow: '0 0 32px rgba(99,102,241,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: '#fff',
          margin: '0 auto 14px',
          overflow: 'hidden',
        }}>
          {IDENTITY.avatarUrl
            ? <img src={IDENTITY.avatarUrl} alt={IDENTITY.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : IDENTITY.avatarInitial
          }
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 4px' }}>
          {IDENTITY.name}
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 12px' }}>
          {IDENTITY.title}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            <MapPin size={12} strokeWidth={2} />
            {IDENTITY.location}
          </span>
          {latestRole && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              <Briefcase size={12} strokeWidth={2} />
              {latestRole.role} · {latestRole.company}
            </span>
          )}
        </div>

        {/* Available badge */}
        {IDENTITY.available && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 12, padding: '4px 12px', borderRadius: 20,
            background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.3)',
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 8px rgba(52,211,153,0.7)',
            }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399', letterSpacing: '0.04em' }}>
              OPEN TO WORK
            </span>
          </div>
        )}
      </motion.div>

      {/* Resume Download — primary CTA */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleResume}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8,
          padding: '14px 20px', borderRadius: 14,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', cursor: 'pointer', marginBottom: 24,
          boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
          color: '#fff', fontSize: 15, fontWeight: 700,
          fontFamily: 'inherit',
          transition: 'opacity 0.15s',
        }}
      >
        <Download size={17} strokeWidth={2} />
        {resumeClicked ? 'Downloading…' : 'Download Resume'}
      </motion.button>

      {/* Social links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}
      >
        {SOCIALS.filter(s => s.icon !== 'mail').map(social => (
          <SocialRow key={social.label} social={social} />
        ))}
        <SocialRow social={{ ...SOCIALS.find(s => s.icon === 'mail'), label: `Email: ${IDENTITY.email}` } || {}} />
      </motion.div>

      {/* Top skills preview */}
      {topSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: '16px 18px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, marginBottom: 24,
          }}
        >
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.3)', marginBottom: 12,
          }}>
            TOP SKILLS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topSkills.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 140, fontSize: 12, color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                  {s.name}
                </span>
                <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${s.level}%`,
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  }} />
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', width: 32, textAlign: 'right' }}>
                  {s.level}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* View full desktop version */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        onClick={onViewDesktop}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8,
          padding: '13px 20px', borderRadius: 14, cursor: 'pointer',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 500,
          fontFamily: 'inherit',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        <Monitor size={16} strokeWidth={1.75} />
        View Full Desktop Portfolio
      </motion.button>

      <p style={{
        textAlign: 'center', fontSize: 11,
        color: 'rgba(255,255,255,0.2)',
        marginTop: 12, lineHeight: 1.6,
      }}>
        Best experienced on a desktop or laptop browser
      </p>
    </div>
  )
}
