import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import DynamicIcon from '@components/ui/DynamicIcon'
import useFileSystemStore from '@stores/fileSystemStore'
import { getFileIcon, getFileColor } from './fileUtils'

function SortHeader({ label, field, currentSort, sortDir, onSort }) {
  const active = currentSort === field
  return (
    <button
      onClick={() => onSort(field)}
      style={{
        display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
        color: active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
        letterSpacing: '0.07em', textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      {active && (sortDir === 'asc'
        ? <ChevronUp size={11} strokeWidth={2.5} />
        : <ChevronDown size={11} strokeWidth={2.5} />
      )}
    </button>
  )
}

export default function FEListView({ items, onOpen, onContextMenu }) {
  const { selectedPaths, selectPath, clearSelection, sortBy, sortDir, setSortBy } = useFileSystemStore()

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 80px 72px 100px',
        padding: '0 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,10,20,0.4)',
        flexShrink: 0,
      }}>
        <SortHeader label="Name" field="name" currentSort={sortBy} sortDir={sortDir} onSort={setSortBy} />
        <SortHeader label="Type" field="type" currentSort={sortBy} sortDir={sortDir} onSort={setSortBy} />
        <SortHeader label="Size" field="size" currentSort={sortBy} sortDir={sortDir} onSort={setSortBy} />
        <SortHeader label="Modified" field="date" currentSort={sortBy} sortDir={sortDir} onSort={setSortBy} />
      </div>

      {/* Rows */}
      <div onClick={clearSelection} style={{ flex: 1 }}>
        {items.map((item, i) => {
          const isDir      = item.type === 'dir'
          const icon       = isDir ? 'folder' : getFileIcon(item.ext)
          const color      = isDir ? '#fbbf24' : getFileColor(item.ext)
          const isSelected = selectedPaths.includes(item.path)

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.15 }}
              onClick={(e) => { e.stopPropagation(); selectPath(item.path, e.ctrlKey || e.metaKey) }}
              onDoubleClick={() => onOpen(item)}
              onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(e, item) }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 72px 100px',
                padding: '0 12px', height: 34,
                alignItems: 'center',
                background: isSelected ? 'rgba(99,102,241,0.14)' : 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.035)',
                cursor: 'default',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  background: `${color}18`, border: `1px solid ${color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <DynamicIcon name={icon} size={13} color={color} strokeWidth={1.75} />
                </div>
                <span style={{
                  fontFamily: 'var(--font-ui)', fontSize: 12,
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.82)',
                  fontWeight: isDir ? 500 : 400,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.name}
                </span>
              </div>

              {/* Type */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: color }}>
                {isDir ? 'folder' : (item.ext || '—')}
              </span>

              {/* Size */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                {isDir ? '—' : (item.size || '—')}
              </span>

              {/* Modified */}
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                {item.modified || '—'}
              </span>
            </motion.div>
          )
        })}

        {items.length === 0 && (
          <div style={{
            padding: 48, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 12,
            color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-ui)', fontSize: 13,
          }}>
            <DynamicIcon name="folder-open" size={40} color="rgba(255,255,255,0.15)" strokeWidth={1.25} />
            This folder is empty
          </div>
        )}
      </div>
    </div>
  )
}
