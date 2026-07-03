import useFileSystemStore from '@stores/fileSystemStore'

export default function FEStatusBar({ itemCount }) {
  const selectedPaths = useFileSystemStore(s => s.selectedPaths)
  const currentPath   = useFileSystemStore(s => s.currentPath)

  return (
    <div style={{
      height: 26, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(8,8,18,0.7)',
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: 11,
        color: 'rgba(255,255,255,0.35)',
      }}>
        {selectedPaths.length > 0
          ? `${selectedPaths.length} item${selectedPaths.length > 1 ? 's' : ''} selected`
          : `${itemCount} item${itemCount !== 1 ? 's' : ''}`
        }
      </span>

      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'rgba(255,255,255,0.22)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        maxWidth: 320,
      }}>
        {currentPath}
      </span>
    </div>
  )
}
