import { useState, useEffect, useCallback } from 'react'
import { useStore } from '../core/store'
import NodeRenderer from '../renderer/NodeRenderer'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const positionClasses: Record<string, string> = {
  center: 'items-center justify-center',
  top: 'items-start justify-center',
  bottom: 'items-end justify-center',
  left: 'items-center justify-start',
  right: 'items-center justify-end',
  'top-left': 'items-start justify-start',
  'top-right': 'items-start justify-end',
  'bottom-left': 'items-end justify-start',
  'bottom-right': 'items-end justify-end',
}

const animationVariants: Record<string, { initial: any; animate: any; exit: any }> = {
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  'slide-down': {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  'slide-left': {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  'slide-right': {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  },
}

export default function PopupPreview() {
  const popups = useStore((s) => s.popups)
  const [openPopupId, setOpenPopupId] = useState<string | null>(null)
  const [autoCloseTimer, setAutoCloseTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const popup = popups.find((p) => p.id === openPopupId)

  const closePopup = useCallback(() => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
      setAutoCloseTimer(null)
    }
    setOpenPopupId(null)
  }, [autoCloseTimer])

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<string>
      if (custom.detail) {
        setOpenPopupId(custom.detail)
      }
    }
    window.addEventListener('artbuilder:open-dialog', handler)
    return () => window.removeEventListener('artbuilder:open-dialog', handler)
  }, [])

  // Auto-close timer
  useEffect(() => {
    if (popup?.settings.autoCloseDelay && popup.settings.autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        setOpenPopupId(null)
      }, popup.settings.autoCloseDelay * 1000)
      setAutoCloseTimer(timer)
      return () => clearTimeout(timer)
    }
  }, [popup])

  // Escape key handler
  useEffect(() => {
    if (!popup) return
    if (popup.settings.closeOnEscape === false) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopup()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [popup, closePopup])

  if (!popup) return null

  const s = popup.settings
  const posClass = positionClasses[s.position || 'center'] || positionClasses.center
  const anim = animationVariants[s.animation || 'fade'] || animationVariants.fade

  const backdropStyle: React.CSSProperties = {
    backgroundColor: s.backdropColor || '#000000',
    opacity: s.backdropOpacity ?? 0.6,
  }

  const popupStyle: React.CSSProperties = {
    width: s.width || '500px',
    height: s.height || 'auto',
    maxWidth: s.maxWidth || '90vw',
    maxHeight: s.maxHeight || '80vh',
    borderRadius: popup.type === 'modal' ? '12px' : popup.type === 'bottom-sheet' ? '12px 12px 0 0' : popup.type === 'toast' ? '8px' : '0',
    overflow: 'auto',
  }

  // Drawer / toast positioning in preview
  if (popup.type === 'drawer-left') {
    popupStyle.position = 'absolute'
    popupStyle.left = 0
    popupStyle.top = 0
    popupStyle.height = '100%'
  } else if (popup.type === 'drawer-right') {
    popupStyle.position = 'absolute'
    popupStyle.right = 0
    popupStyle.top = 0
    popupStyle.height = '100%'
  } else if (popup.type === 'bottom-sheet') {
    popupStyle.position = 'absolute'
    popupStyle.bottom = 0
    popupStyle.left = 0
  } else if (popup.type === 'fullscreen') {
    popupStyle.width = '100%'
    popupStyle.height = '100%'
  } else if (popup.type === 'toast') {
    popupStyle.position = 'absolute'
    popupStyle.bottom = '16px'
    popupStyle.right = '16px'
    popupStyle.width = s.width || '380px'
  }

  const showClose = s.showCloseButton !== false

  return (
    <AnimatePresence>
      <motion.div
        key={popup.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex ${posClass} p-4`}
        style={backdropStyle}
        onClick={() => {
          if (s.closeOnBackdropClick !== false) {
            closePopup()
          }
        }}
      >
        <motion.div
          initial={anim.initial}
          animate={anim.animate}
          exit={anim.exit}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white shadow-2xl relative"
          style={popupStyle}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          {showClose && (
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10"
              style={{ color: s.closeButtonColor || '#94a3b8' }}
            >
              <X style={{ width: s.closeButtonSize || 16, height: s.closeButtonSize || 16 }} />
            </button>
          )}

          <NodeRenderer node={popup.root} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
