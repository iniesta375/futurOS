/**
 * contactService.js — Handles form submission.
 * Submits to Firestore if Firebase is configured,
 * otherwise falls back to console.log (demo mode).
 */

/**
 * Submit a contact form message.
 * @param {object} data - { name, email, subject, message }
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function submitContactForm(data) {
  // Validate
  if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
    return { success: false, error: 'All required fields must be filled.' }
  }

  const payload = {
    ...data,
    submittedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    referrer: window.location.href,
  }

  // If Firebase is configured, write to Firestore
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    try {
      const { db }          = await import('@utils/firebase')
      const { collection, addDoc } = await import('firebase/firestore')
      const docRef = await addDoc(collection(db, 'contacts'), payload)
      console.info('[Contact] Message submitted to Firestore:', docRef.id)
      return { success: true, id: docRef.id }
    } catch (err) {
      console.error('[Contact] Firestore write failed:', err)
      return { success: false, error: 'Failed to send. Please try emailing directly.' }
    }
  }

  // Demo mode — simulate network delay + log to console
  console.info('[Contact] Demo mode — Firebase not configured. Message received:', payload)
  await new Promise(r => setTimeout(r, 1200)) // simulate latency
  return { success: true, id: `demo-${Date.now()}` }
}

/**
 * Validate a single field.
 * Returns error string or empty string.
 */
export function validateField(name, value) {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Name is required'
      if (value.trim().length < 2) return 'Name must be at least 2 characters'
      return ''

    case 'email':
      if (!value.trim()) return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
      return ''

    case 'subject':
      if (!value.trim()) return 'Please select a subject'
      return ''

    case 'message':
      if (!value.trim()) return 'Message is required'
      if (value.trim().length < 20) return 'Message must be at least 20 characters'
      return ''

    default:
      return ''
  }
}
