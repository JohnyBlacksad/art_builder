import { useDroppable } from '@dnd-kit/core'
import { motion, type Transition } from 'framer-motion'
import { useState, useEffect } from 'react'
import ParticlesCanvas from '../components/ParticlesCanvas'
import ResizeHandles from '../components/ResizeHandles'
import Accordion from '../components/library/Accordion'
import Dialog from '../components/library/Dialog'
import Tabs from '../components/library/Tabs'
import Select from '../components/library/Select'
import Tooltip from '../components/library/Tooltip'
import Slider from '../components/library/Slider'
import Switch from '../components/library/Switch'
import { useStore } from '../core/store'
import { usePreview } from '../core/previewContext'
import { cn } from '../lib/utils'
import type { ComponentNode, AnimationConfig, InteractiveConfig } from '../core/types'

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

const hoverTargets: Record<string, Record<string, any>> = {
  'fade-in': { opacity: 0.7 },
  'slide-up': { y: -10 },
  'slide-down': { y: 10 },
  'slide-left': { x: -10 },
  'slide-right': { x: 10 },
  scale: { scale: 1.05 },
  rotate: { rotate: 5 },
  flip: { rotateY: 15 },
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
      whileHover: hoverTargets[animation.type] || variant.visible,
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

function wrapHandles(el: React.ReactNode, show: boolean, nodeId: string) {
  if (!show) return el
  return (
    <>
      {el}
      <ResizeHandles nodeId={nodeId} />
    </>
  )
}

function getInteractiveMotionProps(node: ComponentNode) {
  const interactive = node.props.interactive as InteractiveConfig | undefined
  if (!interactive) return null
  const hover: Record<string, any> = {}
  if (interactive.hoverScale !== 1) hover.scale = interactive.hoverScale
  if (interactive.hoverBrightness !== 1) hover.filter = `brightness(${interactive.hoverBrightness})`

  const tap: Record<string, any> = {}
  if (interactive.pressScale !== 1) tap.scale = interactive.pressScale

  const props: Record<string, any> = {}
  if (Object.keys(hover).length > 0) props.whileHover = hover
  if (Object.keys(tap).length > 0) props.whileTap = tap

  return Object.keys(props).length > 0 ? props : null
}

export default function NodeRenderer({ node }: NodeRendererProps) {
  const preview = usePreview()
  const selectedId = useStore((s) => s.selectedId)
  const selectNode = useStore((s) => s.selectNode)
  const isSelected = selectedId === node.id
  const [playTick, setPlayTick] = useState(0)

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<string>
      if (custom.detail === node.id) {
        setPlayTick((t) => t + 1)
      }
    }
    window.addEventListener('artbuilder:play-animation', handler)
    return () => window.removeEventListener('artbuilder:play-animation', handler)
  }, [node.id])

  const isContainer = ['container', 'flex', 'grid'].includes(node.type)
  const [radioSelected, setRadioSelected] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${node.id}`,
    data: { type: 'CONTAINER', nodeId: node.id },
    disabled: !isContainer || preview,
  })

  const handleClick = (e: React.MouseEvent) => {
    if (preview) return
    e.stopPropagation()
    selectNode(node.id)
  }

  const anim = node.props.animation as AnimationConfig | undefined
  const motionProps = getAnimationProps(anim, isContainer)
  const isAnimated = motionProps !== null

  const showHandles = !preview && isSelected && node.id !== 'root'

  const baseClass = cn(
    showHandles && 'relative',
    !preview && isSelected && 'ring-2 ring-blue-500 ring-offset-1',
    node.id === 'root' && 'min-h-full',
    !preview && isOver && isContainer && 'ring-2 ring-green-400 ring-offset-2 bg-green-50/10'
  )

  const baseStyle = (node.props.style as React.CSSProperties) || {}

  if (isContainer) {
    const children = (
      <>
        {node.children.map((child) => (
          <NodeRenderer key={child.id} node={child} />
        ))}
      </>
    )

    const interactiveProps = getInteractiveMotionProps(node)

    // Interactive radio button in preview
    if (preview && node.props.isRadio && !isAnimated) {
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setRadioSelected((s) => !s)}
          className={baseClass}
          style={{
            ...baseStyle,
            borderColor: radioSelected ? '#4f46e5' : baseStyle.borderColor,
            borderWidth: radioSelected ? '3px' : baseStyle.borderWidth || '2px',
            boxShadow: radioSelected ? '0 0 0 2px #c7d2fe' : 'none',
          }}
          data-node-id={node.id}
        >
          {children}
        </motion.div>
      )
    }

    // Interactive container in preview
    if (preview && interactiveProps && !isAnimated) {
      return (
        <motion.div
          ref={preview ? undefined : setNodeRef}
          className={baseClass}
          style={baseStyle}
          onClick={handleClick}
          data-node-id={node.id}
          {...interactiveProps}
        >
          {children}
        </motion.div>
      )
    }

    if (isAnimated) {
      return wrapHandles(
        <motion.div
          key={playTick}
          ref={preview ? undefined : setNodeRef}
          className={baseClass}
          style={baseStyle}
          onClick={handleClick}
          data-node-id={node.id}
          {...motionProps}
        >
          {children}
        </motion.div>,
        showHandles,
        node.id
      )
    }

    return wrapHandles(
      <div
        ref={preview ? undefined : setNodeRef}
        className={baseClass}
        style={baseStyle}
        onClick={handleClick}
        data-node-id={node.id}
      >
        {children}
      </div>,
      showHandles,
      node.id
    )
  }

  const commonProps: React.HTMLAttributes<HTMLElement> = {
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
        return wrapHandles(<MotionTag key={playTick} {...commonProps} {...motionProps}>{text}</MotionTag>, showHandles, node.id)
      }
      return wrapHandles(<Tag {...commonProps}>{text}</Tag>, showHandles, node.id)
    }

    case 'text': {
      const text = (node.props.text as string) || ''
      if (isAnimated) {
        return wrapHandles(<motion.p key={playTick} {...commonProps} {...motionProps} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />, showHandles, node.id)
      }
      return wrapHandles(<p {...commonProps} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />, showHandles, node.id)
    }

    case 'button': {
      const text = (node.props.text as string) || ''
      if (isAnimated) {
        return wrapHandles(<motion.button key={playTick} {...commonProps} {...motionProps}>{text}</motion.button>, showHandles, node.id)
      }
      // Interactive button in preview
      if (preview && interactiveProps) {
        return (
          <motion.button
            className={baseClass}
            style={baseStyle}
            data-node-id={node.id}
            {...interactiveProps}
          >
            {text}
          </motion.button>
        )
      }
      return wrapHandles(<button {...commonProps}>{text}</button>, showHandles, node.id)
    }

    case 'image': {
      const src = (node.props.src as string) || ''
      const alt = (node.props.alt as string) || ''
      if (isAnimated) {
        return wrapHandles(<motion.img key={playTick} {...commonProps} src={src} alt={alt} draggable={false} {...motionProps} />, showHandles, node.id)
      }
      return wrapHandles(<img {...commonProps} src={src} alt={alt} draggable={false} />, showHandles, node.id)
    }

    case 'video': {
      const src = (node.props.src as string) || ''
      const autoplay = !!node.props.autoplay
      const loop = !!node.props.loop
      const muted = !!node.props.muted
      const controls = !!node.props.controls
      if (isAnimated) {
        return wrapHandles(
          <motion.video
            key={playTick}
            {...commonProps}
            src={src}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            controls={controls}
            playsInline
            {...motionProps}
          />,
          showHandles,
          node.id
        )
      }
      return wrapHandles(
        <video
          {...commonProps}
          src={src}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline
        />,
        showHandles,
        node.id
      )
    }

    case 'divider':
      if (isAnimated) {
        return wrapHandles(<motion.div key={playTick} {...commonProps} {...motionProps} />, showHandles, node.id)
      }
      return wrapHandles(<div {...commonProps} />, showHandles, node.id)

    case 'spacer':
      if (isAnimated) {
        return wrapHandles(<motion.div key={playTick} {...commonProps} {...motionProps} />, showHandles, node.id)
      }
      return wrapHandles(<div {...commonProps} />, showHandles, node.id)

    case 'raw': {
      const html = (node.props.html as string) || ''
      if (isAnimated) {
        return wrapHandles(<motion.div key={playTick} {...commonProps} {...motionProps} dangerouslySetInnerHTML={{ __html: html }} />, showHandles, node.id)
      }
      return wrapHandles(<div {...commonProps} dangerouslySetInnerHTML={{ __html: html }} />, showHandles, node.id)
    }

    case 'particles': {
      const count = (node.props.count as number) || 80
      const color = (node.props.color as string) || '#3b82f6'
      const pSpeed = (node.props.speed as number) || 0.5
      const pSize = (node.props.size as number) || 2
      return wrapHandles(
        <div {...commonProps}>
          <ParticlesCanvas count={count} color={color} speed={pSpeed} size={pSize} style={baseStyle} />
        </div>,
        showHandles,
        node.id
      )
    }

    case 'accordion': {
      const items = (node.props.items as any[]) || []
      return wrapHandles(<Accordion items={items} style={baseStyle} />, showHandles, node.id)
    }

    case 'dialog': {
      const triggerText = (node.props.triggerText as string) || 'Open'
      const dialogTitle = (node.props.title as string) || 'Title'
      const dialogContent = (node.props.content as string) || 'Content'
      return wrapHandles(<Dialog triggerText={triggerText} title={dialogTitle} content={dialogContent} style={baseStyle} />, showHandles, node.id)
    }

    case 'tabs': {
      const tabs = (node.props.tabs as any[]) || []
      return wrapHandles(<Tabs tabs={tabs} style={baseStyle} />, showHandles, node.id)
    }

    case 'select': {
      const options = (node.props.options as string[]) || []
      const placeholder = (node.props.placeholder as string) || 'Select...'
      return wrapHandles(<Select options={options} placeholder={placeholder} style={baseStyle} />, showHandles, node.id)
    }

    case 'tooltip': {
      const tooltipContent = (node.props.content as string) || 'Tooltip'
      const triggerText = (node.props.triggerText as string) || 'Hover me'
      return wrapHandles(<Tooltip content={tooltipContent} triggerText={triggerText} style={baseStyle} />, showHandles, node.id)
    }

    case 'slider': {
      const min = (node.props.min as number) ?? 0
      const max = (node.props.max as number) ?? 100
      const step = (node.props.step as number) ?? 1
      const defaultValue = (node.props.defaultValue as number) ?? 50
      return wrapHandles(<Slider min={min} max={max} step={step} defaultValue={defaultValue} style={baseStyle} />, showHandles, node.id)
    }

    case 'switch': {
      const label = (node.props.label as string) || 'Toggle'
      const defaultChecked = !!node.props.defaultChecked
      return wrapHandles(<Switch label={label} defaultChecked={defaultChecked} style={baseStyle} />, showHandles, node.id)
    }

    default:
      if (isAnimated) {
        return wrapHandles(<motion.div key={playTick} {...commonProps} {...motionProps}>Unknown: {node.type}</motion.div>, showHandles, node.id)
      }
      return wrapHandles(<div {...commonProps}>Unknown: {node.type}</div>, showHandles, node.id)
  }
}
