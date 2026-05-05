import { useDraggable } from '@dnd-kit/core'
import type { ComponentMeta, ComponentType } from '../core/types'
import { componentRegistry } from '../core/registry'
import { presetRegistry } from '../core/presets'
import { useState, useEffect } from 'react'
import {
  Square, Rows, Grid3x3, Heading, Type, MousePointerClick, Image, Minus, MoveVertical,
  Menu, Layout, CreditCard, PanelBottom, Tags, MessageSquare, BarChart3, Megaphone, Mail, Images, Box, Sparkles, Code, Video, Atom, Clapperboard, Palette
} from 'lucide-react'
import { loadCustomComponents } from '../core/customComponents'
import type { PresetMeta } from '../core/presets'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Square, Rows, Grid3x3, Heading, Type, MousePointerClick, Image, Minus, MoveVertical,
  Menu, Layout, CreditCard, PanelBottom, Tags, MessageSquare, BarChart3, Megaphone, Mail, Images, Box, Sparkles, Code, Video, Atom, Clapperboard, Palette,
}

function DraggableItem({ id, label, icon, data }: { id: string; label: string; icon: string; data: Record<string, unknown> }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, data })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  const Icon = iconMap[icon] || Square

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 cursor-grab active:cursor-grabbing border border-slate-700/50 hover:border-slate-600 transition-colors select-none"
    >
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-sm text-slate-200">{label}</span>
    </div>
  )
}

export default function ComponentPanel() {
  const [custom, setCustom] = useState<PresetMeta[]>([])

  useEffect(() => {
    const refresh = () => setCustom(loadCustomComponents())
    refresh()
    window.addEventListener('artbuilder:refresh-library', refresh)
    return () => window.removeEventListener('artbuilder:refresh-library', refresh)
  }, [])

  const byCategory = Object.values(componentRegistry).reduce((acc, meta) => {
    acc[meta.category] = acc[meta.category] || []
    acc[meta.category].push(meta)
    return acc
  }, {} as Record<string, ComponentMeta[]>)

  const presetsByCategory = Object.values(presetRegistry).reduce((acc, meta) => {
    acc[meta.category] = acc[meta.category] || []
    acc[meta.category].push(meta)
    return acc
  }, {} as Record<string, typeof presetRegistry[keyof typeof presetRegistry][]>)

  const categoryNames: Record<string, string> = {
    layout: 'Layout',
    basic: 'Basic',
    media: 'Media',
    Sections: 'Sections',
    UI: 'UI Components',
  }

  return (
    <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Library</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Presets */}
        {Object.entries(presetsByCategory).map(([cat, items]) => (
          <div key={cat}>
            <h3 className="text-xs font-medium text-blue-400 uppercase tracking-wider mb-2 px-1">
              {categoryNames[cat] || cat}
            </h3>
            <div className="space-y-1.5">
              {items.map((meta) => (
                <DraggableItem
                  key={meta.id}
                  id={`preset-${meta.id}`}
                  label={meta.label}
                  icon={meta.icon}
                  data={{ type: 'PRESET', presetId: meta.id }}
                />
              ))}
            </div>
          </div>
        ))}

        {custom.length > 0 && (
          <>
            <div className="h-px bg-slate-800" />
            <div>
              <h3 className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-2 px-1">
                My Components
              </h3>
              <div className="space-y-1.5">
                {custom.map((meta) => (
                  <DraggableItem
                    key={meta.id}
                    id={`preset-${meta.id}`}
                    label={meta.label}
                    icon={meta.icon}
                    data={{ type: 'PRESET', presetId: meta.id }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-slate-800" />

        {/* Primitives */}
        {Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat}>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-1">
              {categoryNames[cat] || cat}
            </h3>
            <div className="space-y-1.5">
              {items.map((meta) => (
                <DraggableItem
                  key={meta.type}
                  id={`palette-${meta.type}`}
                  label={meta.label}
                  icon={meta.icon}
                  data={{ type: 'NEW_COMPONENT', componentType: meta.type }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
