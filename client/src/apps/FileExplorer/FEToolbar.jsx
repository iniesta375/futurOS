import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, ChevronUp, Grid3x3, List,
  Plus, FolderPlus, Search, X, SortAsc, RefreshCw,
} from 'lucide-react'
import useFileSystemStore from '@stores/fileSystemStore'
import Tooltip from '@components/ui/Tooltip'

function ToolBtn({ icon: Icon, onClick, active, disabled, tooltip, danger }) {
  return (
    <Tooltip text={tooltip} placement="bottom">
      <motion.button
        whileHover={!disabled ? { scale: 1.08 } : {}}
        whileTap={!disabled ? { scale: 0.93 } : {}}
        onClick={onClick}
        disabled={disabled}
        style={{
          width: 30, height: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 7, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
          color: danger ? '#f87171'
            : disabled ? 'rgba(255,255,255,0.2)'
            : active ? '#818cf8'
            : 'rgba(255,255,255,0.62)',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { if (!disabled && !active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
      >
        <Icon size={15} strokeWidth={2} />
      </motion.button>
    </Tooltip>
  )
}

export default function FEToolbar({ searchQuery, onSearchChange, onNewFile, onNewFolder }) {
  const { canGoBack, canGoForward, goBack, goForward, goUp, currentPath,
          viewMode, setViewMode, setSortBy, sortBy } = useFileSystemStore()
  const [showSearch, setShowSearch] = useState(false)

  const isRoot = currentPath === '/'

  return (
    <div style={{
      height: 44,
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '0 10px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(10,10,20,0.6)',
      flexShrink: 0,
    }}>
      {/* Nav buttons */}
      <div style={{ display: 'flex', gap: 2 }}>
        <ToolBtn icon={ChevronLeft}  onClick={goBack}    disabled={!canGoBack()}    tooltip="Back"    />
        <ToolBtn icon={ChevronRight} onClick={goForward} disabled={!canGoForward()} tooltip="Forward" />
        <ToolBtn icon={ChevronUp}    onClick={goUp}      disabled={isRoot}          tooltip="Up"      />
      </div>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 2 }}>
        <ToolBtn icon={Grid3x3} onClick={() => setViewMode('grid')} active={viewMode === 'grid'} tooltip="Grid view" />
        <ToolBtn icon={List}    onClick={() => setViewMode('list')} active={viewMode === 'list'} tooltip="List view" />
      </div>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

      {/* Sort */}
      <ToolBtn
        icon={SortAsc}
        onClick={() => setSortBy(sortBy === 'name' ? 'date' : 'name')}
        tooltip={`Sort by ${sortBy === 'name' ? 'date' : 'name'}`}
      />

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search */}
      {showSearch ? (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '0 10px', height: 28, overflow: 'hidden',
          }}
        >
          <Search size={13} color="rgba(255,255,255,0.4)" />
          <input
            autoFocus
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search files..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'var(--font-ui)', fontSize: 12,
              color: 'rgba(255,255,255,0.85)',
            }}
          />
          <button
            onClick={() => { setShowSearch(false); onSearchChange('') }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
          >
            <X size={13} color="rgba(255,255,255,0.4)" />
          </button>
        </motion.div>
      ) : (
        <ToolBtn icon={Search} onClick={() => setShowSearch(true)} tooltip="Search" />
      )}

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

      {/* New items */}
      <ToolBtn icon={Plus}      onClick={onNewFile}   tooltip="New File"   />
      <ToolBtn icon={FolderPlus} onClick={onNewFolder} tooltip="New Folder" />
    </div>
  )
}
