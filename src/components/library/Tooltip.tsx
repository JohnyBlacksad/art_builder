import { useState } from 'react'

interface TooltipProps {
  content?: string
  triggerText?: string
  style?: React.CSSProperties
}

export default function Tooltip({ content = 'Tooltip text', triggerText = 'Hover me', style }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{ cursor: 'pointer', fontSize: '0.875rem', color: '#4f46e5', textDecoration: 'underline' }}
      >
        {triggerText}
      </span>
      {show && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '8px 12px',
            backgroundColor: '#1e293b',
            color: 'white',
            borderRadius: '6px',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          {content}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              borderWidth: '6px',
              borderStyle: 'solid',
              borderColor: '#1e293b transparent transparent transparent',
            }}
          />
        </div>
      )}
    </div>
  )
}
