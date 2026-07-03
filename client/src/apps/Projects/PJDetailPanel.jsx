import { motion } from 'framer-motion'
import { X, ExternalLink, Github, Star, GitCommitHorizontal, Check, ChevronRight } from 'lucide-react'
import { STATUS_CONFIG } from './projectsData'
import { useInView } from '@hooks/useInView'

function HighlightItem({ text, accent, delay }) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.25 }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
        background: `${accent}20`, border: `1px solid ${accent}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={10} color={accent} strokeWidth={2.5} />
      </div>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.65, color: 'rgba(255,255,255,0.68)' }}>
        {text}
      </span>
    </motion.div>
  )
}

export default function PJDetailPanel({ project, onClose }) {
  const statusCfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.active
  const accent = project.accent || '#6366f1'

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{
        flexShrink: 0, overflow: 'hidden',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(8,8,18,0.8)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Gradient hero */}
        <div style={{
          height: 120, flexShrink: 0, position: 'relative',
          background: project.gradient, overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.12,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E\")",
            backgroundSize: '128px',
          }} />
          <button onClick={onClose} style={{
            position: 'absolute', top: 10, right: 10,
            width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.7)',
          }}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="selectable" style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Title block */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.93)', letterSpacing: '-0.02em', marginBottom: 3 }}>
              {project.title}
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
              {project.subtitle}
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                {project.year}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                {project.role}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700,
                color: statusCfg.color, padding: '1px 7px', borderRadius: 10,
                background: statusCfg.bg,
              }}>
                {statusCfg.label}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Stars',   value: project.stats.stars,   icon: Star,                 color: '#fbbf24' },
              { label: 'Commits', value: project.stats.commits, icon: GitCommitHorizontal,   color: '#818cf8' },
              { label: 'Forks',   value: project.stats.forks,   icon: ChevronRight,          color: '#34d399' },
            ].map(({ label, value, icon: Icon, color }) => value && value !== '—' && (
              <div key={label} style={{
                flex: 1, padding: '8px 10px', borderRadius: 10, textAlign: 'center',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
                  <Icon size={12} color={color} strokeWidth={2} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color }}>
                    {value}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginBottom: 8 }}>
              OVERVIEW
            </div>
            {project.description.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginBottom: i < project.description.split('\n\n').length - 1 ? 10 : 0 }}>
                {para}
              </p>
            ))}
          </div>

          {/* Highlights */}
          {project.highlights && (
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginBottom: 10 }}>
                KEY HIGHLIGHTS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.highlights.map((h, i) => (
                  <HighlightItem key={i} text={h} accent={accent} delay={i * 0.07} />
                ))}
              </div>
            </div>
          )}

          {/* Tech stack */}
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginBottom: 8 }}>
              TECH STACK
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {project.tech.map(tag => (
                <span key={tag} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: accent, background: `${accent}15`,
                  border: `1px solid ${accent}30`,
                  padding: '3px 9px', borderRadius: 7,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {project.links?.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 10, textDecoration: 'none',
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                color: '#fff', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
                boxShadow: `0 4px 16px ${accent}40`,
              }}>
                <ExternalLink size={14} strokeWidth={2} />
                View Live
              </a>
            )}
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 10, textDecoration: 'none',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
              }}>
                <Github size={14} strokeWidth={1.75} />
                Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
