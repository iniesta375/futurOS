import { motion } from 'framer-motion'
import { Star, ExternalLink, Github, Zap } from 'lucide-react'
import { STATUS_CONFIG } from './projectsData'

export default function PJListRow({ project, onClick, isSelected, index }) {
  const statusCfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.active
  const accent = project.accent || '#6366f1'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      onClick={() => onClick(project)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 90px 70px auto 80px 56px',
        gap: 12, alignItems: 'center',
        padding: '10px 18px', height: 52,
        cursor: 'pointer',
        background: isSelected ? `${accent}0e` : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        borderLeft: `3px solid ${isSelected ? accent : 'transparent'}`,
        transition: 'background 0.12s, border-color 0.12s',
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
    >
      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: project.gradient,
          border: `1px solid ${accent}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {project.featured && <Zap size={13} color="#fbbf24" strokeWidth={2.5} />}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.title}
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'rgba(255,255,255,0.38)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.subtitle}
          </div>
        </div>
      </div>

      {/* Category */}
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}>
        {project.category}
      </span>

      {/* Status */}
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700,
        color: statusCfg.color, letterSpacing: '0.06em',
        padding: '2px 8px', borderRadius: 12,
        background: statusCfg.bg, border: `1px solid ${statusCfg.color}33`,
        whiteSpace: 'nowrap',
      }}>
        {statusCfg.label.toUpperCase()}
      </span>

      {/* Tech */}
      <div style={{ display: 'flex', gap: 4, overflow: 'hidden' }}>
        {project.tech.slice(0, 3).map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: accent, background: `${accent}15`,
            border: `1px solid ${accent}30`,
            padding: '1px 6px', borderRadius: 5, whiteSpace: 'nowrap',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {project.stats.stars !== '—' && (
          <>
            <Star size={11} color="#fbbf24" strokeWidth={2} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              {project.stats.stars}
            </span>
          </>
        )}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {project.links?.github && (
          <a href={project.links.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.15s', display: 'flex' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            <Github size={14} strokeWidth={1.75} />
          </a>
        )}
        {project.links?.live && (
          <a href={project.links.live} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.15s', display: 'flex' }}
            onMouseEnter={e => e.currentTarget.style.color = accent}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            <ExternalLink size={14} strokeWidth={1.75} />
          </a>
        )}
      </div>
    </motion.div>
  )
}
