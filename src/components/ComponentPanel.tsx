import { useDraggable } from '@dnd-kit/core'
import type { ComponentMeta, ComponentType } from '../core/types'
import { componentRegistry } from '../core/registry'
import { presetRegistry } from '../core/presets'
import { useState, useEffect } from 'react'
import {
  Square, Rows, Grid3x3, Heading, Type, MousePointerClick, Image, Minus, MoveVertical,
  Menu, Layout, CreditCard, PanelBottom, Tags, MessageSquare, BarChart3, Megaphone, Mail, Images, Box, Sparkles, Code, Video, Atom, Clapperboard, Palette,
  Diamond, Zap, Sunrise, Flame, ListCollapse, ChevronDown, HelpCircle, SlidersHorizontal, ToggleLeft, NotebookTabs,
  Columns3, Columns2, PanelLeft, LayoutTemplate, GalleryThumbnails
} from 'lucide-react'
import { loadCustomComponents } from '../core/customComponents'
import type { PresetMeta } from '../core/presets'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Square, Rows, Grid3x3, Heading, Type, MousePointerClick, Image, Minus, MoveVertical,
  Menu, Layout, CreditCard, PanelBottom, Tags, MessageSquare, BarChart3, Megaphone, Mail, Images, Box, Sparkles, Code, Video, Atom, Clapperboard, Palette,
  Diamond, Zap, Sunrise, Flame, ListCollapse, ChevronDown, HelpCircle, SlidersHorizontal, ToggleLeft, NotebookTabs,
  Columns3, Columns2, PanelLeft, LayoutTemplate, GalleryThumbnails,
}

