import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Calendar, HardDrive, Download } from 'lucide-react'
import DynamicIcon from '@components/ui/DynamicIcon'
import useFileSystemStore from '@stores/fileSystemStore'
import { getFileIcon, getFileColor, isTextFile } from './fileUtils'
import { executeAction } from '@constants/actionsRegistry'

/** Very lightweight syntax colorizer — just highlights keywords by regex */
function colorizeCode(code = '', ext = '') {
  // Only do keyword-level colorization (no full parser needed)
  const lines = code.split('\n')
  return lines.map((line, i) => (
    <div key={i} style={{ display: 'flex', minHeight: 20 }}>
      <span style={{
        minWidth: 32, textAlign: 'right', paddingRight: 12,
        color: 'rgba(255,255,255,0.2)', userSelect: 'none',
        fontSize: 11, lineHeight: '20px',
      }}>
        {i + 1}
      </span>
      <span style={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {line || ' '}
      </span>
    </div>
  ))
}

function MarkdownPreview({ content }) {
  // Minimal markdown → styled HTML
  const lines = content.split('\n')
  return (
    <div style={{ padding: '16px 20px', fontFamily: 'var(--font-ui)', fontSize: 13, lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        if (line.startsWith('# '))   return <h1 key={i} style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.92)', marginBottom: 8, fontFamily: 'var(--font-display)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}>{line.slice(2)}</h1>
        if (line.startsWith('## '))  return <h2 key={i} style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: 16, marginBottom: 6 }}>{line.slice(3)}</h2>
        if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.78)', marginTop: 12, marginBottom: 4 }}>{line.slice(4)}</h3>
        if (line.startsWith('- [x] ')) return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}><span style={{ color: '#34d399' }}>✓</span><span style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>{line.slice(6)}</span></div>
        if (line.startsWith('- [ ] ')) return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}><span style={{ color: 'rgba(255,255,255,0.3)' }}>○</span><span style={{ color: 'rgba(255,255,255,0.75)' }}>{line.slice(6)}</span></div>
        if (line.startsWith('- '))   return <div key={i} style={{ color: 'rgba(255,255,255,0.72)', marginBottom: 2, paddingLeft: 12 }}>• {line.slice(2)}</div>
        if (line.startsWith('```'))  return <div key={i} style={{ height: 1, borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 0' }} />
        if (line.startsWith('> '))   return <div key={i} style={{ borderLeft: '3px solid #6366f1', paddingLeft: 12, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', margin: '6px 0' }}>{line.slice(2)}</div>
        if (line === '')             return <div key={i} style={{ height: 10 }} />
        // Inline bold **text**
        const boldParts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i} style={{ color: 'rgba(255,255,255,0.72)', marginBottom: 2 }}>
            {boldParts.map((part, j) =>
              j % 2 === 1
                ? <strong key={j} style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{part}</strong>
                : part
            )}
          </p>
        )
      })}
    </div>
  )
}

export default function FEPreview({ onClose }) {
  const { selectedPaths, fs } = useFileSystemStore()
  const path = selectedPaths[0]
  const node = path ? fs[path] : null

  if (!node) {
    return (
      <div style={{
        width: 260, borderLeft: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(8,8,18,0.5)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 12,
        color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-ui)', fontSize: 12,
      }}>
        <DynamicIcon name="mouse-pointer-2" size={32} color="rgba(255,255,255,0.1)" strokeWidth={1.25} />
        Select a file to preview
      </div>
    )
  }

  const isDir   = node.type === 'dir'
  const icon    = isDir ? 'folder' : getFileIcon(node.ext)
  const color   = isDir ? '#fbbf24' : getFileColor(node.ext)
  const canPreview = !isDir && isTextFile(node.ext) && node.content
  const isMd    = node.ext === 'md'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={path}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 16 }}
        transition={{ duration: 0.2 }}
        style={{
          width: 280, flexShrink: 0,
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(8,8,18,0.5)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `${color}18`, border: `1px solid ${color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DynamicIcon name={icon} size={18} color={color} strokeWidth={1.5} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
              color: 'rgba(255,255,255,0.88)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{node.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color }}>
              {isDir ? 'folder' : (node.ext?.toUpperCase() || 'FILE')}
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Metadata */}
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0,
        }}>
          {[
            { icon: Calendar, label: 'Modified', value: node.modified || '—' },
            { icon: HardDrive, label: 'Size',     value: isDir ? `${(node.children || []).length} items` : (node.size || '—') },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={12} color="rgba(255,255,255,0.3)" strokeWidth={1.75} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.35)', width: 60 }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Content preview */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {canPreview ? (
            isMd ? (
              <MarkdownPreview content={node.content} />
            ) : (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: '20px',
                color: 'rgba(255,255,255,0.75)', padding: '12px 0',
              }}>
                {colorizeCode(node.content, node.ext)}
              </div>
            )
          ) : isDir ? (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>CONTENTS</div>
              {(node.children || []).slice(0, 12).map(child => (
                <div key={child} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DynamicIcon name="file" size={12} color="rgba(255,255,255,0.3)" strokeWidth={1.75} />
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{child}</span>
                </div>
              ))}
              {(node.children || []).length > 12 && (
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                  + {node.children.length - 12} more
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: 24, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 10,
              color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-ui)', fontSize: 12,
            }}>
              <DynamicIcon name={icon} size={32} color={`${color}66`} strokeWidth={1.25} />
              Preview not available
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
