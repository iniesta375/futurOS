/**
 * actionsRegistry.js — FuturOS Actions Registry
 *
 * Architecture:
 * - Every executable OS action is a plain object with: id, label, icon,
 *   category, keywords, shortcut, run(), when?()
 * - `executeAction(id)` is the single execution path for ALL OS actions
 * - The registry feeds: GlobalSearch index, keyboard shortcuts,
 *   context menus, and taskbar buttons
 * - Uses static imports (no require()) — circular deps are avoided by
 *   calling .getState() at call time, not at module evaluation time
 */

import useOSStore      from '@stores/osStore'
import useWindowStore  from '@stores/windowStore'
import APP_REGISTRY    from '@constants/appRegistry'
import { IDENTITY }    from '@content/portfolio'
import { Analytics }   from '@utils/analytics'

// ── Lazy store accessors ──────────────────────────────────────────────────
// Called at action execution time, not at module load time
const os  = () => useOSStore.getState()
const win = () => useWindowStore.getState()

// ── App launcher helper ───────────────────────────────────────────────────
function launchApp(appId) {
  const app = APP_REGISTRY[appId]
  if (!app) return
  win().openWindow(appId, {
    title:       app.title,
    defaultSize: app.defaultSize,
    minSize:     app.minSize,
  })
}

// ── Action definitions ────────────────────────────────────────────────────

