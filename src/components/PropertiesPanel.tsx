import { useState } from 'react'
import { useStore } from '../core/store'
import { componentRegistry } from '../core/registry'
import {
  Trash2, ArrowUp, ArrowDown, Play,
  ChevronDown, ChevronRight,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  LayoutGrid, Rows3, Square,
  WrapText, StretchHorizontal,
  Space, AlignHorizontalSpaceBetween, AlignHorizontalSpaceAround, AlignVerticalDistributeCenter,
  X
} from 'lucide-react'

interface ControlRowProps {
  label: string
  children: React.ReactNode
}

function ControlRow({ label, children }: ControlRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-slate-500 w-20 shrink-0">{label}</span>
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
      className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
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
      className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt || '—'}
        </option>
      ))}
    </select>
  )
}

function ToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all border ${
        active
          ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
          : 'bg-slate-900/30 border-slate-700/30 text-slate-500 hover:text-slate-300 hover:border-slate-600/50'
      }`}
      title={label}
    >
      <Icon className="w-3.5 h-3.5" />
      {label && <span>{label}</span>}
    </button>
  )
}

function IconToggleGroup({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; icon: React.ComponentType<{ className?: string }>; label: string }[]
}) {
  return (
    <div className="flex gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`p-1.5 rounded-md transition-all ${
            value === opt.value
              ? 'bg-blue-500/15 text-blue-400'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
          title={opt.label}
        >
          <opt.icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  )
}

