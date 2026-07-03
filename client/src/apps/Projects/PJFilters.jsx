import { motion, AnimatePresence } from 'framer-motion'
import { X, Tag, ChevronDown } from 'lucide-react'
import { CATEGORIES, ALL_TECH_TAGS } from './projectsData'
import { useOSAnimations } from '@contexts/GlassEffectContext'

function Pill({ label, active, onClick, count, color }) {
  const { enabled } = useOSAnimations()
  return (
    <motion.button
      whileHover={enabled ? { scale: 1.04 } : {}} whileTap={enabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
        background: active ? (color ? `${color}22` : 'rgba(99,102,241,0.2)') : 'rgba(255,255,255,0.05)',
        border: `1px solid ${active ? (color || 'rgba(99,102,241,0.5)') + (color ? '55' : '') : 'rgba(255,255,255,0.09)'}`,
        color: active ? (color || '#818cf8') : 'rgba(255,255,255,0.55)',
        fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: active ? 600 : 400,
        transition: 'all 0.15s', whiteSpace: 'nowrap',
      }}
    >
      {label}
      {count !== undefined && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.7 }}>
          {count}
        </span>
      )}
    </motion.button>
  )
}

export default function PJFilters({
  selectedCategory, onCategoryChange,
  selectedTags, onTagToggle, onClearTags,
  projectCounts, showTags, onToggleTags,
}) {
  return (
    <div style={{
      padding: '10px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(8,8,16,0.5)', flexShrink: 0,
    }}>
      {/* Category row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: showTags ? 10 : 0 }}>
        {CATEGORIES.map(cat => (
          <Pill
            key={cat.id}
            label={cat.label}
            active={selectedCategory === cat.id}
            onClick={() => onCategoryChange(cat.id)}
            count={projectCounts?.[cat.id]}
          />
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {selectedTags.length > 0 && (
            <button onClick={onClearTags} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20,
              background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)',
              color: '#f87171', fontFamily: 'var(--font-ui)', fontSize: 11, cursor: 'pointer',
            }}>
              <X size={11} strokeWidth={2} />
              {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''}
            </button>
          )}
          <button onClick={onToggleTags} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20,
            background: showTags ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${showTags ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.09)'}`,
            color: showTags ? '#818cf8' : 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, cursor: 'pointer',
          }}>
            <Tag size={11} strokeWidth={2} />
            Filter by tech
            <motion.div animate={{ rotate: showTags ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={11} strokeWidth={2} />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Tech tag cloud */}
      <AnimatePresence>
        {showTags && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, paddingTop: 2, paddingBottom: 4 }}>
              {ALL_TECH_TAGS.map(tag => (
                <Pill
                  key={tag} label={tag}
                  active={selectedTags.includes(tag)}
                  onClick={() => onTagToggle(tag)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
