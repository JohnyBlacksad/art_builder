import { useState } from 'react'

interface SelectProps {
  options?: string[]
  placeholder?: string
  style?: React.CSSProperties
}

export default function Select({ options = [], placeholder = 'Select...', style }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ position: 'relative', ...style }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          background: 'white',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '0.875rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {selected || placeholder}
        <span>▼</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            background: 'white',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            zIndex: 10,
          }}
        >
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => { setSelected(opt); setOpen(false) }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                backgroundColor: selected === opt ? '#f8fafc' : 'white',
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
