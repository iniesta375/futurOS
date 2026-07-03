import { useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BrowserTabBar   from './BrowserTabBar'
import BrowserToolbar  from './BrowserToolbar'
import BrowserHomePage from './BrowserHomePage'
import BrowserContent  from './BrowserContent'
import { resolveUrl, urlToTitle, DEFAULT_BOOKMARKS } from './browserData'

let tabIdCounter = 1
const newTab = (url = 'futuros://newtab') => ({
  id: `tab-${tabIdCounter++}`,
  url,
  title: urlToTitle(url),
  favicon: null,
  history: [url],
  historyIdx: 0,
  isLoading: false,
})

export default function Browser() {
  const [tabs, setTabs]             = useState([newTab()])
  const [activeTabId, setActiveTabId] = useState(tabs[0].id)
  const [bookmarks, setBookmarks]   = useState(DEFAULT_BOOKMARKS)

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0]

  // ── Tab mutations ────────────────────────────────────────────────────
  const updateTab = useCallback((id, patch) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
  }, [])

  const addTab = useCallback((url = 'futuros://newtab') => {
    const tab = newTab(url)
    setTabs(prev => [...prev, tab])
    setActiveTabId(tab.id)
    return tab.id
  }, [])

  const closeTab = useCallback((id) => {
    setTabs(prev => {
      if (prev.length === 1) return [newTab()]
      const next = prev.filter(t => t.id !== id)
      if (id === activeTabId) {
        const idx = Math.min(prev.findIndex(t => t.id === id), next.length - 1)
        setActiveTabId(next[idx]?.id || next[0]?.id)
      }
      return next
    })
  }, [activeTabId])

  // ── Navigation ───────────────────────────────────────────────────────
  const navigate = useCallback((url, tabId = activeTabId) => {
    const resolved = resolveUrl(url)
    setTabs(prev => prev.map(t => {
      if (t.id !== tabId) return t
      const newHist = [...t.history.slice(0, t.historyIdx + 1), resolved]
      return { ...t, url: resolved, title: urlToTitle(resolved), history: newHist, historyIdx: newHist.length - 1, isLoading: true }
    }))
  }, [activeTabId])

  const goBack = useCallback(() => {
    setTabs(prev => prev.map(t => {
      if (t.id !== activeTabId || t.historyIdx <= 0) return t
      const idx = t.historyIdx - 1
      return { ...t, historyIdx: idx, url: t.history[idx], title: urlToTitle(t.history[idx]), isLoading: true }
    }))
  }, [activeTabId])

  const goForward = useCallback(() => {
    setTabs(prev => prev.map(t => {
      if (t.id !== activeTabId || t.historyIdx >= t.history.length - 1) return t
      const idx = t.historyIdx + 1
      return { ...t, historyIdx: idx, url: t.history[idx], title: urlToTitle(t.history[idx]), isLoading: true }
    }))
  }, [activeTabId])

  const refresh = useCallback(() => {
    updateTab(activeTabId, { isLoading: true })
    // Force iframe reload by toggling key — handled in BrowserContent
    setTimeout(() => {}, 50)
  }, [activeTabId, updateTab])

  const goHome = useCallback(() => navigate('futuros://newtab'), [navigate])

  // ── Bookmarks ────────────────────────────────────────────────────────
  const isBookmarked = bookmarks.some(b => b.url === activeTab?.url)

  const toggleBookmark = useCallback(() => {
    const url = activeTab?.url
    if (!url || url === 'futuros://newtab') return
    setBookmarks(prev =>
      prev.some(b => b.url === url)
        ? prev.filter(b => b.url !== url)
        : [...prev, {
            id: `bm-${Date.now()}`,
            title: activeTab.title || urlToTitle(url),
            url,
            icon: '🔖',
            color: '#818cf8',
          }]
    )
  }, [activeTab])

  const isHome = activeTab?.url === 'futuros://newtab'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      background: '#080810',
      overflow: 'hidden',
      fontFamily: 'var(--font-ui)',
    }}>
      {/* Tab bar */}
      <BrowserTabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onActivate={setActiveTabId}
        onClose={closeTab}
        onNew={() => addTab()}
      />

      {/* Toolbar */}
      <BrowserToolbar
        url={activeTab?.url || ''}
        isLoading={activeTab?.isLoading || false}
        canGoBack={activeTab ? activeTab.historyIdx > 0 : false}
        canGoForward={activeTab ? activeTab.historyIdx < activeTab.history.length - 1 : false}
        isBookmarked={isBookmarked}
        onNavigate={navigate}
        onBack={goBack}
        onForward={goForward}
        onRefresh={refresh}
        onStop={() => updateTab(activeTabId, { isLoading: false })}
        onHome={goHome}
        onBookmark={toggleBookmark}
      />

      {/* Content area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <AnimatePresence mode="wait">
          {isHome ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', height: '100%' }}
            >
              <BrowserHomePage
                onNavigate={navigate}
                bookmarks={bookmarks}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTabId}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ width: '100%', height: '100%' }}
            >
              <BrowserContent
                url={activeTab?.url}
                onLoaded={() => updateTab(activeTabId, { isLoading: false })}
                onError={() => updateTab(activeTabId, { isLoading: false })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
