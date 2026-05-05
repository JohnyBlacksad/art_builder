import { useState } from 'react'

interface TabItem {
  label: string
  content: string
}

interface TabsProps {
  tabs?: TabItem[]
  style?: React.CSSProperties
}

export default function Tabs({ tabs = [], style }: TabsProps) {
  const [active, setActive] = useState(0)

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', ...style }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: active === i ? '#f8fafc' : 'white',
              borderBottom: active === i ? '2px solid #4f46e5' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: active === i ? 600 : 400,
              color: active === i ? '#4f46e5' : '#64748b',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ padding: '16px', fontSize: '0.875rem', color: '#334155' }}>
        {tabs[active]?.content || ''}
      </div>
    </div>
  )
}
