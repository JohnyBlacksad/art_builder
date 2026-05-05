import { useStore } from '../core/store'
import NodeRenderer from '../renderer/NodeRenderer'

export default function Canvas() {
  const root = useStore((s) => s.root)
  const zoom = useStore((s) => s.zoom)
  const selectNode = useStore((s) => s.selectNode)

  return (
    <div
      className="flex-1 bg-canvas overflow-auto flex items-start justify-center p-8"
      onClick={() => selectNode(null)}
    >
      <div
        className="bg-white shadow-lg transition-all origin-top"
        style={{
          width: '100%',
          maxWidth: '1024px',
          minHeight: '800px',
          transform: `scale(${zoom})`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <NodeRenderer node={root} />
      </div>
    </div>
  )
}
