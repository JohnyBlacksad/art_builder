import { useCallback } from 'react'
import { useStore } from '../core/store'

interface Props {
  nodeId: string
}

const handlePositions = [
  { pos: 'nw', cursor: 'nw-resize', style: { top: -4, left: -4 } },
  { pos: 'n', cursor: 'n-resize', style: { top: -4, left: '50%', transform: 'translateX(-50%)' } },
  { pos: 'ne', cursor: 'ne-resize', style: { top: -4, right: -4 } },
  { pos: 'w', cursor: 'w-resize', style: { top: '50%', left: -4, transform: 'translateY(-50%)' } },
  { pos: 'e', cursor: 'e-resize', style: { top: '50%', right: -4, transform: 'translateY(-50%)' } },
  { pos: 'sw', cursor: 'sw-resize', style: { bottom: -4, left: -4 } },
  { pos: 's', cursor: 's-resize', style: { bottom: -4, left: '50%', transform: 'translateX(-50%)' } },
  { pos: 'se', cursor: 'se-resize', style: { bottom: -4, right: -4 } },
]

function parseSize(val: string | undefined): { num: number; unit: string } {
  if (!val) return { num: 100, unit: 'px' }
  const match = String(val).match(/^([\d.]+)(.*)$/)
  if (match) return { num: parseFloat(match[1]), unit: match[2] || 'px' }
  return { num: 100, unit: 'px' }
}

export default function ResizeHandles({ nodeId }: Props) {
  const updateProps = useStore((s) => s.updateProps)
  const root = useStore((s) => s.root)

  const findNode = useCallback((node: typeof root, id: string): typeof root | null => {
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findNode(child, id)
      if (found) return found
    }
    return null
  }, [])

  const node = findNode(root, nodeId)
  if (!node) return null

  const style = (node.props.style as Record<string, string>) || {}

  const startResize = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    e.preventDefault()

    const w = parseSize(style.width)
    const h = parseSize(style.height)
    const startX = e.clientX
    const startY = e.clientY
    const startW = w.num
    const startH = h.num

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY

      let newW = startW
      let newH = startH

      if (direction.includes('e')) newW += dx
      if (direction.includes('w')) newW -= dx
      if (direction.includes('s')) newH += dy
      if (direction.includes('n')) newH -= dy

      if (newW < 20) newW = 20
      if (newH < 20) newH = 20

      const nextStyle = { ...style, width: `${Math.round(newW)}${w.unit}`, height: `${Math.round(newH)}${h.unit}` }
      if (!style.width) delete nextStyle.width
      if (!style.height) delete nextStyle.height

      updateProps(nodeId, { style: nextStyle })
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <>
      {handlePositions.map(({ pos, cursor, style: posStyle }) => (
        <div
          key={pos}
          className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full z-50"
          style={{ ...posStyle, cursor, position: 'absolute' }}
          onMouseDown={(e) => startResize(e, pos)}
        />
      ))}
    </>
  )
}
