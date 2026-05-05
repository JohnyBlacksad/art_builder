export type ComponentType =
  | 'container'
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'divider'
  | 'spacer'
  | 'flex'
  | 'grid'

export interface BaseProps {
  id?: string
  className?: string
  style?: React.CSSProperties
}

export interface ComponentNode {
  id: string
  type: ComponentType
  props: Record<string, unknown>
  children: ComponentNode[]
}

export interface ComponentMeta {
  type: ComponentType
  label: string
  icon: string
  category: 'layout' | 'basic' | 'media'
  defaultProps: Record<string, unknown>
  isContainer?: boolean
}

export interface EditorState {
  root: ComponentNode
  selectedId: string | null
  zoom: number
}
