import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Bookmark, ExternalLink, Clock } from 'lucide-react'
import { QUICK_LINKS, DEFAULT_BOOKMARKS, resolveUrl } from './browserData'
import { useClock } from '@hooks/useClock'

function QuickLink({ item, index, onNavigate }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.04, type: 'spring', stiffness: 380, damping: 28 }}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onNavigate(item.url)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '14px 12px', borderRadius: 14, cursor: 'pointer',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'border-color 0.15s, background 0.15s',
        minWidth: 72,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
      }}
    >
      <span style={{ fontSize: 22 }}>{item.icon}</span>
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500,
        color: 'rgba(255,255,255,0.65)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        maxWidth: 68,
      }}>
        {item.title}
      </span>
    </motion.button>
  )
}

function BookmarkCard({ bm, index, onNavigate }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4 }}
      onClick={() => onNavigate(bm.url)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
        background: 'transparent',
        width: '100%', textAlign: 'left',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        background: `${bm.color}18`,
        border: `1px solid ${bm.color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15,
      }}>
        {bm.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.82)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {bm.title}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {bm.url.replace('https://', '')}
        </div>
      </div>
      <ExternalLink size={12} color="rgba(255,255,255,0.2)" />
    </motion.button>
  )
}

export default function BrowserHomePage({ onNavigate, bookmarks = DEFAULT_BOOKMARKS }) {
  const [query, setQuery] = useState('')
  const { timeStr, fullDateStr } = useClock()
  const inputRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onNavigate(resolveUrl(query))
      setQuery('')
    }
  }

  return (
    <div
      className="selectable"
      style={{
        width: '100%', height: '100%',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.06) 0%, transparent 60%), #080810',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '48px 24px 32px',
      }}
    >
      {/* Clock */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: 36 }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.88)',
          letterSpacing: '-0.03em', lineHeight: 1,
        }}>
          {timeStr}
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
          {fullDateStr}
        </div>
      </motion.div>

      {/* Search bar */}
      <motion.form
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        onSubmit={handleSearch}
        style={{ width: '100%', maxWidth: 560, marginBottom: 40 }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16, padding: '0 18px', height: 52,
          boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
        >
          <Search size={18} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search the web or enter a URL"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'var(--font-ui)', fontSize: 15,
              color: 'rgba(255,255,255,0.88)',
            }}
          />
          {query && (
            <button type="submit" style={{
              padding: '5px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: '#fff',
            }}>
              Go
            </button>
          )}
        </div>
      </motion.form>

      {/* Quick links */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ width: '100%', maxWidth: 700, marginBottom: 36 }}
      >
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: 14 }}>
          QUICK ACCESS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {QUICK_LINKS.map((item, i) => (
            <QuickLink key={item.url} item={item} index={i} onNavigate={onNavigate} />
          ))}
        </div>
      </motion.div>

      {/* Bookmarks */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          width: '100%', maxWidth: 700,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, overflow: 'hidden',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <Bookmark size={13} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
            BOOKMARKS
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 8 }}>
          {bookmarks.map((bm, i) => (
            <BookmarkCard key={bm.id} bm={bm} index={i} onNavigate={onNavigate} />
          ))}
        </div>
      </motion.div>

      {/* FuturOS internal pages */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ marginTop: 28, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {[
          { label: '📖 About Me',    url: 'futuros://about'    },
          { label: '📁 Projects',    url: 'futuros://projects'  },
          { label: '💻 Terminal',    url: 'futuros://terminal'  },
          { label: '⚙️ Settings',   url: 'futuros://settings'  },
        ].map(page => (
          <button
            key={page.url}
            onClick={() => onNavigate(page.url)}
            style={{
              padding: '7px 16px', borderRadius: 20,
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#818cf8', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
          >
            {page.label}
          </button>
        ))}
      </motion.div>
    </div>
  )
}