function CollapsibleSection({
  title,
  color,
  defaultOpen = true,
  children,
}: {
  title: string
  color: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-slate-800/50 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full py-2.5 px-1 hover:bg-slate-800/30 rounded-md transition-colors"
      >
        {open ? (
          <ChevronDown className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-slate-500" />
        )}
        <h3 className={`text-[10px] font-semibold uppercase tracking-wider ${color}`}>{title}</h3>
      </button>
      {open && <div className="pb-3 px-1 space-y-2">{children}</div>}
    </div>
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
  const interactive = (node.props.interactive as Record<string, any>) || {
    hoverScale: 1.02,
    hoverBrightness: 1.1,
    pressScale: 0.97,
  }

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

  const setInteractive = (partial: Record<string, any>) => {
    updateProps(node.id, {
      interactive: { ...interactive, ...partial },
    })
  }

  const isTextLike = ['heading', 'text', 'button'].includes(node.type)
  const isImage = node.type === 'image'
  const isContainer = ['container', 'flex', 'grid'].includes(node.type)

  return (
    <div className="w-80 h-full bg-sidebar border-l border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Properties</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {meta?.label || node.type} <span className="text-slate-700">•</span> {node.id === 'root' ? 'Page Root' : node.id.slice(0, 12)}
          </p>
        </div>
        {node.id !== 'root' && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => moveUp(node.id)}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Move up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => moveDown(node.id)}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Move down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                removeNode(node.id)
                selectNode(null)
              }}
              className="p-1.5 rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Content */}
        {isTextLike && (
          <CollapsibleSection title="Content" color="text-blue-400" defaultOpen={true}>
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-500">Text</label>
              <textarea
                value={String(node.props.text || '')}
                onChange={(e) => updateProps(node.id, { text: e.target.value })}
                rows={3}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-2.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 resize-none transition-all"
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
          </CollapsibleSection>
        )}

        {(isImage || node.type === 'video') && (
          <CollapsibleSection title={node.type === 'video' ? 'Video' : 'Image'} color="text-blue-400" defaultOpen={true}>
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-500">URL</label>
              <input
                type="text"
                value={String(node.props.src || '')}
                onChange={(e) => updateProps(node.id, { src: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-2.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>
            {node.type === 'image' && (
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-500">Alt</label>
                <input
                  type="text"
                  value={String(node.props.alt || '')}
                  onChange={(e) => updateProps(node.id, { alt: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-2.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
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
                  <label key={key} className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
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
          </CollapsibleSection>
        )}

        {/* Particles */}
        {node.type === 'particles' && (
          <CollapsibleSection title="Particles" color="text-blue-400" defaultOpen={true}>
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
                <span className="text-[11px] text-slate-400 w-10 text-right">{node.props.count || 80}</span>
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
                  className="flex-1 min-w-0 bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-blue-500/60 transition-all"
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
                <span className="text-[11px] text-slate-400 w-10 text-right">{node.props.speed || 0.5}</span>
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
                <span className="text-[11px] text-slate-400 w-10 text-right">{node.props.size || 2}</span>
              </div>
            </ControlRow>
          </CollapsibleSection>
        )}

        {/* Layout */}
        {isContainer && (
          <CollapsibleSection title="Layout" color="text-blue-400" defaultOpen={true}>
            <ControlRow label="Display">
              <div className="flex gap-1">
                <ToggleButton
                  active={style.display === 'block' || !style.display}
                  onClick={() => setStyle('display', 'block')}
                  icon={Square}
                  label="Block"
                />
                <ToggleButton
                  active={style.display === 'flex'}
                  onClick={() => setStyle('display', 'flex')}
                  icon={Rows3}
                  label="Flex"
                />
                <ToggleButton
                  active={style.display === 'grid'}
                  onClick={() => setStyle('display', 'grid')}
                  icon={LayoutGrid}
                  label="Grid"
                />
              </div>
            </ControlRow>

            {style.display?.includes('flex') && (
              <>
                <ControlRow label="Direction">
                  <div className="flex gap-1">
                    <ToggleButton
                      active={style.flexDirection === 'row' || !style.flexDirection}
                      onClick={() => setStyle('flexDirection', 'row')}
                      icon={Rows3}
                      label="Row"
                    />
                    <ToggleButton
                      active={style.flexDirection === 'column'}
                      onClick={() => setStyle('flexDirection', 'column')}
                      icon={LayoutGrid}
                      label="Col"
                    />
                  </div>
                </ControlRow>

                <ControlRow label="Justify">
                  <IconToggleGroup
                    value={style.justifyContent || 'flex-start'}
                    onChange={(v) => setStyle('justifyContent', v)}
                    options={[
                      { value: 'flex-start', icon: AlignStartVertical, label: 'Start' },
                      { value: 'center', icon: AlignCenterVertical, label: 'Center' },
                      { value: 'flex-end', icon: AlignEndVertical, label: 'End' },
                      { value: 'space-between', icon: AlignHorizontalSpaceBetween, label: 'Between' },
                      { value: 'space-around', icon: AlignHorizontalSpaceAround, label: 'Around' },
                      { value: 'space-evenly', icon: AlignVerticalDistributeCenter, label: 'Evenly' },
                    ]}
                  />
                </ControlRow>

                <ControlRow label="Align">
                  <IconToggleGroup
                    value={style.alignItems || 'stretch'}
                    onChange={(v) => setStyle('alignItems', v)}
                    options={[
                      { value: 'stretch', icon: StretchHorizontal, label: 'Stretch' },
                      { value: 'flex-start', icon: AlignStartVertical, label: 'Start' },
                      { value: 'center', icon: AlignCenterVertical, label: 'Center' },
                      { value: 'flex-end', icon: AlignEndVertical, label: 'End' },
                    ]}
                  />
                </ControlRow>

                <ControlRow label="Wrap">
                  <div className="flex gap-1">
                    <ToggleButton
                      active={style.flexWrap === 'nowrap' || !style.flexWrap}
                      onClick={() => setStyle('flexWrap', 'nowrap')}
                      icon={X}
                      label="No"
                    />
                    <ToggleButton
                      active={style.flexWrap === 'wrap'}
                      onClick={() => setStyle('flexWrap', 'wrap')}
                      icon={WrapText}
                      label="Yes"
                    />
                  </div>
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
          </CollapsibleSection>
        )}

        {/* Spacing */}
        <CollapsibleSection title="Spacing" color="text-blue-400" defaultOpen={false}>
          <ControlRow label="Padding">
            <StyleInput value={style.padding || ''} onChange={(v) => setStyle('padding', v)} placeholder="16px" />
          </ControlRow>
          <ControlRow label="Margin">
            <StyleInput value={style.margin || ''} onChange={(v) => setStyle('margin', v)} placeholder="0" />
          </ControlRow>
        </CollapsibleSection>

        {/* Size */}
        <CollapsibleSection title="Size" color="text-blue-400" defaultOpen={false}>
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
        </CollapsibleSection>

        {/* Appearance */}
        <CollapsibleSection title="Appearance" color="text-blue-400" defaultOpen={true}>
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
        </CollapsibleSection>

        {/* Effects */}
        <CollapsibleSection title="Effects" color="text-pink-400" defaultOpen={false}>
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Gradient Presets</span>
            <div className="grid grid-cols-4 gap-1">
              {[
                { name: 'Sunset', value: 'linear-gradient(to right, #f97316, #db2777)' },
                { name: 'Ocean', value: 'linear-gradient(to right, #0ea5e9, #6366f1)' },
                { name: 'Neon', value: 'linear-gradient(to right, #22c55e, #3b82f6)' },
                { name: 'Purple', value: 'linear-gradient(to right, #7c3aed, #db2777)' },
                { name: 'Fire', value: 'linear-gradient(to right, #ef4444, #f97316)' },
                { name: 'Ice', value: 'linear-gradient(to right, #06b6d4, #3b82f6)' },
                { name: 'Gold', value: 'linear-gradient(to right, #eab308, #f97316)' },
                { name: 'Midnight', value: 'linear-gradient(to right, #1e3a8a, #7c3aed)' },
              ].map((g) => (
                <button
                  key={g.name}
                  onClick={() => setStyle('backgroundImage', g.value)}
                  className="h-8 rounded-md border border-white/10 hover:border-white/30 transition-colors"
                  style={{ backgroundImage: g.value }}
                  title={g.name}
                />
              ))}
            </div>
          </div>
          <ControlRow label="BG Image">
            <StyleInput value={style.backgroundImage || ''} onChange={(v) => setStyle('backgroundImage', v)} placeholder="none or url(...)" />
          </ControlRow>
          <ControlRow label="Filter">
            <StyleInput value={style.filter || ''} onChange={(v) => setStyle('filter', v)} placeholder="blur(8px) brightness(1.1)" />
          </ControlRow>
          <ControlRow label="Backdrop">
            <StyleInput value={style.backdropFilter || ''} onChange={(v) => setStyle('backdropFilter', v)} placeholder="blur(12px)" />
          </ControlRow>
          <ControlRow label="Opacity">
            <div className="flex items-center gap-1 flex-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={parseFloat(style.opacity || '1')}
                onChange={(e) => setStyle('opacity', e.target.value)}
                className="flex-1 accent-pink-500"
              />
              <span className="text-[11px] text-slate-400 w-10 text-right">{style.opacity || '1'}</span>
            </div>
          </ControlRow>
        </CollapsibleSection>

        {/* Typography */}
        {(isTextLike || isContainer) && (
          <CollapsibleSection title="Typography" color="text-blue-400" defaultOpen={false}>
            <ControlRow label="Font Family">
              <StyleSelect
                value={style.fontFamily || ''}
                onChange={(v) => setStyle('fontFamily', v)}
                options={['', 'Inter', 'Roboto', 'Playfair Display', 'Montserrat', 'Poppins', 'Open Sans', 'Lato', 'Merriweather']}
              />
            </ControlRow>
            <ControlRow label="Font Size">
              <StyleInput value={style.fontSize || ''} onChange={(v) => setStyle('fontSize', v)} placeholder="16px" />
            </ControlRow>
            <ControlRow label="Weight">
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
              <IconToggleGroup
                value={style.textAlign || 'left'}
                onChange={(v) => setStyle('textAlign', v)}
                options={[
                  { value: 'left', icon: AlignLeft, label: 'Left' },
                  { value: 'center', icon: AlignCenter, label: 'Center' },
                  { value: 'right', icon: AlignRight, label: 'Right' },
                  { value: 'justify', icon: AlignJustify, label: 'Justify' },
                ]}
              />
            </ControlRow>
            <ControlRow label="Letter Spacing">
              <StyleInput
                value={style.letterSpacing || ''}
                onChange={(v) => setStyle('letterSpacing', v)}
                placeholder="normal"
              />
            </ControlRow>
          </CollapsibleSection>
        )}

        {/* Interactive Data */}
        {['accordion', 'dialog', 'tabs', 'select', 'tooltip', 'slider', 'switch'].includes(node.type) && (
          <CollapsibleSection title="Data" color="text-orange-400" defaultOpen={true}>
            <textarea
              className="w-full h-32 bg-slate-900/50 text-slate-200 text-xs p-2 rounded border border-slate-700/50 font-mono resize-none focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-all"
              defaultValue={JSON.stringify(node.props, null, 2)}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  updateProps(node.id, parsed)
                } catch {
                  // ignore invalid json
                }
              }}
            />
            <p className="text-[10px] text-slate-500">Edit as JSON. Be careful with syntax.</p>
          </CollapsibleSection>
        )}

        {/* Animation */}
        <CollapsibleSection title="Animation" color="text-purple-400" defaultOpen={false}>
          <div className="flex items-center justify-between mb-2">
            <ControlRow label="Type">
              <StyleSelect
                value={anim?.type || 'none'}
                onChange={(v) => setAnim({ type: v as any })}
                options={['none', 'fade-in', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale', 'rotate', 'flip']}
              />
            </ControlRow>
            {anim?.type && anim.type !== 'none' && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('artbuilder:play-animation', { detail: node.id }))}
                className="flex items-center gap-1 px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-medium transition-colors ml-2"
                title="Play animation"
              >
                <Play className="w-3 h-3" />
                Play
              </button>
            )}
          </div>
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
                  <span className="text-[11px] text-slate-400 w-10 text-right">{anim?.duration ?? 0.5}s</span>
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
                  <span className="text-[11px] text-slate-400 w-10 text-right">{anim?.delay ?? 0}s</span>
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
                    <span className="text-[11px] text-slate-400 w-10 text-right">{anim?.stagger ?? 0}s</span>
                  </div>
                </ControlRow>
              )}
            </>
          )}
        </CollapsibleSection>

        {/* Interactive States */}
        <CollapsibleSection title="Interactive States" color="text-emerald-400" defaultOpen={false}>
          <ControlRow label="Hover Scale">
            <div className="flex items-center gap-1 flex-1">
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={interactive?.hoverScale ?? 1.02}
                onChange={(e) => setInteractive({ hoverScale: parseFloat(e.target.value) })}
                className="flex-1 accent-emerald-500"
              />
              <span className="text-[11px] text-slate-400 w-10 text-right">{interactive?.hoverScale ?? 1.02}x</span>
            </div>
          </ControlRow>
          <ControlRow label="Hover Brightness">
            <div className="flex items-center gap-1 flex-1">
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={interactive?.hoverBrightness ?? 1.1}
                onChange={(e) => setInteractive({ hoverBrightness: parseFloat(e.target.value) })}
                className="flex-1 accent-emerald-500"
              />
              <span className="text-[11px] text-slate-400 w-10 text-right">{interactive?.hoverBrightness ?? 1.1}</span>
            </div>
          </ControlRow>
          <ControlRow label="Press Scale">
            <div className="flex items-center gap-1 flex-1">
              <input
                type="range"
                min="0.8"
                max="1.0"
                step="0.05"
                value={interactive?.pressScale ?? 0.97}
                onChange={(e) => setInteractive({ pressScale: parseFloat(e.target.value) })}
                className="flex-1 accent-emerald-500"
              />
              <span className="text-[11px] text-slate-400 w-10 text-right">{interactive?.pressScale ?? 0.97}x</span>
            </div>
          </ControlRow>
        </CollapsibleSection>
      </div>
    </div>
  )
}
