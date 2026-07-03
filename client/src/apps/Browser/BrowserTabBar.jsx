import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Globe } from 'lucide-react'
import { displayUrl, urlToTitle } from './browserData'

function Tab({ tab, isActive, onActivate, onClose, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.88, x: -8 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.85, x: -8 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      onClick={onActivate}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '0 10px 0 12px',
        height: '100%', minWidth: 100, maxWidth: 200,
        cursor: 'pointer', userSelect: 'none', flexShrink: 0,
        background: isActive
          ? 'rgba(14, 14, 28, 0.95)'
          : 'transparent',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
    >
      {/* Active top indicator */}
      {isActive && (
        <motion.div
          layoutId="active-tab-indicator"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, #6366f1, #818cf8)',
            borderRadius: '0 0 2px 2px',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}

      {/* Favicon */}
      <div style={{
        width: 14, height: 14, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {tab.favicon
          ? <img src={tab.favicon} alt="" width={14} height={14} style={{ borderRadius: 2 }} onError={e => e.target.style.display = 'none'} />
          : <Globe size={12} color={isActive ? '#818cf8' : 'rgba(255,255,255,0.35)'} strokeWidth={1.75} />
        }
      </div>

      {/* Title */}
      <span style={{
        flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontFamily: 'var(--font-ui)', fontSize: 12,
        fontWeight: isActive ? 500 : 400,
        color: isActive ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.5)',
        minWidth: 0,
      }}>
        {tab.title || urlToTitle(tab.url)}
      </span>

      {/* Close */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={e => { e.stopPropagation(); onClose() }}
        style={{
          width: 16, height: 16, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'transparent',
          color: 'rgba(255,255,255,0.35)',
          transition: 'background 0.1s, color 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f87171' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
      >
        <X size={10} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  )
}

export default function BrowserTabBar({ tabs, activeTabId, onActivate, onClose, onNew }) {
  return (
    <div style={{
      height: 36, display: 'flex', alignItems: 'stretch',
      background: 'rgba(8,8,18,0.95)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', alignItems: 'stretch' }}>
        <AnimatePresence mode="popLayout">
          {tabs.map((tab, i) => (
            <Tab
              key={tab.id}
              tab={tab}
              index={i}
              isActive={tab.id === activeTabId}
              onActivate={() => onActivate(tab.id)}
              onClose={() => onClose(tab.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* New tab button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNew}
        style={{
          width: 36, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer',
          background: 'transparent',
          color: 'rgba(255,255,255,0.4)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
      >
        <Plus size={14} strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}
