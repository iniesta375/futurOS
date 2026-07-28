export const IDENTITY = {
  name:         'Ajayi Inioluwa Dorcas',

  title:        'Full-Stack Developer & UI Engineer',

  /** 1–4 rotating taglines shown in the About Me hero */
  taglines: [
    'Building products people love',
    'React · Node.js · Cloud Native',
    'Open source contributor',
    'Performance obsessed',
  ],

  /**
   * 2–3 paragraph bio.
   * Write in first person. Be specific — mention the types of problems you
   * solve, teams you've worked with, or your engineering philosophy.
   */
  bio: `Replace this with your real bio. Mention your specialisation,
years of experience, what kinds of problems you enjoy solving, and
what makes your work distinctive.

A second paragraph can describe your current focus — what you're
building, learning, or excited about right now.`,

  location:     'Ogbomosho, Nigeria',

  email:        'ajayiinioluwa2007@gmail.com',

  
  available:    true,

  /**
   * First initial of your name — shown in the avatar circle.
   * If you have a real avatar photo, see AVATAR_URL below.
   */
  avatarInitial: 'A',

  /**
   * Optional: URL to a square headshot (ideally 256×256px or larger).
   * Leave null to use the initials avatar.
   * Example: 'https://avatars.githubusercontent.com/u/YOURID?v=4'
   */
  avatarUrl:    null,

  /**
   * URL to your resume PDF.
   *
   * Options:
   *   A) Drop resume.pdf in public/ → use '/resume.pdf'
   *   B) Dropbox share link         → use the direct download URL
   *   C) Google Drive               → use the direct download URL
   *      (File → Share → Copy link, change ?usp=sharing → ?export=download)
   *
   * This URL is used in: About Me sidebar, Command Palette, Terminal `resume`
   * command, File Explorer download action, and the analytics tracker.
   */
  resumeUrl:    '/resume.pdf',

  stats: [
    { label: 'Years Exp.',   value: '2+' },
    { label: 'Projects',     value: '20+' },
    { label: 'OSS Stars',    value: '—' },
    { label: 'Coffee / day', value: '3' },
  ],
}



export const SOCIALS = [
  {
    label: 'GitHub',
    icon:  'github',
    url:   'https://github.com/iniesta375',
    color: '#ffffff',
  },
  {
    label: 'LinkedIn',
    icon:  'linkedin',
    url:   'https://linkedin.com/in/ajayi-inioluwa',
    color: '#0a66c2',
  },
  {
    label: 'Twitter / X',
    icon:  'twitter',
    url:   'https://x.com/Iniesta37506',
    color: '#1da1f2',
  },
  // Optional entries — uncomment to activate:
  // { label: 'Blog',       icon: 'globe',   url: 'https://yourblog.com', color: '#22d3ee' },
  // { label: 'Dribbble',   icon: 'dribbble',url: 'https://dribbble.com/yourhandle', color: '#ea4c89' },
  // { label: 'YouTube',    icon: 'youtube', url: 'https://youtube.com/@yourchannel', color: '#ff0000' },
  {
    label: 'Email',
    icon:  'mail',
    url:   `mailto:${IDENTITY.email}`,
    color: '#f87171',
  },
]

// ── Skills ────────────────────────────────────────────────────────────────────
// Level is 0–100. Be honest — skill bars that are all 90+ look inflated.
// Remove categories that don't apply to you.

export const SKILLS = [
  {
    category: 'Frontend',
    color: '#61dafb',
    items: [
      { name: 'React / Next.js',   level: 90 },
      { name: 'TypeScript',        level: 85 },
      { name: 'CSS / Tailwind',    level: 88 },
      { name: 'Framer Motion',     level: 75 },
    ],
  },
  {
    category: 'Backend',
    color: '#34d399',
    items: [
      { name: 'Node.js / Express', level: 82 },
      { name: 'MongoDB',           level: 72 },
      { name: 'Redis',             level: 65 },
    ],
  },
  {
    category: 'DevOps & Cloud',
    color: '#f59e0b',
    items: [
      { name: 'AWS / GCP',         level: 70 },
      { name: 'Docker',            level: 75 },
      { name: 'CI/CD',             level: 80 },
    ],
  },
  // Uncomment if relevant:
  // {
  //   category: 'Mobile',
  //   color: '#8b5cf6',
  //   items: [
  //     { name: 'React Native', level: 70 },
  //     { name: 'Expo',         level: 72 },
  //   ],
  // },
]

export const TECH_STACK = [
  { name: 'React',       color: '#61dafb', icon: '⚛' },
  { name: 'TypeScript',  color: '#3178c6', icon: 'TS' },
  { name: 'Next.js',     color: '#ffffff', icon: '▲' },
  { name: 'Vite',        color: '#646cff', icon: '⚡' },
  { name: 'Node.js',     color: '#68a063', icon: '⬢' },
  { name: 'PostgreSQL',  color: '#336791', icon: '🐘' },
  { name: 'Docker',      color: '#2496ed', icon: '🐳' },
  { name: 'Tailwind',    color: '#38bdf8', icon: '💨' },
  { name: 'Figma',       color: '#f24e1e', icon: '◈' },
  { name: 'Framer',      color: '#bb4ad8', icon: '✦' },
  // Add more as needed
]