export const ACTIONS = {

  // ── App launchers ─────────────────────────────────────────────────────
  'app.about': {
    id: 'app.about', label: 'About Me', subtitle: 'Developer profile, skills & bio',
    icon: 'user-circle', category: 'Apps',
    keywords: ['about', 'profile', 'bio', 'developer', 'resume'],
    run: () => launchApp('about'),
  },
  'app.projects': {
    id: 'app.projects', label: 'Projects', subtitle: 'Portfolio project showcase',
    icon: 'folder-open', category: 'Apps',
    keywords: ['projects', 'work', 'portfolio', 'showcase', 'apps'],
    run: () => launchApp('projects'),
  },
  'app.terminal': {
    id: 'app.terminal', label: 'Terminal', subtitle: 'Interactive skills & commands CLI',
    icon: 'terminal', category: 'Apps',
    keywords: ['terminal', 'shell', 'cli', 'skills', 'commands'],
    shortcut: 'Ctrl+`',
    run: () => launchApp('terminal'),
  },
  'app.files': {
    id: 'app.files', label: 'File Explorer', subtitle: 'Browse the virtual file system',
    icon: 'folder', category: 'Apps',
    keywords: ['files', 'explorer', 'filesystem', 'browse', 'documents'],
    run: () => launchApp('files'),
  },
  'app.browser': {
    id: 'app.browser', label: 'Browser', subtitle: 'In-OS web browser with bookmarks',
    icon: 'globe', category: 'Apps',
    keywords: ['browser', 'web', 'internet', 'surf', 'navigate'],
    run: () => launchApp('browser'),
  },
  'app.settings': {
    id: 'app.settings', label: 'Settings', subtitle: 'Customize appearance, sound & profile',
    icon: 'settings', category: 'Apps',
    keywords: ['settings', 'preferences', 'config', 'customize', 'options'],
    run: () => launchApp('settings'),
  },
  'app.contact': {
    id: 'app.contact', label: 'Contact', subtitle: 'Send a message or find social links',
    icon: 'mail', category: 'Apps',
    keywords: ['contact', 'email', 'message', 'reach', 'hire'],
    run: () => launchApp('contact'),
  },

  // ── Window management ──────────────────────────────────────────────────
  'window.close': {
    id: 'window.close', label: 'Close Window', subtitle: 'Close the focused window',
    icon: 'x-circle', category: 'Windows',
    keywords: ['close', 'quit', 'exit', 'dismiss'],
    shortcut: 'Ctrl+W',
    run: () => {
      const { activeWindowId, closeWindow } = win()
      if (activeWindowId) closeWindow(activeWindowId)
    },
  },
  'window.minimize': {
    id: 'window.minimize', label: 'Minimize Window', subtitle: 'Send the window to the taskbar',
    icon: 'minus', category: 'Windows',
    keywords: ['minimize', 'hide', 'taskbar', 'collapse'],
    shortcut: 'Ctrl+H',
    run: () => {
      const { activeWindowId, minimizeWindow } = win()
      if (activeWindowId) minimizeWindow(activeWindowId)
    },
  },
  'window.minimize-all': {
    id: 'window.minimize-all', label: 'Minimize All Windows', subtitle: 'Show the desktop',
    icon: 'layout-dashboard', category: 'Windows',
    keywords: ['minimize all', 'show desktop', 'hide all', 'clear'],
    shortcut: 'Ctrl+M',
    run: () => win().minimizeAll(),
  },

  // ── OS overlays & navigation ───────────────────────────────────────────
  'os.search': {
    id: 'os.search', label: 'Command Palette', subtitle: 'Search apps, commands & files',
    icon: 'search', category: 'System',
    keywords: ['search', 'palette', 'find', 'spotlight', 'command', 'launcher'],
    shortcut: 'Ctrl+K',
    run: () => os().toggleSearch(),
  },
  'os.start-menu': {
    id: 'os.start-menu', label: 'Start Menu', subtitle: 'Open the app launcher grid',
    icon: 'grid-3x3', category: 'System',
    keywords: ['start', 'launcher', 'apps', 'menu', 'grid'],
    run: () => os().toggleStartMenu(),
  },
  'os.shortcuts': {
    id: 'os.shortcuts', label: 'Keyboard Shortcuts', subtitle: 'View all OS keyboard shortcuts',
    icon: 'keyboard', category: 'System',
    keywords: ['shortcuts', 'keyboard', 'hotkeys', 'help', 'bindings'],
    shortcut: 'Ctrl+/',
    run: () => os().toggleKeyboardOverlay(),
  },
  'os.notifications': {
    id: 'os.notifications', label: 'Notification Center', subtitle: 'View all notifications',
    icon: 'bell', category: 'System',
    keywords: ['notifications', 'alerts', 'messages', 'inbox'],
    run: () => os().toggleNotifCenter(),
  },

  // ── Appearance ─────────────────────────────────────────────────────────
  'appearance.wallpaper': {
    id: 'appearance.wallpaper', label: 'Change Wallpaper', subtitle: 'Choose a desktop background',
    icon: 'image', category: 'Appearance',
    keywords: ['wallpaper', 'background', 'desktop image', 'theme'],
    run: () => launchApp('settings'),
  },
  'appearance.accent': {
    id: 'appearance.accent', label: 'Accent Color', subtitle: 'Change system highlight color',
    icon: 'palette', category: 'Appearance',
    keywords: ['color', 'accent', 'theme', 'tint', 'highlight', 'indigo'],
    run: () => launchApp('settings'),
  },
  'appearance.fullscreen': {
    id: 'appearance.fullscreen', label: 'Toggle Fullscreen', subtitle: 'Enter or exit fullscreen mode',
    icon: 'maximize', category: 'Appearance',
    keywords: ['fullscreen', 'maximize', 'immersive', 'f11'],
    shortcut: 'F11',
    run: () => {
      if (document.fullscreenElement) document.exitFullscreen()
      else document.documentElement.requestFullscreen().catch(() => {})
    },
  },

  // ── Account ────────────────────────────────────────────────────────────
  'account.logout': {
    id: 'account.logout', label: 'Sign Out', subtitle: 'Return to the login screen',
    icon: 'log-out', category: 'Account',
    keywords: ['sign out', 'logout', 'lock', 'switch user', 'leave'],
    run: () => os().logout(),
  },
  'system.reload': {
    id: 'system.reload', label: 'Reload FuturOS', subtitle: 'Restart the OS session',
    icon: 'refresh-cw', category: 'System',
    keywords: ['reload', 'restart', 'refresh', 'reset', 'reboot'],
    run: () => window.location.reload(),
  },

  // ── Terminal quick-launch ──────────────────────────────────────────────
  'terminal.whoami': {
    id: 'terminal.whoami', label: 'Run: whoami', subtitle: 'Show developer profile in terminal',
    icon: 'terminal', category: 'Terminal',
    keywords: ['whoami', 'profile', 'about', 'identity', 'terminal'],
    run: () => launchApp('terminal'),
  },
  'terminal.skills': {
    id: 'terminal.skills', label: 'Run: skills', subtitle: 'Show animated skill bars in terminal',
    icon: 'terminal', category: 'Terminal',
    keywords: ['skills', 'abilities', 'expertise', 'level', 'terminal'],
    run: () => launchApp('terminal'),
  },
  'terminal.projects': {
    id: 'terminal.projects', label: 'Run: projects', subtitle: 'List portfolio projects in terminal',
    icon: 'terminal', category: 'Terminal',
    keywords: ['projects', 'work', 'portfolio', 'list', 'terminal'],
    run: () => launchApp('terminal'),
  },
  'terminal.neofetch': {
    id: 'terminal.neofetch', label: 'Run: neofetch', subtitle: 'System info ASCII panel',
    icon: 'terminal', category: 'Terminal',
    keywords: ['neofetch', 'sysinfo', 'system', 'ascii', 'terminal'],
    run: () => launchApp('terminal'),
  },
  'terminal.experience': {
    id: 'terminal.experience', label: 'Run: experience', subtitle: 'Show career timeline in terminal',
    icon: 'terminal', category: 'Terminal',
    keywords: ['experience', 'career', 'jobs', 'history', 'terminal'],
    run: () => launchApp('terminal'),
  },
  'terminal.contact': {
    id: 'terminal.contact', label: 'Run: contact', subtitle: 'Show contact links in terminal',
    icon: 'terminal', category: 'Terminal',
    keywords: ['contact', 'email', 'social', 'links', 'terminal'],
    run: () => launchApp('terminal'),
  },

  // ── Resume ────────────────────────────────────────────────────────────
  'resume.download': {
    id:       'resume.download',
    label:    'Download Resume',
    subtitle: `Download ${IDENTITY.name}'s PDF resume`,
    icon:     'download',
    category: 'Quick Access',
    keywords: ['resume', 'cv', 'download', 'pdf', 'hire', 'curriculum'],
    shortcut: 'Ctrl+Shift+D',
    run: () => {
      Analytics.resumeDownload()
      const a = document.createElement('a')
      a.href     = IDENTITY.resumeUrl
      a.download = `${IDENTITY.name.replace(/\s+/g, '-')}-Resume.pdf`
      a.target   = '_blank'
      a.rel      = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
  },

  // ── Recruiter tour ────────────────────────────────────────────────────
  'recruiter.tour': {
    id:       'recruiter.tour',
    label:    'Recruiter Tour',
    subtitle: 'Open About Me, Projects & Terminal',
    icon:     'sparkles',
    category: 'Quick Access',
    keywords: ['tour', 'recruiter', 'intro', 'start', 'welcome', 'guide'],
    shortcut: 'Ctrl+Shift+R',
    run: () => {
      import('@hooks/useRecruiterMode').then(m => m.openRecruiterApps?.())
    },
  },
}

// ── Exports ───────────────────────────────────────────────────────────────

/** Flat array for search indexing */
export const ACTION_LIST = Object.values(ACTIONS)

/**
 * Execute an action by id.
 * Single execution path used by keyboard shortcuts, command palette, context menus.
 */
export function executeAction(id) {
  const action = ACTIONS[id]
  if (!action) {
    console.warn(`[FuturOS Actions] Unknown action: "${id}"`)
    return
  }
  try {
    action.run()
  } catch (err) {
    console.error(`[FuturOS Actions] Error executing "${id}":`, err)
  }
}

export default ACTIONS
