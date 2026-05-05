import { useDroppable } from '@dnd-kit/core'
import type { ComponentNode } from '../core/types'
import { useStore } from '../core/store'
import { cn } from '../lib/utils'

interface NodeRendererProps {
  node: ComponentNode
}

export default function NodeRenderer({ node }: NodeRendererProps) {
  const selectedId = useStore((s) => s.selectedId)
  const selectNode = useStore((s) => s.selectNode)
  const isSelected = selectedId === node.id

  const isContainer = ['container', 'flex', 'grid'].includes(node.type)

  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${node.id}`,
    data: { type: 'CONTAINER', nodeId: node.id },
    disabled: !isContainer,
  })

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectNode(node.id)
  }

  const baseProps: React.HTMLAttributes<HTMLElement> = {
    'data-node-id': node.id,
    onClick: handleClick,
    className: cn(
      'relative transition-all',
      isSelected && 'ring-2 ring-blue-500 ring-offset-1',
      node.id === 'root' && 'min-h-full',
      isOver && isContainer && 'ring-2 ring-green-400 ring-offset-2 bg-green-50/10'
    ),
    style: (node.props.style as React.CSSProperties) || {},
  }

  if (isContainer) {
    return (
      <div ref={setNodeRef} {...baseProps}>
        {node.children.length === 0 && (
          <div className="text-xs text-slate-400 text-center py-6 pointer-events-none select-none opacity-60">
            Drop here
          </div>
        )}
        {node.children.map((child) => (
          <NodeRenderer key={child.id} node={child} />
        ))}
      </div>
    )
  }

  switch (node.type) {
    case 'heading': {
      const level = (node.props.level as string) || 'h2'
      const text = (node.props.text as string) || ''
      const HeadingTag = level as keyof JSX.IntrinsicElements
      return <HeadingTag {...baseProps}>{text}</HeadingTag>
    }

    case 'text': {
      const text = (node.props.text as string) || ''
      return (
        <p {...baseProps} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />
      )
    }

    case 'button': {
      const text = (node.props.text as string) || ''
      return (
        <button {...baseProps} onClick={handleClick}>
          {text}
        </button>
      )
    }

    case 'image': {
      const src = (node.props.src as string) || ''
      const alt = (node.props.alt as string) || ''
      return <img {...baseProps} src={src} alt={alt} draggable={false} />
    }

    case 'divider':
      return <div {...baseProps} />

    case 'spacer':
      return <div {...baseProps} />

    default:
      return <div {...baseProps}>Unknown: {node.type}</div>
  }
}
