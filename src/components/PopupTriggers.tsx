import { useEffect } from 'react'
import { useStore } from '../core/store'

export default function PopupTriggers() {
  const popups = useStore((s) => s.popups)

  useEffect(() => {
    // On Load triggers
    const timers: ReturnType<typeof setTimeout>[] = []
    popups.forEach((popup) => {
      if (popup.settings.trigger === 'load') {
        const delay = (popup.settings.delay || 0) * 1000
        const timer = setTimeout(() => {
          window.dispatchEvent(new CustomEvent('artbuilder:open-dialog', { detail: popup.id }))
        }, delay)
        timers.push(timer)
      }
    })

    // Scroll triggers
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetId = entry.target.getAttribute('data-scroll-trigger')
            if (targetId) {
              const popup = popups.find(
                (p) => p.settings.trigger === 'scroll' && p.settings.scrollTarget === targetId
              )
              if (popup) {
                window.dispatchEvent(new CustomEvent('artbuilder:open-dialog', { detail: popup.id }))
              }
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    popups.forEach((popup) => {
      if (popup.settings.trigger === 'scroll' && popup.settings.scrollTarget) {
        const el = document.querySelector(`[data-scroll-trigger="${popup.settings.scrollTarget}"]`)
        if (el) {
          scrollObserver.observe(el)
        }
      }
    })

    // Exit intent trigger
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        popups.forEach((popup) => {
          if (popup.settings.trigger === 'exit-intent') {
            window.dispatchEvent(new CustomEvent('artbuilder:open-dialog', { detail: popup.id }))
          }
        })
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      timers.forEach(clearTimeout)
      scrollObserver.disconnect()
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [popups])

  return null
}
