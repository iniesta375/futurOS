/**
 * KeyboardOverlay.jsx — FuturOS Keyboard Shortcuts Reference
 *
 * Full-screen modal listing all shortcuts grouped by area (System,
 * Windows, Terminal, File Explorer, Browser, Desktop). Toggled via
 * Ctrl+/ or the "Shortcuts" link in the Command Palette footer.
 *
 * Phase 12C Part 3: panel background/blur now sourced from
 * useGlassEffect('menu'), backdrop scrim from useGlassBackdrop(6), and
 * the open/close animation respects animationsEnabled via
 * useOSAnimations().enabled.
 */

import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard } from 'lucide-react'
import useOSStore from '@stores/osStore'
import { useGlassEffect, useGlassBackdrop, useOSAnimations } from '@contexts/GlassEffectContext'
import { useFocusTrap } from '@hooks/useFocusTrap'

const GROUPS = [
  {
    title: 'System', color: '#818cf8',
    shortcuts: [
      { keys: ['Ctrl', 'K'],  label: 'Command palette / Search' },
      { keys: ['Ctrl', '`'],  label: 'Open Terminal' },
      { keys: ['Ctrl', '/'],  label: 'Toggle this shortcut overlay' },
      { keys: ['Esc'],        label: 'Close menus & overlays' },
    ],
  },
  {
    title: 'Windows', color: '#22d3ee',
    shortcuts: [
      { keys: ['Ctrl', 'W'],  label: 'Close focused window' },
      { keys: ['Ctrl', 'H'],  label: 'Minimize focused window' },
      { keys: ['Dbl-click title'], label: 'Maximize / restore window' },
      { keys: ['Drag to top'],     label: 'Snap maximize' },
      { keys: ['Drag to edge'],    label: 'Snap left / right (50%)' },
    ],
  },
  {
    title: 'Terminal', color: '#34d399',
    shortcuts: [
      { keys: ['↑', '↓'],    label: 'History navigation' },
      { keys: ['Tab'],        label: 'Autocomplete command' },
      { keys: ['Ctrl', 'C'], label: 'Cancel / clear input' },
      { keys: ['Ctrl', 'L'], label: 'Clear screen' },
    ],
  },
  {
    title: 'File Explorer', color: '#fbbf24',
    shortcuts: [
      { keys: ['Dbl-click'], label: 'Open file or folder' },
      { keys: ['F2'],        label: 'Rename selected item' },
      { keys: ['Ctrl', 'C'], label: 'Copy selected' },
      { keys: ['Ctrl', 'X'], label: 'Cut selected' },
      { keys: ['Del'],       label: 'Delete selected item' },
    ],
  },
  {
    title: 'Browser', color: '#60a5fa',
    shortcuts: [
      { keys: ['Ctrl', 'T'],   label: 'New tab' },
      { keys: ['Ctrl', 'W'],   label: 'Close tab' },
      { keys: ['Alt', '←'],    label: 'Navigate back' },
      { keys: ['Alt', '→'],    label: 'Navigate forward' },
      { keys: ['Ctrl', 'D'],   label: 'Bookmark page' },
    ],
  },
  {
    title: 'Desktop', color: '#f97316',
    shortcuts: [
      { keys: ['Rt-click'],     label: 'Desktop context menu' },
      { keys: ['Dbl-click icon'], label: 'Launch app' },
      { keys: ['Click tray'],   label: 'Open quick settings' },
      { keys: ['Click clock'],  label: 'Open calendar' },
    ],
  },
]

function KbdKey({ k }) {
  return (
    <kbd style={{
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
      color: 'rgba(255,255,255,0.8)',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderBottom: '2px solid rgba(255,255,255,0.22)',
      borderRadius: 5, padding: '2px 8px',
      display: 'inline-block', flexShrink: 0,
    }}>
      {k}
    </kbd>
  )
}

export default function KeyboardOverlay() {
  const open  = useOSStore(s => s.keyboardOverlayOpen)
  const close = useOSStore(s => s.closeKeyboardOverlay)
  const glass    = useGlassEffect('menu')
  const backdrop = useGlassBackdrop(6)
  const { enabled } = useOSAnimations()
  const panelRef = useRef(null)
  useFocusTrap(panelRef, open)
  const overlay = document.getElementById('overlay-layer')
  if (!overlay) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: enabled ? 0.2 : 0 }}
            onClick={close}
            aria-hidden="true"
            style={{ position: 'fixed', inset: 0, zIndex: 850, ...backdrop }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
            initial={enabled ? { opacity: 0, scale: 0.94, y: 20 } : { opacity: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={enabled ? { opacity: 0, scale: 0.94, y: 20 } : { opacity: 0 }}
            transition={enabled ? { duration: 0.22, ease: [0.34, 1.1, 0.64, 1] } : { duration: 0 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: 780, maxHeight: '80vh',
              ...glass,
              borderRadius: 20,
              boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
              zIndex: 851,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              flexShrink: 0,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Keyboard size={18} color="#818cf8" strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.93)', letterSpacing: '-0.02em' }}>
                  Keyboard Shortcuts
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>
                  FuturOS — all shortcuts at a glance
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close keyboard shortcuts"
                style={{
                  marginLeft: 'auto', width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                <X size={15} strokeWidth={2} />
              </button>
            </div>

            {/* Grid of shortcut groups */}
            <div style={{
              flex: 1, overflowY: 'auto',
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: 16, padding: '20px 24px 24px',
            }}>
              {GROUPS.map(group => (
                <div key={group.title} style={{
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: group.color, boxShadow: `0 0 6px ${group.color}` }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                      {group.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {group.shortcuts.map(({ keys, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.55)', flex: 1, lineHeight: 1.4 }}>
                          {label}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                          {keys.map((k, ki) => (
                            <span key={ki} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <KbdKey k={k} />
                              {ki < keys.length - 1 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>+</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                Press <strong>Esc</strong> or <strong>Ctrl+/</strong> to close
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
                FuturOS v1.0
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    overlay
  )
}
