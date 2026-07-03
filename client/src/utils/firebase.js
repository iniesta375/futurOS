import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

/**
 * Firebase configuration
 * Replace with your actual Firebase project credentials
 * Use environment variables in production
 */
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || '',
}

// Initialize Firebase (guard for missing config in dev)
let app, auth, db, storage

try {
  if (firebaseConfig.apiKey) {
    app     = initializeApp(firebaseConfig)
    auth    = getAuth(app)
    db      = getFirestore(app)
    storage = getStorage(app)
  } else {
    console.warn('[FuturOS] Firebase config not found. Add VITE_FIREBASE_* env vars.')
  }
} catch (err) {
  console.error('[FuturOS] Firebase init error:', err)
}

export { auth, db, storage }
export default app
