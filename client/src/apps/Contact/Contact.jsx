import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ContactLeft   from './ContactLeft'
import ContactForm   from './ContactForm'
import SuccessOverlay from './SuccessOverlay'

export default function Contact() {
  const [submitted, setSubmitted]       = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const handleSuccess = (data) => {
    setSubmittedData(data)
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    setSubmittedData(null)
  }

  return (
    <div style={{
      display: 'flex', width: '100%', height: '100%',
      background: 'rgba(10,10,20,0.97)',
      overflow: 'hidden',
      fontFamily: 'var(--font-ui)',
      position: 'relative',
    }}>
      {/* Left panel */}
      <ContactLeft />

      {/* Right — form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 32px', minWidth: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          <div style={{ marginBottom: 24 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
              color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.02em', marginBottom: 4,
            }}>
              Send a Message
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
              Fill in the form below and I'll respond within 24 hours.
              All fields marked <span style={{ color: '#6366f1' }}>*</span> are required.
            </p>
          </div>

          <ContactForm onSuccess={handleSuccess} />
        </motion.div>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {submitted && (
          <SuccessOverlay
            submittedData={submittedData}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
