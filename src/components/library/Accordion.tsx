import { useState } from 'react'

interface AccordionItem {
  title: string
  content: string
}

interface AccordionProps {
  items?: AccordionItem[]
  style?: React.CSSProperties
}

export default function Accordion({ items = [], style }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', ...style }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid #e2e8f0' : undefined }}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875rem',
              }}
            >
              {item.title}
              <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>▼</span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 300ms ease-out',
              }}
            >
              <div style={{ padding: '0 16px 12px', fontSize: '0.875rem', color: '#64748b' }}>
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
