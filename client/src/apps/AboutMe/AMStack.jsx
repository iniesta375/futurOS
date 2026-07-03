import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@hooks/useInView'
import { TECH_STACK } from './aboutData'

function TechBadge({ tech, delay }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 380, damping: 26 }}
      whileHover={{ scale: 1.1, y: -3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
        cursor: 'default',
        position: 'relative',
      }}
    >
      {/* Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', bottom: 'calc(100% + 8px)',
            left: '50%', transform: 'translateX(-50%)',
            fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.88)',
            background: 'rgba(14,14,28,0.96)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '3px 8px', borderRadius: 6,
            whiteSpace: 'nowrap',
            zIndex: 10,
            backdropFilter: 'blur(8px)',
          }}
        >
          {tech.name}
        </motion.div>
      )}

      {/* Badge hex */}
      <div style={{
        width: 52, height: 52,
        borderRadius: 14,
        background: hovered ? `${tech.color}22` : 'rgba(255,255,255,0.05)',
        border: `1.5px solid ${hovered ? tech.color + '66' : 'rgba(255,255,255,0.09)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: hovered ? `0 0 20px ${tech.color}40, 0 4px 16px rgba(0,0,0,0.3)` : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
        fontSize: 22,
        lineHeight: 1,
      }}>
        {tech.icon}
      </div>

      {/* Label */}
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 500,
        color: hovered ? tech.color : 'rgba(255,255,255,0.45)',
        transition: 'color 0.2s',
        maxWidth: 52, textAlign: 'center', lineHeight: 1.2,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {tech.name}
      </span>
    </motion.div>
  )
}

export default function AMStack() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section id="stack" ref={ref} style={{ padding: '8px 28px 24px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
          color: 'rgba(255,255,255,0.9)', marginBottom: 4,
        }}>
          Tech Stack
        </div>
        <div style={{ width: 32, height: 2, borderRadius: 99, background: '#8b5cf6' }} />
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 16,
      }}>
        {inView && TECH_STACK.map((tech, i) => (
          <TechBadge key={tech.name} tech={tech} delay={i * 0.04} />
        ))}
      </div>
    </section>
  )
}
