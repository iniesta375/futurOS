import { create } from 'zustand'

const NOW = new Date().toISOString().split('T')[0]

const initialFS = {
  '/': { type: 'dir', name: 'Root', children: ['Desktop', 'Documents', 'Projects', 'Downloads', 'Pictures', 'Music'], modified: NOW },
  '/Desktop': { type: 'dir', name: 'Desktop', children: ['readme.md', 'shortcuts.json'], modified: NOW },
  '/Desktop/readme.md': { type: 'file', name: 'readme.md', ext: 'md', size: '1 KB', modified: NOW, content: '# Welcome to FuturOS 👋\n\nThis is a developer portfolio built as a fully functional web-based operating system.\n\n## Features\n- Drag & resize windows\n- Virtual file system\n- Terminal emulator\n- Projects explorer\n- And much more!\n\n> Built with React, Vite, Tailwind CSS v4, Framer Motion & Zustand' },
  '/Desktop/shortcuts.json': { type: 'file', name: 'shortcuts.json', ext: 'json', size: '0.5 KB', modified: NOW, content: '{\n  "terminal": "Ctrl+`",\n  "search": "Ctrl+K",\n  "close": "Ctrl+W",\n  "minimize": "Ctrl+H"\n}' },
  '/Documents': { type: 'dir', name: 'Documents', children: ['resume.pdf', 'cover-letter.md', 'Notes', 'Code Snippets'], modified: NOW },
  '/Documents/resume.pdf': { type: 'file', name: 'resume.pdf', ext: 'pdf', size: '142 KB', modified: '2025-03-01', content: null },
  '/Documents/cover-letter.md': { type: 'file', name: 'cover-letter.md', ext: 'md', size: '3 KB', modified: '2025-03-10', content: '# Cover Letter\n\nDear Hiring Manager,\n\nI am a passionate full-stack developer with expertise in React, Node.js, and cloud infrastructure.\n\nMy recent work includes:\n- **FuturOS** — A web-based OS portfolio (React + Framer Motion)\n- **DataFlow** — Real-time analytics dashboard (Next.js + D3)\n- **SwiftCart** — E-commerce platform (React Native + Stripe)\n\nI would love to bring my skills to your team.\n\nBest regards,\nDeveloper' },
  '/Documents/Notes': { type: 'dir', name: 'Notes', children: ['ideas.md', 'todo.md', 'learning.md'], modified: NOW },
  '/Documents/Notes/ideas.md': { type: 'file', name: 'ideas.md', ext: 'md', size: '1 KB', modified: NOW, content: '# Project Ideas 💡\n\n## In Progress\n- [ ] FuturOS portfolio OS\n- [ ] AI-powered code reviewer\n\n## Backlog\n- [ ] P2P encrypted chat app\n- [ ] Browser-based IDE\n- [ ] WebGL particle engine\n\n## Done\n- [x] Personal portfolio v1\n- [x] Open source CLI tool' },
  '/Documents/Notes/todo.md': { type: 'file', name: 'todo.md', ext: 'md', size: '1 KB', modified: NOW, content: '# Todo 📋\n\n## This Week\n- [x] Setup Vite + React + Tailwind v4\n- [x] Build window management system\n- [x] Boot sequence animations\n- [x] File explorer app\n- [ ] Terminal emulator\n- [ ] About Me app\n\n## This Month\n- [ ] Deploy to Vercel\n- [ ] Add Firebase auth' },
  '/Documents/Notes/learning.md': { type: 'file', name: 'learning.md', ext: 'md', size: '2 KB', modified: '2025-04-20', content: '# Learning Log 📚\n\n## 2025\n\n### Q2\n- **Rust** — Ownership, borrowing, lifetimes\n- **WebGPU** — Compute shaders\n- **Framer Motion** — Advanced animations\n\n### Q1\n- **React Server Components** — Deep dive\n- **Tailwind v4** — CSS-first config\n- **Zustand** — State management patterns' },
  '/Documents/Code Snippets': { type: 'dir', name: 'Code Snippets', children: ['debounce.js', 'useLocalStorage.ts', 'animations.css'], modified: NOW },
  '/Documents/Code Snippets/debounce.js': { type: 'file', name: 'debounce.js', ext: 'js', size: '0.4 KB', modified: '2025-02-15', content: 'export function debounce(fn, wait = 300) {\n  let timer\n  return function (...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn.apply(this, args), wait)\n  }\n}' },
  '/Documents/Code Snippets/useLocalStorage.ts': { type: 'file', name: 'useLocalStorage.ts', ext: 'ts', size: '0.8 KB', modified: '2025-03-20', content: "import { useState, useEffect } from 'react'\n\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  const [value, setValue] = useState<T>(() => {\n    try {\n      const item = window.localStorage.getItem(key)\n      return item ? JSON.parse(item) : initialValue\n    } catch { return initialValue }\n  })\n\n  useEffect(() => {\n    window.localStorage.setItem(key, JSON.stringify(value))\n  }, [key, value])\n\n  return [value, setValue] as const\n}" },
  '/Documents/Code Snippets/animations.css': { type: 'file', name: 'animations.css', ext: 'css', size: '0.6 KB', modified: '2025-04-01', content: '@keyframes slideUp {\n  from { opacity: 0; transform: translateY(16px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes glowPulse {\n  0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.4); }\n  50%       { box-shadow: 0 0 24px rgba(99,102,241,0.8); }\n}\n\n.enter { animation: slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1); }' },
  '/Projects': { type: 'dir', name: 'Projects', children: ['FuturOS', 'DataFlow', 'SwiftCart', 'OpenSource'], modified: NOW },
  '/Projects/FuturOS': { type: 'dir', name: 'FuturOS', children: ['README.md', 'package.json'], modified: NOW },
  '/Projects/FuturOS/README.md': { type: 'file', name: 'README.md', ext: 'md', size: '2 KB', modified: NOW, content: '# FuturOS 🖥️\n\nA futuristic web-based operating system portfolio.\n\n## Tech Stack\n- **React 18** + Vite\n- **Tailwind CSS v4**\n- **Framer Motion**\n- **Zustand**\n\n```bash\nnpm install\nnpm run dev\n```' },
  '/Projects/FuturOS/package.json': { type: 'file', name: 'package.json', ext: 'json', size: '1.2 KB', modified: NOW, content: '{\n  "name": "futuros",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.3.1",\n    "framer-motion": "^11.2.10",\n    "zustand": "^4.5.2"\n  }\n}' },
  '/Projects/DataFlow': { type: 'dir', name: 'DataFlow', children: ['README.md'], modified: '2025-02-10' },
  '/Projects/DataFlow/README.md': { type: 'file', name: 'README.md', ext: 'md', size: '1 KB', modified: '2025-02-10', content: '# DataFlow 📊\n\nReal-time analytics dashboard.\n\n## Stack\n- Next.js 14, TypeScript\n- D3.js, Recharts\n- WebSocket, Redis\n- PostgreSQL' },
  '/Projects/SwiftCart': { type: 'dir', name: 'SwiftCart', children: ['README.md'], modified: '2025-01-15' },
  '/Projects/SwiftCart/README.md': { type: 'file', name: 'README.md', ext: 'md', size: '1 KB', modified: '2025-01-15', content: '# SwiftCart 🛒\n\nCross-platform e-commerce mobile app.\n\n## Stack\n- React Native + Expo\n- Stripe payments\n- Firebase\n- Redux Toolkit' },
  '/Projects/OpenSource': { type: 'dir', name: 'OpenSource', children: ['cli-toolkit', 'react-hooks-lib'], modified: '2025-03-01' },
  '/Projects/OpenSource/cli-toolkit': { type: 'dir', name: 'cli-toolkit', children: ['README.md'], modified: '2025-03-01' },
  '/Projects/OpenSource/cli-toolkit/README.md': { type: 'file', name: 'README.md', ext: 'md', size: '0.8 KB', modified: '2025-03-01', content: '# CLI Toolkit ⚡\n\nNode.js CLI utilities for developer productivity.\n\n```bash\nnpm install -g @dev/cli-toolkit\n```' },
  '/Projects/OpenSource/react-hooks-lib': { type: 'dir', name: 'react-hooks-lib', children: ['README.md'], modified: '2025-02-20' },
  '/Projects/OpenSource/react-hooks-lib/README.md': { type: 'file', name: 'README.md', ext: 'md', size: '0.8 KB', modified: '2025-02-20', content: '# React Hooks Library 🪝\n\nProduction-ready React hooks collection.\n\n### Included\n- `useDebounce`\n- `useIntersection`\n- `useMediaQuery`\n- `useLocalStorage`\n- `useWebSocket`' },
  '/Downloads': { type: 'dir', name: 'Downloads', children: ['vscode-setup.zip', 'design-assets.zip'], modified: NOW },
  '/Downloads/vscode-setup.zip': { type: 'file', name: 'vscode-setup.zip', ext: 'zip', size: '2.4 MB', modified: '2025-04-10', content: null },
  '/Downloads/design-assets.zip': { type: 'file', name: 'design-assets.zip', ext: 'zip', size: '18 MB', modified: '2025-03-28', content: null },
  '/Pictures': { type: 'dir', name: 'Pictures', children: ['screenshots', 'wallpapers'], modified: NOW },
  '/Pictures/screenshots': { type: 'dir', name: 'screenshots', children: [], modified: NOW },
  '/Pictures/wallpapers':  { type: 'dir', name: 'wallpapers',  children: [], modified: NOW },
  '/Music': { type: 'dir', name: 'Music', children: [], modified: NOW },
}

