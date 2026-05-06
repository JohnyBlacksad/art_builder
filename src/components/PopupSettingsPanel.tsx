import { useStore, type Popup, type PopupSettings } from '../core/store'
import { X, PanelTop, PanelBottom, PanelLeft, PanelRight, Maximize, MessageSquare } from 'lucide-react'

const typeLabels: Record<string, string> = {
  modal: 'Modal (centered)',
  'drawer-left': 'Left Drawer',
  'drawer-right': 'Right Drawer',
  fullscreen: 'Fullscreen',
  'bottom-sheet': 'Bottom Sheet',
  toast: 'Toast Notification',
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  modal: MessageSquare,
  'drawer-left': PanelLeft,
  'drawer-right': PanelRight,
  fullscreen: Maximize,
  'bottom-sheet': PanelBottom,
  toast: PanelTop,
}

const animationLabels: Record<string, string> = {
  none: 'None',
  fade: 'Fade',
  'slide-up': 'Slide Up',
  'slide-down': 'Slide Down',
  'slide-left': 'Slide Left',
  'slide-right': 'Slide Right',
  scale: 'Scale',
  zoom: 'Zoom',
}

const positionLabels: Record<string, string> = {
  center: 'Center',
  top: 'Top',
  bottom: 'Bottom',
  left: 'Left',
  right: 'Right',
  'top-left': 'Top Left',
  'top-right': 'Top Right',
  'bottom-left': 'Bottom Left',
  'bottom-right': 'Bottom Right',
}

