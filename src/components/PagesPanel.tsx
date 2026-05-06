import { useState } from 'react'
import { useStore } from '../core/store'
import { FileText, Plus, Trash2, Pencil, Check, X, Eye, Link } from 'lucide-react'

export default function PagesPanel() {
  const pages = useStore((s) => s.pages)
  const currentPageId = useStore((s) => s.currentPageId)
  const setCurrentPage = useStore((s) => s.setCurrentPage)
  const addPage = useStore((s) => s.addPage)
  const deletePage = useStore((s) => s.deletePage)
  const renamePage = useStore((s) => s.renamePage)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const startEdit = (page: typeof pages[0]) => {
    setEditingId(page.id)
    setEditName(page.name)
  }

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      renamePage(editingId, editName.trim())
    }
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  const openPreview = (page: typeof pages[0]) => {
    localStorage.setItem('artbuilder:preview', JSON.stringify(page.root))
    window.open(`${window.location.pathname}?preview=1`, '_blank')
  }

  return (
    <div className="w-72 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Pages</h2>
          <button
            onClick={() => addPage()}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-colors"
            title="Add new page"
          >
            <Plus className="w-3 h-3" />
            New
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-1">
          {pages.length} page{pages.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Pages list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {pages.map((page, index) => {
          const isCurrent = page.id === currentPageId
          const isEditing = editingId === page.id

          return (
            <div
              key={page.id}
              className={`group flex flex-col gap-1 px-2.5 py-2 rounded-lg cursor-pointer select-none transition-all ${
                isCurrent
                  ? 'bg-blue-500/15 border border-blue-500/30'
                  : 'border border-transparent hover:bg-slate-800/50 hover:border-slate-700/30'
              }`}
              onClick={() => !isEditing && setCurrentPage(page.id)}
            >
              <div className="flex items-center gap-2">
                <FileText className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-blue-400' : 'text-slate-500'}`} />

                {isEditing ? (
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={saveEdit}
                      className="flex-1 min-w-0 bg-slate-900/50 border border-blue-500/40 rounded px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); saveEdit() }}
                      className="p-0.5 rounded hover:bg-slate-700 text-emerald-400"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); cancelEdit() }}
                      className="p-0.5 rounded hover:bg-slate-700 text-slate-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={`flex-1 text-[11px] truncate ${isCurrent ? 'text-blue-400 font-medium' : 'text-slate-300'}`}>
                      {page.name}
                    </span>
                    <span className="text-[9px] text-slate-600 shrink-0">
                      {index + 1}
                    </span>
                  </>
                )}
              </div>

              {/* Slug + Actions */}
              {!isEditing && (
                <div className="flex items-center justify-between pl-6">
                  <div className="flex items-center gap-1 text-[10px] text-slate-600">
                    <Link className="w-2.5 h-2.5" />
                    <span>/{page.slug}</span>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); openPreview(page) }}
                      className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-blue-400 transition-colors"
                      title="Preview this page"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(page) }}
                      className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-colors"
                      title="Rename"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    {pages.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deletePage(page.id) }}
                        className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div className="p-3 border-t border-sidebar-border">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          Each page has its own URL slug and elements tree. Click the eye icon to preview any page.
        </p>
      </div>
    </div>
  )
}
