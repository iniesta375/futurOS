import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useClock } from '@hooks/useClock'
import { useOSAnimations } from '@contexts/GlassEffectContext'

/**
 * ClockWidget — Feature 6 / reference implementation.
 *
 * This is the template every future widget (Weather, Calendar, System
 * Monitor, Notes, Music — see widgetRegistry.js) should follow:
 *
 *  - Renders ONLY its content. Sizing, drag, resize, minimize, focus ring
 *    and glass styling all come from WidgetContainer — this component
 *    just fills 100% width/height.
 *  - Reuses an existing shared hook (useClock) rather than duplicating
 *    time logic that TaskbarClock/LockClock/DesktopClock already use.
 *  - Owns one small piece of UI-local state (the selected locale) and
 *    persists it to its OWN localStorage key — independent of
 *    widgetStore's position/size/minimized/zIndex schema. This is the
 *    pattern for any widget that needs lightweight settings of its own
 *    (e.g. a Weather widget's chosen city) without growing the shared
 *    widget instance schema.
 *
 * ── Animations ───────────────────────────────────────────────────────────
 * - The time string crossfades via AnimatePresence, keyed on the string
 *   itself — it only re-mounts (and animates) when the displayed minute
 *   actually changes, not on every per-second tick from useClock.
 * - A small "seconds" pulse dot re-animates every second using a cheap
 *   transform/opacity tween (re-keyed on `now.getSeconds()`), giving the
 *   widget a "live" feel without animating any text.
 * - Both respect the animationsEnabled setting via useOSAnimations().
 */

const LOCALES = [
  { code: 'en-US', label: 'EN-US' },
  { code: 'en-GB', label: 'EN-GB' },
  { code: 'fr-FR', label: 'FR' },
  { code: 'de-DE', label: 'DE' },
  { code: 'es-ES', label: 'ES' },
  { code: 'ja-JP', label: 'JA' },
  { code: 'zh-CN', label: 'ZH' },
]

const LOCALE_STORAGE_KEY = 'futuros-clock-locale'

function loadStoredLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    return LOCALES.some(l => l.code === saved) ? saved : LOCALES[0].code
  } catch {
    return LOCALES[0].code
  }
}

export default function ClockWidget() {
  const [locale, setLocale] = useState(loadStoredLocale)
  const { now, timeStr, fullDateStr } = useClock(locale)
  const { enabled } = useOSAnimations()

  const cycleLocale = useCallback(() => {
    setLocale(current => {
      const idx  = LOCALES.findIndex(l => l.code === current)
      const next = LOCALES[(idx + 1) % LOCALES.length].code
      try { localStorage.setItem(LOCALE_STORAGE_KEY, next) } catch { /* ignore */ }
      return next
    })
  }, [])

  const localeLabel = LOCALES.find(l => l.code === locale)?.label || locale
  const seconds = now.getSeconds()

  return (
    <div className="flex flex-col w-full h-full" style={{ padding: 14, fontFamily: 'var(--font-ui)' }}>
      {/* ── Header row: live indicator + locale cycler ── */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--color-success)',
              animation: 'glow-pulse 2s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.32)' }}>
            LOCAL TIME
          </span>
        </div>

        <button
          onClick={cycleLocale}
          className="flex items-center gap-1 rounded-md transition-colors"
          style={{
            padding: '2px 7px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
          }}
          title="Switch locale"
        >
          <Globe size={10} strokeWidth={2} />
          {localeLabel}
        </button>
      </div>

      {/* ── Time + date ── */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0" style={{ gap: 6 }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={timeStr}
            initial={enabled ? { opacity: 0, y: 8 } : { opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={enabled ? { opacity: 0, y: -8 } : { opacity: 0 }}
            transition={enabled ? { duration: 0.25, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
            className="text-gradient"
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 38, lineHeight: 1, letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {timeStr}
          </motion.div>
        </AnimatePresence>

        <div
          style={{
            fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.45)',
            textAlign: 'center',
          }}
        >
          {fullDateStr}
        </div>
      </div>

      {/* ── Seconds pulse ── */}
      <div className="flex items-center justify-center gap-1 flex-shrink-0" style={{ paddingTop: 4 }}>
        <motion.span
          key={seconds}
          initial={enabled ? { scale: 0.4, opacity: 0.25 } : { opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={enabled ? { duration: 0.4, ease: 'easeOut' } : { duration: 0 }}
          style={{
            width: 4, height: 4, borderRadius: '50%',
            background: 'var(--color-accent-bright)',
          }}
        />
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.22)' }}>
          {String(seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  )
}
