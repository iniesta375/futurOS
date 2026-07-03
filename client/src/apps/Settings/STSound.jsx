import { Volume1, Volume2, VolumeX, Music } from 'lucide-react'
import useOSStore from '@stores/osStore'
import { SectionHeader, SettingCard, SettingRow, SettingSlider, Toggle, Divider } from './STShared'

function VolumeVisualizer({ volume }) {
  const bars = 20
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 40, padding: '4px 0' }}>
      {Array.from({ length: bars }, (_, i) => {
        const threshold = (i / bars) * 100
        const active = volume > threshold
        const h = 8 + (i / bars) * 32
        return (
          <div
            key={i}
            style={{
              width: 6, height: h,
              borderRadius: 3,
              background: active
                ? i > 16
                  ? '#f87171'
                  : i > 13
                    ? '#fbbf24'
                    : '#34d399'
                : 'rgba(255,255,255,0.08)',
              boxShadow: active ? `0 0 4px currentColor` : 'none',
              transition: 'background 0.1s',
              flexShrink: 0,
            }}
          />
        )
      })}
    </div>
  )
}

const VolumeIcon = ({ volume }) => {
  if (volume === 0) return <VolumeX size={16} color="rgba(255,255,255,0.4)" strokeWidth={1.75} />
  if (volume < 50)  return <Volume1  size={16} color="rgba(255,255,255,0.6)" strokeWidth={1.75} />
  return              <Volume2  size={16} color="rgba(255,255,255,0.8)" strokeWidth={1.75} />
}

export default function STSound() {
  const { volume, setVolume, accentColor } = useOSStore()

  return (
    <div className="selectable">
      <SectionHeader
        title="Sound"
        subtitle="Manage system volume and audio devices"
      />

      <Divider label="VOLUME" />

      {/* Visual level meter */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, marginBottom: 12,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VolumeIcon volume={volume} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>
              {volume}
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              / 100
            </span>
          </div>
          <VolumeVisualizer volume={volume} />
        </div>

        <SettingSlider value={volume} onChange={setVolume} min={0} max={100} accent={accentColor} />

        {/* Mute presets */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 25, 50, 75, 100].map(v => (
            <button
              key={v}
              onClick={() => setVolume(v)}
              style={{
                flex: 1, padding: '5px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
                background: volume === v ? accentColor : 'rgba(255,255,255,0.07)',
                color: volume === v ? '#fff' : 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {v === 0 ? '🔇' : `${v}%`}
            </button>
          ))}
        </div>
      </div>

      <Divider label="OUTPUT DEVICE" />
      <SettingCard>
        {[
          { name: 'Built-in Speakers',  active: true,  icon: '🔊' },
          { name: 'Bluetooth Headset',  active: false, icon: '🎧' },
          { name: 'HDMI Audio',         active: false, icon: '📺' },
        ].map((dev, i, arr) => (
          <SettingRow
            key={dev.name}
            label={`${dev.icon}  ${dev.name}`}
            noBorder={i === arr.length - 1}
          >
            {dev.active ? (
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: '#34d399', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', padding: '2px 8px', borderRadius: 10 }}>
                ACTIVE
              </span>
            ) : (
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                Not connected
              </span>
            )}
          </SettingRow>
        ))}
      </SettingCard>
    </div>
  )
}
