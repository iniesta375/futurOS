import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Globe, Mail, Copy, Check, ArrowRight } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import { PROFILE, SOCIALS } from './aboutData'
import { useOSAnimations } from '@contexts/GlassEffectContext'

const ICON_MAP = {
  github:   Github,
  linkedin: Linkedin,
  twitter:  Twitter,
  globe:    Globe,
  mail:     Mail,
}

function SocialBtn({ social, delay }) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const Icon = ICON_MAP[social.icon] || Globe
  const { enabled } = useOSAnimations()

  return (
    <motion.a
      ref={ref}
      href={social.url}
      target={social.icon !== 'mail' ? '_blank' : undefined}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, type: 'spring', stiffness: 350, damping: 28 }}
      whileHover={enabled ? { scale: 1.04, y: -2 } : {}}
      whileTap={enabled ? { scale: 0.97 } : {}}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        flex: 1, minWidth: 130,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${social.color}55`
        e.currentTarget.style.background = `${social.color}0d`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: `${social.color}18`,
        border: `1px solid ${social.color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color={social.color} strokeWidth={1.75} />
      </div>
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
        color: 'rgba(255,255,255,0.8)',
      }}>
        {social.label}
      </span>
      <ArrowRight size={13} color="rgba(255,255,255,0.25)" style={{ marginLeft: 'auto' }} />
    </motion.a>
  )
}

export default function AMContact() {
  const [copied, setCopied] = useState(false)
  const [ref, inView] = useInView({ threshold: 0.1 })

  const handleCopy = () => {
    navigator.clipboard.writeText(PROFILE.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section id="contact" ref={ref} style={{ padding: '8px 28px 32px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
          color: 'rgba(255,255,255,0.9)', marginBottom: 4,
        }}>
          Contact
        </div>
        <div style={{ width: 32, height: 2, borderRadius: 99, background: '#f87171' }} />
      </div>

      {/* CTA hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(34,211,238,0.06) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 16, marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', bottom: -30, right: -30,
          width: 160, height: 160,
          background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
          color: 'rgba(255,255,255,0.92)', marginBottom: 8,
        }}>
          Let's build something great
        </div>
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: 13, lineHeight: 1.7,
          color: 'rgba(255,255,255,0.55)', marginBottom: 18,
        }}>
          I'm currently open to senior frontend, full-stack, and staff engineering roles.
          If you have an interesting problem to solve, I'd love to hear from you.
        </p>

        {/* Email CTA */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href={`mailto:${PROFILE.email}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: 10, textDecoration: 'none',
              fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
              color: '#fff',
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)' }}
          >
            <Mail size={15} strokeWidth={2} />
            Send Email
          </a>

          <motion.button
            whileHover={enabled ? { scale: 1.04 } : {}}
            whileTap={enabled ? { scale: 0.97 } : {}}
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: copied ? '#34d399' : 'rgba(255,255,255,0.65)',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={2} />}
            {copied ? 'Copied!' : PROFILE.email}
          </motion.button>
        </div>
      </motion.div>

      {/* Social links grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {SOCIALS.map((social, i) => (
          <SocialBtn key={social.label} social={social} delay={0.05 + i * 0.06} />
        ))}
      </div>
    </section>
  )
}
