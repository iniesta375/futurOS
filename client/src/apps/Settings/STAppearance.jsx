import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import useOSStore from '@stores/osStore'
import { WALLPAPERS, ACCENT_COLORS } from '@constants/os'
import { SectionHeader, SettingCard, SettingRow, Toggle, Divider } from './STShared'

function WallpaperSwatch({ wallpaper, isActive, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: '100%', aspectRatio: '16/9',
        borderRadius: 10, border: 'none', cursor: 'pointer',
        background: wallpaper.type === 'css' ? wallpaper.value : `url(${wallpaper.value})`,
        backgroundSize: 'cover',
        position: 'relative', overflow: 'hidden',
        boxShadow: isActive
          ? '0 0 0 3px rgba(99,102,241,0.8), 0 8px 24px rgba(0,0,0,0.5)'
          : '0 0 0 1px rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Noise overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: '128px',
      }} />

      {/* Name label */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 8px 8px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 500,
        color: 'rgba(255,255,255,0.9)', textAlign: 'center',
      }}>
        {wallpaper.name}
      </div>

      {/* Active checkmark */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 20, height: 20, borderRadius: '50%',
            background: '#6366f1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(99,102,241,0.6)',
          }}
        >
          <Check size={11} color="#fff" strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  )
}

function AccentDot({ color, name, isActive, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={name}
      style={{
        width: 28, height: 28, borderRadius: '50%',
        border: 'none', cursor: 'pointer',
        background: color,
        boxShadow: isActive
          ? `0 0 0 3px rgba(255,255,255,0.2), 0 0 0 5px ${color}88, 0 0 16px ${color}66`
          : `0 0 0 1px rgba(255,255,255,0.1), 0 2px 8px ${color}44`,
        transition: 'box-shadow 0.2s',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {isActive && (
        <Check
          size={13} strokeWidth={3} color="#fff"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        />
      )}
    </motion.button>
  )
}

export default function STAppearance() {
  const {
    wallpaper, setWallpaper,
    accentColor, setAccentColor,
    transparency, toggleTransparency,
    animationsEnabled, toggleAnimations,
    wallpaperBlur, toggleWallpaperBlur,
  } = useOSStore()

  return (
    <div className="selectable">
      <SectionHeader
        title="Appearance"
        subtitle="Customise the look and feel of FuturOS"
      />

      {/* Wallpaper */}
      <Divider label="WALLPAPER" />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 12, marginBottom: 20,
      }}>
        {WALLPAPERS.map(wp => (
          <WallpaperSwatch
            key={wp.id}
            wallpaper={wp}
            isActive={wallpaper === wp.id}
            onClick={() => setWallpaper(wp.id)}
          />
        ))}
      </div>

      {/* Accent color */}
      <Divider label="ACCENT COLOR" />
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12,
        padding: '4px 0 20px',
      }}>
        {ACCENT_COLORS.map(ac => (
          <AccentDot
            key={ac.id}
            color={ac.value}
            name={ac.name}
            isActive={accentColor === ac.value}
            onClick={() => setAccentColor(ac.value)}
          />
        ))}
        {/* Custom color picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label
            title="Custom color"
            style={{
              width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
              border: '2px dashed rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, lineHeight: 1,
              overflow: 'hidden', position: 'relative',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>+</span>
            <input
              type="color"
              value={accentColor}
              onChange={e => setAccentColor(e.target.value)}
              style={{
                position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer',
              }}
            />
          </label>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
            {accentColor}
          </span>
        </div>
      </div>

      {/* Effects toggles */}
      <Divider label="EFFECTS" />
      <SettingCard>
        <SettingRow
          label="Transparency & Blur"
          description="Glassmorphism effects on windows and taskbar. Disable for better performance."
        >
          <Toggle value={transparency} onChange={toggleTransparency} accent={accentColor} />
        </SettingRow>
        <SettingRow
          label="Desktop Animations"
          description="Window open/close, hover, and transition animations."
        >
          <Toggle value={animationsEnabled} onChange={toggleAnimations} accent={accentColor} />
        </SettingRow>
        <SettingRow
          label="Wallpaper Blur"
          description="Apply blur and darkening to the wallpaper layer."
          noBorder
        >
          <Toggle value={wallpaperBlur} onChange={toggleWallpaperBlur} accent={accentColor} />
        </SettingRow>
      </SettingCard>
    </div>
  )
}
