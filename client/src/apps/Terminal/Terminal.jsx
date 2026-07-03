import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { resolveCommand, getCompletions } from './commands'
import { COMMANDS } from './commands'
import TerminalInput from './TerminalInput'
import TerminalOutputNode from './TerminalOutput.jsx'
import { blank, line, error, dim } from './terminalNodes'

const WELCOME_OUTPUT = [
  ...COMMANDS.banner(),
  line('  System ready.  Type  help  to explore.', { color: 'success' }),
  blank(),
]

function PromptEcho({ cmd }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '6px 0 2px', flexShrink: 0 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#34d399', fontWeight: 700 }}>dev@futuros</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'rgba(255,255,255,0.3)' }}>:</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#818cf8', fontWeight: 600 }}>~/portfolio</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#fbbf24', margin: '0 8px 0 6px' }}>$</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'rgba(255,255,255,0.82)' }}>{cmd}</span>
    </div>
  )
}

function SessionEntry({ entry }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
      {entry.cmd !== null && <PromptEcho cmd={entry.cmd} />}
      {entry.output.map(node => (
        <TerminalOutputNode key={node.id} node={node} />
      ))}
    </motion.div>
  )
}

function StatusChip({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
        {label}
      </span>
    </div>
  )
}

export default function Terminal() {
  const [entries, setEntries]     = useState([{ id: 'welcome', cmd: null, output: WELCOME_OUTPUT }])
  const [inputVal, setInputVal]   = useState('')
  const [histIdx, setHistIdx]     = useState(-1)
  const [suggestions, setSuggestions] = useState([])
  const [cmdCount, setCmdCount]   = useState(0)

  const historyRef  = useRef([])
  const inputRef    = useRef(null)
  const bottomRef   = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = useCallback((raw) => {
    const cmd = raw.trim()
    setInputVal('')
    setSuggestions([])
    setHistIdx(-1)
    if (!cmd) return

    historyRef.current = [cmd, ...historyRef.current.filter(c => c !== cmd)].slice(0, 100)
    setCmdCount(c => c + 1)

    if (cmd === 'clear' || cmd === 'cls') {
      setEntries([])
      return
    }

    const resolved = resolveCommand(cmd)
    let output
    if (!resolved) {
      output = [
        blank(),
        error(`Command not found: ${cmd}`),
        dim('  Type  help  to see available commands'),
        blank(),
      ]
    } else {
      try {
        output = resolved.handler(resolved.rawArgs, {}, historyRef.current)
      } catch (e) {
        output = [error(`Runtime error: ${e.message}`)]
      }
    }

    setEntries(prev => [...prev, { id: `${cmd}-${Date.now()}`, cmd, output }])
  }, [])

  const handleHistoryUp = useCallback(() => {
    const hist = historyRef.current
    if (!hist.length) return
    const next = Math.min(histIdx + 1, hist.length - 1)
    setHistIdx(next)
    setInputVal(hist[next] || '')
  }, [histIdx])

  const handleHistoryDown = useCallback(() => {
    const next = Math.max(histIdx - 1, -1)
    setHistIdx(next)
    setInputVal(next === -1 ? '' : historyRef.current[next] || '')
  }, [histIdx])

  const handleTabComplete = useCallback((partial) => {
    const completions = getCompletions(partial.trim())
    if (completions.length === 1) {
      setInputVal(completions[0])
      setSuggestions([])
    } else if (completions.length > 1) {
      setSuggestions(completions)
    }
  }, [])

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        width: '100%', height: '100%',
        background: '#0a0a12',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', cursor: 'text',
        fontFamily: 'var(--font-mono)',
        position: 'relative',
      }}
    >
      {/* CRT scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
      }} />

      {/* Top glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 200,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Output scroll area */}
      <div
        className="selectable"
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 20px 8px', zIndex: 3, position: 'relative' }}
      >
        {entries.map(entry => (
          <SessionEntry key={entry.id} entry={entry} />
        ))}

        {/* Tab completions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 0' }}
            >
              {suggestions.map(s => (
                <span
                  key={s}
                  onClick={() => { setInputVal(s); setSuggestions([]); inputRef.current?.focus() }}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    color: '#818cf8', background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    padding: '2px 8px', borderRadius: 5, cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.22)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.12)'}
                >
                  {s}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        flexShrink: 0, padding: '4px 20px 12px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(8,8,16,0.6)', zIndex: 3, position: 'relative',
      }}>
        <TerminalInput
          ref={inputRef}
          value={inputVal}
          onChange={setInputVal}
          onSubmit={handleSubmit}
          onHistoryUp={handleHistoryUp}
          onHistoryDown={handleHistoryDown}
          onTabComplete={handleTabComplete}
        />
      </div>

      {/* Status bar */}
      <div style={{
        height: 22, flexShrink: 0,
        background: '#0d0d1a',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 16, zIndex: 3,
      }}>
        <StatusChip color="#34d399" label="CONNECTED" />
        <StatusChip color="#818cf8" label={`${cmdCount} commands`} />
        <StatusChip color="#22d3ee" label="futuros-sh 1.0" />
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>
          Tab: complete · ↑↓: history · Ctrl+L: clear
        </span>
      </div>
    </div>
  )
}
