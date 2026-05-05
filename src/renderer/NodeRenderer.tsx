import { useDroppable } from '@dnd-kit/core'
import { motion, type Transition } from 'framer-motion'
import type { ComponentNode, AnimationConfig } from '../core/types'
import { useStore } from '../core/store'
import { cn } from '../lib/utils'

interface NodeRendererProps {
  node: ComponentNode
}

const easeMap: Record<string, string> = {
  linear: 'linear',
  easeIn: 'easeIn',
  easeOut: 'easeOut',
  easeInOut: 'easeInOut',
  circIn: 'circIn',
  circOut: 'circOut',
  backIn: 'backIn',
  backOut: 'backOut',
  backInOut: 'backInOut',
  spring: 'spring',
}

function getAnimationProps(animation: AnimationConfig | undefined, isContainer: boolean) {
  if (!animation || animation.type === 'none') return null

  const transition: Transition = {
    duration: animation.duration,
    delay: animation.delay,
    ease: (easeMap[animation.ease] || 'easeInOut') as any,
  }

  if (isContainer && animation.stagger > 0) {
    transition.staggerChildren = animation.stagger
  }

  const variants: Record<string, Record<string, any>> = {
    'fade-in': { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    'slide-up': { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    'slide-down': { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
    'slide-left': { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
    'slide-right': { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
    rotate: { hidden: { opacity: 0, rotate: -10 }, visible: { opacity: 1, rotate: 0 } },
    flip: { hidden: { opacity: 0, rotateY: 90 }, visible: { opacity: 1, rotateY: 0 } },
  }

  const variant = variants[animation.type]
  if (!variant) return null

  if (animation.trigger === 'load') {
    return {
      initial: 'hidden',
      animate: 'visible',
      variants: variant,
      transition,
    }
  }

  if (animation.trigger === 'hover') {
    return {
      whileHover: variant.visible,
      transition,
    }
  }

  if (animation.trigger === 'in-view') {
    return {
      initial: 'hidden',
      whileInView: 'visible',
      viewport: { once: true, margin: '-50px' },
      variants: variant,
      transition,
    }
  }

  return null
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

  const anim = node.props.animation as AnimationConfig | undefined
  const motionProps = getAnimationProps(anim, isContainer)
  const isAnimated = motionProps !== null

  const baseClass = cn(
    'relative transition-all',
    isSelected && 'ring-2 ring-blue-500 ring-offset-1',
    node.id === 'root' && 'min-h-full',
    isOver && isContainer && 'ring-2 ring-green-400 ring-offset-2 bg-green-50/10'
  )

  const baseStyle = (node.props.style as React.CSSProperties) || {}

  if (isContainer) {
    const children = (
      <>
        {node.children.length === 0 && (
          <div className="text-xs text-slate-400 text-center py-6 pointer-events-none select-none opacity-60">
            Drop here
          </div>
        )}
        {node.children.map((child) => (
          <NodeRenderer key={child.id} node={child} />
        ))}
      </>
    )

    if (isAnimated) {
      return (
        <motion.div
          ref={setNodeRef}
          className={baseClass}
          style={baseStyle}
          onClick={handleClick}
          data-node-id={node.id}
          {...motionProps}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        ref={setNodeRef}
        className={baseClass}
        style={baseStyle}
        onClick={handleClick}
        data-node-id={node.id}
      >
        {children}
      </div>
    )
  }

  const commonProps = {
    className: baseClass,
    style: baseStyle,
    onClick: handleClick,
    'data-node-id': node.id,
  }

  switch (node.type) {
    case 'heading': {
      const level = (node.props.level as string) || 'h2'
      const text = (node.props.text as string) || ''
      const Tag = level as keyof JSX.IntrinsicElements
      if (isAnimated) {
        const MotionTag = motion[Tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6']
        return <MotionTag {...commonProps} {...motionProps}>{text}</MotionTag>
      }
      return <Tag {...commonProps}>{text}</Tag>
    }

    case 'text': {
      const text = (node.props.text as string) || ''
      if (isAnimated) {
        return <motion.p {...commonProps} {...motionProps} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />
      }
      return <p {...commonProps} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />
    }

    case 'button': {
      const text = (node.props.text as string) || ''
      if (isAnimated) {
        return <motion.button {...commonProps} {...motionProps}>{text}</motion.button>
      }
      return <button {...commonProps}>{text}</button>
    }

    case 'image': {
      const src = (node.props.src as string) || ''
      const alt = (node.props.alt as string) || ''
      if (isAnimated) {
        return <motion.img {...commonProps} src={src} alt={alt} draggable={false} {...motionProps} />
      }
      return <img {...commonProps} src={src} alt={alt} draggable={false} />
    }

    case 'divider':
      if (isAnimated) {
        return <motion.div {...commonProps} {...motionProps} />
      }
      return <div {...commonProps} />

    case 'spacer':
      if (isAnimated) {
        return <motion.div {...commonProps} {...motionProps} />
      }
      return <div {...commonProps} />

    case 'raw': {
      const html = (node.props.html as string) || ''
      if (isAnimated) {
        return <motion.div {...commonProps} {...motionProps} dangerouslySetInnerHTML={{ __html: html }} />
      }
      return <div {...commonProps} dangerouslySetInnerHTML={{ __html: html }} />
    }

    default:
      if (isAnimated) {
        return <motion.div {...commonProps} {...motionProps}>Unknown: {node.type}</motion.div>
      }
      return <div {...commonProps}>Unknown: {node.type}</div>
  }
}