export default function PopupSettingsPanel() {
  const currentPopupId = useStore((s) => s.currentPopupId)
  const popups = useStore((s) => s.popups)
  const updatePopupSettings = useStore((s) => s.updatePopupSettings)

  const popup = popups.find((p) => p.id === currentPopupId)
  if (!popup) return null

  const s = popup.settings

  const update = (partial: Partial<PopupSettings>) => {
    if (currentPopupId) {
      updatePopupSettings(currentPopupId, partial)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-sidebar-border">
        <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-200">Popup Settings</h3>
          <p className="text-[10px] text-slate-500">{popup.name}</p>
        </div>
      </div>

      {/* Type */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Type</label>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(typeLabels).map(([key, label]) => {
            const Icon = typeIcons[key]
            const active = popup.type === key
            return (
              <button
                key={key}
                onClick={() => update({})}
                disabled={true}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium transition-colors border ${
                  active
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                    : 'bg-slate-800/50 border-slate-700/40 text-slate-500 hover:bg-slate-800'
                }`}
                title="Type is set at creation. Delete and recreate to change."
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            )
          })}
        </div>
        <p className="text-[9px] text-slate-600">Type is set at creation. Delete and recreate to change.</p>
      </div>

      {/* Size */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Size</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] text-slate-500 block mb-1">Width</label>
            <input
              type="text"
              value={s.width || ''}
              onChange={(e) => update({ width: e.target.value })}
              placeholder="500px"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="text-[9px] text-slate-500 block mb-1">Height</label>
            <input
              type="text"
              value={s.height || ''}
              onChange={(e) => update({ height: e.target.value })}
              placeholder="auto"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="text-[9px] text-slate-500 block mb-1">Max Width</label>
            <input
              type="text"
              value={s.maxWidth || ''}
              onChange={(e) => update({ maxWidth: e.target.value })}
              placeholder="90vw"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="text-[9px] text-slate-500 block mb-1">Max Height</label>
            <input
              type="text"
              value={s.maxHeight || ''}
              onChange={(e) => update({ maxHeight: e.target.value })}
              placeholder="80vh"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Backdrop</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={s.backdropColor || '#000000'}
            onChange={(e) => update({ backdropColor: e.target.value })}
            className="w-8 h-8 rounded bg-transparent border-0 p-0 cursor-pointer"
          />
          <div className="flex-1">
            <label className="text-[9px] text-slate-500 block mb-1">Opacity: {Math.round((s.backdropOpacity || 0.6) * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={s.backdropOpacity || 0.6}
              onChange={(e) => update({ backdropOpacity: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 h-1 bg-slate-700 rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Close Button</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => update({ showCloseButton: !(s.showCloseButton ?? true) })}
            className={`w-8 h-4 rounded-full transition-colors relative ${
              s.showCloseButton ?? true ? 'bg-purple-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                s.showCloseButton ?? true ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className="text-[11px] text-slate-300">{s.showCloseButton ?? true ? 'Visible' : 'Hidden'}</span>
        </div>
        {(s.showCloseButton ?? true) && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              value={s.closeButtonColor || '#94a3b8'}
              onChange={(e) => update({ closeButtonColor: e.target.value })}
              className="w-6 h-6 rounded bg-transparent border-0 p-0 cursor-pointer"
            />
            <span className="text-[9px] text-slate-500">Color</span>
            <input
              type="number"
              value={s.closeButtonSize || 16}
              onChange={(e) => update({ closeButtonSize: parseInt(e.target.value) || 16 })}
              min={8}
              max={32}
              className="w-12 bg-slate-900/50 border border-slate-700/50 rounded-md px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none"
            />
            <span className="text-[9px] text-slate-500">px</span>
          </div>
        )}
      </div>

      {/* Animation */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Animation</label>
        <select
          value={s.animation || 'fade'}
          onChange={(e) => update({ animation: e.target.value as PopupSettings['animation'] })}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/60"
        >
          {Object.entries(animationLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Position */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Position</label>
        <select
          value={s.position || 'center'}
          onChange={(e) => update({ position: e.target.value as PopupSettings['position'] })}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/60"
        >
          {Object.entries(positionLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Auto-close */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Auto Close</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={s.autoCloseDelay || 0}
            onChange={(e) => update({ autoCloseDelay: parseInt(e.target.value) || 0 })}
            min={0}
            max={60}
            className="w-16 bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none"
          />
          <span className="text-[11px] text-slate-400">seconds (0 = off)</span>
        </div>
      </div>

      {/* Close behavior */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Close Behavior</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => update({ closeOnBackdropClick: !(s.closeOnBackdropClick ?? true) })}
            className={`w-8 h-4 rounded-full transition-colors relative ${
              s.closeOnBackdropClick ?? true ? 'bg-purple-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                s.closeOnBackdropClick ?? true ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className="text-[11px] text-slate-300">Click backdrop to close</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => update({ closeOnEscape: !(s.closeOnEscape ?? true) })}
            className={`w-8 h-4 rounded-full transition-colors relative ${
              s.closeOnEscape ?? true ? 'bg-purple-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                s.closeOnEscape ?? true ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className="text-[11px] text-slate-300">Press Escape to close</span>
        </div>
      </div>

      {/* Auto Trigger */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Auto Trigger</label>
        <select
          value={s.trigger || 'none'}
          onChange={(e) => update({ trigger: e.target.value as PopupSettings['trigger'] })}
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/60"
        >
          <option value="none">None (manual only)</option>
          <option value="load">On Page Load</option>
          <option value="scroll">On Scroll to Element</option>
          <option value="exit-intent">On Exit Intent</option>
        </select>
        {s.trigger === 'load' && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] text-slate-500">Delay:</span>
            <input
              type="number"
              value={s.delay || 0}
              onChange={(e) => update({ delay: parseInt(e.target.value) || 0 })}
              min={0}
              max={60}
              className="w-14 bg-slate-900/50 border border-slate-700/50 rounded-md px-1.5 py-0.5 text-[11px] text-slate-200 focus:outline-none"
            />
            <span className="text-[9px] text-slate-500">seconds</span>
          </div>
        )}
        {s.trigger === 'scroll' && (
          <div className="mt-1">
            <span className="text-[9px] text-slate-500">Target element ID:</span>
            <input
              type="text"
              value={s.scrollTarget || ''}
              onChange={(e) => update({ scrollTarget: e.target.value })}
              placeholder="e.g. pricing-section"
              className="w-full mt-1 bg-slate-900/50 border border-slate-700/50 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
        )}
      </div>
    </div>
  )
}
