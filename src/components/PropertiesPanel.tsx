import { useStore } from '../core/store'
import { componentRegistry } from '../core/registry'
import { Trash2, ArrowUp, ArrowDown, Play } from 'lucide-react'

interface ControlRowProps {
  label: string
  children: React.ReactNode
}

function ControlRow({ label, children }: ControlRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
      {children}
    </div>
  )
}

function StyleInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
    />
  )
}

function StyleSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt || '—'}
        </option>
      ))}
    </select>
  )
}

export default function PropertiesPanel() {
  const selectedId = useStore((s) => s.selectedId)
  const root = useStore((s) => s.root)
  const updateProps = useStore((s) => s.updateProps)
  const removeNode = useStore((s) => s.removeNode)
  const selectNode = useStore((s) => s.selectNode)
  const moveUp = useStore((s) => s.moveUp)
  const moveDown = useStore((s) => s.moveDown)

  if (!selectedId) {
    return (
      <div className="w-80 h-full bg-sidebar border-l border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm p-4 text-center">
          Click any element on the canvas to edit it
        </div>
      </div>
    )
  }

  function findNode(node: typeof root, id: string): typeof root | null {
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findNode(child, id)
      if (found) return found
    }
    return null
  }

  const node = findNode(root, selectedId)
  if (!node) return null

  const meta = componentRegistry[node.type]
  const style = (node.props.style as Record<string, string>) || {}
  const anim = (node.props.animation as Record<string, any>) || { type: 'none' }

  const setStyle = (key: string, value: string) => {
    updateProps(node.id, {
      style: { ...style, [key]: value },
    })
  }

  const setAnim = (partial: Record<string, any>) => {
    updateProps(node.id, {
      animation: { ...anim, ...partial },
    })
  }

  const isTextLike = ['heading', 'text', 'button'].includes(node.type)
  const isImage = node.type === 'image'
  const isContainer = ['container', 'flex', 'grid'].includes(node.type)

  return (
    <div className="w-80 h-full bg-sidebar border-l border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Properties</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {meta?.label || node.type} <span className="text-slate-700">•</span> {node.id === 'root' ? 'Page Root' : node.id.slice(0, 12)}
          </p>
        </div>
        {node.id !== 'root' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => moveUp(node.id)}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Move up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveDown(node.id)}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Move down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                removeNode(node.id)
                selectNode(null)
              }}
              className="p-1.5 rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Content */}
        {isTextLike && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Content</h3>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500">Text</label>
              <textarea
                value={String(node.props.text || '')}
                onChange={(e) => updateProps(node.id, { text: e.target.value })}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            {node.type === 'heading' && (
              <ControlRow label="Level">
                <StyleSelect
                  value={String(node.props.level || 'h2')}
                  onChange={(v) => updateProps(node.id, { level: v })}
                  options={['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
                />
              </ControlRow>
            )}
          </div>
        )}

        {(isImage || node.type === 'video') && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {node.type === 'video' ? 'Video' : 'Image'}
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500">URL</label>
              <input
                type="text"
                value={String(node.props.src || '')}
                onChange={(e) => updateProps(node.id, { src: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            {node.type === 'image' && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500">Alt</label>
                <input
                  type="text"
                  value={String(node.props.alt || '')}
                  onChange={(e) => updateProps(node.id, { alt: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
            {node.type === 'video' && (
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {[
                  { key: 'autoplay', label: 'Autoplay' },
                  { key: 'loop', label: 'Loop' },
                  { key: 'muted', label: 'Muted' },
                  { key: 'controls', label: 'Controls' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!node.props[key]}
                      onChange={(e) => updateProps(node.id, { [key]: e.target.checked })}
                      className="accent-blue-500"
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Particles */}
        {node.type === 'particles' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Particles</h3>
            <ControlRow label="Count">
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={(node.props.count as number) || 80}
                  onChange={(e) => updateProps(node.id, { count: parseInt(e.target.value) })}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-xs text-slate-400 w-10 text-right">{node.props.count || 80}</span>
              </div>
            </ControlRow>
            <ControlRow label="Color">
              <div className="flex gap-1 flex-1">
                <input
                  type="color"
                  value={(node.props.color as string)?.startsWith('#') ? (node.props.color as string) : '#3b82f6'}
                  onChange={(e) => updateProps(node.id, { color: e.target.value })}
                  className="w-8 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={String(node.props.color || '')}
                  onChange={(e) => updateProps(node.id, { color: e.target.value })}
                  className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </ControlRow>
            <ControlRow label="Speed">
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={(node.props.speed as number) || 0.5}
                  onChange={(e) => updateProps(node.id, { speed: parseFloat(e.target.value) })}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-xs text-slate-400 w-10 text-right">{node.props.speed || 0.5}</span>
              </div>
            </ControlRow>
            <ControlRow label="Size">
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={(node.props.size as number) || 2}
                  onChange={(e) => updateProps(node.id, { size: parseInt(e.target.value) })}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-xs text-slate-400 w-10 text-right">{node.props.size || 2}</span>
              </div>
            </ControlRow>
          </div>
        )}

        {/* Layout */}
        {isContainer && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Layout</h3>
            <ControlRow label="Display">
              <StyleSelect
                value={style.display || 'block'}
                onChange={(v) => setStyle('display', v)}
                options={['block', 'flex', 'grid', 'inline-block', 'inline-flex']}
              />
            </ControlRow>
            {style.display?.includes('flex') && (
              <>
                <ControlRow label="Direction">
                  <StyleSelect
                    value={style.flexDirection || 'row'}
                    onChange={(v) => setStyle('flexDirection', v)}
                    options={['row', 'row-reverse', 'column', 'column-reverse']}
                  />
                </ControlRow>
                <ControlRow label="Justify">
                  <StyleSelect
                    value={style.justifyContent || 'flex-start'}
                    onChange={(v) => setStyle('justifyContent', v)}
                    options={['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']}
                  />
                </ControlRow>
                <ControlRow label="Align">
                  <StyleSelect
                    value={style.alignItems || 'stretch'}
                    onChange={(v) => setStyle('alignItems', v)}
                    options={['stretch', 'flex-start', 'center', 'flex-end', 'baseline']}
                  />
                </ControlRow>
                <ControlRow label="Wrap">
                  <StyleSelect
                    value={style.flexWrap || 'nowrap'}
                    onChange={(v) => setStyle('flexWrap', v)}
                    options={['nowrap', 'wrap', 'wrap-reverse']}
                  />
                </ControlRow>
              </>
            )}
            {style.display === 'grid' && (
              <ControlRow label="Columns">
                <StyleInput
                  value={style.gridTemplateColumns || ''}
                  onChange={(v) => setStyle('gridTemplateColumns', v)}
                  placeholder="repeat(3, 1fr)"
                />
              </ControlRow>
            )}
            <ControlRow label="Gap">
              <StyleInput value={style.gap || ''} onChange={(v) => setStyle('gap', v)} placeholder="16px" />
            </ControlRow>
          </div>
        )}

        {/* Spacing */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Spacing</h3>
          <ControlRow label="Padding">
            <StyleInput value={style.padding || ''} onChange={(v) => setStyle('padding', v)} placeholder="16px" />
          </ControlRow>
          <ControlRow label="Margin">
            <StyleInput value={style.margin || ''} onChange={(v) => setStyle('margin', v)} placeholder="0" />
          </ControlRow>
        </div>

        {/* Size */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Size</h3>
          <ControlRow label="Width">
            <StyleInput value={style.width || ''} onChange={(v) => setStyle('width', v)} placeholder="auto" />
          </ControlRow>
          <ControlRow label="Height">
            <StyleInput value={style.height || ''} onChange={(v) => setStyle('height', v)} placeholder="auto" />
          </ControlRow>
          <ControlRow label="Min Width">
            <StyleInput value={style.minWidth || ''} onChange={(v) => setStyle('minWidth', v)} placeholder="auto" />
          </ControlRow>
          <ControlRow label="Max Width">
            <StyleInput value={style.maxWidth || ''} onChange={(v) => setStyle('maxWidth', v)} placeholder="none" />
          </ControlRow>
        </div>

        {/* Appearance */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Appearance</h3>
          <ControlRow label="Background">
            <div className="flex gap-1 flex-1">
              <input
                type="color"
                value={style.backgroundColor?.startsWith('#') ? style.backgroundColor : '#000000'}
                onChange={(e) => setStyle('backgroundColor', e.target.value)}
                className="w-8 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <StyleInput
                value={style.backgroundColor || ''}
                onChange={(v) => setStyle('backgroundColor', v)}
                placeholder="transparent"
              />
            </div>
          </ControlRow>
          <ControlRow label="Text Color">
            <div className="flex gap-1 flex-1">
              <input
                type="color"
                value={style.color?.startsWith('#') ? style.color : '#000000'}
                onChange={(e) => setStyle('color', e.target.value)}
                className="w-8 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <StyleInput value={style.color || ''} onChange={(v) => setStyle('color', v)} placeholder="inherit" />
            </div>
          </ControlRow>
          <ControlRow label="Radius">
            <StyleInput value={style.borderRadius || ''} onChange={(v) => setStyle('borderRadius', v)} placeholder="0" />
          </ControlRow>
          <ControlRow label="Border">
            <StyleInput value={style.borderWidth || ''} onChange={(v) => setStyle('borderWidth', v)} placeholder="0" />
          </ControlRow>
          <ControlRow label="Border Color">
            <div className="flex gap-1 flex-1">
              <input
                type="color"
                value={style.borderColor?.startsWith('#') ? style.borderColor : '#000000'}
                onChange={(e) => setStyle('borderColor', e.target.value)}
                className="w-8 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <StyleInput value={style.borderColor || ''} onChange={(v) => setStyle('borderColor', v)} placeholder="none" />
            </div>
          </ControlRow>
          <ControlRow label="Shadow">
            <StyleInput
              value={style.boxShadow || ''}
              onChange={(v) => setStyle('boxShadow', v)}
              placeholder="none"
            />
          </ControlRow>
        </div>

        {/* Typography */}
        {(isTextLike || isContainer) && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Typography</h3>
            <ControlRow label="Font Size">
              <StyleInput value={style.fontSize || ''} onChange={(v) => setStyle('fontSize', v)} placeholder="16px" />
            </ControlRow>
            <ControlRow label="Font Weight">
              <StyleSelect
                value={style.fontWeight || ''}
                onChange={(v) => setStyle('fontWeight', v)}
                options={['', '300', '400', '500', '600', '700', '800', '900']}
              />
            </ControlRow>
            <ControlRow label="Line Height">
              <StyleInput value={style.lineHeight || ''} onChange={(v) => setStyle('lineHeight', v)} placeholder="1.5" />
            </ControlRow>
            <ControlRow label="Text Align">
              <StyleSelect
                value={style.textAlign || ''}
                onChange={(v) => setStyle('textAlign', v)}
                options={['', 'left', 'center', 'right', 'justify']}
              />
            </ControlRow>
            <ControlRow label="Letter Spacing">
              <StyleInput
                value={style.letterSpacing || ''}
                onChange={(v) => setStyle('letterSpacing', v)}
                placeholder="normal"
              />
            </ControlRow>
          </div>
        )}

        {/* Animation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Animation</h3>
            {anim?.type && anim.type !== 'none' && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('artbuilder:play-animation', { detail: node.id }))}
                className="flex items-center gap-1 px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-medium transition-colors"
                title="Play animation"
              >
                <Play className="w-3 h-3" />
                Play
              </button>
            )}
          </div>
          <ControlRow label="Type">
            <StyleSelect
              value={anim?.type || 'none'}
              onChange={(v) => setAnim({ type: v as any })}
              options={['none', 'fade-in', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale', 'rotate', 'flip']}
            />
          </ControlRow>
          {anim?.type && anim.type !== 'none' && (
            <>
              <ControlRow label="Trigger">
                <StyleSelect
                  value={anim?.trigger || 'load'}
                  onChange={(v) => setAnim({ trigger: v as any })}
                  options={['load', 'hover', 'in-view']}
                />
              </ControlRow>
              <ControlRow label="Duration">
                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={anim?.duration ?? 0.5}
                    onChange={(e) => setAnim({ duration: parseFloat(e.target.value) })}
                    className="flex-1 accent-purple-500"
                  />
                  <span className="text-xs text-slate-400 w-10 text-right">{anim?.duration ?? 0.5}s</span>
                </div>
              </ControlRow>
              <ControlRow label="Delay">
                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={anim?.delay ?? 0}
                    onChange={(e) => setAnim({ delay: parseFloat(e.target.value) })}
                    className="flex-1 accent-purple-500"
                  />
                  <span className="text-xs text-slate-400 w-10 text-right">{anim?.delay ?? 0}s</span>
                </div>
              </ControlRow>
              <ControlRow label="Ease">
                <StyleSelect
                  value={anim?.ease || 'easeInOut'}
                  onChange={(v) => setAnim({ ease: v })}
                  options={['linear', 'easeIn', 'easeOut', 'easeInOut', 'circIn', 'circOut', 'backIn', 'backOut', 'backInOut']}
                />
              </ControlRow>
              {isContainer && (
                <ControlRow label="Stagger">
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.05"
                      value={anim?.stagger ?? 0}
                      onChange={(e) => setAnim({ stagger: parseFloat(e.target.value) })}
                      className="flex-1 accent-purple-500"
                    />
                    <span className="text-xs text-slate-400 w-10 text-right">{anim?.stagger ?? 0}s</span>
                  </div>
                </ControlRow>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
