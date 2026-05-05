import { generateId } from './store'
import type { ComponentNode } from './types'
import type { PresetMeta } from './presets'

const STORAGE_KEY = 'artbuilder-custom-components'

export interface SavedComponent {
  id: string
  name: string
  node: ComponentNode
  createdAt: number
}

function cloneNode(node: ComponentNode): ComponentNode {
  return {
    id: generateId(),
    type: node.type,
    props: JSON.parse(JSON.stringify(node.props)),
    children: node.children.map(cloneNode),
  }
}

export function saveCustomComponent(name: string, node: ComponentNode): void {
  const saved: SavedComponent[] = loadRaw()
  saved.push({
    id: `custom_${Date.now()}`,
    name,
    node: cloneNode(node),
    createdAt: Date.now(),
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}

export function loadCustomComponents(): PresetMeta[] {
  const saved = loadRaw()
  return saved.map((s) => ({
    id: s.id,
    label: s.name,
    icon: 'Box',
    category: 'My Components',
    build: () => [cloneNode(s.node)],
  }))
}

export function deleteCustomComponent(id: string): void {
  const saved = loadRaw().filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}

function loadRaw(): SavedComponent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
