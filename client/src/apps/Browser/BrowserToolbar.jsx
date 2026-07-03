import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, RotateCcw, X, Shield,
  ShieldCheck, Bookmark, BookmarkCheck, Home, ExternalLink,
} from 'lucide-react'
import { resolveUrl, displayUrl } from './browserData'
import Tooltip from '@components/ui/Tooltip'

function NavBtn({ icon: Icon, onClick, disabled, tooltip }) {
  return (
    <Tooltip text={tooltip} placement="bottom">
      <motion.button
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        onClick={onClick}
        disabled={disabled}
        style={{
          width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 7, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          background: 'transparent',
          color: disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
          transition: 'background 0.12s, color 0.12s',
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <Icon size={15} strokeWidth={2} />
      </motion.button>
    </Tooltip>
  )
}

export default function BrowserToolbar({
  url, isLoading, canGoBack, canGoForward,
  isBookmarked, onNavigate, onBack, onForward,
  onRefresh, onStop, onHome, onBookmark, onOpenExternal,
}) {
  const [inputVal, setInputVal]     = useState('')
  const [isFocused, setIsFocused]   = useState(false)
  const inputRef = useRef(null)

  // Sync display URL when tab changes
  useEffect(() => {
    if (!isFocused) setInputVal(displayUrl(url))
  }, [url, isFocused])

  const handleSubmit = (e) => {
    e?.preventDefault()
    inputRef.current?.blur()
    setIsFocused(false)
    const resolved = resolveUrl(inputVal)
    setInputVal(displayUrl(resolved))
    onNavigate(resolved)
  }

  const isSecure = url?.startsWith('https://') || url?.startsWith('futuros://')

  return (
    <div style={{
      height: 44, display: 'flex', alignItems: 'center',
      gap: 6, padding: '0 10px',
      background: 'rgba(10,10,22,0.96)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0, position: 'relative',
    }}>
      {/* Loading bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 0.85 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
              transformOrigin: 'left',
              zIndex: 10,
            }}
          />
        )}
      </AnimatePresence>

      {/* Nav controls */}
      <div style={{ display: 'flex', gap: 2 }}>
        <NavBtn icon={ChevronLeft}  onClick={onBack}    disabled={!canGoBack}    tooltip="Back"    />
        <NavBtn icon={ChevronRight} onClick={onForward} disabled={!canGoForward} tooltip="Forward" />
        <NavBtn
          icon={isLoading ? X : RotateCcw}
          onClick={isLoading ? onStop : onRefresh}
          tooltip={isLoading ? 'Stop' : 'Refresh'}
        />
        <NavBtn icon={Home} onClick={onHome} tooltip="Home" />
      </div>

      {/* URL bar */}
      <form onSubmit={handleSubmit} style={{ flex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: isFocused ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${isFocused ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.09)'}`,
          borderRadius: 10, padding: '0 12px', height: 32,
          transition: 'border-color 0.2s, background 0.2s',
          cursor: 'text',
        }}
        onClick={() => inputRef.current?.focus()}
        >
          {/* Security icon */}
          {isSecure
            ? <ShieldCheck size={13} color="#34d399" strokeWidth={2} style={{ flexShrink: 0 }} />
            : <Shield      size={13} color="#fbbf24" strokeWidth={2} style={{ flexShrink: 0 }} />
          }

          <input
            ref={inputRef}
            value={isFocused ? inputVal : displayUrl(url)}
            onChange={e => setInputVal(e.target.value)}
            onFocus={() => { setIsFocused(true); setInputVal(url || ''); setTimeout(() => inputRef.current?.select(), 0) }}
            onBlur={() => { setIsFocused(false) }}
            onKeyDown={e => { if (e.key === 'Escape') { setIsFocused(false); inputRef.current?.blur() } }}
            placeholder="Search or enter URL"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'var(--font-ui)', fontSize: 13,
              color: 'rgba(255,255,255,0.85)',
            }}
          />

          {/* Favicon area */}
          {!isFocused && url && !url.startsWith('futuros://') && (
            <img
              src={`https://www.google.com/s2/favicons?domain=${new URL(url.startsWith('http') ? url : `https://${url}`).hostname}&sz=16`}
              alt=""
              width={14} height={14}
              style={{ borderRadius: 2, flexShrink: 0, opacity: 0.8 }}
              onError={e => e.target.style.display = 'none'}
            />
          )}
        </div>
      </form>

      {/* Right actions */}
      <div style={{ display: 'flex', gap: 2 }}>
        <Tooltip text={isBookmarked ? 'Remove bookmark' : 'Bookmark'} placement="bottom">
          <motion.button
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
            onClick={onBookmark}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 7, border: 'none', cursor: 'pointer', background: 'transparent',
              color: isBookmarked ? '#fbbf24' : 'rgba(255,255,255,0.5)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            {isBookmarked
              ? <BookmarkCheck size={15} strokeWidth={2} />
              : <Bookmark      size={15} strokeWidth={2} />
            }
          </motion.button>
        </Tooltip>

        {url && !url.startsWith('futuros://') && (
          <Tooltip text="Open in new tab" placement="bottom">
            <motion.button
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
              onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
              style={{
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 7, border: 'none', cursor: 'pointer', background: 'transparent',
                color: 'rgba(255,255,255,0.5)', transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ExternalLink size={14} strokeWidth={2} />
            </motion.button>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
