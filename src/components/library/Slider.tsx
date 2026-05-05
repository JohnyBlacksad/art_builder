import { useState } from 'react'

interface SliderProps {
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  style?: React.CSSProperties
}

export default function Slider({ min = 0, max = 100, step = 1, defaultValue = 50, style }: SliderProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div style={{ padding: '8px 0', ...style }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#4f46e5' }}
      />
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
        {value}
      </div>
    </div>
  )
}
