import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ComponentNode, ComponentType, EditorState } from './types'

let idCounter = 0
export function generateId(): string {
  return `node_${++idCounter}_${Date.now().toString(36)}`
}

let pageIdCounter = 0
export function generatePageId(): string {
  return `page_${++pageIdCounter}_${Date.now().toString(36)}`
}

export function createNode(type: ComponentType, props: Record<string, unknown> = {}, children: ComponentNode[] = []): ComponentNode {
  return {
    id: generateId(),
    type,
    props,
    children,
  }
}

function createDefaultRoot(): ComponentNode {
  return {
    id: 'root',
    type: 'container',
    props: {
      style: {
        position: 'relative',
        minHeight: '100vh',
        padding: '24px',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      } as React.CSSProperties,
    },
    children: [],
  }
}

function findNode(root: ComponentNode, id: string): ComponentNode | null {
  if (root.id === id) return root
  for (const child of root.children) {
    const found = findNode(child, id)
    if (found) return found
  }
  return null
}

function removeNode(parent: ComponentNode, id: string): boolean {
  const idx = parent.children.findIndex(c => c.id === id)
  if (idx !== -1) {
    parent.children.splice(idx, 1)
    return true
  }
  for (const child of parent.children) {
    if (removeNode(child, id)) return true
  }
  return false
}

function insertNode(parent: ComponentNode, node: ComponentNode, index?: number): void {
  if (index === undefined || index < 0 || index > parent.children.length) {
    parent.children.push(node)
  } else {
    parent.children.splice(index, 0, node)
  }
}

function moveNodeInternal(root: ComponentNode, nodeId: string, targetParentId: string, index?: number): void {
  const node = findNode(root, nodeId)
  if (!node) return

  let target: ComponentNode | null = findNode(root, targetParentId)
  if (!target) return
  if (target.id === nodeId) return
  let p: ComponentNode | null = target
  while (p) {
    if (p.id === nodeId) return
    p = findParent(root, p.id)
  }

  removeNode(root, nodeId)
  insertNode(target, node, index)
}

function findParent(root: ComponentNode, id: string): ComponentNode | null {
  for (const child of root.children) {
    if (child.id === id) return root
    const found = findParent(child, id)
    if (found) return found
  }
  return null
}

function moveInParent(root: ComponentNode, nodeId: string, direction: -1 | 1): void {
  const parent = findParent(root, nodeId)
  if (!parent) return
  const idx = parent.children.findIndex(c => c.id === nodeId)
  if (idx === -1) return
  const newIdx = idx + direction
  if (newIdx < 0 || newIdx >= parent.children.length) return
  const temp = parent.children[idx]
  parent.children[idx] = parent.children[newIdx]
  parent.children[newIdx] = temp
}

export interface Page {
  id: string
  name: string
  slug: string
  root: ComponentNode
}

const defaultRoot = createDefaultRoot()
const homePage: Page = {
  id: generatePageId(),
  name: 'Home',
  slug: 'home',
  root: JSON.parse(JSON.stringify(defaultRoot)),
}

const MAX_HISTORY = 50

interface HistoryEntry {
  root: ComponentNode
  selectedId: string | null
}

interface Store extends EditorState {
  pages: Page[]
  currentPageId: string

  history: HistoryEntry[]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean

  selectNode: (id: string | null) => void
  addNode: (type: ComponentType, parentId: string, index?: number, props?: Record<string, unknown>) => void
  addNodes: (nodes: ComponentNode[], parentId: string) => void
  removeNode: (id: string) => void
  updateProps: (id: string, props: Record<string, unknown>) => void
  moveNode: (nodeId: string, targetParentId: string, index?: number) => void
  moveUp: (nodeId: string) => void
  moveDown: (nodeId: string) => void
  setZoom: (zoom: number) => void
  setRoot: (root: ComponentNode) => void
  undo: () => void
  redo: () => void

  // Pages
  addPage: (name?: string) => void
  deletePage: (id: string) => void
  renamePage: (id: string, name: string) => void
  setCurrentPage: (id: string) => void
}

function pushHistory(state: Store) {
  if (state.historyIndex < state.history.length - 1) {
    state.history = state.history.slice(0, state.historyIndex + 1)
  }
  state.history.push({
    root: JSON.parse(JSON.stringify(state.root)),
    selectedId: state.selectedId,
  })
  if (state.history.length > MAX_HISTORY) {
    state.history.shift()
  } else {
    state.historyIndex++
  }
  state.canUndo = state.historyIndex > 0
  state.canRedo = false
}

function syncCurrentPage(state: Store) {
  const page = state.pages.find(p => p.id === state.currentPageId)
  if (page) {
    page.root = JSON.parse(JSON.stringify(state.root))
  }
}

