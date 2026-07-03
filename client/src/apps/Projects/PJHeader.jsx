import { motion } from 'framer-motion'
import { Search, X, Grid3x3, List, Zap } from 'lucide-react'

export default function PJHeader({
  searchQuery, onSearchChange,
  resultCount, totalCount,
  viewMode, onViewModeChange,
  featuredOnly, onFeaturedToggle,
}) {
  return (
    <div style={{
      padding: '18px 22px 14px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(10,10,20,0.6)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'rgba(255,255,255,0.93)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Projects
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, marginTop: 3, color: 'rgba(255,255,255,0.38)' }}>
            {resultCount < totalCount ? `${resultCount} of ${totalCount} projects` : `${totalCount} projects`}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onFeaturedToggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
              background: featuredOnly ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${featuredOnly ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: featuredOnly ? '#fbbf24' : 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.04em', transition: 'all 0.15s',
            }}
          >
            <Zap size={12} strokeWidth={2.5} />
            {featuredOnly ? 'FEATURED' : 'FEATURED'}
          </button>

          <div style={{ display: 'flex', gap: 2, padding: 3, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}>
            {[{ v: 'grid', Icon: Grid3x3 }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
              <button key={v} onClick={() => onViewModeChange(v)} style={{
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 6, border: 'none', cursor: 'pointer',
                background: viewMode === v ? 'rgba(99,102,241,0.25)' : 'transparent',
                color: viewMode === v ? '#818cf8' : 'rgba(255,255,255,0.45)',
                transition: 'background 0.15s, color 0.15s',
              }}>
                <Icon size={14} strokeWidth={viewMode === v ? 2.25 : 1.75} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(255,255,255,0.06)',
        border: `1px solid ${searchQuery ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 10, padding: '0 14px', height: 38,
        transition: 'border-color 0.2s',
      }}>
        <Search size={14} color="rgba(255,255,255,0.4)" strokeWidth={2} />
        <input
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by title, tech, or description..."
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}
        />
        {searchQuery && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => onSearchChange('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
            <X size={14} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          </motion.button>
        )}
      </div>
    </div>
  )
}