// Visual thumbnail for each preset — shows a mini wireframe
function PresetThumbnail({ presetId }: { presetId: string }) {
  const thumbnails: Record<string, React.ReactNode> = {
    navbar: (
      <div className="w-full h-full flex flex-col gap-1 p-1">
        <div className="flex items-center justify-between">
          <div className="w-6 h-2 bg-blue-400/60 rounded-sm" />
          <div className="flex gap-1">
            <div className="w-4 h-1.5 bg-slate-500/40 rounded-sm" />
            <div className="w-4 h-1.5 bg-slate-500/40 rounded-sm" />
            <div className="w-4 h-1.5 bg-slate-500/40 rounded-sm" />
            <div className="w-6 h-1.5 bg-blue-400/60 rounded-sm" />
          </div>
        </div>
      </div>
    ),
    hero: (
      <div className="w-full h-full flex gap-1 p-1">
        <div className="flex-1 flex flex-col gap-1 justify-center">
          <div className="w-full h-2 bg-slate-300/40 rounded-sm" />
          <div className="w-3/4 h-1.5 bg-slate-300/30 rounded-sm" />
          <div className="w-1/2 h-1.5 bg-slate-300/30 rounded-sm" />
          <div className="flex gap-1 mt-1">
            <div className="w-6 h-1.5 bg-blue-400/60 rounded-sm" />
            <div className="w-6 h-1.5 bg-slate-500/30 rounded-sm" />
          </div>
        </div>
        <div className="w-1/3 h-full bg-slate-400/20 rounded-sm" />
      </div>
    ),
    card: (
      <div className="w-full h-full flex flex-col gap-1 p-1">
        <div className="w-full h-1/2 bg-slate-400/20 rounded-sm" />
        <div className="w-3/4 h-1.5 bg-slate-300/40 rounded-sm" />
        <div className="w-full h-1 bg-slate-300/20 rounded-sm" />
        <div className="w-1/3 h-1.5 bg-slate-500/40 rounded-sm" />
      </div>
    ),
    features: (
      <div className="w-full h-full flex flex-col gap-1 p-1">
        <div className="w-1/2 h-1.5 bg-slate-300/40 rounded-sm mx-auto" />
        <div className="w-2/3 h-1 bg-slate-300/20 rounded-sm mx-auto" />
        <div className="grid grid-cols-3 gap-1 mt-1 flex-1">
          <div className="bg-slate-400/15 rounded-sm" />
          <div className="bg-slate-400/15 rounded-sm" />
          <div className="bg-slate-400/15 rounded-sm" />
        </div>
      </div>
    ),
    footer: (
      <div className="w-full h-full flex flex-col gap-1 p-1 bg-slate-800/30 rounded">
        <div className="grid grid-cols-4 gap-1 flex-1">
          <div className="col-span-1 flex flex-col gap-0.5">
            <div className="w-4 h-1 bg-slate-300/40 rounded-sm" />
            <div className="w-full h-0.5 bg-slate-300/20 rounded-sm" />
          </div>
          <div className="col-span-1 flex flex-col gap-0.5">
            <div className="w-4 h-1 bg-slate-300/40 rounded-sm" />
            <div className="w-full h-0.5 bg-slate-300/20 rounded-sm" />
          </div>
          <div className="col-span-1 flex flex-col gap-0.5">
            <div className="w-4 h-1 bg-slate-300/40 rounded-sm" />
            <div className="w-full h-0.5 bg-slate-300/20 rounded-sm" />
          </div>
          <div className="col-span-1 flex flex-col gap-0.5">
            <div className="w-4 h-1 bg-slate-300/40 rounded-sm" />
            <div className="w-full h-0.5 bg-slate-300/20 rounded-sm" />
          </div>
        </div>
        <div className="w-full h-px bg-slate-500/30" />
        <div className="w-1/2 h-1 bg-slate-300/20 rounded-sm mx-auto" />
      </div>
    ),
    pricing: (
      <div className="w-full h-full flex flex-col gap-1 p-1">
        <div className="w-1/2 h-1.5 bg-slate-300/40 rounded-sm mx-auto" />
        <div className="w-2/3 h-1 bg-slate-300/20 rounded-sm mx-auto" />
        <div className="grid grid-cols-3 gap-1 mt-1 flex-1">
          <div className="bg-slate-400/15 rounded-sm flex flex-col items-center gap-0.5 p-0.5">
            <div className="w-4 h-1 bg-slate-300/30 rounded-sm" />
            <div className="w-6 h-2 bg-slate-300/40 rounded-sm" />
          </div>
          <div className="bg-blue-500/20 rounded-sm flex flex-col items-center gap-0.5 p-0.5 border border-blue-400/30">
            <div className="w-4 h-1 bg-blue-300/40 rounded-sm" />
            <div className="w-6 h-2 bg-blue-300/50 rounded-sm" />
          </div>
          <div className="bg-slate-400/15 rounded-sm flex flex-col items-center gap-0.5 p-0.5">
            <div className="w-4 h-1 bg-slate-300/30 rounded-sm" />
            <div className="w-6 h-2 bg-slate-300/40 rounded-sm" />
          </div>
        </div>
      </div>
    ),
    testimonials: (
      <div className="w-full h-full flex flex-col gap-1 p-1">
        <div className="w-1/2 h-1.5 bg-slate-300/40 rounded-sm mx-auto" />
        <div className="grid grid-cols-2 gap-1 mt-1 flex-1">
          <div className="bg-slate-400/15 rounded-sm p-1 flex flex-col gap-1">
            <div className="w-full h-1 bg-slate-300/20 rounded-sm" />
            <div className="w-full h-1 bg-slate-300/20 rounded-sm" />
            <div className="flex items-center gap-1 mt-auto">
              <div className="w-3 h-3 bg-slate-400/30 rounded-full" />
              <div className="w-6 h-1 bg-slate-300/30 rounded-sm" />
            </div>
          </div>
          <div className="bg-slate-400/15 rounded-sm p-1 flex flex-col gap-1">
            <div className="w-full h-1 bg-slate-300/20 rounded-sm" />
            <div className="w-full h-1 bg-slate-300/20 rounded-sm" />
            <div className="flex items-center gap-1 mt-auto">
              <div className="w-3 h-3 bg-slate-400/30 rounded-full" />
              <div className="w-6 h-1 bg-slate-300/30 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    ),
    stats: (
      <div className="w-full h-full grid grid-cols-4 gap-1 p-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex flex-col items-center justify-center gap-0.5">
            <div className="w-6 h-2 bg-slate-300/50 rounded-sm" />
            <div className="w-4 h-1 bg-slate-300/20 rounded-sm" />
          </div>
        ))}
      </div>
    ),
    cta: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1 bg-blue-500/20 rounded">
        <div className="w-1/2 h-1.5 bg-white/40 rounded-sm" />
        <div className="w-2/3 h-1 bg-white/20 rounded-sm" />
        <div className="w-8 h-1.5 bg-white/40 rounded-sm mt-1" />
      </div>
    ),
    contact: (
      <div className="w-full h-full flex gap-1 p-1">
        <div className="flex-1 flex flex-col gap-1 justify-center">
          <div className="w-full h-2 bg-slate-300/40 rounded-sm" />
          <div className="w-3/4 h-1 bg-slate-300/20 rounded-sm" />
          <div className="w-1/2 h-1 bg-slate-300/20 rounded-sm" />
        </div>
        <div className="w-1/2 flex flex-col gap-0.5 p-1 bg-slate-400/15 rounded-sm">
          <div className="w-full h-1 bg-slate-300/20 rounded-sm" />
          <div className="w-full h-1.5 bg-white/10 rounded-sm" />
          <div className="w-full h-1 bg-slate-300/20 rounded-sm" />
          <div className="w-full h-1.5 bg-white/10 rounded-sm" />
          <div className="w-full h-2 bg-blue-400/30 rounded-sm mt-auto" />
        </div>
      </div>
    ),
    gallery: (
      <div className="w-full h-full flex flex-col gap-1 p-1">
        <div className="w-1/2 h-1.5 bg-slate-300/40 rounded-sm mx-auto" />
        <div className="grid grid-cols-3 gap-1 mt-1 flex-1">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-slate-400/15 rounded-sm" />
          ))}
        </div>
      </div>
    ),
    videoHero: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1 relative">
        <div className="absolute inset-0 bg-slate-700/30 rounded-sm" />
        <div className="relative w-6 h-6 border-2 border-white/40 rounded-full flex items-center justify-center">
          <div className="w-0 h-0 border-t-3 border-b-3 border-l-4 border-transparent border-l-white/60 ml-0.5" />
        </div>
        <div className="relative w-8 h-1.5 bg-white/30 rounded-sm" />
        <div className="relative w-6 h-1 bg-white/20 rounded-sm" />
      </div>
    ),
    animatedGallery: (
      <div className="w-full h-full flex flex-col gap-1 p-1">
        <div className="w-1/2 h-1.5 bg-slate-300/40 rounded-sm mx-auto" />
        <div className="grid grid-cols-3 gap-1 mt-1 flex-1">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-slate-400/15 rounded-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />
            </div>
          ))}
        </div>
      </div>
    ),
    colorProduct: (
      <div className="w-full h-full flex flex-col gap-1 p-1">
        <div className="w-full h-1/2 bg-slate-400/15 rounded-sm relative">
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-2 h-2 bg-red-400/50 rounded-full" />
            <div className="w-2 h-2 bg-blue-400/50 rounded-full" />
          </div>
        </div>
        <div className="w-2/3 h-1.5 bg-slate-300/40 rounded-sm" />
        <div className="w-1/3 h-2 bg-blue-400/40 rounded-sm" />
      </div>
    ),
    glassCard: (
      <div className="w-full h-full flex items-center justify-center p-1">
        <div className="w-full h-full bg-white/10 rounded-sm border border-white/20 backdrop-blur-sm flex flex-col gap-1 p-1">
          <div className="w-full h-1.5 bg-white/30 rounded-sm" />
          <div className="w-full h-1 bg-white/15 rounded-sm" />
          <div className="w-1/2 h-1.5 bg-white/20 rounded-sm mt-auto" />
        </div>
      </div>
    ),
    gradientButton: (
      <div className="w-full h-full flex items-center justify-center p-1">
        <div className="w-2/3 h-2 bg-gradient-to-r from-indigo-400/60 to-purple-400/60 rounded-sm" />
      </div>
    ),
    gradientHero: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/30 rounded">
        <div className="w-2/3 h-2 bg-white/20 rounded-sm" />
        <div className="w-1/2 h-1 bg-white/10 rounded-sm" />
        <div className="w-1/3 h-1.5 bg-white/20 rounded-sm mt-1" />
      </div>
    ),
    neonText: (
      <div className="w-full h-full flex items-center justify-center p-1">
        <div className="w-3/4 h-2 bg-pink-400/30 rounded-sm shadow-[0_0_8px_rgba(236,72,153,0.3)]" />
      </div>
    ),
    // Wireframe grid thumbnails
    grid2: (
      <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
      </div>
    ),
    grid3: (
      <div className="w-full h-full grid grid-cols-3 gap-1 p-1">
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
      </div>
    ),
    grid4: (
      <div className="w-full h-full grid grid-cols-4 gap-1 p-1">
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
      </div>
    ),
    sidebar: (
      <div className="w-full h-full flex gap-1 p-1">
        <div className="w-1/4 bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
        <div className="flex-1 bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
      </div>
    ),
    headerContent: (
      <div className="w-full h-full flex flex-col gap-1 p-1">
        <div className="w-full h-1/4 bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
        <div className="flex-1 bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
      </div>
    ),
    bento: (
      <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-1 p-1">
        <div className="col-span-2 row-span-2 bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
        <div className="bg-blue-400/15 rounded-sm border border-dashed border-blue-400/30" />
      </div>
    ),
  }

  return thumbnails[presetId] || (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-6 h-6 bg-slate-500/20 rounded-sm" />
    </div>
  )
}