export const useStore = create<Store>()(
  immer((set) => ({
    root: JSON.parse(JSON.stringify(defaultRoot)),
    selectedId: null,
    zoom: 1,
    pages: [homePage],
    currentPageId: homePage.id,
    history: [{ root: JSON.parse(JSON.stringify(defaultRoot)), selectedId: null }],
    historyIndex: 0,
    canUndo: false,
    canRedo: false,

    selectNode: (id) =>
      set((state) => {
        state.selectedId = id
      }),

    addNode: (type, parentId, index, props = {}) =>
      set((state) => {
        pushHistory(state)
        const parent = findNode(state.root, parentId)
        if (!parent) return
        const node = createNode(type, props)
        insertNode(parent, node, index)
        state.selectedId = node.id
        syncCurrentPage(state)
      }),

    addNodes: (nodes, parentId) =>
      set((state) => {
        pushHistory(state)
        const parent = findNode(state.root, parentId)
        if (!parent) return
        for (const node of nodes) {
          insertNode(parent, node)
        }
        if (nodes.length > 0) state.selectedId = nodes[0].id
        syncCurrentPage(state)
      }),

    removeNode: (id) =>
      set((state) => {
        if (id === 'root') return
        pushHistory(state)
        removeNode(state.root, id)
        if (state.selectedId === id) state.selectedId = null
        syncCurrentPage(state)
      }),

    updateProps: (id, props) =>
      set((state) => {
        pushHistory(state)
        const node = findNode(state.root, id)
        if (!node) return
        node.props = { ...node.props, ...props }
        syncCurrentPage(state)
      }),

    moveNode: (nodeId, targetParentId, index) =>
      set((state) => {
        pushHistory(state)
        moveNodeInternal(state.root, nodeId, targetParentId, index)
        syncCurrentPage(state)
      }),

    moveUp: (nodeId) =>
      set((state) => {
        pushHistory(state)
        moveInParent(state.root, nodeId, -1)
        syncCurrentPage(state)
      }),

    moveDown: (nodeId) =>
      set((state) => {
        pushHistory(state)
        moveInParent(state.root, nodeId, 1)
        syncCurrentPage(state)
      }),

    setZoom: (zoom) =>
      set((state) => {
        state.zoom = Math.max(0.25, Math.min(2, zoom))
      }),

    setRoot: (root) =>
      set((state) => {
        state.root = JSON.parse(JSON.stringify(root))
        state.history = [{ root: JSON.parse(JSON.stringify(root)), selectedId: null }]
        state.historyIndex = 0
        state.canUndo = false
        state.canRedo = false
        state.selectedId = null
        syncCurrentPage(state)
      }),

    undo: () =>
      set((state) => {
        if (state.historyIndex <= 0) return
        state.historyIndex--
        const entry = state.history[state.historyIndex]
        state.root = JSON.parse(JSON.stringify(entry.root))
        state.selectedId = entry.selectedId
        state.canUndo = state.historyIndex > 0
        state.canRedo = state.historyIndex < state.history.length - 1
        syncCurrentPage(state)
      }),

    redo: () =>
      set((state) => {
        if (state.historyIndex >= state.history.length - 1) return
        state.historyIndex++
        const entry = state.history[state.historyIndex]
        state.root = JSON.parse(JSON.stringify(entry.root))
        state.selectedId = entry.selectedId
        state.canUndo = state.historyIndex > 0
        state.canRedo = state.historyIndex < state.history.length - 1
        syncCurrentPage(state)
      }),

    // Pages
    addPage: (name) =>
      set((state) => {
        const newPage: Page = {
          id: generatePageId(),
          name: name || `Page ${state.pages.length + 1}`,
          slug: name?.toLowerCase().replace(/\s+/g, '-') || `page-${state.pages.length + 1}`,
          root: createDefaultRoot(),
        }
        state.pages.push(newPage)
        // Switch to new page
        syncCurrentPage(state)
        state.currentPageId = newPage.id
        state.root = JSON.parse(JSON.stringify(newPage.root))
        state.selectedId = null
        state.history = [{ root: JSON.parse(JSON.stringify(newPage.root)), selectedId: null }]
        state.historyIndex = 0
        state.canUndo = false
        state.canRedo = false
      }),

    deletePage: (id) =>
      set((state) => {
        if (state.pages.length <= 1) return // Can't delete last page
        const idx = state.pages.findIndex(p => p.id === id)
        if (idx === -1) return
        state.pages.splice(idx, 1)
        if (state.currentPageId === id) {
          // Switch to first remaining page
          const firstPage = state.pages[0]
          state.currentPageId = firstPage.id
          state.root = JSON.parse(JSON.stringify(firstPage.root))
          state.selectedId = null
          state.history = [{ root: JSON.parse(JSON.stringify(firstPage.root)), selectedId: null }]
          state.historyIndex = 0
          state.canUndo = false
          state.canRedo = false
        }
      }),

    renamePage: (id, name) =>
      set((state) => {
        const page = state.pages.find(p => p.id === id)
        if (page) page.name = name
      }),

    setCurrentPage: (id) =>
      set((state) => {
        const page = state.pages.find(p => p.id === id)
        if (!page || state.currentPageId === id) return
        syncCurrentPage(state)
        state.currentPageId = id
        state.root = JSON.parse(JSON.stringify(page.root))
        state.selectedId = null
        state.history = [{ root: JSON.parse(JSON.stringify(page.root)), selectedId: null }]
        state.historyIndex = 0
        state.canUndo = false
        state.canRedo = false
      }),
  }))
)
