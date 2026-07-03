import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, AlertCircle, ChevronDown } from 'lucide-react'
import { validateField, submitContactForm } from './contactService'
import useOSStore from '@stores/osStore'

const SUBJECTS = [
  'Job Opportunity',
  'Freelance Project',
  'Open Source Collaboration',
  'Technical Question',
  'Speaking / Podcast',
  'Just Saying Hi',
  'Other',
]

const MAX_MESSAGE = 1000

function FormField({ label, name, type = 'text', value, onChange, onBlur, error, placeholder, required, autoFocus }) {
  const [focused, setFocused] = useState(false)
  const accent = useOSStore(s => s.accentColor)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
        color: 'rgba(255,255,255,0.55)',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {label}
        {required && <span style={{ color: accent, fontSize: 14, lineHeight: 1 }}>*</span>}
      </label>

      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          onBlur={() => { setFocused(false); onBlur(name, value) }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{
            width: '100%',
            fontFamily: 'var(--font-ui)', fontSize: 13,
            color: 'rgba(255,255,255,0.88)',
            background: focused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${
              error ? 'rgba(248,113,113,0.6)'
              : focused ? accent + '88'
              : 'rgba(255,255,255,0.1)'
            }`,
            borderRadius: 10,
            padding: '10px 14px',
            outline: 'none',
            transition: 'border-color 0.15s, background 0.15s',
            boxShadow: focused && !error ? `0 0 0 3px ${accent}18` : 'none',
          }}
        />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}
          >
            <AlertCircle size={11} color="#f87171" strokeWidth={2} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#f87171' }}>
              {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SubjectField({ value, onChange, onBlur, error }) {
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(false)
  const accent = useOSStore(s => s.accentColor)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 4 }}>
        Subject <span style={{ color: accent, fontSize: 14, lineHeight: 1 }}>*</span>
      </label>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          onBlur={() => { setOpen(false); setFocused(false); onBlur('subject', value) }}
          style={{
            width: '100%', textAlign: 'left',
            fontFamily: 'var(--font-ui)', fontSize: 13,
            color: value ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.35)',
            background: open ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${error ? 'rgba(248,113,113,0.6)' : open ? accent + '88' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: open ? '10px 10px 0 0' : 10,
            padding: '10px 14px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'border-color 0.15s, background 0.15s',
          }}
        >
          {value || 'Select a subject'}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} color="rgba(255,255,255,0.4)" strokeWidth={2} />
          </motion.div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                background: 'rgba(14,14,28,0.97)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${accent}66`,
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              {SUBJECTS.map(subject => (
                <button
                  key={subject}
                  type="button"
                  onMouseDown={() => { onChange('subject', subject); setOpen(false); onBlur('subject', subject) }}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '9px 14px',
                    fontFamily: 'var(--font-ui)', fontSize: 13,
                    color: value === subject ? accent : 'rgba(255,255,255,0.72)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    fontWeight: value === subject ? 600 : 400,
                    transition: 'background 0.1s, color 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {subject}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}
          >
            <AlertCircle size={11} color="#f87171" strokeWidth={2} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#f87171' }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MessageField({ value, onChange, onBlur, error }) {
  const [focused, setFocused] = useState(false)
  const accent = useOSStore(s => s.accentColor)
  const remaining = MAX_MESSAGE - value.length
  const isNearLimit = remaining < 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 4 }}>
          Message <span style={{ color: accent, fontSize: 14, lineHeight: 1 }}>*</span>
        </label>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: isNearLimit ? '#fbbf24' : 'rgba(255,255,255,0.28)',
          transition: 'color 0.2s',
        }}>
          {value.length} / {MAX_MESSAGE}
        </span>
      </div>

      <textarea
        value={value}
        onChange={e => onChange('message', e.target.value.slice(0, MAX_MESSAGE))}
        onBlur={() => { setFocused(false); onBlur('message', value) }}
        onFocus={() => setFocused(true)}
        placeholder="Tell me about your project, opportunity, or question..."
        rows={5}
        className="selectable"
        style={{
          width: '100%', resize: 'vertical', minHeight: 120, maxHeight: 280,
          fontFamily: 'var(--font-ui)', fontSize: 13, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.88)',
          background: focused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${error ? 'rgba(248,113,113,0.6)' : focused ? accent + '88' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 10,
          padding: '10px 14px',
          outline: 'none',
          transition: 'border-color 0.15s, background 0.15s',
          boxShadow: focused && !error ? `0 0 0 3px ${accent}18` : 'none',
        }}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}
          >
            <AlertCircle size={11} color="#f87171" strokeWidth={2} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#f87171' }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactForm({ onSuccess }) {
  const accent = useOSStore(s => s.accentColor)
  const userName = useOSStore(s => s.userName)

  const [values, setValues] = useState({ name: userName !== 'Developer' ? userName : '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleChange = useCallback((field, value) => {
    setValues(v => ({ ...v, [field]: value }))
    if (touched[field]) {
      setErrors(e => ({ ...e, [field]: validateField(field, value) }))
    }
  }, [touched])

  const handleBlur = useCallback((field, value) => {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(e => ({ ...e, [field]: validateField(field, value) }))
  }, [])

  const validateAll = () => {
    const newErrors = {}
    let valid = true
    Object.keys(values).forEach(field => {
      const err = validateField(field, values[field])
      if (err) { newErrors[field] = err; valid = false }
    })
    setErrors(newErrors)
    setTouched({ name: true, email: true, subject: true, message: true })
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) return
    setSubmitting(true)
    setSubmitError(null)
    const result = await submitContactForm(values)
    setSubmitting(false)
    if (result.success) {
      onSuccess(values)
    } else {
      setSubmitError(result.error)
    }
  }

  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
      {/* Name + Email row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField
          label="Name" name="name" value={values.name}
          onChange={handleChange} onBlur={handleBlur}
          error={touched.name ? errors.name : ''}
          placeholder="Alex Chen" required autoFocus
        />
        <FormField
          label="Email" name="email" type="email" value={values.email}
          onChange={handleChange} onBlur={handleBlur}
          error={touched.email ? errors.email : ''}
          placeholder="you@example.com" required
        />
      </div>

      {/* Subject */}
      <SubjectField
        value={values.subject}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.subject ? errors.subject : ''}
      />

      {/* Message */}
      <MessageField
        value={values.message}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.message ? errors.message : ''}
      />

      {/* Submit error */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.3)',
            }}
          >
            <AlertCircle size={14} color="#f87171" strokeWidth={2} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#f87171' }}>{submitError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <motion.button
        type="submit"
        whileHover={!submitting ? { scale: 1.02 } : {}}
        whileTap={!submitting ? { scale: 0.98 } : {}}
        disabled={submitting}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '13px 24px', borderRadius: 12,
          border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
          background: submitting ? 'rgba(99,102,241,0.4)' : `linear-gradient(135deg, ${accent}, ${accent}cc)`,
          color: '#fff',
          fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700,
          boxShadow: submitting ? 'none' : `0 4px 20px ${accent}44`,
          transition: 'background 0.2s, box-shadow 0.2s',
          letterSpacing: '0.01em',
        }}
      >
        {submitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={16} strokeWidth={2.5} />
            </motion.div>
            Sending...
          </>
        ) : (
          <>
            <Send size={16} strokeWidth={2.5} />
            Send Message
          </>
        )}
      </motion.button>

      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', lineHeight: 1.5 }}>
        By sending, you agree your message may be stored. No spam, ever.
        {!import.meta.env.VITE_FIREBASE_API_KEY && ' (Demo mode — messages are logged to console)'}
      </p>
    </form>
  )
}
