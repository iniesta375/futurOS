import { motion } from 'framer-motion'
import { Star, GitFork, ExternalLink, GitBranch } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import { OPEN_SOURCE } from './aboutData'

function RepoCard({ repo, delay }) {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        padding: '16px 18px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        cursor: 'default',
        transition: 'border-color 0.2s, background 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        borderColor: 'rgba(99,102,241,0.3)',
        background: 'rgba(99,102,241,0.05)',
      }}
    >
      {repo.contrib && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          fontFamily: 'var(--font-ui)', fontSize: 9, fontWeight: 700,
          color: '#34d399', letterSpacing: '0.08em',
          background: 'rgba(52,211,153,0.12)',
          border: '1px solid rgba(52,211,153,0.3)',
          padding: '2px 7px', borderRadius: 99,
        }}>
          CONTRIBUTOR
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <GitBranch size={14} color="#6366f1" strokeWidth={1.75} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
          color: '#818cf8',
        }}>
          {repo.name}
        </span>
        <a
          href={repo.url}
          target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ marginLeft: 'auto', display: 'flex', color: 'rgba(255,255,255,0.3)', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          <ExternalLink size={12} strokeWidth={2} />
        </a>
      </div>

      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.6,
        color: 'rgba(255,255,255,0.55)', marginBottom: 14,
      }}>
        {repo.desc}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: repo.color,
          }} />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            {repo.lang}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Star size={11} color="#fbbf24" strokeWidth={2} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            {repo.stars}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function AMOpenSource() {
  return (
    <section id="oss" style={{ padding: '8px 28px 24px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
          color: 'rgba(255,255,255,0.9)', marginBottom: 4,
        }}>
          Open Source
        </div>
        <div style={{ width: 32, height: 2, borderRadius: 99, background: '#34d399' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {OPEN_SOURCE.map((repo, i) => (
          <RepoCard key={repo.name} repo={repo} delay={i * 0.1} />
        ))}
      </div>
    </section>
  )
}
