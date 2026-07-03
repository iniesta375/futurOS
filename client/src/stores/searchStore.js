/**
 * searchStore.js — FuturOS Search History Store
 *
 * Persists the last N searches to localStorage so the command palette
 * can show "Recent" items before the user starts typing.
 *
 * Each recent item is a full SearchResult object (from searchEngine.js)
 * so we can render it with its icon, color, and type badge.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENTS = 6

const useSearchStore = create(
  persist(
    (set, get) => ({
      recents: [],   // SearchResult[] — most recent first

      /** Add a result to the front of recents, deduplicating by id */
      addRecent: (item) => {
        if (!item?.id || !item?.title) return
        set(state => {
          const filtered = state.recents.filter(r => r.id !== item.id)
          return {
            recents: [
              {
                id:       item.id,
                title:    item.title,
                subtitle: item.subtitle,
                icon:     item.icon,
                type:     item.type,
                accent:   item.accent,
                shortcut: item.shortcut,
                appId:    item.appId,
                actionId: item.actionId,
              },
              ...filtered,
            ].slice(0, MAX_RECENTS),
          }
        })
      },

      /** Remove a single item from recents by id */
      removeRecent: (id) => set(state => ({
        recents: state.recents.filter(r => r.id !== id),
      })),

      /** Clear all recent searches */
      clearRecents: () => set({ recents: [] }),
    }),
    {
      name: 'futuros-search-history',
      // Only persist the recents array — not functions
      partialize: state => ({ recents: state.recents }),
    }
  )
)

export default useSearchStore
