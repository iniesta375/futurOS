

export { PROJECTS } from '@content/portfolio'

export const CATEGORIES = [
  { id: 'all',    label: 'All Projects' },
  { id: 'web',    label: 'Web App'      },
  { id: 'mobile', label: 'Mobile'       },
  { id: 'tool',   label: 'Dev Tool'     },
  { id: 'oss',    label: 'Open Source'  },
  { id: 'design', label: 'UI/UX'        },
]

export const STATUS_CONFIG = {
  live:     { label: 'Live',     color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  active:   { label: 'Active',   color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
  wip:      { label: 'WIP',      color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  private:  { label: 'Private',  color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  archived: { label: 'Archived', color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
}

// Derived: unique tech tags from all projects — used by filter component
import { PROJECTS as _P } from '@content/portfolio'
export const ALL_TECH_TAGS = [...new Set(_P.flatMap(p => p.tech))].sort()
