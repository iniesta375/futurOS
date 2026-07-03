/**
 * APP_REGISTRY — Central registry of all OS applications
 * Each entry defines metadata, default window config, and lazy import path
 */

export const APP_IDS = {
  ABOUT:      'about',
  PROJECTS:   'projects',
  TERMINAL:   'terminal',
  FILES:      'files',
  BROWSER:    'browser',
  SETTINGS:   'settings',
  CONTACT:    'contact',
}

export const APP_REGISTRY = {
  [APP_IDS.ABOUT]: {
    id: APP_IDS.ABOUT,
    title: 'About Me',
    icon: 'user-circle',
    description: 'Learn about the developer',
    defaultSize: { width: 860, height: 580 },
    minSize: { width: 600, height: 420 },
    accentColor: '#6366f1',
    category: 'personal',
    pinned: true,
    desktopIcon: true,
  },

  [APP_IDS.PROJECTS]: {
    id: APP_IDS.PROJECTS,
    title: 'Projects',
    icon: 'folder-open',
    description: 'Explore my work',
    defaultSize: { width: 1000, height: 640 },
    minSize: { width: 700, height: 460 },
    accentColor: '#22d3ee',
    category: 'work',
    pinned: true,
    desktopIcon: true,
  },

  [APP_IDS.TERMINAL]: {
    id: APP_IDS.TERMINAL,
    title: 'Terminal',
    icon: 'terminal',
    description: 'Skills & experience CLI',
    defaultSize: { width: 780, height: 500 },
    minSize: { width: 500, height: 320 },
    accentColor: '#34d399',
    category: 'tools',
    pinned: true,
    desktopIcon: true,
  },

  [APP_IDS.FILES]: {
    id: APP_IDS.FILES,
    title: 'File Explorer',
    icon: 'folder',
    description: 'Browse the file system',
    defaultSize: { width: 920, height: 580 },
    minSize: { width: 600, height: 400 },
    accentColor: '#fbbf24',
    category: 'system',
    pinned: true,
    desktopIcon: true,
  },

  [APP_IDS.BROWSER]: {
    id: APP_IDS.BROWSER,
    title: 'Browser',
    icon: 'globe',
    description: 'In-OS web browser',
    defaultSize: { width: 1100, height: 700 },
    minSize: { width: 700, height: 480 },
    accentColor: '#60a5fa',
    category: 'tools',
    pinned: false,
    desktopIcon: false,
  },

  [APP_IDS.SETTINGS]: {
    id: APP_IDS.SETTINGS,
    title: 'Settings',
    icon: 'settings',
    description: 'Customize your OS',
    defaultSize: { width: 860, height: 580 },
    minSize: { width: 600, height: 440 },
    accentColor: '#a78bfa',
    category: 'system',
    pinned: false,
    desktopIcon: false,
  },

  [APP_IDS.CONTACT]: {
    id: APP_IDS.CONTACT,
    title: 'Contact',
    icon: 'mail',
    description: 'Get in touch',
    defaultSize: { width: 720, height: 540 },
    minSize: { width: 500, height: 400 },
    accentColor: '#f87171',
    category: 'personal',
    pinned: true,
    desktopIcon: true,
  },
}

/** Apps shown in the taskbar pinned area */
export const PINNED_APPS = Object.values(APP_REGISTRY).filter(a => a.pinned)

/** Apps shown as desktop icons */
export const DESKTOP_APPS = Object.values(APP_REGISTRY).filter(a => a.desktopIcon)

export default APP_REGISTRY
