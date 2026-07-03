import { motion } from 'framer-motion'
import { useInView } from '@hooks/useInView'
import { SKILLS } from './aboutData'

function SkillBar({ name, level, color, delay }) {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 6,
      }}>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
          color: 'rgba(255,255,255,0.78)',
        }}>
          {name}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.3, duration: 0.3 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: color, fontWeight: 600,
          }}
        >
          {level}%
        </motion.span>
      </div>

      {/* Track */}
      <div style={{
        height: 5, borderRadius: 99,
        background: 'rgba(255,255,255,0.07)',
        overflow: 'hidden',
      }}>
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{
            delay,
            duration: 0.9,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}66`,
            position: 'relative',
          }}
        >
          {/* Shimmer */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ delay: delay + 0.6, duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              borderRadius: 99,
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

function SkillCategory({ category, color, items }) {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        padding: '18px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
      }}
    >
      {/* Category header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }} />
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '-0.01em',
        }}>
          {category}
        </span>
      </div>

      {/* Skill bars */}
      {items.map((skill, i) => (
        <SkillBar
          key={skill.name}
          name={skill.name}
          level={skill.level}
          color={color}
          delay={0.05 + i * 0.07}
        />
      ))}
    </motion.div>
  )
}

export default function AMSkills() {
  return (
    <section id="skills" style={{ padding: '8px 28px 24px' }}>
      {/* Section header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
          color: 'rgba(255,255,255,0.9)', marginBottom: 4,
        }}>
          Skills
        </div>
        <div style={{ width: 32, height: 2, borderRadius: 99, background: '#6366f1' }} />
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 14,
      }}>
        {SKILLS.map(cat => (
          <SkillCategory key={cat.category} {...cat} />
        ))}
      </div>
    </section>
  )
}