// ── Experience ────────────────────────────────────────────────────────────────
// List most recent first. Use real company names.
//
// For bullets: be specific and quantified where possible.
// "Improved performance" → "Reduced bundle size by 40%, improving LCP by 1.2s"
// No metrics? Still be specific: "Rebuilt checkout flow; reduced drop-off rate"
//
// Education goes at the bottom with type: 'Education'

export const EXPERIENCE = [
  {
    role:    'Your Most Recent Role',
    company: 'Company Name',
    period:  '2023 – Present',
    type:    'Full-time',
    color:   '#6366f1',
    bullets: [
      'Describe a concrete impact you had — ideally with a number',
      'Another specific achievement or responsibility',
      'Something that shows your seniority or breadth',
    ],
  },
  {
    role:    'Previous Role',
    company: 'Previous Company',
    period:  '2021 – 2023',
    type:    'Full-time',
    color:   '#22d3ee',
    bullets: [
      'What you built, shipped, or improved',
      'Team impact or collaboration',
      'Technical decision you led or contributed to',
    ],
  },
  // Add more roles as needed...
  {
    role:    'B.Sc. Computer Science',
    company: 'Ladoke Akintola University of Technology',
    period:  '2023 – 2027',
    type:    'Education',
    color:   '#fbbf24',
    bullets: [
      'B.S. / M.S. / etc. in Your Field',
      'Notable achievement, GPA if strong, or relevant coursework',
    ],
  },
]

// ── Open Source ───────────────────────────────────────────────────────────────
// Projects where you're the author or a notable contributor.
// Set url to '#' if the repo is private or not yet public.
// Set stars to null to hide the star count entirely.

export const OPEN_SOURCE = [
  {
    name:   'your-project-name',
    desc:   'One sentence describing what this does and why it matters.',
    stars:  null,          // real star count, or null to hide
    lang:   'JavaScript',
    color:  '#3178c6',
    url:    'https://github.com/yourusername/your-project',
  },
  // Add more or remove this section if you have no OSS work
]

// ── Projects ──────────────────────────────────────────────────────────────────
// PROJECT CREDIBILITY RULES:
//
//   ✅ DO:
//     - Link to real GitHub repos (even private ones can have a landing page)
//     - Only include stats that can be verified by visiting the link
//     - Mark status: 'private' if the code is closed-source; no shame in that
//     - Use 'wip' for in-progress work
//     - Be specific in descriptions: what problem, what solution, what outcome
//
//   ❌ DON'T:
//     - Make up user counts, star counts, or performance numbers
//     - List "example.com" as a live link
//     - Include projects you didn't build in a meaningful way
//     - Claim "50k events/sec" without a reference to prove it
//
// FuturOS is safe to keep as-is — the recruiter is looking at it right now.

export const PROJECTS = [
  {
    id:       'futuros',
    title:    'FuturOS',
    subtitle: 'Web-based OS Developer Portfolio',
    description: `A fully functional web-based operating system built as a developer portfolio.
Features drag-and-resize windows, a virtual file system, terminal emulator, boot
sequence, and glassmorphism UI — all running in the browser.

This is the app you're currently exploring. Every window, animation, and interaction
is custom-built with React, Framer Motion, and Zustand.`,
    category: 'web',
    featured: true,
    status:   'live',
    year:     '2025',
    role:     'Solo · Full-Stack',
    accent:   '#6366f1',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #0f0f1a 100%)',
    tech:     ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Firebase'],
    stats:    { commits: '200+' },  // only include stats you can verify
    links: {
      github: 'https://github.com/yourusername/futuros',  // ← replace
      live:   'https://yourdomain.com',                   // ← replace
    },
    highlights: [
      'Drag-resize window system with 8-zone snap layout',
      'BIOS-style boot sequence with particle animation',
      'Virtual file system with full CRUD operations',
      'Glass effect system driven by CSS custom properties',
      'Context menus, system tray, start menu, notifications',
    ],
  },

  
  {
    id:       'project-two',
    title:    'Project Title',
    subtitle: 'One-line description of what it does',
    description: `Describe the problem this solves, what you built, and the outcome.
Be specific. Avoid vague phrases like "modern" or "scalable" without context.

Second paragraph: tech decisions, interesting challenges, or business impact.`,
    category: 'web',           // web | mobile | tool | oss | design
    featured: true,
    status:   'live',          // live | active | wip | private | archived
    year:     '2024',
    role:     'Lead Developer', // Your specific contribution
    accent:   '#22d3ee',
    gradient: 'linear-gradient(135deg, #0c1a2e 0%, #0a1628 100%)',
    tech:     ['Next.js', 'TypeScript', 'PostgreSQL'],
    stats:    {},               // only real verifiable stats, or leave empty {}
    links: {
      github: 'https://github.com/yourusername/project',  // or null if private
      live:   'https://yourproject.com',                  // or null if no live URL
    },
    highlights: [
      'Concrete feature or decision you made',
      'Technical challenge you solved',
      'Something demonstrating your depth',
    ],
  },
]

// ── Metadata (used in index.html + manifest) ──────────────────────────────────
// Update these to match your real domain and identity.

export const SITE_META = {
  /** Your actual deployed domain — no trailing slash */
  domain:       'https://yourdomain.com',

  /** Used in OG title: "[siteName] — Developer Portfolio" */
  siteName:     'YourName.dev',

  /** Twitter/X handle including the @ */
  twitterHandle: '@yourhandle',

  /** Path to your OG share image (1200×630px), relative to domain */
  ogImage:      '/og-image.png',
}
