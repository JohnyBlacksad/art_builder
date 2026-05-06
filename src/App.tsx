import { useEffect, useState } from 'react'
import { DndContext, type DragEndEvent, type DragStartEvent, DragOverlay, pointerWithin } from '@dnd-kit/core'
import { useStore } from './core/store'
import { componentRegistry } from './core/registry'
import { presetRegistry } from './core/presets'
import { getCustomPreset } from './core/customComponents'
import { PreviewContext } from './core/previewContext'
import type { ComponentType, ComponentNode } from './core/types'
import ComponentPanel from './components/ComponentPanel'
import LayersPanel from './components/LayersPanel'
import PropertiesPanel from './components/PropertiesPanel'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import { Layers, Library } from 'lucide-react'

const isPreview = new URLSearchParams(window.location.search).has('preview')

export default function App() {
  const addNode = useStore((s) => s.addNode)
  const addNodes = useStore((s) => s.addNodes)
  const moveNode = useStore((s) => s.moveNode)
  const setRoot = useStore((s) => s.setRoot)
  const [dragType, setDragType] = useState<ComponentType | null>(null)
  const [dragLabel, setDragLabel] = useState<string>('')
  const [previewReady, setPreviewReady] = useState(false)
  const [leftPanel, setLeftPanel] = useState<'library' | 'layers'>('library')

  useEffect(() => {
    if (isPreview) {
      const saved = localStorage.getItem('artbuilder:preview')
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as ComponentNode
          setRoot(parsed)
        } catch {
          // ignore parse error
        }
      }
      setPreviewReady(true)
    }
  }, [setRoot])

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current
    if (data?.type === 'NEW_COMPONENT') {
      setDragType(data.componentType as ComponentType)
      setDragLabel(componentRegistry[data.componentType as ComponentType]?.label || '')
    } else if (data?.type === 'PRESET') {
      const preset = presetRegistry[data.presetId as string]
      setDragLabel(preset?.label || 'Preset')
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDragType(null)
    setDragLabel('')
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type === 'NEW_COMPONENT' && overData?.type === 'CONTAINER') {
      const componentType = activeData.componentType as ComponentType
      const meta = componentRegistry[componentType]
      if (meta) {
        addNode(componentType, overData.nodeId, undefined, { ...meta.defaultProps })
      }
    } else if (activeData?.type === 'PRESET' && overData?.type === 'CONTAINER') {
      const presetId = activeData.presetId as string
      const preset = presetRegistry[presetId] || getCustomPreset(presetId)
      if (preset) {
        const nodes = preset.build()
        addNodes(nodes, overData.nodeId)
      }
    } else if (activeData?.type === 'SORTABLE_NODE' && overData?.type === 'CONTAINER') {
      moveNode(activeData.nodeId as string, overData.nodeId as string)
    }
  }

  if (isPreview) {
    return (
      <PreviewContext.Provider value={true}>
        <DndContext collisionDetection={pointerWithin}>
          <div className="h-screen bg-white overflow-auto">
            <Canvas key={previewReady ? 'ready' : 'loading'} />
          </div>
        </DndContext>
      </PreviewContext.Provider>
    )
  }

  return (
    <PreviewContext.Provider value={false}>
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="h-screen flex flex-col bg-slate-950">
          <Toolbar />
          <div className="flex-1 flex overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Left panel tabs */}
              <div className="flex bg-sidebar border-b border-sidebar-border">
                <button
                  onClick={() => setLeftPanel('library')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium transition-all border-b-2 ${
                    leftPanel === 'library'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Library className="w-3.5 h-3.5" />
                  Library
                </button>
                <button
                  onClick={() => setLeftPanel('layers')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium transition-all border-b-2 ${
                    leftPanel === 'layers'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Layers
                </button>
              </div>
              {leftPanel === 'library' ? <ComponentPanel /> : <LayersPanel />}
            </div>
            <Canvas />
            <PropertiesPanel />
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          {dragLabel ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm shadow-xl pointer-events-none opacity-90">
              <span>{dragLabel}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </PreviewContext.Provider>
  )
}
