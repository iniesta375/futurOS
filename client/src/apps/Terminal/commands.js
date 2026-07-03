/**
 * commands.js — Terminal command registry.
 * Each handler: (args: string[], flags: Record<string,string>) => OutputNode[]
 */

import { PROFILE, SKILLS, EXPERIENCE, TECH_STACK, SOCIALS } from '@apps/AboutMe/aboutData'
import { PROJECTS } from '@apps/Projects/projectsData'
import {
  line, blank, divider, header, success, error, warn, info,
  dim, accent, cyan, link, bar, table,
} from './terminalNodes'

// ── ASCII Art ─────────────────────────────────────────────────────────────

const BANNER = [
  '  ███████╗██╗   ██╗████████╗██╗   ██╗██████╗  ██████╗ ███████╗',
  '  ██╔════╝██║   ██║╚══██╔══╝██║   ██║██╔══██╗██╔═══██╗██╔════╝',
  '  █████╗  ██║   ██║   ██║   ██║   ██║██████╔╝██║   ██║███████╗',
  '  ██╔══╝  ██║   ██║   ██║   ██║   ██║██╔══██╗██║   ██║╚════██║',
  '  ██║     ╚██████╔╝   ██║   ╚██████╔╝██║  ██║╚██████╔╝███████║',
  '  ╚═╝      ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝',
]

// ── Parse flags from args ─────────────────────────────────────────────────

function parseArgs(rawArgs) {
  const args = []
  const flags = {}
  for (const arg of rawArgs) {
    if (arg.startsWith('--')) {
      const [key, val] = arg.slice(2).split('=')
      flags[key] = val || true
    } else if (arg.startsWith('-') && arg.length > 1) {
      flags[arg.slice(1)] = true
    } else {
      args.push(arg)
    }
  }
  return { args, flags }
}

// ── Skill bar ASCII ───────────────────────────────────────────────────────

