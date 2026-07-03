import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, HardDrive } from 'lucide-react'
import DynamicIcon from '@components/ui/DynamicIcon'
import useFileSystemStore from '@stores/fileSystemStore'
import { PINNED_LOCATIONS } from './fileUtils'

function SidebarSection({ title, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        padding: '6px 12px 4px',
        fontSize: 10, fontWeight: 600,
        color: 'rgba(255,255,255,0.28)',
        letterSpacing: '0.1em',
        fontFamily: 'var(--font-ui)',
        textTransform: 'uppercase',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function SidebarItem({ icon, label, path, active, depth = 0 }) {
  const navigate = useFileSystemStore(s => s.navigate)
  return (
    <button
      onClick={() => navigate(path)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: `5px 12px 5px ${12 + depth * 12}px`,
        background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
        border: active ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
        borderRadius: 7, cursor: 'pointer',
        margin: '1px 4px', width: 'calc(100% - 8px)',
        transition: 'background 0.12s, border-color 0.12s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <DynamicIcon
        name={icon}
        size={14}
        color={active ? '#818cf8' : 'rgba(255,255,255,0.45)'}
        strokeWidth={1.75}
      />
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 12,
        color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.62)',
        fontWeight: active ? 500 : 400,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        flex: 1, textAlign: 'left',
      }}>
        {label}
      </span>
    </button>
  )
}

function TreeNode({ path, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth === 0)
  const { fs, currentPath, navigate } = useFileSystemStore()
  const node = fs[path]
  if (!node || node.type !== 'dir') return null

  const active = currentPath === path
  const childDirs = (node.children || [])
    .map(c => ({ name: c, childPath: path === '/' ? `/${c}` : `${path}/${c}` }))
    .filter(({ childPath }) => fs[childPath]?.type === 'dir')

  return (
    <div>
      <button
        onClick={() => { navigate(path); setExpanded(e => !e) }}
        style={{
          width: 'calc(100% - 8px)', display: 'flex', alignItems: 'center', gap: 6,
          padding: `4px 12px 4px ${12 + depth * 12}px`,
          background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
          border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
          borderRadius: 7, cursor: 'pointer', margin: '1px 4px',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
      >
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronRight size={12} color="rgba(255,255,255,0.3)" strokeWidth={2} />
        </motion.div>
        <DynamicIcon
          name="folder"
          size={13}
          color={active ? '#818cf8' : 'rgba(255,255,255,0.45)'}
          strokeWidth={1.75}
        />
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: 12,
          color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
          fontWeight: active ? 500 : 400, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left',
        }}>
          {node.name}
        </span>
      </button>

      <AnimatePresence>
        {expanded && childDirs.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            {childDirs.map(({ childPath }) => (
              <TreeNode key={childPath} path={childPath} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FESidebar() {
  const currentPath = useFileSystemStore(s => s.currentPath)

  return (
    <div style={{
      width: 196, flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(8,8,18,0.5)',
      overflowY: 'auto', overflowX: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Drive */}
      <div style={{ padding: '12px 12px 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <HardDrive size={14} color="rgba(255,255,255,0.4)" strokeWidth={1.75} />
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: 12,
          color: 'rgba(255,255,255,0.55)', fontWeight: 500,
        }}>
          FuturOS Drive
        </span>
      </div>

      {/* Storage bar */}
      <div style={{ margin: '4px 12px 12px', height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
        <div style={{ width: '38%', height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #6366f1, #22d3ee)' }} />
      </div>

      {/* Pinned */}
      <SidebarSection title="Favourites">
        {PINNED_LOCATIONS.map(loc => (
          <SidebarItem
            key={loc.path}
            icon={loc.icon}
            label={loc.label}
            path={loc.path}
            active={currentPath === loc.path}
          />
        ))}
      </SidebarSection>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 12px' }} />

      {/* Full tree */}
      <SidebarSection title="Folders">
        <div style={{ paddingBottom: 8 }}>
          <TreeNode path="/" depth={0} />
        </div>
      </SidebarSection>
    </div>
  )
}
