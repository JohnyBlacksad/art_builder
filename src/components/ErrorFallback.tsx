import { AlertTriangle, RotateCcw } from 'lucide-react'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-950 p-8">
      <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-xl p-6 text-center shadow-2xl">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-100 mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          This block encountered an error and couldn't render properly.
        </p>
        <div className="bg-slate-950 rounded-lg p-3 mb-4 text-left overflow-hidden">
          <code className="text-[11px] text-red-300 font-mono block truncate">
            {error.message}
          </code>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors border border-red-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}