const useFileSystemStore = create((set, get) => ({
  fs: initialFS,
  currentPath: '/Desktop',
  history: ['/Desktop'],
  historyIndex: 0,
  selectedPaths: [],
  viewMode: 'grid',
  sortBy: 'name',
  sortDir: 'asc',
  clipboardItem: null,

  navigate: (path) => {
    const { history, historyIndex } = get()
    const newHistory = [...history.slice(0, historyIndex + 1), path]
    set({ currentPath: path, history: newHistory, historyIndex: newHistory.length - 1, selectedPaths: [] })
  },
  goBack: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) set({ historyIndex: historyIndex - 1, currentPath: history[historyIndex - 1], selectedPaths: [] })
  },
  goForward: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) set({ historyIndex: historyIndex + 1, currentPath: history[historyIndex + 1], selectedPaths: [] })
  },
  goUp: () => {
    const { currentPath } = get()
    if (currentPath === '/') return
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    get().navigate(parts.length === 0 ? '/' : '/' + parts.join('/'))
  },
  canGoBack:    () => get().historyIndex > 0,
  canGoForward: () => get().historyIndex < get().history.length - 1,

  selectPath: (path, multi = false) => set(s => ({
    selectedPaths: multi
      ? s.selectedPaths.includes(path) ? s.selectedPaths.filter(p => p !== path) : [...s.selectedPaths, path]
      : [path],
  })),
  clearSelection: () => set({ selectedPaths: [] }),

  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (by) => set(s => ({
    sortBy: by,
    sortDir: s.sortBy === by && s.sortDir === 'asc' ? 'desc' : 'asc',
  })),

  getNode: (path) => get().fs[path],
  getChildren: (path) => {
    const node = get().fs[path]
    if (!node || node.type !== 'dir') return []
    return (node.children || []).map(child => {
      const childPath = path === '/' ? `/${child}` : `${path}/${child}`
      const n = get().fs[childPath]
      return n ? { path: childPath, ...n } : null
    }).filter(Boolean)
  },
  getSortedChildren: (path) => {
    const children = get().getChildren(path)
    const { sortBy, sortDir } = get()
    const dirs  = children.filter(c => c.type === 'dir')
    const files = children.filter(c => c.type === 'file')
    const sort = (arr) => [...arr].sort((a, b) => {
      let cmp = 0
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortBy === 'date') cmp = (a.modified || '').localeCompare(b.modified || '')
      else if (sortBy === 'type') cmp = (a.ext || '').localeCompare(b.ext || '')
      return sortDir === 'asc' ? cmp : -cmp
    })
    return [...sort(dirs), ...sort(files)]
  },

  createFile: (parentPath, name, content = '') => {
    const ext = name.includes('.') ? name.split('.').pop() : ''
    const filePath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`
    set(state => ({
      fs: {
        ...state.fs,
        [filePath]: { type: 'file', name, ext, size: '0 KB', content, modified: new Date().toISOString().split('T')[0] },
        [parentPath]: { ...state.fs[parentPath], children: [...(state.fs[parentPath]?.children || []), name] },
      },
    }))
    return filePath
  },
  createDir: (parentPath, name) => {
    const dirPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`
    set(state => ({
      fs: {
        ...state.fs,
        [dirPath]: { type: 'dir', name, children: [], modified: new Date().toISOString().split('T')[0] },
        [parentPath]: { ...state.fs[parentPath], children: [...(state.fs[parentPath]?.children || []), name] },
      },
    }))
    return dirPath
  },
  renameNode: (path, newName) => {
    const parts = path.split('/')
    const oldName = parts[parts.length - 1]
    const parentPath = parts.slice(0, -1).join('/') || '/'
    const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`
    set(state => {
      const node = { ...state.fs[path], name: newName }
      const newFS = { ...state.fs }
      delete newFS[path]
      newFS[newPath] = node
      newFS[parentPath] = { ...newFS[parentPath], children: newFS[parentPath].children.map(c => c === oldName ? newName : c) }
      return { fs: newFS }
    })
  },
  deleteNode: (path) => {
    const parts = path.split('/')
    const name = parts[parts.length - 1]
    const parentPath = parts.slice(0, -1).join('/') || '/'
    set(state => {
      const newFS = { ...state.fs }
      const deleteRecursive = (p) => {
        const n = newFS[p]
        if (n?.type === 'dir') (n.children || []).forEach(child => deleteRecursive(p === '/' ? `/${child}` : `${p}/${child}`))
        delete newFS[p]
      }
      deleteRecursive(path)
      newFS[parentPath] = { ...newFS[parentPath], children: (newFS[parentPath]?.children || []).filter(c => c !== name) }
      return { fs: newFS, selectedPaths: [] }
    })
  },
  updateFileContent: (path, content) => set(state => ({
    fs: { ...state.fs, [path]: { ...state.fs[path], content, modified: new Date().toISOString().split('T')[0] } },
  })),
  copy: (path) => set({ clipboardItem: { action: 'copy', path } }),
  cut:  (path) => set({ clipboardItem: { action: 'cut',  path } }),
}))

export default useFileSystemStore
