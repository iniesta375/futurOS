import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useFileSystemStore from '@stores/fileSystemStore'
import useOSStore from '@stores/osStore'
import FEToolbar    from './FEToolbar'
import FESidebar    from './FESidebar'
import FEBreadcrumb from './FEBreadcrumb'
import FEGridView   from './FEGridView'
import FEListView   from './FEListView'
import FEPreview    from './FEPreview'
import FEStatusBar  from './FEStatusBar'

export default function FileExplorer() {
  const {
    currentPath, viewMode, getSortedChildren, navigate,
    createFile, createDir, renameNode, deleteNode,
    selectPath, selectedPaths, clearSelection,
    copy, cut, clipboardItem,
  } = useFileSystemStore()

  const showContextMenu = useOSStore(s => s.showContextMenu)
  const hideContextMenu = useOSStore(s => s.hideContextMenu)

  const [searchQuery,  setSearchQuery]  = useState('')
  const [editingPath,  setEditingPath]  = useState(null)
  const [showPreview,  setShowPreview]  = useState(true)

  const allItems = getSortedChildren(currentPath)
  const items = searchQuery
    ? allItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allItems

  const handleOpen = useCallback((item) => {
    if (item.type === 'dir') {
      navigate(item.path)
      clearSelection()
    } else {
      selectPath(item.path, false)
      setShowPreview(true)
    }
  }, [navigate, selectPath, clearSelection])

  const handleRenameEnd = useCallback((path, newName) => {
    setEditingPath(null)
    const current = useFileSystemStore.getState().fs[path]
    if (newName && newName.trim() && newName !== current?.name) {
      renameNode(path, newName.trim())
    }
  }, [renameNode])

  const handleNewFile = useCallback(() => {
    const name = `untitled-${Date.now().toString(36)}.txt`
    const path = createFile(currentPath, name, '')
    setEditingPath(path)
    selectPath(path, false)
  }, [currentPath, createFile, selectPath])

  const handleNewFolder = useCallback(() => {
    const path = createDir(currentPath, 'New Folder')
    setEditingPath(path)
    selectPath(path, false)
  }, [currentPath, createDir, selectPath])

  const handleDelete = useCallback((path) => {
    deleteNode(path)
  }, [deleteNode])

  const handleContextMenu = useCallback((e, item) => {
    e.preventDefault()
    selectPath(item.path, false)
    const isDir = item.type === 'dir'
    showContextMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { label: isDir ? 'Open Folder' : 'Open File', icon: isDir ? 'folder-open' : 'file', action: () => handleOpen(item) },
        { divider: true },
        { label: 'Rename', icon: 'pencil', shortcut: 'F2', action: () => setEditingPath(item.path) },
        { label: 'Copy',   icon: 'copy',   shortcut: 'Ctrl+C', action: () => copy(item.path) },
        { label: 'Cut',    icon: 'scissors', shortcut: 'Ctrl+X', action: () => cut(item.path) },
        { divider: true },
        { label: 'Get Info', icon: 'info', action: () => { selectPath(item.path, false); setShowPreview(true) } },
        { divider: true },
        { label: 'Delete', icon: 'trash-2', danger: true, action: () => handleDelete(item.path) },
      ],
    })
  }, [showContextMenu, selectPath, handleOpen, copy, cut, handleDelete])

  const handleContentContextMenu = useCallback((e) => {
    e.preventDefault()
    clearSelection()
    showContextMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { label: 'New File',   icon: 'file-plus',  action: handleNewFile   },
        { label: 'New Folder', icon: 'folder-plus', action: handleNewFolder },
        { divider: true },
        { label: viewMode === 'grid' ? 'Switch to List' : 'Switch to Grid',
          icon: viewMode === 'grid' ? 'list' : 'grid-3x3',
          action: () => useFileSystemStore.getState().setViewMode(viewMode === 'grid' ? 'list' : 'grid') },
      ],
    })
  }, [showContextMenu, clearSelection, handleNewFile, handleNewFolder, viewMode])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      background: 'rgba(10, 10, 20, 0.95)',
      fontFamily: 'var(--font-ui)',
      overflow: 'hidden',
    }}>
      <FEToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <FESidebar />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <FEBreadcrumb />

          <div
            style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}
            onContextMenu={handleContentContextMenu}
            onClick={hideContextMenu}
          >
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div key={`grid-${currentPath}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ height: '100%' }}>
                  <FEGridView items={items} onOpen={handleOpen} onContextMenu={handleContextMenu} onRenameEnd={handleRenameEnd} editingPath={editingPath} />
                </motion.div>
              ) : (
                <motion.div key={`list-${currentPath}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <FEListView items={items} onOpen={handleOpen} onContextMenu={handleContextMenu} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <FEStatusBar itemCount={items.length} />
        </div>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden', flexShrink: 0 }}
            >
              <FEPreview onClose={() => setShowPreview(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
