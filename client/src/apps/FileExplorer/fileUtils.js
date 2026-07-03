/**
 * File Explorer utilities — icons, colors, MIME detection, preview helpers
 */

// Extension → Lucide icon name
export const getFileIcon = (ext) => {
  const map = {
    // Code
    js: 'file-code',  jsx: 'file-code', ts: 'file-code', tsx: 'file-code',
    py: 'file-code',  rs: 'file-code',  go: 'file-code', java: 'file-code',
    cpp: 'file-code', c: 'file-code',   rb: 'file-code', php: 'file-code',
    // Markup / config
    html: 'file-code', css: 'file-code', scss: 'file-code',
    json: 'braces',    xml: 'file-code', yaml: 'settings', toml: 'settings',
    env: 'settings',   sh: 'terminal',   bash: 'terminal',
    // Docs
    md: 'file-text',   txt: 'file-text', pdf: 'file-text',
    doc: 'file-text',  docx: 'file-text',
    // Media
    png: 'image',  jpg: 'image',  jpeg: 'image', gif: 'image',
    svg: 'image',  webp: 'image',
    mp4: 'video',  mov: 'video',  avi: 'video',
    mp3: 'music',  wav: 'music',  flac: 'music',
    // Archives
    zip: 'archive', tar: 'archive', gz: 'archive', rar: 'archive',
    // Data
    csv: 'table-2', sql: 'database', db: 'database',
  }
  return map[ext?.toLowerCase()] || 'file'
}

// Extension → accent color
export const getFileColor = (ext) => {
  const map = {
    js:   '#f7df1e', jsx: '#61dafb', ts:  '#3178c6', tsx: '#61dafb',
    py:   '#3572a5', rs: '#dea584',  go:  '#00add8', java: '#b07219',
    html: '#e34c26', css: '#563d7c', scss: '#cc6699',
    json: '#cbcb41', md:  '#6b9fff', txt: '#94a3b8',
    pdf:  '#f40f02', png: '#22d3ee', jpg: '#22d3ee', svg: '#f97316',
    mp4:  '#8b5cf6', mp3: '#ec4899', zip: '#6b7280',
    csv:  '#34d399', sql: '#60a5fa', sh:  '#34d399',
  }
  return map[ext?.toLowerCase()] || '#6b7280'
}

// Detect if a file's content can be shown as code/text
export const isTextFile = (ext) => {
  const textExts = new Set([
    'js','jsx','ts','tsx','py','rs','go','java','cpp','c','rb','php',
    'html','css','scss','json','xml','yaml','toml','env','sh','bash',
    'md','txt','csv','sql','svg',
  ])
  return textExts.has(ext?.toLowerCase())
}

// Get the language for syntax-theme coloring
export const getLang = (ext) => {
  const map = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', rs: 'rust', go: 'go', java: 'java', cpp: 'cpp',
    html: 'html', css: 'css', json: 'json', md: 'markdown',
    sh: 'bash', bash: 'bash', yaml: 'yaml', toml: 'toml',
  }
  return map[ext?.toLowerCase()] || 'text'
}

// Sidebar pinned locations
export const PINNED_LOCATIONS = [
  { label: 'Desktop',   path: '/Desktop',   icon: 'monitor' },
  { label: 'Documents', path: '/Documents', icon: 'file-text' },
  { label: 'Projects',  path: '/Projects',  icon: 'folder-git-2' },
  { label: 'Downloads', path: '/Downloads', icon: 'download' },
  { label: 'Pictures',  path: '/Pictures',  icon: 'image' },
  { label: 'Music',     path: '/Music',     icon: 'music' },
]

// Format bytes string → display string
export const fmtSize = (s) => s || '—'

// Build breadcrumb segments from a path string
export const getBreadcrumbs = (path) => {
  if (path === '/') return [{ label: 'Root', path: '/' }]
  const parts = path.split('/').filter(Boolean)
  const crumbs = [{ label: 'Root', path: '/' }]
  let current = ''
  for (const part of parts) {
    current += '/' + part
    crumbs.push({ label: part, path: current })
  }
  return crumbs
}
