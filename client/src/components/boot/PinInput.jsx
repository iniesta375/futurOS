import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PIN_LENGTH = 6
const CORRECT_PIN = '000000'  // Demo PIN — all zeros

/**
 * PinInput — Visual PIN pad with dot indicators.
 * Accepts keyboard or button input.
 * Shakes + clears on wrong PIN. Calls onSuccess on correct PIN.
 */
export default function PinInput({ onSuccess, onSkip }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef(null)

  // Focus hidden input for keyboard entry
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (success) return
    if (e.key >= '0' && e.key <= '9' && pin.length < PIN_LENGTH) {
      setPin(p => p + e.key)
    } else if (e.key === 'Backspace') {
      setPin(p => p.slice(0, -1))
    }
  }, [pin, success])

  const appendDigit = useCallback((d) => {
    if (!success && pin.length < PIN_LENGTH) setPin(p => p + d)
  }, [pin, success])

  const clearPin = useCallback(() => setPin(''), [])

  // Auto-check when PIN is full
  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return

    if (pin === CORRECT_PIN) {
      setSuccess(true)
      setTimeout(() => onSuccess?.(), 600)
    } else {
      setError(true)
      setTimeout(() => { setError(false); setPin('') }, 700)
    }
  }, [pin, onSuccess])

  const dots = Array.from({ length: PIN_LENGTH }, (_, i) => i)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Hidden keyboard input */}
      <input
        ref={inputRef}
        type="tel"
        value={pin}
        onKeyDown={handleKeyDown}
        onChange={() => {}}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        inputMode="numeric"
      />

      {/* Dot indicators */}
      <motion.div
        animate={error ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        style={{ display: 'flex', gap: 12, alignItems: 'center' }}
      >
        {dots.map(i => {
          const filled  = i < pin.length
          const isLast  = i === pin.length - 1

          return (
            <motion.div
              key={i}
              animate={{
                scale:      filled ? 1 : 0.75,
                background: success
                  ? '#34d399'
                  : error
                    ? '#f87171'
                    : filled
                      ? '#818cf8'
                      : 'rgba(255,255,255,0.15)',
                boxShadow: success
                  ? '0 0 12px rgba(52,211,153,0.7)'
                  : error
                    ? '0 0 12px rgba(248,113,113,0.7)'
                    : filled
                      ? '0 0 10px rgba(129,140,248,0.6)'
                      : 'none',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              style={{
                width: 14, height: 14, borderRadius: '50%',
                border: filled || success || error ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
              }}
            />
          )
        })}
      </motion.div>

      {/* Hint text */}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#f87171' }}
          >
            Incorrect PIN — try again
          </motion.p>
        ) : success ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#34d399' }}
          >
            Welcome back ✓
          </motion.p>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}
          >
            Enter PIN  <span style={{ opacity: 0.5 }}>(hint: 000000)</span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* Numpad */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        width: 196,
      }}>
        {[1,2,3,4,5,6,7,8,9,'⌫',0,'→'].map((key, i) => {
          const isBackspace = key === '⌫'
          const isSkip = key === '→'

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.06, background: 'rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              onClick={() => {
                if (isBackspace) clearPin()
                else if (isSkip) onSkip?.()
                else appendDigit(String(key))
              }}
              style={{
                height: 52, borderRadius: 10,
                background: isSkip
                  ? 'rgba(99,102,241,0.2)'
                  : 'rgba(255,255,255,0.07)',
                border: isSkip
                  ? '1px solid rgba(99,102,241,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                fontFamily: isBackspace ? 'var(--font-ui)' : 'var(--font-display)',
                fontSize: isBackspace || isSkip ? 16 : 20,
                fontWeight: isBackspace || isSkip ? 400 : 500,
                color: isSkip ? '#818cf8' : 'rgba(255,255,255,0.85)',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              {key}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
