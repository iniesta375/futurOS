/**
 * GlobalSearch.jsx — FuturOS Command Palette / Spotlight Search
 *
 * Features:
 * - Three-tier fuzzy search: exact → prefix → substring → char-sequence
 * - Results scored and ranked with type priority (App > Action > Setting > File)
 * - Quick suggestions shown before typing (curated shortcuts)
 * - Arrow-key navigation + Enter to execute
 * - Keyboard shortcut badges on matching actions
 * - Recent searches tracked in localStorage via searchStore
 * - Single execution path: executeItem() → action.run() or openWindow()
 * - Portal-rendered into #overlay-layer, backdrop click to dismiss
 * - Wired to osStore.searchOpen — opened by Ctrl+K or any action calling toggleSearch()
 *
 * Phase 12C Part 3:
 * - Panel background/blur now sourced from useGlassEffect('menu'), so it
 *   tracks the transparency toggle and glassBlur slider live.
 * - Backdrop scrim uses useGlassBackdrop(4) for the same reason.
 * - Open/close animation respects the animationsEnabled setting via
 *   useOSAnimations().enabled.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Command, ArrowRight, Zap, Keyboard, Clock } from 'lucide-react'
import useOSStore       from '@stores/osStore'
import APP_REGISTRY     from '@constants/appRegistry'
import { ACTIONS }      from '@constants/actionsRegistry'
import { useClickOutside } from '@hooks/useClickOutside'
import { useGlassEffect, useGlassBackdrop, useOSAnimations } from '@contexts/GlassEffectContext'
import { useFocusTrap } from '@hooks/useFocusTrap'
import DynamicIcon      from './DynamicIcon'
import { search, QUICK_SUGGESTIONS, TYPE_META } from './searchEngine'
import { useShallow } from 'zustand/react/shallow'
import useSearchStore   from '@stores/searchStore'

// ── Single execution path ─────────────────────────────────────────────────

function executeItem(item, onClose) {
  // Track in recents before closing so state is saved
  useSearchStore.getState().addRecent(item)

  // Close palette immediately for snappy feel
  onClose()

  // App launch via windowStore
  if (item.appId) {
    import('@stores/windowStore').then(({ default: useWindowStore }) => {
      const app = APP_REGISTRY[item.appId]
      useWindowStore.getState().openWindow(item.appId, {
        title:       app?.title || item.appId,
        defaultSize: app?.defaultSize,
        minSize:     app?.minSize,
      })
    })
    return
  }

  // Action via registry — small RAF delay lets palette close anim play
  if (item.actionId) {
    const action = ACTIONS[item.actionId]
    if (action) {
      requestAnimationFrame(() => {
        try { action.run() } catch (e) { console.error('[Search] Action error:', e) }
      })
    }
    return
  }
}

// ── Result item component ─────────────────────────────────────────────────

function ResultItem({ item, isSelected, onExecute }) {
  const ref   = useRef(null)
  const color = item.accent || TYPE_META[item.type]?.color || '#818cf8'

  useEffect(() => {
    if (isSelected) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [isSelected])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.1 }}
      onClick={onExecute}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '9px 14px', cursor: 'pointer', borderRadius: 10,
        background: isSelected ? 'rgba(99,102,241,0.15)' : 'transparent',
        border: `1px solid ${isSelected ? 'rgba(99,102,241,0.28)' : 'transparent'}`,
        margin: '2px 6px',
        transition: 'background 0.1s, border-color 0.1s',
        boxShadow: isSelected ? '0 2px 12px rgba(99,102,241,0.15)' : 'none',
      }}
      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = 'transparent' } }}
    >
      {/* Icon */}
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <DynamicIcon name={item.icon || 'file'} size={16} color={color} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
          color: isSelected ? '#fff' : 'rgba(255,255,255,0.85)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.title}
        </div>
        {item.subtitle && (
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 11,
            color: 'rgba(255,255,255,0.36)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {item.subtitle}
          </div>
        )}
      </div>

      {/* Right: shortcut badge + type chip + arrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {item.shortcut && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'rgba(255,255,255,0.32)',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderBottom: '2px solid rgba(255,255,255,0.15)',
            padding: '1px 7px', borderRadius: 5,
          }}>
            {item.shortcut}
          </span>
        )}
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600,
          color, background: `${color}14`,
          border: `1px solid ${color}28`,
          padding: '2px 7px', borderRadius: 10, letterSpacing: '0.04em',
        }}>
          {TYPE_META[item.type]?.label || item.type}
        </span>
        {isSelected && <ArrowRight size={13} color="rgba(255,255,255,0.35)" strokeWidth={2} />}
      </div>
    </motion.div>
  )
}

// ── Section header ────────────────────────────────────────────────────────

function SectionLabel({ label, icon: Icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 20px 4px',
      fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700,
      color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em',
    }}>
      {Icon && <Icon size={10} strokeWidth={2.5} />}
      {label}
    </div>
  )
}

// ── Recent searches row ───────────────────────────────────────────────────

function RecentItem({ item, onExecute, onRemove, isSelected }) {
  const color = item.accent || TYPE_META[item.type]?.color || '#818cf8'
  return (
    <div
      onClick={onExecute}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 14px', cursor: 'pointer', borderRadius: 10,
        background: isSelected ? 'rgba(99,102,241,0.12)' : 'transparent',
        margin: '1px 6px',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
    >
      <Clock size={14} color="rgba(255,255,255,0.28)" strokeWidth={2} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: 13,
          color: 'rgba(255,255,255,0.72)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          display: 'block',
        }}>
          {item.title}
        </span>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onRemove(item.id) }}
        style={{
          width: 18, height: 18, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.25)', borderRadius: 4,
          opacity: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#f87171' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '0' }}
      >
        <X size={11} strokeWidth={2.5} />
      </button>
    </div>
  )
}

// ── Main search content ───────────────────────────────────────────────────

function SearchContent({ onClose }) {
  const [query, setQuery]       = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef  = useRef(null)
  const panelRef  = useRef(null)
  useClickOutside(panelRef, onClose)
  useFocusTrap(panelRef, true)

  const glass    = useGlassEffect('menu')
  const { enabled } = useOSAnimations()

  // Narrow searchStore subscription — only re-render when recents array changes
  const recents      = useSearchStore(useShallow(s => s.recents))
  const clearRecents = useSearchStore(s => s.clearRecents)
  const removeRecent = useSearchStore(s => s.removeRecent)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [])

  const results      = query.trim() ? search(query) : []
  const showRecents  = !query.trim() && recents.length > 0
  const showQuick    = !query.trim()

  // Flat list for keyboard nav
  const navItems = query.trim()
    ? results
    : [...(showRecents ? recents.slice(0, 3) : []), ...QUICK_SUGGESTIONS]

  useEffect(() => setSelectedIdx(0), [query])

  const handleExecute = useCallback((item) => {
    executeItem(item, onClose)
  }, [onClose])

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIdx(i => Math.min(i + 1, navItems.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIdx(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (navItems[selectedIdx]) handleExecute(navItems[selectedIdx])
        break
      case 'Escape':
        onClose()
        break
    }
  }, [navItems, selectedIdx, handleExecute, onClose])

  const recentOffset = showRecents ? Math.min(recents.length, 3) : 0

  return (
    <motion.div
      key="search-content"
      initial={enabled ? { opacity: 0, scale: 0.96, y: -14 } : { opacity: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={enabled ? { opacity: 0, scale: 0.94, y: -10 } : { opacity: 0 }}
      transition={enabled ? { duration: 0.18, ease: [0.34, 1.12, 0.64, 1] } : { duration: 0 }}
      style={{
        position: 'fixed',
        top: '16%', left: '50%', transform: 'translateX(-50%)',
        width: 620, maxWidth: 'calc(100vw - 32px)',
        zIndex: 800,
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        style={{
          ...glass,
          borderRadius: 20,
          boxShadow: '0 48px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(99,102,241,0.12)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          maxHeight: '65vh',
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '12%', right: '12%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.65), transparent)',
          borderRadius: 99, zIndex: 1,
        }} />

        {/* ── Input ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '15px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <Search size={19} color="#6366f1" strokeWidth={2} style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search apps, commands, files…"
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'var(--font-ui)', fontSize: 16,
              color: 'rgba(255,255,255,0.92)',
            }}
          />
          {query ? (
            <motion.button
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              onClick={() => setQuery('')}
              style={{
                display: 'flex', background: 'rgba(255,255,255,0.1)', border: 'none',
                borderRadius: 6, cursor: 'pointer', padding: 5, color: 'rgba(255,255,255,0.55)',
              }}
            >
              <X size={14} strokeWidth={2.5} />
            </motion.button>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: '3px 8px', borderRadius: 7,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              flexShrink: 0,
            }}>
              <Command size={11} color="rgba(255,255,255,0.4)" strokeWidth={2} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>K</span>
            </div>
          )}
        </div>

        {/* ── Results / Quick access ── */}
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>

          {/* Recent searches */}
          {showRecents && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 2px' }}>
                <SectionLabel label="RECENT" icon={Clock} />
                <button
                  onClick={clearRecents}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-ui)', fontSize: 10,
                    color: 'rgba(255,255,255,0.28)',
                    padding: '2px 8px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
                >
                  Clear
                </button>
              </div>
              {recents.slice(0, 3).map((item, i) => (
                <RecentItem
                  key={`recent-${item.id}`}
                  item={item}
                  isSelected={i === selectedIdx}
                  onExecute={() => handleExecute(item)}
                  onRemove={removeRecent}
                />
              ))}
            </>
          )}

          {/* Quick suggestions (before typing) */}
          {showQuick && (
            <>
              <SectionLabel label="QUICK ACCESS" icon={Zap} />
              {QUICK_SUGGESTIONS.map((item, i) => (
                <ResultItem
                  key={item.id}
                  item={item}
                  isSelected={(showRecents ? recentOffset : 0) + i === selectedIdx}
                  onExecute={() => handleExecute(item)}
                />
              ))}
            </>
          )}

          {/* Search results — aria-live announces result count to screen readers */}
          {query.trim() && results.length === 0 && (
            <div
              role="status"
              aria-live="polite"
              style={{ padding: '32px 20px', textAlign: 'center' }}
            >
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                No results for "{query}"
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>
                Try an app name, action, filename, or command
              </div>
            </div>
          )}

          {query.trim() && results.length > 0 && (
            <>
              <SectionLabel
                label={`${results.length} RESULT${results.length !== 1 ? 'S' : ''}`}
                aria-live="polite"
                role="status"
              />
              {results.map((item, i) => (
                <ResultItem
                  key={item.id}
                  item={item}
                  isSelected={i === selectedIdx}
                  onExecute={() => handleExecute(item)}
                />
              ))}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '9px 18px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
          background: 'rgba(0,0,0,0.25)',
        }}>
          {[['↑↓', 'Navigate'], ['↵', 'Open'], ['Esc', 'Close']].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <kbd style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderBottom: '2px solid rgba(255,255,255,0.18)',
                borderRadius: 4, padding: '1px 6px',
              }}>
                {key}
              </kbd>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>
                {label}
              </span>
            </div>
          ))}

          <div style={{ flex: 1 }} />

          <button
            onClick={() => { onClose(); useOSStore.getState().toggleKeyboardOverlay() }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.28)', padding: '2px 6px', borderRadius: 5,
              fontFamily: 'var(--font-ui)', fontSize: 10,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
          >
            <Keyboard size={11} strokeWidth={2} />
            Shortcuts
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap size={11} color="#6366f1" strokeWidth={2.5} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
              FuturOS Search
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Portal entry point ────────────────────────────────────────────────────

export default function GlobalSearch() {
  const searchOpen  = useOSStore(s => s.searchOpen)
  const closeSearch = useOSStore(s => s.closeSearch)
  const backdrop    = useGlassBackdrop(4)
  const { enabled } = useOSAnimations()
  const overlay = document.getElementById('overlay-layer')
  if (!overlay) return null

  return createPortal(
    <AnimatePresence>
      {searchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="gs-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: enabled ? 0.15 : 0 }}
            onClick={closeSearch}
            style={{
              position: 'fixed', inset: 0, zIndex: 799,
              ...backdrop,
            }}
          />
          {/* Palette */}
          <SearchContent key="gs-content" onClose={closeSearch} />
        </>
      )}
    </AnimatePresence>,
    overlay
  )
}
