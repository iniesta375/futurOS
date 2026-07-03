import { motion } from 'framer-motion'
import { MapPin, Mail, ArrowRight } from 'lucide-react'
import { PROFILE } from './aboutData'
import { useTypewriter } from '@hooks/useTypewriter'
import { useInView } from '@hooks/useInView'

function StatCard({ value, label, delay }) {
  const [ref, inView] = useInView({ threshold: 0.3 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 28 }}
      style={{
        flex: 1,
        padding: '14px 12px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        textAlign: 'center',
        minWidth: 0,
      }}
    >
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 26, fontWeight: 700,
        color: '#818cf8',
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-ui)', fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.04em',
      }}>
        {label}
      </div>
    </motion.div>
  )
}

export default function AMProfile() {
  const typed = useTypewriter(PROFILE.taglines, { typeSpeed: 55, pauseMs: 2000 })
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section id="profile" ref={ref} style={{ padding: '32px 28px 24px' }}>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          padding: '28px 28px 24px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(34,211,238,0.04) 100%)',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: 16,
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Name */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30, fontWeight: 800,
          color: 'rgba(255,255,255,0.95)',
          letterSpacing: '-0.02em',
          marginBottom: 6,
          lineHeight: 1.1,
        }}>
          {PROFILE.name}
        </div>

        {/* Typed tagline */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 14,
          color: '#818cf8', marginBottom: 16,
          minHeight: 22,
        }}>
          <span>$ </span>
          <span>{typed}</span>
          <span style={{
            display: 'inline-block', width: 2, height: 14,
            background: '#818cf8', marginLeft: 1, verticalAlign: 'middle',
            animation: 'glow-pulse 1s ease-in-out infinite',
          }} />
        </div>

        {/* Location + email */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { icon: MapPin, text: PROFILE.location },
            { icon: Mail,   text: PROFILE.email    },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon size={13} color="rgba(255,255,255,0.35)" strokeWidth={2} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ marginBottom: 24 }}
      >
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 13, lineHeight: 1.8,
          color: 'rgba(255,255,255,0.62)',
        }}>
          {PROFILE.bio.split('\n\n').map((para, i) => (
            <p key={i} style={{ marginBottom: i < PROFILE.bio.split('\n\n').length - 1 ? 12 : 0 }}>
              {para}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10 }}>
        {PROFILE.stats.map((stat, i) => (
          <StatCard key={stat.label} value={stat.value} label={stat.label} delay={0.1 + i * 0.06} />
        ))}
      </div>
    </section>
  )
}
