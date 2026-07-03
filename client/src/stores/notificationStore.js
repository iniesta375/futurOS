/**
 * notificationStore.js — FuturOS Unified Notification Store
 *
 * Architecture:
 * - Single source of truth for ALL notification state
 * - Toast = ephemeral auto-dismiss, max 5 visible, LIFO stack
 * - Center entry = persistent, grouped by appId, max 50
 * - Every addNotification() produces BOTH a toast AND a center entry
 * - showToast() produces ONLY a toast (no center entry) for transient feedback
 * - Priority queue: error > warning > success > info > app
 * - Actions: optional { label, run } attached to notifications
 * - Pause: toasts pause auto-dismiss on hover
 *
 * Public API (call from anywhere via .getState()):
 *   notify({ type, title, message, appId, appIcon, action, duration, toastOnly })
 *   dismissToast(id)
 *   markRead(id)
 *   markAllRead()
 *   removeNotification(id)
 *   clearAll()
 *   toggleCenter() / closeCenter()
 */

import { create } from 'zustand'

// ── Type config ───────────────────────────────────────────────────────────
export const TYPE_CONFIG = {
  info:    { color: '#60a5fa', icon: 'info',           priority: 1 },
  success: { color: '#34d399', icon: 'check-circle-2', priority: 2 },
  warning: { color: '#fbbf24', icon: 'alert-triangle', priority: 3 },
  error:   { color: '#f87171', icon: 'x-circle',       priority: 4 },
  app:     { color: '#818cf8', icon: 'layout-grid',    priority: 0 },
  system:  { color: '#a78bfa', icon: 'cpu',            priority: 1 },
}

// ── ID generator ─────────────────────────────────────────────────────────
let _seq = 1
const uid = (prefix) => `${prefix}-${_seq++}-${Date.now().toString(36)}`

// ── Store ─────────────────────────────────────────────────────────────────
const useNotificationStore = create((set, get) => ({

  // ── Toasts ────────────────────────────────────────────────────────────
  toasts: [],       // max 5, LIFO, auto-removed after duration

  /**
   * Show a toast-only notification (no center entry).
   * Returns the toast id.
   */
  showToast: ({ title, message, type = 'info', duration = 4000, appIcon } = {}) => {
    const id = uid('toast')
    const toast = { id, title, message, type, duration, appIcon, createdAt: Date.now(), paused: false }

    set(s => ({
      toasts: [...s.toasts, toast].slice(-5),  // keep newest 5
    }))

    // Schedule auto-dismiss
    const schedule = () => {
      const timer = setTimeout(() => {
        // Check if still paused
        const current = get().toasts.find(t => t.id === id)
        if (current?.paused) {
          // Re-check after 500ms
          setTimeout(schedule, 500)
        } else {
          get().dismissToast(id)
        }
      }, duration)
      return timer
    }
    schedule()

    return id
  },

  dismissToast: (id) => {
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
  },

  pauseToast: (id) => {
    set(s => ({
      toasts: s.toasts.map(t => t.id === id ? { ...t, paused: true } : t),
    }))
  },

  resumeToast: (id) => {
    set(s => ({
      toasts: s.toasts.map(t => t.id === id ? { ...t, paused: false } : t),
    }))
  },

  // ── Notification Center ───────────────────────────────────────────────
  notifications: [],  // max 50, persistent until cleared
  centerOpen: false,

  /**
   * Primary API: creates a center entry AND a toast.
   * @param {object} opts
   *   type       - 'info' | 'success' | 'warning' | 'error' | 'app' | 'system'
   *   title      - required
   *   message    - optional body text
   *   appId      - which app sent it (for grouping)
   *   appIcon    - emoji or null (falls back to type icon)
   *   action     - { label: string, run: () => void } optional CTA
   *   duration   - toast duration ms (default 5000)
   *   toastOnly  - if true, skip center entry
   *   silent     - if true, skip toast (center entry only)
   */
  notify: ({
    type = 'info', title, message,
    appId, appIcon, action,
    duration = 5000, toastOnly = false, silent = false,
  } = {}) => {
    if (!title) return

    const id = uid('notif')
    const now = new Date()

    // Add to notification center (unless toastOnly)
    if (!toastOnly) {
      const entry = {
        id, type, title, message,
        appId: appId || 'system',
        appIcon, action,
        read: false,
        timestamp: now,
      }
      set(s => ({
        notifications: [entry, ...s.notifications].slice(0, 50),
      }))
    }

    // Show toast (unless silent)
    if (!silent) {
      get().showToast({ title, message, type, duration, appIcon })
    }

    return id
  },

  markRead: (id) => {
    set(s => ({
      notifications: s.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))
  },

  markAllRead: () => {
    set(s => ({
      notifications: s.notifications.map(n => ({ ...n, read: true })),
    }))
  },

  removeNotification: (id) => {
    set(s => ({
      notifications: s.notifications.filter(n => n.id !== id),
    }))
  },

  clearAll: () => set({ notifications: [] }),

  toggleCenter: () => set(s => ({ centerOpen: !s.centerOpen })),
  openCenter:   () => set({ centerOpen: true }),
  closeCenter:  () => set({ centerOpen: false }),

  // ── Computed helpers ──────────────────────────────────────────────────
  getUnreadCount: () =>
  get().notifications.filter(n => !n.read).length,
  get unreadCount() {
    return get().notifications.filter(n => !n.read).length
  },
}))


/**
 * Convenience shorthand for calling from outside React components.
 * Usage: notify({ type: 'success', title: 'Done!', message: 'File saved.' })
 */
export function notify(opts) {
  return useNotificationStore.getState().notify(opts)
}

export default useNotificationStore
