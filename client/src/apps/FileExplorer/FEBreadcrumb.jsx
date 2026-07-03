import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import useFileSystemStore from '@stores/fileSystemStore'
import { getBreadcrumbs } from './fileUtils'

export default function FEBreadcrumb() {
  const currentPath = useFileSystemStore(s => s.currentPath)
  const navigate    = useFileSystemStore(s => s.navigate)
  const crumbs      = getBreadcrumbs(currentPath)

  return (
    <div style={{
      height: 32, display: 'flex', alignItems: 'center',
      padding: '0 12px', gap: 2,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(10,10,20,0.4)',
      flexShrink: 0, overflowX: 'auto',
    }}>
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <motion.span
            key={crumb.path}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}
          >
            {i === 0 ? (
              <button
                onClick={() => navigate(crumb.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '2px 6px', borderRadius: 5,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: isLast ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <Home size={11} strokeWidth={2} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: isLast ? 500 : 400 }}>
                  {crumb.label}
                </span>
              </button>
            ) : (
              <button
                onClick={() => !isLast && navigate(crumb.path)}
                style={{
                  padding: '2px 6px', borderRadius: 5,
                  background: 'transparent', border: 'none',
                  cursor: isLast ? 'default' : 'pointer',
                  color: isLast ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.45)',
                  fontFamily: 'var(--font-ui)', fontSize: 12,
                  fontWeight: isLast ? 600 : 400,
                }}
                onMouseEnter={e => { if (!isLast) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                {crumb.label}
              </button>
            )}

            {!isLast && (
              <ChevronRight size={12} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
            )}
          </motion.span>
        )
      })}
    </div>
  )
}
