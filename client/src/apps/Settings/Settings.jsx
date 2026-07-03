import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import STSidebar     from './STSidebar'
import STAppearance  from './STAppearance'
import STDisplay     from './STDisplay'
import STSound       from './STSound'
import STNetwork     from './STNetwork'
import STProfile     from './STProfile'
import STKeyboard    from './STKeyboard'
import STAbout       from './STAbout'

const PANELS = {
  appearance: STAppearance,
  display:    STDisplay,
  sound:      STSound,
  network:    STNetwork,
  profile:    STProfile,
  keyboard:   STKeyboard,
  about:      STAbout,
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('appearance')
  const Panel = PANELS[activeSection] || STAppearance

  return (
    <div style={{
      display: 'flex', width: '100%', height: '100%',
      background: 'rgba(10,10,20,0.97)',
      overflow: 'hidden', fontFamily: 'var(--font-ui)',
    }}>
      <STSidebar active={activeSection} onSelect={setActiveSection} />

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '24px 28px 32px' }}
          >
            <Panel />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
