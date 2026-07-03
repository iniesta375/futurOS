import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Code2 } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import { EXPERIENCE } from './aboutData'

const typeIcon = {
  'Full-time': Briefcase,
  'Contract':  Code2,
  'Education': GraduationCap,
}

const typeBadgeColor = {
  'Full-time': 'rgba(99,102,241,0.2)',
  'Contract':  'rgba(34,211,238,0.15)',
  'Education': 'rgba(251,191,36,0.15)',
}

function TimelineNode({ entry, index, isLast }) {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const Icon = typeIcon[entry.type] || Briefcase

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      style={{ display: 'flex', gap: 20, position: 'relative' }}
    >
      {/* Timeline spine */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        flexShrink: 0, width: 40,
      }}>
        {/* Node dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.15, type: 'spring', stiffness: 400, damping: 24 }}
          style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: `${entry.color}20`,
            border: `2px solid ${entry.color}60`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 16px ${entry.color}30`,
            zIndex: 1,
          }}
        >
          <Icon size={15} color={entry.color} strokeWidth={1.75} />
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={inView ? { height: '100%' } : {}}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            style={{
              width: 1, flex: 1, marginTop: 4,
              background: `linear-gradient(to bottom, ${entry.color}40, rgba(255,255,255,0.06))`,
              minHeight: 20,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 28, minWidth: 0 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
              color: 'rgba(255,255,255,0.92)', marginBottom: 3, letterSpacing: '-0.01em',
            }}>
              {entry.role}
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
              color: entry.color, marginBottom: 4,
            }}>
              {entry.company}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
            }}>
              {entry.period}
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600,
              color: entry.color, letterSpacing: '0.05em',
              padding: '2px 8px', borderRadius: 12,
              background: typeBadgeColor[entry.type] || 'rgba(99,102,241,0.15)',
              border: `1px solid ${entry.color}30`,
            }}>
              {entry.type.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {entry.bullets.map((bullet, bi) => (
            <motion.div
              key={bi}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 + 0.2 + bi * 0.06 }}
              style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
            >
              <div style={{
                width: 4, height: 4, borderRadius: '50%',
                background: entry.color, flexShrink: 0,
                marginTop: 6,
              }} />
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.65,
                color: 'rgba(255,255,255,0.6)',
              }}>
                {bullet}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function AMExperience() {
  return (
    <section id="experience" style={{ padding: '8px 28px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
          color: 'rgba(255,255,255,0.9)', marginBottom: 4,
        }}>
          Experience
        </div>
        <div style={{ width: 32, height: 2, borderRadius: 99, background: '#22d3ee' }} />
      </div>

      <div>
        {EXPERIENCE.map((entry, i) => (
          <TimelineNode
            key={entry.company + entry.period}
            entry={entry}
            index={i}
            isLast={i === EXPERIENCE.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
