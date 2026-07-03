import { useEffect, useState, memo } from 'react'
import { resolveColor } from './terminalNodes'

const STREAM_SPEED = 8   // ms per character for streaming text

/** Streaming text node — reveals characters one by one */
function StreamedLine({ content, color, bold, dim: isDim, indent = 0, onDone, noStream }) {
  const [displayed, setDisplayed] = useState(noStream ? content : '')
  const resolvedColor = resolveColor(color)

  useEffect(() => {
    if (noStream || !content) { setDisplayed(content); onDone?.(); return }
    let i = 0
    const iv = setInterval(() => {
      i++
      setDisplayed(content.slice(0, i))
      if (i >= content.length) { clearInterval(iv); onDone?.() }
    }, STREAM_SPEED)
    return () => clearInterval(iv)
  }, [content, noStream])

  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      lineHeight: 1.7,
      color: isDim ? resolvedColor + '80' : resolvedColor,
      fontWeight: bold ? 600 : 400,
      paddingLeft: indent * 8,
      whiteSpace: 'pre',
      minHeight: 22,
    }}>
      {displayed}
      {!noStream && displayed.length < content.length && (
        <span style={{
          display: 'inline-block', width: 6, height: 13,
          background: resolveColor('accent'),
          verticalAlign: 'middle', marginLeft: 1,
          animation: 'glow-pulse 0.6s ease-in-out infinite',
        }} />
      )}
    </div>
  )
}

/** ASCII bar node */
function BarNode({ label, percent, barColor }) {
  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    let start = null
    const duration = 700

    const animate = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayPct(Math.round(eased * percent))
      if (progress < 1) requestAnimationFrame(animate)
    }
    const raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [percent])

  const W = 30
  const filled = Math.round((displayPct / 100) * W)
  const barStr = '█'.repeat(filled) + '░'.repeat(W - filled)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.7,
      minHeight: 22,
    }}>
      <span style={{ color: 'rgba(255,255,255,0.7)', width: 200, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ color: barColor || '#6366f1' }}>{barStr}</span>
      <span style={{ color: barColor || '#6366f1', fontWeight: 700, minWidth: 36 }}>
        {displayPct}%
      </span>
    </div>
  )
}

/** Table node */
function TableNode({ headers, rows }) {
  if (!rows?.length) return null

  // Compute column widths
  const widths = headers.map((h, ci) =>
    Math.max(h.length, ...rows.map(r => (r[ci] || '').length))
  )

  const renderRow = (cells, style) =>
    cells.map((cell, ci) =>
      (cell || '').padEnd(widths[ci] + 2)
    ).join('')

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.7 }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', paddingLeft: 16 }}>
        {'  ' + renderRow(headers)}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.15)', paddingLeft: 16 }}>
        {'  ' + widths.map(w => '─'.repeat(w + 2)).join('')}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ color: i % 2 === 0 ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.55)', paddingLeft: 16 }}>
          {'  ' + renderRow(row)}
        </div>
      ))}
    </div>
  )
}

/** Link node */
function LinkNode({ content, href }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.7, minHeight: 22 }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#22d3ee',
          textDecoration: 'none',
          borderBottom: '1px dashed rgba(34,211,238,0.4)',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#67e8f9'; e.currentTarget.style.borderBottomColor = '#67e8f9' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#22d3ee'; e.currentTarget.style.borderBottomColor = 'rgba(34,211,238,0.4)' }}
      >
        {content}
      </a>
    </div>
  )
}

/** Single output node dispatcher */
const OutputNode = memo(({ node, onDone }) => {
  switch (node.type) {
    case 'bar':
      return <BarNode {...node} />
    case 'table':
      return <TableNode {...node} />
    case 'link':
      return <LinkNode {...node} />
    default:
      return (
        <StreamedLine
          content={node.content || ''}
          color={node.color}
          bold={node.bold}
          dim={node.dim}
          indent={node.indent}
          noStream={node.noStream}
          onDone={onDone}
        />
      )
  }
})

OutputNode.displayName = 'OutputNode'

export default OutputNode
