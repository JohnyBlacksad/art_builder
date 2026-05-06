import { useState } from 'react'
import { useStore } from '../core/store'
import { componentRegistry } from '../core/registry'
import type { ComponentNode } from '../core/types'
import {
  Square, Rows, Grid3x3, Heading, Type, MousePointerClick, Image, Minus, MoveVertical,
  Menu, Layout, CreditCard, PanelBottom, Tags, MessageSquare, BarChart3, Megaphone, Mail, Images, Box, Sparkles, Code, Video, Atom, Clapperboard, Palette,
  Diamond, Zap, Sunrise, Flame, ListCollapse, ChevronDown, HelpCircle, SlidersHorizontal, ToggleLeft, NotebookTabs,
  ChevronRight, Eye, EyeOff, Lock, Unlock,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Square, Rows, Grid3x3, Heading, Type, MousePointerClick, Image, Minus, MoveVertical,
  Menu, Layout, CreditCard, PanelBottom, Tags, MessageSquare, BarChart3, Megaphone, Mail, Images, Box, Sparkles, Code, Video, Atom, Clapperboard, Palette,
  Diamond, Zap, Sunrise, Flame, ListCollapse, ChevronDown, HelpCircle, SlidersHorizontal, ToggleLeft, NotebookTabs,
}

function getNodeLabel(node: ComponentNode): string {
  if (node.type === 'heading' || node.type === 'text' || node.type === 'button') {
    const text = String(node.props.text || '')
    if (text.length > 25) return text.slice(0, 25) + '...'
    return text || componentRegistry[node.type]?.label || node.type
  }
  if (node.type === 'image') {
    return node.props.alt || 'Image'
  }
  if (node.type === 'video') {
    return 'Video'
  }
  if (node.type === 'divider') return 'Divider'
  if (node.type === 'spacer') return 'Spacer'
  if (node.type === 'particles') return 'Particles'
  if (node.type === 'raw') return 'HTML'
  return componentRegistry[node.type]?.label || node.type
}

function getNodeIcon(node: ComponentNode): React.ComponentType<{ className?: string }> {
  const iconName = componentRegistry[node.type]?.icon
  return iconMap[iconName] || Square
}

interface TreeNodeProps {
  node: ComponentNode
  depth: number
  selectedId: string | null
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onSelect: (id: string) => void
}

function TreeNode({ node, depth, selectedId, expandedIds, onToggleExpand, onSelect }: TreeNodeProps) {
  const isSelected = selectedId === node.id
  const isExpanded = expandedIds.has(node.id)
  const hasChildren = node.children.length > 0
  const Icon = getNodeIcon(node)
  const label = getNodeLabel(node)

  const isContainer = ['container', 'flex', 'grid'].includes(node.type)

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1 px-1 rounded-md cursor-pointer select-none transition-colors ${
          isSelected
            ? 'bg-blue-500/15 text-blue-400'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onClick={() => onSelect(node.id)}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(node.id)
            }}
            className="w-4 h-4 flex items-center justify-center rounded hover:bg-slate-700/50 transition-colors shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-slate-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-500" />
            )}
          </button>
        ) : (
          <div className="w-4 h-4 shrink-0" />
        )}

        {/* Icon */}
        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />

        {/* Label */}
        <span className={`text-[11px] truncate flex-1 ${isSelected ? 'font-medium' : ''}`}>
          {label}
        </span>

        {/* Container badge */}
        {isContainer && node.children.length > 0 && (
          <span className="text-[9px] text-slate-600 bg-slate-800/50 px-1 rounded">
            {node.children.length}
          </span>
        )}
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function LayersPanel() {
  const root = useStore((s) => s.root)
  const selectedId = useStore((s) => s.selectedId)
  const selectNode = useStore((s) => s.selectNode)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([root.id]))

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    const ids = new Set<string>()
    const collect = (node: ComponentNode) => {
      ids.add(node.id)
      node.children.forEach(collect)
    }
    collect(root)
    setExpandedIds(ids)
  }

  const collapseAll = () => {
    setExpandedIds(new Set([root.id]))
  }

  return (
    <div className="w-72 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Layers</h2>
          <div className="flex items-center gap-0.5">
            <button
              onClick={expandAll}
              className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              title="Expand all"
            >
              Expand
            </button>
            <button
              onClick={collapseAll}
              className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              title="Collapse all"
            >
              Collapse
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-600">
          {countNodes(root)} elements
        </p>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-1.5">
        <TreeNode
          node={root}
          depth={0}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onToggleExpand={toggleExpand}
          onSelect={selectNode}
        />
      </div>
    </div>
  )
}

function countNodes(node: ComponentNode): number {
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
}
