import { useClock } from '@hooks/useClock'

/**
 * TaskbarClock — Live clock & date for the system tray area.
 */
export default function TaskbarClock() {
  const { timeStr, dateStr } = useClock()

  return (
    <div
      className="flex flex-col items-end justify-center px-2 cursor-default select-none"
      style={{ lineHeight: 1.3 }}
    >
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.90)',
          letterSpacing: '0.01em',
        }}
      >
        {timeStr}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.50)',
        }}
      >
        {dateStr}
      </span>
    </div>
  )
}
