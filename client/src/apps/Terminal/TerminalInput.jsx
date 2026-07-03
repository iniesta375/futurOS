import { useRef, useEffect, forwardRef } from 'react'

/**
 * TerminalInput — The active command line prompt.
 * Renders the prompt prefix, blinking cursor, and hidden real input.
 */
const TerminalInput = forwardRef(function TerminalInput(
  { value, onChange, onSubmit, onHistoryUp, onHistoryDown, onTabComplete, disabled },
  ref
) {
  // Always show caret at end of typed text
  const measureRef = useRef(null)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 0 2px',
        position: 'relative',
        flexShrink: 0,
      }}
      onClick={() => ref?.current?.focus()}
    >
      {/* Prompt symbols */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12.5,
        color: '#34d399',
        fontWeight: 700,
        userSelect: 'none',
        flexShrink: 0,
        marginRight: 2,
      }}>
        dev@futuros
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12.5,
        color: 'rgba(255,255,255,0.3)',
        userSelect: 'none',
        flexShrink: 0,
      }}>
        :
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12.5,
        color: '#818cf8',
        fontWeight: 600,
        userSelect: 'none',
        flexShrink: 0,
        marginRight: 6,
      }}>
        ~/portfolio
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12.5,
        color: '#fbbf24',
        userSelect: 'none',
        flexShrink: 0,
        marginRight: 8,
      }}>
        $
      </span>

      {/* Invisible measure span for cursor positioning */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
        {/* Visible text mirror */}
        <span
          ref={measureRef}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            color: 'rgba(255,255,255,0.88)',
            whiteSpace: 'pre',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {value}
        </span>

        {/* Blinking cursor */}
        {!disabled && (
          <span
            style={{
              display: 'inline-block',
              width: 7, height: 14,
              background: '#818cf8',
              verticalAlign: 'middle',
              marginLeft: 1,
              animation: 'glow-pulse 1s ease-in-out infinite',
              borderRadius: 1,
              flexShrink: 0,
            }}
          />
        )}

        {/* Real hidden input — handles all keyboard events */}
        <input
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSubmit(value)
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              onHistoryUp()
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              onHistoryDown()
            } else if (e.key === 'Tab') {
              e.preventDefault()
              onTabComplete(value)
            } else if (e.key === 'c' && e.ctrlKey) {
              e.preventDefault()
              onChange('')
            } else if (e.key === 'l' && e.ctrlKey) {
              e.preventDefault()
              onSubmit('clear')
            }
          }}
          disabled={disabled}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          style={{
            position: 'absolute',
            left: 0, top: 0,
            width: '100%', height: '100%',
            opacity: 0,
            cursor: 'text',
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'transparent',
            caretColor: 'transparent',
          }}
        />
      </div>
    </div>
  )
})

export default TerminalInput
