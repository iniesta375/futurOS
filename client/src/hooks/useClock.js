import { useState, useEffect } from 'react'

/**
 * useClock — Returns live-updating time and date strings
 *
 * Phase 12C Part 3: accepts an optional `locale` (BCP-47 tag, e.g.
 * 'en-US', 'fr-FR', 'ja-JP'). Defaults to 'en-US' to preserve the exact
 * formatting every existing caller (TaskbarClock, LockClock, etc.) already
 * relies on. Pass `undefined` explicitly to use the browser's locale.
 */
export function useClock(locale = 'en-US') {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    // Align to next second boundary
    const msToNext = 1000 - (Date.now() % 1000)
    const alignTimeout = setTimeout(() => {
      setNow(new Date())
      const interval = setInterval(() => setNow(new Date()), 1000)
      return () => clearInterval(interval)
    }, msToNext)

    return () => clearTimeout(alignTimeout)
  }, [])

  const timeStr = now.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const dateStr = now.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const fullDateStr = now.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return { now, timeStr, dateStr, fullDateStr }
}
