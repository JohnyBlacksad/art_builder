import { useState, useRef, useEffect } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const safeColor = color?.startsWith('#') ? color : '#3b82f6'

  return (
    <div ref={ref} className="relative flex items-center gap-2 flex-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-7 rounded-md border border-slate-600/50 shrink-0 cursor-pointer transition-transform hover:scale-105"
        style={{ backgroundColor: safeColor }}
        title="Click to open color picker"
      />
      <HexColorInput
        color={safeColor}
        onChange={onChange}
        prefixed
        className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500/60 transition-all font-mono uppercase"
      />
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 p-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700/50">
          <HexColorPicker color={safeColor} onChange={onChange} style={{ width: '160px', height: '160px' }} />
        </div>
      )}
    </div>
  )
}
