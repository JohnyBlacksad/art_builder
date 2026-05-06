import { useStore } from '../core/store'
import NodeRenderer from '../renderer/NodeRenderer'

const positionClasses: Record<string, string> = {
  center: 'items-center justify-center',
  top: 'items-start justify-center',
  bottom: 'items-end justify-center',
  left: 'items-center justify-start',
  right: 'items-center justify-end',
  'top-left': 'items-start justify-start',
  'top-right': 'items-start justify-end',
  'bottom-left': 'items-end justify-start',
  'bottom-right': 'items-end justify-end',
}

export default function PopupEditor() {
  const root = useStore((s) => s.root)
  const currentPopupId = useStore((s) => s.currentPopupId)
  const popups = useStore((s) => s.popups)
  const setCurrentPopup = useStore((s) => s.setCurrentPopup)
  const selectNode = useStore((s) => s.selectNode)

  const popup = popups.find((p) => p.id === currentPopupId)
  if (!popup) return null

  const s = popup.settings
  const posClass = positionClasses[s.position || 'center'] || positionClasses.center

  // Build style from settings
  const popupStyle: React.CSSProperties = {
    width: s.width || '500px',
    height: s.height || 'auto',
    maxWidth: s.maxWidth || '90vw',
    maxHeight: s.maxHeight || '80vh',
    borderRadius: popup.type === 'modal' ? '12px' : popup.type === 'bottom-sheet' ? '12px 12px 0 0' : popup.type === 'toast' ? '8px' : '0',
    overflow: 'auto',
  }

  // For drawers and bottom-sheet, add positioning
  if (popup.type === 'drawer-left') {
    popupStyle.position = 'absolute'
    popupStyle.left = 0
    popupStyle.top = 0
    popupStyle.height = '100%'
  } else if (popup.type === 'drawer-right') {
    popupStyle.position = 'absolute'
    popupStyle.right = 0
    popupStyle.top = 0
    popupStyle.height = '100%'
  } else if (popup.type === 'bottom-sheet') {
    popupStyle.position = 'absolute'
    popupStyle.bottom = 0
    popupStyle.left = 0
  } else if (popup.type === 'fullscreen') {
    popupStyle.width = '100%'
    popupStyle.height = '100%'
  } else if (popup.type === 'toast') {
    popupStyle.position = 'absolute'
    popupStyle.bottom = '16px'
    popupStyle.right = '16px'
    popupStyle.width = s.width || '380px'
  }

  return (
    <div className={`flex-1 overflow-auto flex ${posClass} p-8 relative bg-slate-950/90`}>
      {/* Close button */}
      <button
        onClick={() => {
          setCurrentPopup(null)
          selectNode(null)
        }}
        className="absolute top-4 right-4 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors z-10"
      >
        Close Editor
      </button>

      {/* Label */}
      <div className="absolute top-4 left-4 text-xs text-slate-500 z-10">
        Editing: <span className="text-purple-400 font-medium">{popup.name}</span>
        <span className="text-slate-600 ml-2">({popup.type})</span>
      </div>

      {/* Popup container */}
      <div
        className="bg-white shadow-2xl relative"
        style={popupStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <NodeRenderer node={root} />
      </div>
    </div>
  )
}