function DraggablePresetItem({ meta }: { meta: PresetMeta }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `preset-${meta.id}`,
    data: { type: 'PRESET', presetId: meta.id },
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  const Icon = iconMap[meta.icon] || Square

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="group cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full aspect-[16/10] rounded-lg bg-slate-800/50 border border-slate-700/50 overflow-hidden group-hover:border-slate-500 group-hover:bg-slate-800 transition-all">
        <PresetThumbnail presetId={meta.id} />
      </div>
      <div className="flex items-center gap-2 mt-2 px-0.5">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs text-slate-300 font-medium truncate">{meta.label}</span>
      </div>
    </div>
  )
}

function DraggablePrimitiveItem({ meta }: { meta: ComponentMeta }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${meta.type}`,
    data: { type: 'NEW_COMPONENT', componentType: meta.type },
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  const Icon = iconMap[meta.icon] || Square

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 cursor-grab active:cursor-grabbing border border-slate-700/50 hover:border-slate-600 transition-colors select-none"
    >
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-sm text-slate-200">{meta.label}</span>
    </div>
  )
}

export default function ComponentPanel() {
  const [custom, setCustom] = useState<PresetMeta[]>([])
  const [activeTab, setActiveTab] = useState<'sections' | 'wireframes' | 'primitives'>('sections')

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
  }, {} as Record<string, PresetMeta[]>)

  const categoryNames: Record<string, string> = {
    layout: 'Layout',
    basic: 'Basic',
    media: 'Media',
    Sections: 'Sections',
    UI: 'UI Components',
    Wireframes: 'Wireframes',
  }

  const sections = presetsByCategory['Sections'] || []
  const uiPresets = presetsByCategory['UI'] || []
  const wireframes = presetsByCategory['Wireframes'] || []

  return (
    <div className="w-72 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-3">Library</h2>
        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-0.5">
          {[
            { key: 'sections', label: 'Sections' },
            { key: 'wireframes', label: 'Grids' },
            { key: 'primitives', label: 'Elements' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'sections' && (
          <div className="p-3 space-y-4">
            {sections.length > 0 && (
              <div>
                <h3 className="text-[10px] font-medium text-blue-400 uppercase tracking-wider mb-2 px-1">
                  Page Sections
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {sections.map((meta) => (
                    <DraggablePresetItem key={meta.id} meta={meta} />
                  ))}
                </div>
              </div>
            )}

            {uiPresets.length > 0 && (
              <div>
                <h3 className="text-[10px] font-medium text-pink-400 uppercase tracking-wider mb-2 px-1">
                  UI Components
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {uiPresets.map((meta) => (
                    <DraggablePresetItem key={meta.id} meta={meta} />
                  ))}
                </div>
              </div>
            )}

            {custom.length > 0 && (
              <div>
                <h3 className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider mb-2 px-1">
                  My Components
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {custom.map((meta) => (
                    <DraggablePresetItem key={meta.id} meta={meta} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wireframes' && (
          <div className="p-3 space-y-4">
            {wireframes.length > 0 && (
              <div>
                <h3 className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider mb-2 px-1">
                  Grid Layouts
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {wireframes.map((meta) => (
                    <DraggablePresetItem key={meta.id} meta={meta} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'primitives' && (
          <div className="p-3 space-y-4">
            {Object.entries(byCategory).map(([cat, items]) => (
              <div key={cat}>
                <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2 px-1">
                  {categoryNames[cat] || cat}
                </h3>
                <div className="space-y-1.5">
                  {items.map((meta) => (
                    <DraggablePrimitiveItem key={meta.type} meta={meta} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
