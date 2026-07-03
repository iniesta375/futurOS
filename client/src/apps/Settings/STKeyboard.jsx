import { Keyboard } from 'lucide-react'
import { SectionHeader, Divider } from './STShared'

const SHORTCUTS = [
  {
    category: 'Windows',
    shortcuts: [
      { keys: ['Ctrl', 'W'],       action: 'Close focused window'        },
      { keys: ['Ctrl', 'H'],       action: 'Minimize focused window'     },
      { keys: ['Ctrl', 'K'],       action: 'Open global search'          },
      { keys: ['Ctrl', '`'],       action: 'Open Terminal'               },
      { keys: ['Ctrl', 'L'],       action: 'Clear terminal'              },
      { keys: ['Esc'],             action: 'Close start menu / overlays' },
    ],
  },
  {
    category: 'Terminal',
    shortcuts: [
      { keys: ['↑'],               action: 'Previous command in history' },
      { keys: ['↓'],               action: 'Next command in history'     },
      { keys: ['Tab'],             action: 'Autocomplete command'        },
      { keys: ['Ctrl', 'C'],       action: 'Cancel / clear input'        },
      { keys: ['Ctrl', 'L'],       action: 'Clear screen'               },
    ],
  },
  {
    category: 'File Explorer',
    shortcuts: [
      { keys: ['↑', '↓'],         action: 'Navigate files'             },
      { keys: ['Enter'],           action: 'Open selected file/folder'  },
      { keys: ['Backspace'],       action: 'Go up one directory'        },
      { keys: ['Ctrl', 'C'],       action: 'Copy selected item'         },
      { keys: ['F2'],              action: 'Rename selected item'        },
    ],
  },
  {
    category: 'Browser',
    shortcuts: [
      { keys: ['Ctrl', 'T'],       action: 'New tab'                    },
      { keys: ['Ctrl', 'W'],       action: 'Close tab'                  },
      { keys: ['Alt', '←'],        action: 'Back'                       },
      { keys: ['Alt', '→'],        action: 'Forward'                    },
      { keys: ['Ctrl', 'R'],       action: 'Refresh'                    },
      { keys: ['Ctrl', 'L'],       action: 'Focus address bar'          },
    ],
  },
]

function Kbd({ keys }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'flex-end' }}>
      {keys.map((k, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <kbd style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            color: 'rgba(255,255,255,0.75)',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
            borderRadius: 5, padding: '2px 7px',
            display: 'inline-block',
          }}>
            {k}
          </kbd>
          {i < keys.length - 1 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>+</span>
          )}
        </span>
      ))}
    </div>
  )
}

export default function STKeyboard() {
  return (
    <div className="selectable">
      <SectionHeader
        title="Keyboard Shortcuts"
        subtitle="All available keyboard shortcuts across FuturOS"
      />

      {SHORTCUTS.map(group => (
        <div key={group.category} style={{ marginBottom: 16 }}>
          <Divider label={group.category.toUpperCase()} />
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            {group.shortcuts.map(({ keys, action }, i, arr) => (
              <div
                key={action}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>
                  {action}
                </span>
                <Kbd keys={keys} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Tip */}
      <div style={{
        marginTop: 8, padding: '12px 16px', borderRadius: 10,
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.2)',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <Keyboard size={14} color="#818cf8" strokeWidth={1.75} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
          Most shortcuts work globally. The Terminal has its own context that takes priority — use Ctrl+W to close the window only when not typing.
        </span>
      </div>
    </div>
  )
}
