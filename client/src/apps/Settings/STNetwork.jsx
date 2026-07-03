import { Wifi, WifiOff, Bluetooth, Shield, Globe } from 'lucide-react'
import useOSStore from '@stores/osStore'
import { SectionHeader, SettingCard, SettingRow, Toggle, Divider } from './STShared'

export default function STNetwork() {
  const { wifi, toggleWifi, bluetooth, toggleBluetooth, accentColor } = useOSStore()

  return (
    <div className="selectable">
      <SectionHeader
        title="Network"
        subtitle="Manage wireless connections and network settings"
      />

      <Divider label="WIRELESS" />
      <SettingCard>
        <SettingRow
          label="Wi-Fi"
          description={wifi ? 'Connected to FuturNet_5G' : 'Disconnected'}
        >
          <Toggle value={wifi} onChange={toggleWifi} accent="#22d3ee" />
        </SettingRow>
        <SettingRow
          label="Bluetooth"
          description={bluetooth ? 'On — discoverable' : 'Off'}
          noBorder
        >
          <Toggle value={bluetooth} onChange={toggleBluetooth} accent="#818cf8" />
        </SettingRow>
      </SettingCard>

      {wifi && (
        <>
          <Divider label="CURRENT NETWORK" />
          <SettingCard>
            {[
              { label: 'Network',      value: 'FuturNet_5G',   icon: Wifi   },
              { label: 'IP Address',   value: '192.168.1.42',  icon: Globe  },
              { label: 'Security',     value: 'WPA3 Personal', icon: Shield },
              { label: 'Signal',       value: '████████░░ 82%', icon: null  },
            ].map(({ label, value, icon: Icon }, i, arr) => (
              <SettingRow
                key={label}
                label={label}
                noBorder={i === arr.length - 1}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {Icon && <Icon size={13} strokeWidth={1.75} color={accentColor} />}
                  {value}
                </span>
              </SettingRow>
            ))}
          </SettingCard>

          <Divider label="AVAILABLE NETWORKS" />
          <SettingCard>
            {[
              { ssid: 'FuturNet_5G',    strength: 92, secure: true,  active: true  },
              { ssid: 'CoffeeShop_WiFi', strength: 65, secure: false, active: false },
              { ssid: 'Neighbor_Home',  strength: 41, secure: true,  active: false },
            ].map((net, i, arr) => (
              <SettingRow key={net.ssid} label={net.ssid} noBorder={i === arr.length - 1}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                    {net.strength}%
                  </span>
                  {!net.secure && <span style={{ fontSize: 10, color: '#fbbf24' }}>⚠ Open</span>}
                  {net.active ? (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: '#34d399', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', padding: '1px 7px', borderRadius: 99 }}>
                      Connected
                    </span>
                  ) : (
                    <button style={{
                      fontFamily: 'var(--font-ui)', fontSize: 11,
                      color: 'rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 7, padding: '2px 10px', cursor: 'pointer',
                    }}>
                      Join
                    </button>
                  )}
                </div>
              </SettingRow>
            ))}
          </SettingCard>
        </>
      )}
    </div>
  )
}
