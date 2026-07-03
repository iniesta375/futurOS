import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, GitCommitHorizontal, ExternalLink, Github, Zap } from 'lucide-react'
import { STATUS_CONFIG } from './projectsData'
import { useOSAnimations } from '@contexts/GlassEffectContext'

function TechBadge({ tag, accent }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
      color: 'rgba(255,255,255,0.55)',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '2px 7px', borderRadius: 6, whiteSpace: 'nowrap',
    }}>
      {tag}
    </span>
  )
}

export default function PJCard({ project, onClick, isSelected }) {
  const [hovered, setHovered] = useState(false)
  const statusCfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.active
  const accent = project.accent || '#6366f1'
  const { enabled } = useOSAnimations()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 8 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      whileHover={enabled ? { y: -4, transition: { duration: 0.2 } } : {}}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClick(project)}
      style={{
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${isSelected ? accent + '55' : hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: isSelected
          ? `0 0 0 2px ${accent}44, 0 16px 48px rgba(0,0,0,0.5)`
          : hovered ? '0 12px 36px rgba(0,0,0,0.45)' : '0 4px 16px rgba(0,0,0,0.3)',
        background: 'rgba(12,12,24,0.8)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Gradient art header */}
      <div style={{ height: 100, position: 'relative', overflow: 'hidden', background: project.gradient, flexShrink: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E\")",
          backgroundSize: '128px 128px',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.12,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }} />

        {/* Featured ribbon */}
        {project.featured && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 9px', borderRadius: 20,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <Zap size={10} color="#fbbf24" strokeWidth={2.5} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.08em' }}>FEATURED</span>
          </div>
        )}

        {/* Status chip */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          padding: '3px 9px', borderRadius: 20,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
          border: `1px solid ${statusCfg.color}44`,
        }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, fontWeight: 700, color: statusCfg.color, letterSpacing: '0.08em' }}>
            {statusCfg.label.toUpperCase()}
          </span>
        </div>

        {/* Year */}
        <div style={{ position: 'absolute', bottom: 10, right: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
          {project.year}
        </div>

        {/* Role */}
        <div style={{ position: 'absolute', bottom: 10, left: 12, fontFamily: 'var(--font-ui)', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
          {project.role}
        </div>

        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.15 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            View Details →
          </span>
        </motion.div>
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em', marginBottom: 2 }}>
            {project.title}
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.42)' }}>
            {project.subtitle}
          </div>
        </div>

        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.55)', flex: 1,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {project.tech.slice(0, 4).map(tag => <TechBadge key={tag} tag={tag} />)}
          {project.tech.length > 4 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.35)', padding: '2px 7px' }}>
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {project.stats.stars !== '—' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={11} color="#fbbf24" strokeWidth={2} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{project.stats.stars}</span>
              </div>
            )}
            {project.stats.commits && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <GitCommitHorizontal size={11} color="rgba(255,255,255,0.3)" strokeWidth={2} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{project.stats.commits}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ display: 'flex', color: 'rgba(255,255,255,0.4)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                <Github size={14} strokeWidth={1.75} />
              </a>
            )}
            {project.links?.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ display: 'flex', color: 'rgba(255,255,255,0.4)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = accent}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                <ExternalLink size={14} strokeWidth={1.75} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
