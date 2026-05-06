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

function cloneNodeWithNewIds(node: ComponentNode): ComponentNode {
  return {
    ...node,
    id: generateId(),
    props: JSON.parse(JSON.stringify(node.props)),
    children: node.children.map(cloneNodeWithNewIds),
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

export interface PopupSettings {
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  backdropColor?: string
  backdropOpacity?: number
  showCloseButton?: boolean
  closeButtonColor?: string
  closeButtonSize?: number
  animation?: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'zoom'
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  autoCloseDelay?: number
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  trigger?: 'none' | 'load' | 'scroll' | 'exit-intent'
  delay?: number
  scrollTarget?: string
}

export interface Popup {
  id: string
  name: string
  type: 'modal' | 'drawer-left' | 'drawer-right' | 'fullscreen' | 'bottom-sheet' | 'toast'
  root: ComponentNode
  settings: PopupSettings
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
  popups: Popup[]
  currentPopupId: string | null

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
  duplicateNode: (nodeId: string) => void
  copiedStyle: Record<string, string> | null
  copyStyle: (nodeId: string) => void
  pasteStyle: (nodeId: string) => void
  setZoom: (zoom: number) => void
  setRoot: (root: ComponentNode) => void
  undo: () => void
  redo: () => void

  // Pages
  addPage: (name?: string) => void
  deletePage: (id: string) => void
  renamePage: (id: string, name: string) => void
  setPageSlug: (id: string, slug: string) => void
  setCurrentPage: (id: string) => void

  // Popups
  addPopup: (name?: string, type?: Popup['type']) => void
  deletePopup: (id: string) => void
  renamePopup: (id: string, name: string) => void
  setCurrentPopup: (id: string | null) => void
  updatePopupRoot: (id: string, root: ComponentNode) => void
  updatePopupSettings: (id: string, settings: Partial<PopupSettings>) => void
  setPopups: (popups: Popup[]) => void
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

function syncToCurrentContext(state: Store) {
  if (state.currentPopupId) {
    const popup = state.popups.find(p => p.id === state.currentPopupId)
    if (popup) popup.root = JSON.parse(JSON.stringify(state.root))
  } else {
    const page = state.pages.find(p => p.id === state.currentPageId)
    if (page) page.root = JSON.parse(JSON.stringify(state.root))
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
        syncToCurrentContext(state)
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
        syncToCurrentContext(state)
      }),

    removeNode: (id) =>
      set((state) => {
        if (id === 'root') return
        pushHistory(state)
        removeNode(state.root, id)
        if (state.selectedId === id) state.selectedId = null
        syncToCurrentContext(state)
      }),

    updateProps: (id, props) =>
      set((state) => {
        pushHistory(state)
        const node = findNode(state.root, id)
        if (!node) return
        node.props = { ...node.props, ...props }
        syncToCurrentContext(state)
      }),

    moveNode: (nodeId, targetParentId, index) =>
      set((state) => {
        pushHistory(state)
        moveNodeInternal(state.root, nodeId, targetParentId, index)
        syncToCurrentContext(state)
      }),

    moveUp: (nodeId) =>
      set((state) => {
        pushHistory(state)
        moveInParent(state.root, nodeId, -1)
        syncToCurrentContext(state)
      }),

    moveDown: (nodeId) =>
      set((state) => {
        pushHistory(state)
        moveInParent(state.root, nodeId, 1)
        syncToCurrentContext(state)
      }),

    duplicateNode: (nodeId) =>
      set((state) => {
        if (nodeId === 'root') return
        pushHistory(state)
        const parent = findParent(state.root, nodeId)
        if (!parent) return
        const original = parent.children.find(c => c.id === nodeId)
        if (!original) return
        const clone = cloneNodeWithNewIds(original)
        const idx = parent.children.findIndex(c => c.id === nodeId)
        parent.children.splice(idx + 1, 0, clone)
        state.selectedId = clone.id
        syncToCurrentContext(state)
      }),

    copiedStyle: null,

    copyStyle: (nodeId) =>
      set((state) => {
        const node = findNode(state.root, nodeId)
        if (!node) return
        const style = (node.props.style as Record<string, string>) || {}
        state.copiedStyle = JSON.parse(JSON.stringify(style))
      }),

    pasteStyle: (nodeId) =>
      set((state) => {
        if (!state.copiedStyle) return
        const node = findNode(state.root, nodeId)
        if (!node) return
        pushHistory(state)
        node.props = {
          ...node.props,
          style: { ...(node.props.style as Record<string, string> || {}), ...state.copiedStyle },
        }
        syncToCurrentContext(state)
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
        syncToCurrentContext(state)
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
        syncToCurrentContext(state)
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
        syncToCurrentContext(state)
      }),

    // Popups
    popups: [],
    currentPopupId: null,

    addPopup: (name, type = 'modal') =>
      set((state) => {
        const defaultSettings: PopupSettings = {
          width: type === 'modal' ? '500px' : type === 'drawer-left' || type === 'drawer-right' ? '400px' : type === 'toast' ? '380px' : '100%',
          height: type === 'fullscreen' ? '100%' : type === 'drawer-left' || type === 'drawer-right' ? '100%' : 'auto',
          maxWidth: type === 'modal' ? '90vw' : undefined,
          maxHeight: type === 'modal' || type === 'bottom-sheet' ? '80vh' : undefined,
          backdropColor: '#000000',
          backdropOpacity: 0.6,
          showCloseButton: true,
          closeButtonColor: '#94a3b8',
          closeButtonSize: 16,
          animation: type === 'bottom-sheet' ? 'slide-up' : type === 'drawer-left' ? 'slide-right' : type === 'drawer-right' ? 'slide-left' : 'fade',
          position: type === 'modal' ? 'center' : type === 'toast' ? 'bottom-right' : 'center',
          autoCloseDelay: type === 'toast' ? 5 : 0,
          closeOnBackdropClick: type !== 'toast',
          closeOnEscape: type !== 'toast',
        }
        const newPopup: Popup = {
          id: generatePageId(),
          name: name || `Popup ${state.popups.length + 1}`,
          type,
          root: createDefaultRoot(),
          settings: defaultSettings,
        }
        state.popups.push(newPopup)
      }),

    deletePopup: (id) =>
      set((state) => {
        const idx = state.popups.findIndex(p => p.id === id)
        if (idx !== -1) state.popups.splice(idx, 1)
        if (state.currentPopupId === id) state.currentPopupId = null
      }),

    renamePopup: (id, name) =>
      set((state) => {
        const popup = state.popups.find(p => p.id === id)
        if (popup) popup.name = name
      }),

    setCurrentPopup: (id) =>
      set((state) => {
        // Save current context before switching
        if (state.currentPopupId) {
          const popup = state.popups.find(p => p.id === state.currentPopupId)
          if (popup) popup.root = JSON.parse(JSON.stringify(state.root))
        } else {
          const page = state.pages.find(p => p.id === state.currentPageId)
          if (page) page.root = JSON.parse(JSON.stringify(state.root))
        }

        if (!id) {
          // Return to page editing
          state.currentPopupId = null
          const page = state.pages.find(p => p.id === state.currentPageId)
          state.root = JSON.parse(JSON.stringify(page?.root || defaultRoot))
          state.selectedId = null
          state.history = [{ root: JSON.parse(JSON.stringify(state.root)), selectedId: null }]
          state.historyIndex = 0
          state.canUndo = false
          state.canRedo = false
        } else {
          const popup = state.popups.find(p => p.id === id)
          if (!popup) return
          state.currentPopupId = id
          state.root = JSON.parse(JSON.stringify(popup.root))
          state.selectedId = null
          state.history = [{ root: JSON.parse(JSON.stringify(popup.root)), selectedId: null }]
          state.historyIndex = 0
          state.canUndo = false
          state.canRedo = false
        }
      }),

    updatePopupRoot: (id, root) =>
      set((state) => {
        const popup = state.popups.find(p => p.id === id)
        if (popup) popup.root = JSON.parse(JSON.stringify(root))
      }),

    updatePopupSettings: (id, settings) =>
      set((state) => {
        const popup = state.popups.find(p => p.id === id)
        if (popup) {
          popup.settings = { ...popup.settings, ...settings }
        }
      }),

    setPopups: (popups) =>
      set((state) => {
        state.popups = JSON.parse(JSON.stringify(popups))
      }),

    // Pages
    addPage: (name) =>
      set((state) => {
        // Save popup context if in popup mode
        if (state.currentPopupId) {
          const popup = state.popups.find(p => p.id === state.currentPopupId)
          if (popup) popup.root = JSON.parse(JSON.stringify(state.root))
          state.currentPopupId = null
        } else {
          syncToCurrentContext(state)
        }
        const newPage: Page = {
          id: generatePageId(),
          name: name || `Page ${state.pages.length + 1}`,
          slug: name?.toLowerCase().replace(/\s+/g, '-') || `page-${state.pages.length + 1}`,
          root: createDefaultRoot(),
        }
        state.pages.push(newPage)
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
        if (state.pages.length <= 1) return
        const idx = state.pages.findIndex(p => p.id === id)
        if (idx === -1) return
        state.pages.splice(idx, 1)
        if (state.currentPageId === id) {
          // Exit popup mode if active
          state.currentPopupId = null
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

    setPageSlug: (id, slug) =>
      set((state) => {
        const page = state.pages.find(p => p.id === id)
        if (page) {
          page.slug = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }
      }),

    setCurrentPage: (id) =>
      set((state) => {
        const page = state.pages.find(p => p.id === id)
        if (!page || state.currentPageId === id) return
        // Save current context before switching
        if (state.currentPopupId) {
          const popup = state.popups.find(p => p.id === state.currentPopupId)
          if (popup) popup.root = JSON.parse(JSON.stringify(state.root))
          state.currentPopupId = null
        } else {
          syncToCurrentContext(state)
        }
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
