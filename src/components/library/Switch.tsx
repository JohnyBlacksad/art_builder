import { useState } from 'react'

interface SwitchProps {
  label?: string
  defaultChecked?: boolean
  style?: React.CSSProperties
}

export default function Switch({ label = 'Toggle', defaultChecked = false, style }: SwitchProps) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.875rem', ...style }}>
      <div
        onClick={() => setChecked(!checked)}
        style={{
          width: '40px',
          height: '24px',
          borderRadius: '12px',
          backgroundColor: checked ? '#4f46e5' : '#cbd5e1',
          position: 'relative',
          transition: 'background-color 200ms',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'white',
            position: 'absolute',
            top: '2px',
            left: checked ? '18px' : '2px',
            transition: 'left 200ms',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        />
      </div>
      {label}
    </label>
  )
}
