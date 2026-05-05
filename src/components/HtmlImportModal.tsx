import { useState } from 'react'
import { parseHtmlToNodes } from '../core/htmlImporter'
import { useStore } from '../core/store'
import { X, FileCode } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function HtmlImportModal({ onClose }: Props) {
  const [html, setHtml] = useState('')
  const [error, setError] = useState('')
  const addNodes = useStore((s) => s.addNodes)

  const handleImport = () => {
    try {
      const nodes = parseHtmlToNodes(html)
      if (nodes.length === 0) {
        setError('No valid HTML elements found.')
        return
      }
      addNodes(nodes, 'root')
      onClose()
    } catch (e) {
      setError('Failed to parse HTML. Please check your code.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[640px] max-h-[80vh] flex flex-col bg-sidebar border border-sidebar-border rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-100">Import HTML Component</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-5 overflow-auto">
          <p className="text-xs text-slate-500 mb-3">
            Paste your HTML + Tailwind CSS code below. We'll convert it into editable components.
          </p>
          <textarea
            value={html}
            onChange={(e) => { setHtml(e.target.value); setError('') }}
            placeholder={`<div class="bg-white p-6">...</div>`}
            className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500 resize-none"
            spellCheck={false}
          />
          {error && (
            <p className="mt-2 text-xs text-red-400">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-sidebar-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
          >
            Import Component
          </button>
        </div>
      </div>
    </div>
  )
}
