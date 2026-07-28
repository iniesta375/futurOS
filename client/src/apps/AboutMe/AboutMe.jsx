import { useState, useRef, useCallback, useEffect } from 'react'
import AMSidebar    from './AMSidebar'
import AMProfile    from './AMProfile'
import AMSkills     from './AMSkills'
import AMExperience from './AMExperience'
import AMStack      from './AMStack'
import AMOpenSource from './AMOpenSource'
import AMContact    from './AMContact'

const SECTIONS = ['profile', 'skills', 'experience', 'stack', 'oss', 'contact']

function Divider() {
  return <div style={{ height: 1, margin: '0 28px', background: 'rgba(255,255,255,0.05)' }} />
}

export default function AboutMe() {
  const [activeSection, setActiveSection] = useState('profile')
  const scrollRef = useRef(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const handler = () => {
      const containerRect = container.getBoundingClientRect()
      const containerH = container.clientHeight
      let bestId = SECTIONS[0], bestScore = -Infinity
      for (const id of SECTIONS) {
        const el = container.querySelector(`#${id}`)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const relTop = rect.top - containerRect.top
        const relBot = rect.bottom - containerRect.top
        const vis = Math.min(containerH * 0.6, relBot) - Math.max(0, relTop)
        if (vis > bestScore) { bestScore = vis; bestId = id }
      }
      setActiveSection(bestId)
    }
    container.addEventListener('scroll', handler, { passive: true })
    return () => container.removeEventListener('scroll', handler)
  }, [])

  const handleNavSelect = useCallback((id) => {
    const el = scrollRef.current?.querySelector(`#${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }, [])

  return (
    <div style={{
      display: 'flex', width: '100%', height: '100%',
      background: 'rgba(10, 10, 20, 0.97)',
      overflow: 'hidden', fontFamily: 'var(--font-ui)',
    }}>
      <AMSidebar activeSection={activeSection} onSelect={handleNavSelect} />
      <div
        ref={scrollRef}
        className="selectable"
        style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0,
          background: 'radial-gradient(ellipse at 80% 10%, rgba(99,102,241,0.04) 0%, transparent 50%)',
        }}
      >
        <AMProfile    />
        <Divider />
        <AMSkills     />
        <Divider />
        <AMExperience />
        <Divider />
        <AMStack      />
        <Divider />
        <AMOpenSource />
        <Divider />
        <AMContact    />
      </div>
    </div>
  )
}