function skillBar(level, width = 28) {
  const filled = Math.round((level / 100) * width)
  const empty  = width - filled
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${level}%`
}

// ── Command handlers ──────────────────────────────────────────────────────

export const COMMANDS = {

  // ── help ──────────────────────────────────────────────────────────────
  help: () => [
    blank(),
    header('  FuturOS Terminal  ·  Command Reference', 'cyan'),
    dim('  ─────────────────────────────────────────────────────────'),
    blank(),
    ...([
      ['whoami',       'Developer profile & bio'],
      ['skills',       'Skill levels by category'],
      ['skills -cat',  'Filter: frontend / backend / devops / mobile'],
      ['projects',     'Portfolio project showcase'],
      ['experience',   'Career timeline'],
      ['stack',        'Full tech stack table'],
      ['contact',      'Social links & email'],
      ['neofetch',     'System info panel'],
      ['ls',           'List directory contents'],
      ['pwd',          'Print working directory'],
      ['cat <file>',   'Display file contents'],
      ['history',      'Command history'],
      ['clear',        'Clear terminal'],
      ['banner',       'Display ASCII logo'],
    ].map(([cmd, desc]) =>
      line(
        `  ${cmd.padEnd(22)} ${desc}`,
        { color: cmd.includes(' ') ? 'muted' : 'accent' }
      )
    )),
    blank(),
    dim('  Tip: Press ↑/↓ for history  ·  Tab for autocomplete  ·  Ctrl+C to cancel'),
    blank(),
  ],

  // ── banner ─────────────────────────────────────────────────────────────
  banner: () => [
    blank(),
    ...BANNER.map(l => line(l, { color: 'accent', bold: true })),
    blank(),
    line('  Developer Portfolio OS  ·  v1.0.0', { color: 'cyan' }),
    dim('  Type  help  to see available commands'),
    blank(),
  ],

  // ── whoami ─────────────────────────────────────────────────────────────
  whoami: () => [
    blank(),
    divider(),
    header(`  👤  ${PROFILE.name}`, 'accent'),
    line(`  ${PROFILE.title}`, { color: 'cyan' }),
    divider(),
    blank(),
    line('  LOCATION    ' + PROFILE.location, { color: 'secondary' }),
    line('  EMAIL       ' + PROFILE.email,    { color: 'secondary' }),
    line('  STATUS      ' + (PROFILE.available ? '🟢 Open to work' : '🔴 Not available'), { color: PROFILE.available ? 'success' : 'error' }),
    blank(),
    line('  BIO', { color: 'muted', bold: true }),
    blank(),
    ...PROFILE.bio.split('\n\n').map(para =>
      line('  ' + para.trim(), { color: 'secondary' })
    ),
    blank(),
    line('  STATS', { color: 'muted', bold: true }),
    blank(),
    ...PROFILE.stats.map(s =>
      line(`  ${s.label.padEnd(14)} ${s.value}`, { color: 'accent' })
    ),
    blank(),
  ],

  // ── skills ─────────────────────────────────────────────────────────────
  skills: (rawArgs) => {
    const { flags } = parseArgs(rawArgs)
    const catFilter = flags.cat || flags.c || null

    const categoriesToShow = catFilter
      ? SKILLS.filter(c => c.category.toLowerCase().includes(catFilter.toLowerCase()))
      : SKILLS

    if (catFilter && categoriesToShow.length === 0) {
      return [
        blank(),
        error(`No skill category matching "${catFilter}"`),
        info('Available: frontend, backend, devops, mobile'),
        blank(),
      ]
    }

    const nodes = [blank()]

    categoriesToShow.forEach(cat => {
      nodes.push(header(`  ◆  ${cat.category.toUpperCase()}`, 'accent'))
      nodes.push(divider('·', 50))
      cat.items.forEach(skill => {
        const barStr  = skillBar(skill.level)
        const nameStr = ('  ' + skill.name).padEnd(24)
        nodes.push(
          bar(nameStr, skill.level, cat.color)
        )
      })
      nodes.push(blank())
    })

    return nodes
  },

  // ── projects ───────────────────────────────────────────────────────────
  projects: (rawArgs) => {
    const { flags } = parseArgs(rawArgs)
    const showAll = flags.all || flags.a

    const list = showAll ? PROJECTS : PROJECTS.filter(p => p.featured)

    return [
      blank(),
      header('  📁  PROJECTS  ' + (showAll ? '' : '(featured)  ·  use --all for full list'), 'accent'),
      divider(),
      blank(),
      ...list.flatMap(p => [
        line(`  ${p.featured ? '★ ' : '  '}${p.title}`, { color: p.featured ? 'yellow' : 'primary', bold: p.featured }),
        line(`     ${p.subtitle}`, { color: 'muted' }),
        line(`     ${p.tech.slice(0, 4).join(' · ')}`, { color: 'cyan' }),
        line(`     ${p.year}  ·  ${p.role}  ·  ${p.status.toUpperCase()}`, { color: 'secondary' }),
        ...(p.stats.stars !== '—' ? [line(`     ⭐ ${p.stats.stars} stars  ·  ${p.stats.commits} commits`, { color: 'muted' })] : []),
        blank(),
      ]),
      dim('  Use  projects --all  to see all projects'),
      blank(),
    ]
  },

  // ── experience ─────────────────────────────────────────────────────────
  experience: () => [
    blank(),
    header('  🏢  EXPERIENCE', 'accent'),
    divider(),
    blank(),
    ...EXPERIENCE.flatMap((exp, i) => [
      line(`  ${exp.period}`, { color: 'muted', dim: true }),
      line(`  ${exp.role}  @  ${exp.company}`, { color: 'accent', bold: true }),
      line(`  [${exp.type}]`, { color: exp.type === 'Full-time' ? 'success' : exp.type === 'Education' ? 'yellow' : 'cyan' }),
      blank(),
      ...exp.bullets.map(b => line(`    › ${b}`, { color: 'secondary' })),
      ...(i < EXPERIENCE.length - 1 ? [blank(), dim('  ' + '─'.repeat(50)), blank()] : [blank()]),
    ]),
  ],

  // ── stack ──────────────────────────────────────────────────────────────
  stack: () => {
    const rows = TECH_STACK.map(t => [t.icon + ' ' + t.name, t.color])
    return [
      blank(),
      header('  ⚡  TECH STACK', 'accent'),
      divider(),
      blank(),
      table(
        ['#', 'Technology', 'Color'],
        TECH_STACK.map((t, i) => [`${i + 1}.`, t.icon + ' ' + t.name, t.color])
      ),
      blank(),
      dim(`  ${TECH_STACK.length} technologies in stack`),
      blank(),
    ]
  },

  // ── contact ────────────────────────────────────────────────────────────
  contact: () => [
    blank(),
    header('  📬  CONTACT', 'accent'),
    divider(),
    blank(),
    line(`  Email    ${PROFILE.email}`, { color: 'primary' }),
    line(`  Location ${PROFILE.location}`, { color: 'secondary' }),
    blank(),
    dim('  SOCIAL LINKS'),
    blank(),
    ...SOCIALS.map(s =>
      link(`  ${s.icon.toUpperCase().padEnd(10)} ${s.url}`, s.url)
    ),
    blank(),
    info(PROFILE.available
      ? "I'm currently open to new opportunities. Let's talk!"
      : 'Not actively looking, but always happy to chat.'),
    blank(),
  ],

  // ── neofetch ───────────────────────────────────────────────────────────
  neofetch: () => {
    const now = new Date()
    return [
      blank(),
      line('  ' + BANNER[0].slice(2, 30), { color: 'accent', bold: true }),
      line('  ' + BANNER[1].slice(2, 30), { color: 'accent', bold: true }),
      line('  ' + BANNER[2].slice(2, 30), { color: 'accent', bold: true }),
      blank(),
      line(`  ${PROFILE.name} @ futuros`, { color: 'accent', bold: true }),
      dim('  ─────────────────────────────────'),
      line(`  OS          FuturOS v1.0 Portfolio Edition`, { color: 'primary' }),
      line(`  Host        ${window.location.hostname}`, { color: 'primary' }),
      line(`  Shell       futuros-sh 1.0.0`, { color: 'primary' }),
      line(`  Resolution  ${window.innerWidth}x${window.innerHeight}`, { color: 'primary' }),
      line(`  Uptime      ${Math.floor(performance.now() / 1000)}s`, { color: 'primary' }),
      line(`  Date        ${now.toDateString()}`, { color: 'primary' }),
      line(`  Time        ${now.toLocaleTimeString()}`, { color: 'primary' }),
      blank(),
      line('  Theme', { color: 'muted' }),
      line('  ██████████  ██████████  ██████████  ██████████', {
        color: 'primary',
        bold: true,
      }),
      line('  Indigo      Cyan        Violet      Emerald', { color: 'muted' }),
      blank(),
    ]
  },

  // ── ls / pwd / cat ────────────────────────────────────────────────────
  ls: (rawArgs) => {
    const fsMap = {
      '~':        ['Desktop/', 'Documents/', 'Projects/', 'Downloads/', '.bashrc', '.zshrc'],
      'Desktop':  ['readme.md', 'shortcuts.json'],
      'Documents':['resume.pdf', 'cover-letter.md', 'Notes/'],
      'Projects': ['FuturOS/', 'DataFlow/', 'SwiftCart/', 'cli-toolkit/'],
    }
    const dir = rawArgs[0] || '~'
    const entries = fsMap[dir] || fsMap['~']
    return [
      blank(),
      line(`  total ${entries.length}`, { color: 'muted' }),
      ...entries.map(e =>
        e.endsWith('/')
          ? line(`  📁  ${e}`, { color: 'cyan' })
          : line(`  📄  ${e}`, { color: 'secondary' })
      ),
      blank(),
    ]
  },

  pwd: () => [
    line('  /home/developer/portfolio', { color: 'success' }),
  ],

  cat: (rawArgs) => {
    const file = rawArgs[0]
    const files = {
      '.bashrc': [
        line('  # FuturOS shell configuration', { color: 'muted' }),
        line('  export EDITOR="code"', { color: 'success' }),
        line('  export TERM="xterm-256color"', { color: 'success' }),
        line('  alias ll="ls -la"', { color: 'accent' }),
        line('  alias gs="git status"', { color: 'accent' }),
        line('  alias gp="git push"', { color: 'accent' }),
      ],
      '.zshrc': [
        line('  # FuturOS zsh config', { color: 'muted' }),
        line('  source ~/.oh-my-zsh/oh-my-zsh.sh', { color: 'success' }),
        line('  ZSH_THEME="spaceship"', { color: 'accent' }),
      ],
      'readme.md': [
        line('  # FuturOS Portfolio', { color: 'accent', bold: true }),
        blank(),
        line('  A web-based OS developer portfolio.', { color: 'secondary' }),
        line('  Built with React + Framer Motion + Zustand.', { color: 'secondary' }),
      ],
    }
    if (!file) return [error('Usage: cat <filename>')]
    if (!files[file]) return [error(`cat: ${file}: No such file or directory`)]
    return [blank(), ...files[file], blank()]
  },

  // ── history ───────────────────────────────────────────────────────────
  history: (_args, _flags, historyList = []) => [
    blank(),
    ...historyList.map((cmd, i) =>
      line(`  ${String(i + 1).padStart(4)}  ${cmd}`, {
        color: i === historyList.length - 1 ? 'accent' : 'muted',
      })
    ),
    blank(),
  ],

  // ── Easter eggs ───────────────────────────────────────────────────────
  sudo: () => [
    blank(),
    error('Nice try. This is a portfolio, not a real OS.'),
    dim('  But between us, the password is "hire-me"'),
    blank(),
  ],

  'rm': (rawArgs) => {
    if (rawArgs.includes('-rf') || rawArgs.includes('-r')) {
      return [
        blank(),
        warn('Initiating filesystem wipe...'),
        line('  rm: cannot remove filesystem: Permission denied', { color: 'error' }),
        blank(),
        dim('  (Protected by FuturOS kernel security module)'),
        blank(),
        success('Phew. Your files are safe. This is just a portfolio 😄'),
        blank(),
      ]
    }
    return [error(`rm: missing operand`)]
  },

  vim: () => [
    blank(),
    accent('  Opening vim...'),
    blank(),
    line('  ~', { color: 'muted' }),
    line('  ~', { color: 'muted' }),
    line('  ~', { color: 'muted' }),
    line('  ~  ', { color: 'muted' }),
    line('  -- INSERT --', { color: 'success' }),
    blank(),
    dim('  (Type :q! to exit vim. Good luck.)'),
    dim('  (Just kidding — I use VS Code like a normal person)'),
    blank(),
  ],

  hack: () => [
    blank(),
    accent('  Initiating hack sequence...'),
    line('  [▓▓▓▓▓▓▓▓░░░░░░░░░░░░] 43% — Bypassing firewall', { color: 'cyan' }),
    line('  ACCESS DENIED', { color: 'error', bold: true }),
    blank(),
    dim('  (Just use the Contact app if you want to reach me 😄)'),
    blank(),
  ],

  'git blame': () => [
    blank(),
    line('  ^7d3f0a1 (Alex Chen 2025-01-01) Everything', { color: 'muted' }),
    line('  ^7d3f0a1 (Alex Chen 2025-01-02) Still everything', { color: 'muted' }),
    line('  ^7d3f0a1 (Alex Chen 2025-05-01) It was me all along', { color: 'accent' }),
    blank(),
  ],

  coffee: () => [
    blank(),
    line('       ) ', { color: 'yellow' }),
    line('      ( ', { color: 'yellow' }),
    line('    .-\'-.', { color: 'yellow' }),
    line('   | === |   ☕ Brewing...', { color: 'yellow' }),
    line("   '-----'"),
    blank(),
    success('  Coffee brewed successfully. Let\'s build something great.'),
    blank(),
  ],

  clear: () => [],  // Handled specially in Terminal.jsx

  echo: (rawArgs) => [
    line('  ' + rawArgs.join(' '), { color: 'primary' }),
  ],

  date: () => [
    line('  ' + new Date().toString(), { color: 'cyan' }),
  ],

  exit: () => [
    blank(),
    dim('  Closing terminal... (use the window X button)'),
    blank(),
  ],
}

// ── Command lookup (supports partial + aliases) ───────────────────────────

const ALIASES = {
  '?': 'help',
  'man': 'help',
  'info': 'whoami',
  'me': 'whoami',
  'skill': 'skills',
  'proj': 'projects',
  'exp': 'experience',
  'tech': 'stack',
  'social': 'contact',
  'fetch': 'neofetch',
}

export function resolveCommand(input) {
  const trimmed = input.trim()
  if (!trimmed) return null

  // Split on first space for command name
  const [name, ...rawArgs] = trimmed.split(/\s+/)
  const lower = name.toLowerCase()

  // Check aliases
  const aliased = ALIASES[lower]
  if (aliased) return { handler: COMMANDS[aliased], rawArgs, name: aliased }

  // Exact match
  if (COMMANDS[lower]) return { handler: COMMANDS[lower], rawArgs, name: lower }

  // Partial match (tab-complete feel)
  const partial = Object.keys(COMMANDS).find(k => k.startsWith(lower))
  if (partial) return { handler: COMMANDS[partial], rawArgs, name: partial }

  return null
}

export function getCompletions(partial) {
  const lower = partial.toLowerCase()
  return Object.keys(COMMANDS).filter(k => k.startsWith(lower))
}

export const COMMAND_NAMES = Object.keys(COMMANDS)
