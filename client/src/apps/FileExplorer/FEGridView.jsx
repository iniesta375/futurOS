import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import DynamicIcon from '@components/ui/DynamicIcon'
import useFileSystemStore from '@stores/fileSystemStore'
import { getFileIcon, getFileColor } from './fileUtils'

function FileIcon({ node, isSelected, isEditing, onSelect, onOpen, onContextMenu, onRenameEnd }) {
  const [editName, setEditName] = useState(node.name)
  const inputRef = useRef(null)
  const isDir = node.type === 'dir'
  const icon  = isDir ? 'folder' : getFileIcon(node.ext)
  const color = isDir ? '#fbbf24' : getFileColor(node.ext)

  useEffect(() => {
    if (isEditing) { setEditName(node.name); inputRef.current?.select() }
  }, [isEditing, node.name])

  const handleKey = (e) => {
    if (e.key === 'Enter') onRenameEnd(editName)
    if (e.key === 'Escape') onRenameEnd(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      onClick={(e) => { e.stopPropagation(); onSelect(e.ctrlKey || e.metaKey) }}
      onDoubleClick={() => !isEditing && onOpen()}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(e) }}
      style={{
        width: 84, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 6, padding: '10px 6px 8px', borderRadius: 10, cursor: 'default',
        background: isSelected ? 'rgba(99,102,241,0.18)' : 'transparent',
        border: `1px solid ${isSelected ? 'rgba(99,102,241,0.35)' : 'transparent'}`,
        transition: 'background 0.12s, border-color 0.12s',
        userSelect: 'none',
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
    >
      {/* Icon */}
      <div style={{
        width: 48, height: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 12,
        background: isSelected ? `${color}25` : `${color}18`,
        border: `1px solid ${color}33`,
        boxShadow: isSelected ? `0 4px 16px ${color}30` : `0 2px 8px rgba(0,0,0,0.2)`,
        transition: 'all 0.15s',
        flexShrink: 0,
      }}>
        <DynamicIcon name={icon} size={22} color={color} strokeWidth={1.5} />
      </div>

      {/* Name / rename input */}
      {isEditing ? (
        <input
          ref={inputRef}
          value={editName}
          onChange={e => setEditName(e.target.value)}
          onBlur={() => onRenameEnd(editName)}
          onKeyDown={handleKey}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', textAlign: 'center',
            background: 'rgba(10,10,24,0.9)',
            border: '1px solid rgba(99,102,241,0.5)',
            borderRadius: 5, padding: '2px 4px',
            fontFamily: 'var(--font-ui)', fontSize: 11,
            color: 'rgba(255,255,255,0.9)', outline: 'none',
          }}
        />
      ) : (
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500,
          color: isSelected ? '#fff' : 'rgba(255,255,255,0.78)',
          textAlign: 'center', lineHeight: 1.3,
          maxWidth: 76, wordBreak: 'break-word',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {node.name}
        </span>
      )}
    </motion.div>
  )
}

export default function FEGridView({ items, onOpen, onContextMenu, onRenameEnd, editingPath }) {
  const { selectedPaths, selectPath, clearSelection } = useFileSystemStore()

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.025, delayChildren: 0.03 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onClick={clearSelection}
      style={{
        display: 'flex', flexWrap: 'wrap',
        gap: 4, padding: 16, alignContent: 'flex-start',
        minHeight: '100%',
      }}
    >
      {items.map(item => (
        <FileIcon
          key={item.path}
          node={item}
          isSelected={selectedPaths.includes(item.path)}
          isEditing={editingPath === item.path}
          onSelect={(multi) => selectPath(item.path, multi)}
          onOpen={() => onOpen(item)}
          onContextMenu={(e) => onContextMenu(e, item)}
          onRenameEnd={(name) => onRenameEnd(item.path, name)}
        />
      ))}
      {items.length === 0 && (
        <div style={{
          width: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 48, gap: 12,
          color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-ui)', fontSize: 13,
        }}>
          <DynamicIcon name="folder-open" size={40} color="rgba(255,255,255,0.15)" strokeWidth={1.25} />
          This folder is empty
        </div>
      )}
    </motion.div>
  )
}
