import { useState } from 'react'

interface DialogProps {
  triggerText?: string
  title?: string
  content?: string
  style?: React.CSSProperties
}

export default function Dialog({ triggerText = 'Open', title = 'Dialog Title', content = 'Dialog content...', style }: DialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <div style={style}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#4f46e5',
          color: 'white',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {triggerText}
      </button>
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: '1.125rem', fontWeight: 600 }}>{title}</h3>
            <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '0.875rem' }}>{content}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
