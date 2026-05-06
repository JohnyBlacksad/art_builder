import { useState } from 'react'
import { useStore } from '../core/store'
import { toast } from 'sonner'
import { Layers, Plus, Trash2, Pencil, Check, X, MousePointerClick, Maximize, PanelLeft, PanelRight, ArrowDownFromLine } from 'lucide-react'

const popupIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  modal: MousePointerClick,
  'drawer-left': PanelLeft,
  'drawer-right': PanelRight,
  fullscreen: Maximize,
  'bottom-sheet': ArrowDownFromLine,
}

const popupLabels: Record<string, string> = {
  modal: 'Modal',
  'drawer-left': 'Left Drawer',
  'drawer-right': 'Right Drawer',
  fullscreen: 'Fullscreen',
  'bottom-sheet': 'Bottom Sheet',
  toast: 'Toast',
}

export default function PopupsPanel() {
  const popups = useStore((s) => s.popups)
  const currentPopupId = useStore((s) => s.currentPopupId)
  const setCurrentPopup = useStore((s) => s.setCurrentPopup)
  const addPopup = useStore((s) => s.addPopup)
  const deletePopup = useStore((s) => s.deletePopup)
  const renamePopup = useStore((s) => s.renamePopup)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showTypePicker, setShowTypePicker] = useState(false)

  const startEdit = (popup: typeof popups[0]) => {
    setEditingId(popup.id)
    setEditName(popup.name)
  }

  const handleAdd = (type: string) => {
    addPopup(undefined, type as any)
    setShowTypePicker(false)
  }

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      renamePopup(editingId, editName.trim())
    }
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  return (
    <div className="w-72 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Popups</h2>
          <button
            onClick={() => setShowTypePicker(!showTypePicker)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-medium transition-colors"
          >
            <Plus className="w-3 h-3" />
            New
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-1">
          {popups.length} popup{popups.length !== 1 ? 's' : ''}
        </p>

        {/* Type picker */}
        {showTypePicker && (
          <div className="mt-2 p-2 bg-slate-800/80 rounded-lg border border-slate-700/50 space-y-1">
            <p className="text-[9px] text-slate-400 mb-1">Choose type:</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(popupLabels).map(([type, label]) => {
                const Icon = popupIcons[type] || MousePointerClick
                return (
                  <button
                    key={type}
                    onClick={() => handleAdd(type)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-600 text-slate-300 text-[10px] transition-colors"
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Popups list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {popups.map((popup) => {
          const isCurrent = popup.id === currentPopupId
          const isEditing = editingId === popup.id
          const Icon = popupIcons[popup.type] || MousePointerClick

          return (
            <div
              key={popup.id}
              className={`group flex flex-col gap-1 px-2.5 py-2 rounded-lg cursor-pointer select-none transition-all ${
                isCurrent
                  ? 'bg-purple-500/15 border border-purple-500/30'
                  : 'border border-transparent hover:bg-slate-800/50 hover:border-slate-700/30'
              }`}
              onClick={() => !isEditing && setCurrentPopup(popup.id)}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-purple-400' : 'text-slate-500'}`} />

                {isEditing ? (
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                      className="flex-1 min-w-0 bg-slate-900/50 border border-purple-500/40 rounded px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none"
                    />
                    <button onClick={(e) => { e.stopPropagation(); saveEdit() }} className="p-0.5 rounded hover:bg-slate-700 text-emerald-400">
                      <Check className="w-3 h-3" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); cancelEdit() }} className="p-0.5 rounded hover:bg-slate-700 text-slate-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={`flex-1 text-[11px] truncate ${isCurrent ? 'text-purple-400 font-medium' : 'text-slate-300'}`}>
                      {popup.name}
                    </span>
                    <span className="text-[9px] text-slate-600 shrink-0">
                      {popupLabels[popup.type]}
                    </span>
                  </>
                )}
              </div>

              {!isEditing && (
                <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(popup) }}
                    className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors"
                    title="Rename"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePopup(popup.id)
                      toast.success(`Popup "${popup.name}" deleted`)
                    }}
                    className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t border-sidebar-border">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          Click a popup to edit its content. Use triggers on the page to open them.
        </p>
      </div>
    </div>
  )
}
