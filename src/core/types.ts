export type ComponentType =
  | 'container'
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'video'
  | 'particles'
  | 'divider'
  | 'spacer'
  | 'flex'
  | 'grid'
  | 'raw'
  | 'accordion'
  | 'dialog'
  | 'tabs'
  | 'select'
  | 'tooltip'
  | 'slider'
  | 'switch'

export interface AnimationConfig {
  type: 'none' | 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate' | 'flip'
  trigger: 'load' | 'hover' | 'in-view'
  duration: number
  delay: number
  ease: string
  stagger: number
}

export interface InteractiveConfig {
  hoverScale: number
  hoverBrightness: number
  pressScale: number
  focusRing: boolean
  focusRingColor: string
}

export interface BaseProps {
  id?: string
  className?: string
  style?: React.CSSProperties
  animation?: AnimationConfig
  interactive?: InteractiveConfig
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
