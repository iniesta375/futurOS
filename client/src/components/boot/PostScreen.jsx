import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const POST_LINES = [
  { text: 'FuturOS UEFI BIOS v4.2.1  |  Copyright (c) 2025 FuturCorp', delay: 0,   color: '#818cf8' },
  { text: '─────────────────────────────────────────────────────────', delay: 60,  color: '#2d2d4e' },
  { text: 'CPU: FuturCore™ i9-X @ 5.40GHz  [8C/16T]  ✓ OK',          delay: 120, color: '#94a3b8' },
  { text: 'RAM: 32768 MB DDR5-6400  [4 × 8192 MB]     ✓ OK',         delay: 200, color: '#94a3b8' },
  { text: 'GPU: FuturRadeon RX 9900 XTX  16 GB VRAM   ✓ OK',         delay: 280, color: '#94a3b8' },
  { text: 'NVMe: SAMSUNG 990 PRO 2TB  [7450 MB/s]      ✓ OK',        delay: 360, color: '#94a3b8' },
  { text: '─────────────────────────────────────────────────────────', delay: 440, color: '#2d2d4e' },
  { text: 'Initializing ACPI subsystem...                OK',          delay: 520, color: '#64748b' },
  { text: 'Loading UEFI drivers...                       OK',          delay: 580, color: '#64748b' },
  { text: 'Enumerating PCI bus...                        OK',          delay: 640, color: '#64748b' },
  { text: 'Initializing USB 4.0 host controller...       OK',         delay: 700, color: '#64748b' },
  { text: 'Loading secure boot keys...                   OK',          delay: 760, color: '#64748b' },
  { text: 'TPM 3.0 detected and initialized...           OK',         delay: 820, color: '#64748b' },
  { text: '─────────────────────────────────────────────────────────', delay: 900, color: '#2d2d4e' },
  { text: 'Booting FuturOS from NVMe0...                 OK',         delay: 960, color: '#22d3ee' },
  { text: 'Kernel: futuros-6.8.0-futur-amd64',                        delay: 1020, color: '#34d399' },
  { text: 'Loading initramfs...                          OK',          delay: 1080, color: '#64748b' },
  { text: 'Starting system services...',                               delay: 1140, color: '#fbbf24' },
]

export default function PostScreen({ onDone }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [cursor, setCursor] = useState(true)
  const containerRef = useRef(null)

  // Reveal lines sequentially
  useEffect(() => {
    const timers = POST_LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
        // Auto-scroll
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      }, line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(t)
  }, [])

  // Skip on any click/keypress
  useEffect(() => {
    const skip = () => onDone?.()
    window.addEventListener('keydown', skip)
    window.addEventListener('click', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('click', skip)
    }
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0,
        background: '#050508',
        display: 'flex', flexDirection: 'column',
        padding: '32px 48px',
        overflow: 'hidden',
      }}
    >
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />

      {/* CRT vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 11,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.5) 100%)',
      }} />

      {/* Terminal output */}
      <div
        ref={containerRef}
        style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          fontFamily: 'var(--font-mono)', fontSize: 13,
          lineHeight: 1.7, letterSpacing: '0.02em',
        }}
      >
        {POST_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.color,
              opacity: visibleLines.includes(i) ? 1 : 0,
              transition: 'opacity 0.1s',
              whiteSpace: 'pre',
            }}
          >
            {line.text}
          </div>
        ))}

        {/* Blinking cursor on last visible line */}
        {visibleLines.length > 0 && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#34d399', height: 22 }}>
            {cursor ? '█' : ' '}
          </div>
        )}
      </div>

      {/* Skip hint */}
      <div style={{
        position: 'absolute', bottom: 24, right: 48,
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'rgba(255,255,255,0.2)',
        animation: 'glow-pulse 3s ease-in-out infinite',
      }}>
        Press any key to skip
      </div>
    </motion.div>
  )
}
