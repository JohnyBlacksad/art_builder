import { useEffect } from 'react'
import { useStore } from '../core/store'
import { exportToHTML } from '../core/exporter'
import { saveCustomComponent } from '../core/customComponents'
import { ZoomIn, ZoomOut, Monitor, Smartphone, Download, Undo2, Redo2, Save } from 'lucide-react'

export default function Toolbar() {
  const zoom = useStore((s) => s.zoom)
  const setZoom = useStore((s) => s.setZoom)
  const root = useStore((s) => s.root)
  const selectedId = useStore((s) => s.selectedId)
  const undo = useStore((s) => s.undo)
  const redo = useStore((s) => s.redo)
  const canUndo = useStore((s) => s.canUndo)
  const canRedo = useStore((s) => s.canRedo)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  const handleExport = () => {
    const html = exportToHTML(root)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-12 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-100">ArtBuilder</span>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">v2.0</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-xs font-medium transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent text-xs font-medium transition-colors"
          title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
        >
          <Redo2 className="w-3.5 h-3.5" />
          Redo
        </button>

        <div className="w-px h-4 bg-slate-700 mx-1" />

        <button className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors">
          <Monitor className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors">
          <Smartphone className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-700 mx-1" />

        <button
          onClick={() => setZoom(zoom - 0.1)}
          className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(zoom + 0.1)}
          className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-700 mx-1" />

        {selectedId && selectedId !== 'root' && (
          <button
            onClick={() => {
              const name = prompt('Name your component:')
              if (!name) return
              function findNode(node: typeof root, id: string): typeof root | null {
                if (node.id === id) return node
                for (const child of node.children) {
                  const found = findNode(child, id)
                  if (found) return found
                }
                return null
              }
              const node = findNode(root, selectedId)
              if (node) {
                saveCustomComponent(name, node)
                window.dispatchEvent(new CustomEvent('artbuilder:refresh-library'))
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Component
          </button>
        )}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export HTML
        </button>
      </div>
    </div>
  )
}
