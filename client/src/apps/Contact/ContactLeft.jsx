import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail, Copy, Check, Github, Linkedin, Twitter,
  Globe, MapPin, Clock, ArrowRight, MessageSquare,
} from 'lucide-react'
import { PROFILE, SOCIALS } from '@apps/AboutMe/aboutData'

const ICON_MAP = {
  github:   Github,
  linkedin: Linkedin,
  twitter:  Twitter,
  globe:    Globe,
  mail:     Mail,
}

function AvailabilityCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      style={{
        padding: '14px 16px',
        background: 'rgba(52,211,153,0.07)',
        border: '1px solid rgba(52,211,153,0.2)',
        borderRadius: 14,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        {/* Pulsing dot */}
        <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: '#34d399',
            animation: 'glow-pulse 1.8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: -3, borderRadius: '50%',
            background: 'rgba(52,211,153,0.2)',
            animation: 'glow-pulse 1.8s ease-in-out infinite 0.3s',
          }} />
        </div>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700,
          color: '#34d399',
        }}>
          Available for Work
        </span>
      </div>

      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.6,
        color: 'rgba(255,255,255,0.55)', marginBottom: 10,
      }}>
        Open to senior frontend, full-stack, and staff engineering roles. Remote-first, available immediately.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { icon: Clock,   text: 'Typical response within 24h' },
          { icon: MapPin,  text: PROFILE.location },
          { icon: Globe,   text: 'Remote · Hybrid · Relocation possible' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon size={12} color="rgba(52,211,153,0.6)" strokeWidth={2} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
              {text}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function EmailCard() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(PROFILE.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: 'rgba(248,113,113,0.12)',
        border: '1px solid rgba(248,113,113,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Mail size={16} color="#f87171" strokeWidth={1.75} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>
          EMAIL
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500,
          color: 'rgba(255,255,255,0.82)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {PROFILE.email}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
        onClick={handleCopy}
        style={{
          width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
          background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'background 0.2s',
        }}
      >
        {copied
          ? <Check size={14} color="#34d399" strokeWidth={2.5} />
          : <Copy size={14} color="rgba(255,255,255,0.5)" strokeWidth={1.75} />
        }
      </motion.button>
    </motion.div>
  )
}

function SocialLink({ social, index }) {
  const Icon = ICON_MAP[social.icon] || Globe
  return (
    <motion.a
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.06 }}
      whileHover={{ x: 4 }}
      href={social.url}
      target={social.icon !== 'mail' ? '_blank' : undefined}
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', borderRadius: 10,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none',
        transition: 'background 0.15s, border-color 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${social.color}12`
        e.currentTarget.style.borderColor = `${social.color}44`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
        background: `${social.color}18`,
        border: `1px solid ${social.color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={15} color={social.color} strokeWidth={1.75} />
      </div>
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
        color: 'rgba(255,255,255,0.78)', flex: 1,
      }}>
        {social.label}
      </span>
      <ArrowRight size={13} color="rgba(255,255,255,0.2)" />
    </motion.a>
  )
}

export default function ContactLeft() {
  return (
    <div style={{
      width: 260, flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(8,8,18,0.5)',
      padding: '24px 16px',
      overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: 0,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 16 }}
      >
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
          color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.02em', marginBottom: 4,
        }}>
          Get in Touch
        </div>
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.42)',
        }}>
          I'd love to hear about your project, role, or idea.
        </p>
      </motion.div>

      <AvailabilityCard />
      <EmailCard />

      {/* Social links */}
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', marginBottom: 8 }}>
        SOCIAL
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {SOCIALS.map((social, i) => (
          <SocialLink key={social.label} social={social} index={i} />
        ))}
      </div>
    </div>
  )
}
