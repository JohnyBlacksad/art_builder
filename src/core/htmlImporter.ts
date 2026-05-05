import { createNode } from './store'
import type { ComponentNode } from './types'

const tailwindColors: Record<string, string> = {
  'white': '#ffffff', 'black': '#000000',
  'slate-50': '#f8fafc', 'slate-100': '#f1f5f9', 'slate-200': '#e2e8f0', 'slate-300': '#cbd5e1',
  'slate-400': '#94a3b8', 'slate-500': '#64748b', 'slate-600': '#475569', 'slate-700': '#334155',
  'slate-800': '#1e293b', 'slate-900': '#0f172a', 'slate-950': '#020617',
  'gray-50': '#f9fafb', 'gray-100': '#f3f4f6', 'gray-200': '#e5e7eb', 'gray-300': '#d1d5db',
  'gray-400': '#9ca3af', 'gray-500': '#6b7280', 'gray-600': '#4b5563', 'gray-700': '#374151',
  'gray-800': '#1f2937', 'gray-900': '#111827', 'gray-950': '#030712',
  'zinc-50': '#fafafa', 'zinc-100': '#f4f4f5', 'zinc-200': '#e4e4e7', 'zinc-300': '#d4d4d8',
  'zinc-400': '#a1a1aa', 'zinc-500': '#71717a', 'zinc-600': '#52525b', 'zinc-700': '#3f3f46',
  'zinc-800': '#27272a', 'zinc-900': '#18181b', 'zinc-950': '#09090b',
  'red-50': '#fef2f2', 'red-100': '#fee2e2', 'red-200': '#fecaca', 'red-300': '#fca5a5',
  'red-400': '#f87171', 'red-500': '#ef4444', 'red-600': '#dc2626', 'red-700': '#b91c1c',
  'red-800': '#991b1b', 'red-900': '#7f1d1d',
  'orange-50': '#fff7ed', 'orange-100': '#ffedd5', 'orange-200': '#fed7aa', 'orange-300': '#fdba74',
  'orange-400': '#fb923c', 'orange-500': '#f97316', 'orange-600': '#ea580c', 'orange-700': '#c2410c',
  'orange-800': '#9a3412', 'orange-900': '#7c2d12',
  'amber-50': '#fffbeb', 'amber-100': '#fef3c7', 'amber-200': '#fde68a', 'amber-300': '#fcd34d',
  'amber-400': '#fbbf24', 'amber-500': '#f59e0b', 'amber-600': '#d97706', 'amber-700': '#b45309',
  'amber-800': '#92400e', 'amber-900': '#78350f',
  'yellow-50': '#fefce8', 'yellow-100': '#fef9c3', 'yellow-200': '#fef08a', 'yellow-300': '#fde047',
  'yellow-400': '#facc15', 'yellow-500': '#eab308', 'yellow-600': '#ca8a04', 'yellow-700': '#a16207',
  'yellow-800': '#854d0e', 'yellow-900': '#713f12',
  'green-50': '#f0fdf4', 'green-100': '#dcfce7', 'green-200': '#bbf7d0', 'green-300': '#86efac',
  'green-400': '#4ade80', 'green-500': '#22c55e', 'green-600': '#16a34a', 'green-700': '#15803d',
  'green-800': '#166534', 'green-900': '#14532d',
  'emerald-50': '#ecfdf5', 'emerald-100': '#d1fae5', 'emerald-200': '#a7f3d0', 'emerald-300': '#6ee7b7',
  'emerald-400': '#34d399', 'emerald-500': '#10b981', 'emerald-600': '#059669', 'emerald-700': '#047857',
  'emerald-800': '#065f46', 'emerald-900': '#064e3b',
  'teal-50': '#f0fdfa', 'teal-100': '#ccfbf1', 'teal-200': '#99f6e4', 'teal-300': '#5eead4',
  'teal-400': '#2dd4bf', 'teal-500': '#14b8a6', 'teal-600': '#0d9488', 'teal-700': '#0f766e',
  'teal-800': '#115e59', 'teal-900': '#134e4a',
  'cyan-50': '#ecfeff', 'cyan-100': '#cffafe', 'cyan-200': '#a5f3fc', 'cyan-300': '#67e8f9',
  'cyan-400': '#22d3ee', 'cyan-500': '#06b6d4', 'cyan-600': '#0891b2', 'cyan-700': '#0e7490',
  'cyan-800': '#155e75', 'cyan-900': '#164e63',
  'sky-50': '#f0f9ff', 'sky-100': '#e0f2fe', 'sky-200': '#bae6fd', 'sky-300': '#7dd3fc',
  'sky-400': '#38bdf8', 'sky-500': '#0ea5e9', 'sky-600': '#0284c7', 'sky-700': '#0369a1',
  'sky-800': '#075985', 'sky-900': '#0c4a6e',
  'blue-50': '#eff6ff', 'blue-100': '#dbeafe', 'blue-200': '#bfdbfe', 'blue-300': '#93c5fd',
  'blue-400': '#60a5fa', 'blue-500': '#3b82f6', 'blue-600': '#2563eb', 'blue-700': '#1d4ed8',
  'blue-800': '#1e40af', 'blue-900': '#1e3a8a',
  'indigo-50': '#eef2ff', 'indigo-100': '#e0e7ff', 'indigo-200': '#c7d2fe', 'indigo-300': '#a5b4fc',
  'indigo-400': '#818cf8', 'indigo-500': '#6366f1', 'indigo-600': '#4f46e5', 'indigo-700': '#4338ca',
  'indigo-800': '#3730a3', 'indigo-900': '#312e81',
  'violet-50': '#f5f3ff', 'violet-100': '#ede9fe', 'violet-200': '#ddd6fe', 'violet-300': '#c4b5fd',
  'violet-400': '#a78bfa', 'violet-500': '#8b5cf6', 'violet-600': '#7c3aed', 'violet-700': '#6d28d9',
  'violet-800': '#5b21b6', 'violet-900': '#4c1d95',
  'purple-50': '#faf5ff', 'purple-100': '#f3e8ff', 'purple-200': '#e9d5ff', 'purple-300': '#d8b4fe',
  'purple-400': '#c084fc', 'purple-500': '#a855f7', 'purple-600': '#9333ea', 'purple-700': '#7e22ce',
  'purple-800': '#6b21a8', 'purple-900': '#581c87',
  'fuchsia-50': '#fdf4ff', 'fuchsia-100': '#fae8ff', 'fuchsia-200': '#f5d0fe', 'fuchsia-300': '#f0abfc',
  'fuchsia-400': '#e879f9', 'fuchsia-500': '#d946ef', 'fuchsia-600': '#c026d3', 'fuchsia-700': '#a21caf',
  'fuchsia-800': '#86198f', 'fuchsia-900': '#701a75',
  'pink-50': '#fdf2f8', 'pink-100': '#fce7f3', 'pink-200': '#fbcfe8', 'pink-300': '#f9a8d4',
  'pink-400': '#f472b6', 'pink-500': '#ec4899', 'pink-600': '#db2777', 'pink-700': '#be185d',
  'pink-800': '#9d174d', 'pink-900': '#831843',
  'rose-50': '#fff1f2', 'rose-100': '#ffe4e6', 'rose-200': '#fecdd3', 'rose-300': '#fda4af',
  'rose-400': '#fb7185', 'rose-500': '#f43f5e', 'rose-600': '#e11d48', 'rose-700': '#be123c',
  'rose-800': '#9f1239', 'rose-900': '#881337',
}

function sizeValue(n: string): string {
  if (n.includes('/')) return n
  const num = parseFloat(n)
  if (isNaN(num)) return n
  return `${num * 0.25}rem`
}

function parseCustomColor(colorName: string): string {
  if (colorName.startsWith('[') && colorName.endsWith(']')) {
    return colorName.slice(1, -1)
  }
  return tailwindColors[colorName] || colorName
}

function parseGradient(classes: string[]): string | null {
  const dirMap: Record<string, string> = {
    'bg-gradient-to-t': 'to top', 'bg-gradient-to-tr': 'to top right',
    'bg-gradient-to-r': 'to right', 'bg-gradient-to-br': 'to bottom right',
    'bg-gradient-to-b': 'to bottom', 'bg-gradient-to-bl': 'to bottom left',
    'bg-gradient-to-l': 'to left', 'bg-gradient-to-tl': 'to top left',
    'bg-linear-to-t': 'to top', 'bg-linear-to-tr': 'to top right',
    'bg-linear-to-r': 'to right', 'bg-linear-to-br': 'to bottom right',
    'bg-linear-to-b': 'to bottom', 'bg-linear-to-bl': 'to bottom left',
    'bg-linear-to-l': 'to left', 'bg-linear-to-tl': 'to top left',
  }

  let direction: string | null = null
  let fromColor: string | null = null
  let viaColor: string | null = null
  let toColor: string | null = null

  for (const cls of classes) {
    const c = cls.replace(/^(sm|md|lg|xl|2xl):/, '')
    if (dirMap[c]) direction = dirMap[c]
    if (c.startsWith('from-')) {
      const colorName = c.slice(5)
      fromColor = parseCustomColor(colorName)
    }
    if (c.startsWith('via-')) {
      const colorName = c.slice(4)
      viaColor = parseCustomColor(colorName)
    }
    if (c.startsWith('to-') && !c.startsWith('to-top') && !c.startsWith('to-bottom') && !c.startsWith('to-left') && !c.startsWith('to-right') && !dirMap[c]) {
      const colorName = c.slice(3)
      toColor = parseCustomColor(colorName)
    }
  }

  if (!direction) return null
  const stops: string[] = []
  if (fromColor) stops.push(fromColor)
  if (viaColor) stops.push(viaColor)
  if (toColor) stops.push(toColor)
  if (stops.length < 2 && fromColor) stops.push('transparent')
  if (stops.length < 2) return null

  return `linear-gradient(${direction}, ${stops.join(', ')})`
}

function parseTailwindClasses(className: string): Record<string, string> {
  const style: Record<string, string> = {}
  const classes = className.split(/\s+/).filter(Boolean)

  // Gradient
  const gradient = parseGradient(classes)
  if (gradient) style.backgroundImage = gradient

  for (const cls of classes) {
    const c = cls.replace(/^(sm|md|lg|xl|2xl):/, '')

    if (c === 'flex') style.display = 'flex'
    if (c === 'grid') style.display = 'grid'
    if (c === 'block') style.display = 'block'
    if (c === 'inline-block') style.display = 'inline-block'
    if (c === 'inline-flex') style.display = 'inline-flex'
    if (c === 'hidden') style.display = 'none'

    if (c === 'flex-row') style.flexDirection = 'row'
    if (c === 'flex-col') style.flexDirection = 'column'
    if (c === 'flex-row-reverse') style.flexDirection = 'row-reverse'
    if (c === 'flex-col-reverse') style.flexDirection = 'column-reverse'
    if (c === 'flex-wrap') style.flexWrap = 'wrap'
    if (c === 'flex-nowrap') style.flexWrap = 'nowrap'

    const justifyMatch = c.match(/^justify-(start|end|center|between|around|evenly)$/)
    if (justifyMatch) {
      const map: Record<string, string> = { start: 'flex-start', end: 'flex-end', between: 'space-between', around: 'space-around', evenly: 'space-evenly', center: 'center' }
      style.justifyContent = map[justifyMatch[1]]
    }

    const itemsMatch = c.match(/^items-(start|end|center|stretch|baseline)$/)
    if (itemsMatch) {
      const map: Record<string, string> = { start: 'flex-start', end: 'flex-end', center: 'center', stretch: 'stretch', baseline: 'baseline' }
      style.alignItems = map[itemsMatch[1]]
    }

    const gapMatch = c.match(/^gap-(\d+\.?\d*|px)$/)
    if (gapMatch) style.gap = gapMatch[1] === 'px' ? '1px' : sizeValue(gapMatch[1])
    const gapXMatch = c.match(/^gap-x-(\d+\.?\d*|px)$/)
    if (gapXMatch) style.columnGap = gapXMatch[1] === 'px' ? '1px' : sizeValue(gapXMatch[1])
    const gapYMatch = c.match(/^gap-y-(\d+\.?\d*|px)$/)
    if (gapYMatch) style.rowGap = gapYMatch[1] === 'px' ? '1px' : sizeValue(gapYMatch[1])

    const pMatch = c.match(/^p-(\d+\.?\d*|px)$/)
    if (pMatch) style.padding = pMatch[1] === 'px' ? '1px' : sizeValue(pMatch[1])
    const pxMatch = c.match(/^px-(\d+\.?\d*|px)$/)
    if (pxMatch) { const v = pxMatch[1] === 'px' ? '1px' : sizeValue(pxMatch[1]); style.paddingLeft = v; style.paddingRight = v }
    const pyMatch = c.match(/^py-(\d+\.?\d*|px)$/)
    if (pyMatch) { const v = pyMatch[1] === 'px' ? '1px' : sizeValue(pyMatch[1]); style.paddingTop = v; style.paddingBottom = v }
    const ptMatch = c.match(/^pt-(\d+\.?\d*|px)$/)
    if (ptMatch) style.paddingTop = ptMatch[1] === 'px' ? '1px' : sizeValue(ptMatch[1])
    const pbMatch = c.match(/^pb-(\d+\.?\d*|px)$/)
    if (pbMatch) style.paddingBottom = pbMatch[1] === 'px' ? '1px' : sizeValue(pbMatch[1])
    const plMatch = c.match(/^pl-(\d+\.?\d*|px)$/)
    if (plMatch) style.paddingLeft = plMatch[1] === 'px' ? '1px' : sizeValue(plMatch[1])
    const prMatch = c.match(/^pr-(\d+\.?\d*|px)$/)
    if (prMatch) style.paddingRight = prMatch[1] === 'px' ? '1px' : sizeValue(prMatch[1])

    const mMatch = c.match(/^m-(\d+\.?\d*|px|-\d+\.?\d*)$/)
    if (mMatch) style.margin = mMatch[1] === 'px' ? '1px' : mMatch[1].startsWith('-') ? `-${sizeValue(mMatch[1].slice(1))}` : sizeValue(mMatch[1])
    const mxMatch = c.match(/^mx-(\d+\.?\d*|px)$/)
    if (mxMatch) { const v = mxMatch[1] === 'px' ? '1px' : sizeValue(mxMatch[1]); style.marginLeft = v; style.marginRight = v }
    const myMatch = c.match(/^my-(\d+\.?\d*|px)$/)
    if (myMatch) { const v = myMatch[1] === 'px' ? '1px' : sizeValue(myMatch[1]); style.marginTop = v; style.marginBottom = v }
    const mtMatch = c.match(/^mt-(\d+\.?\d*|px)$/)
    if (mtMatch) style.marginTop = mtMatch[1] === 'px' ? '1px' : sizeValue(mtMatch[1])
    const mbMatch = c.match(/^mb-(\d+\.?\d*|px)$/)
    if (mbMatch) style.marginBottom = mbMatch[1] === 'px' ? '1px' : sizeValue(mbMatch[1])
    const mlMatch = c.match(/^ml-(\d+\.?\d*|px)$/)
    if (mlMatch) style.marginLeft = mlMatch[1] === 'px' ? '1px' : sizeValue(mlMatch[1])
    const mrMatch = c.match(/^mr-(\d+\.?\d*|px)$/)
    if (mrMatch) style.marginRight = mrMatch[1] === 'px' ? '1px' : sizeValue(mrMatch[1])

    const spaceXMatch = c.match(/^space-x-(\d+\.?\d*|px)$/)
    if (spaceXMatch) style.gap = spaceXMatch[1] === 'px' ? '1px' : sizeValue(spaceXMatch[1])

    const wMatch = c.match(/^w-(\d+\.?\d*|px|full|screen|auto)$/)
    if (wMatch) {
      const v = wMatch[1]
      if (v === 'full') style.width = '100%'
      else if (v === 'screen') style.width = '100%'
      else if (v === 'auto') style.width = 'auto'
      else if (v === 'px') style.width = '1px'
      else style.width = sizeValue(v)
    }
    const wCustomMatch = c.match(/^w-\[(.+)]$/)
    if (wCustomMatch) style.width = wCustomMatch[1]
    const hMatch = c.match(/^h-(\d+\.?\d*|px|full|screen|auto)$/)
    if (hMatch) {
      const v = hMatch[1]
      if (v === 'full') style.height = '100%'
      else if (v === 'screen') style.height = '100%'
      else if (v === 'auto') style.height = 'auto'
      else if (v === 'px') style.height = '1px'
      else style.height = sizeValue(v)
    }
    const hCustomMatch = c.match(/^h-\[(.+)]$/)
    if (hCustomMatch) style.height = hCustomMatch[1]
    const minWMatch = c.match(/^min-w-(\d+|full)$/)
    if (minWMatch) style.minWidth = minWMatch[1] === 'full' ? '100%' : sizeValue(minWMatch[1])
    const maxWMatch = c.match(/^max-w-(\d+|full|none)$/)
    if (maxWMatch) {
      const v = maxWMatch[1]
      if (v === 'full') style.maxWidth = '100%'
      else if (v === 'none') style.maxWidth = 'none'
      else style.maxWidth = sizeValue(v)
    }

    const gridColsMatch = c.match(/^grid-cols-(\d+|none)$/)
    if (gridColsMatch) {
      if (gridColsMatch[1] === 'none') style.gridTemplateColumns = 'none'
      else style.gridTemplateColumns = `repeat(${gridColsMatch[1]}, 1fr)`
    }
    const colSpanMatch = c.match(/^col-span-(\d+|full)$/)
    if (colSpanMatch) style.gridColumn = colSpanMatch[1] === 'full' ? '1 / -1' : `span ${colSpanMatch[1]} / span ${colSpanMatch[1]}`
    const colStartMatch = c.match(/^col-start-(\d+)$/)
    if (colStartMatch) style.gridColumnStart = colStartMatch[1]
    const rowSpanMatch = c.match(/^row-span-(\d+|full)$/)
    if (rowSpanMatch) style.gridRow = rowSpanMatch[1] === 'full' ? '1 / -1' : `span ${rowSpanMatch[1]} / span ${rowSpanMatch[1]}`
    const rowStartMatch = c.match(/^row-start-(\d+)$/)
    if (rowStartMatch) style.gridRowStart = rowStartMatch[1]

    const bgMatch = c.match(/^bg-(.+)$/)
    if (bgMatch) {
      const color = tailwindColors[bgMatch[1]] || bgMatch[1]
      style.backgroundColor = color
    }
    const textColorMatch = c.match(/^text-(.+)$/)
    if (textColorMatch && !c.startsWith('text-xs') && !c.startsWith('text-sm') && !c.startsWith('text-base') && !c.startsWith('text-lg') && !c.startsWith('text-xl') && !c.startsWith('text-2') && !c.startsWith('text-3') && !c.startsWith('text-4') && !c.startsWith('text-5') && !c.startsWith('text-6') && !c.startsWith('text-7') && !c.startsWith('text-8') && !c.startsWith('text-9')) {
      const color = tailwindColors[textColorMatch[1]] || textColorMatch[1]
      style.color = color
    }
    const borderColorMatch = c.match(/^border-(.+)$/)
    if (borderColorMatch && borderColorMatch[1] !== 'none' && borderColorMatch[1] !== '0' && !borderColorMatch[1].match(/^\d/)) {
      const color = tailwindColors[borderColorMatch[1]] || borderColorMatch[1]
      style.borderColor = color
    }

    if (c === 'border') style.borderWidth = '1px'
    if (c === 'border-0') style.borderWidth = '0'
    if (c === 'border-2') style.borderWidth = '2px'
    if (c === 'border-4') style.borderWidth = '4px'
    if (c === 'border-8') style.borderWidth = '8px'
    if (c === 'border-none') style.borderStyle = 'none'
    if (c === 'border-solid') style.borderStyle = 'solid'
    if (c === 'border-dashed') style.borderStyle = 'dashed'
    const borderRadiusMatch = c.match(/^rounded(-\w+)?$/)
    if (borderRadiusMatch) {
      const size = borderRadiusMatch[1]?.slice(1)
      const radiusMap: Record<string, string> = {
        'sm': '0.125rem', 'md': '0.375rem', 'lg': '0.5rem', 'xl': '0.75rem', '2xl': '1rem',
        '3xl': '1.5rem', 'full': '9999px', 'none': '0',
      }
      style.borderRadius = size ? (radiusMap[size] || sizeValue(size)) : '0.25rem'
    }

    const textSizeMap: Record<string, string> = {
      'xs': '0.75rem', 'sm': '0.875rem', 'base': '1rem', 'lg': '1.125rem',
      'xl': '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
      '5xl': '3rem', '6xl': '3.75rem', '7xl': '4.5rem', '8xl': '6rem', '9xl': '8rem',
    }
    const textSizeMatch = c.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/)
    if (textSizeMatch) style.fontSize = textSizeMap[textSizeMatch[1]]

    const fontWeightMap: Record<string, string> = {
      'thin': '100', 'extralight': '200', 'light': '300', 'normal': '400',
      'medium': '500', 'semibold': '600', 'bold': '700', 'extrabold': '800', 'black': '900',
    }
    const fontWeightMatch = c.match(/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/)
    if (fontWeightMatch) style.fontWeight = fontWeightMap[fontWeightMatch[1]]

    const textAlignMatch = c.match(/^text-(left|center|right|justify)$/)
    if (textAlignMatch) style.textAlign = textAlignMatch[1]

    const trackingMatch = c.match(/^tracking-(tighter|tight|normal|wide|wider|widest)$/)
    if (trackingMatch) {
      const map: Record<string, string> = { tighter: '-0.05em', tight: '-0.025em', normal: '0', wide: '0.025em', wider: '0.05em', widest: '0.1em' }
      style.letterSpacing = map[trackingMatch[1]]
    }

    const leadingMatch = c.match(/^leading-(\d+|none|tight|snug|normal|relaxed|loose)$/)
    if (leadingMatch) {
      const map: Record<string, string> = { none: '1', tight: '1.25', snug: '1.375', normal: '1.5', relaxed: '1.625', loose: '2' }
      style.lineHeight = map[leadingMatch[1]] || leadingMatch[1]
    }

    if (c === 'uppercase') style.textTransform = 'uppercase'
    if (c === 'lowercase') style.textTransform = 'lowercase'
    if (c === 'capitalize') style.textTransform = 'capitalize'

    if (c === 'overflow-hidden') style.overflow = 'hidden'
    if (c === 'overflow-auto') style.overflow = 'auto'
    if (c === 'overflow-visible') style.overflow = 'visible'

    if (c === 'relative') style.position = 'relative'
    if (c === 'absolute') style.position = 'absolute'
    if (c === 'fixed') style.position = 'absolute' // fixed inside canvas -> absolute
    if (c === 'sticky') style.position = 'sticky'

    const shadowMap: Record<string, string> = {
      'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    }
    const shadowMatch = c.match(/^shadow(-sm|md|lg|xl)?$/)
    if (shadowMatch) style.boxShadow = shadowMap[shadowMatch[1]?.slice(1) || 'md'] || shadowMap.md
    if (c === 'shadow-none') style.boxShadow = 'none'

    const opacityMatch = c.match(/^opacity-(\d+|\d+)$/)
    if (opacityMatch) style.opacity = String(parseInt(opacityMatch[1]) / 100)

    if (c === 'cursor-pointer') style.cursor = 'pointer'

    if (c === 'object-cover') style.objectFit = 'cover'
    if (c === 'object-contain') style.objectFit = 'contain'
    if (c === 'object-fill') style.objectFit = 'fill'

    const zMatch = c.match(/^z-(\d+)$/)
    if (zMatch) style.zIndex = zMatch[1]

    if (c === 'aspect-square') style.aspectRatio = '1 / 1'
    if (c === 'aspect-video') style.aspectRatio = '16 / 9'
    const aspectMatch = c.match(/^aspect-(\d+)\/(\d+)$/)
    if (aspectMatch) style.aspectRatio = `${aspectMatch[1]} / ${aspectMatch[2]}`

    if (c === 'size-full') { style.width = '100%'; style.height = '100%' }
    const sizeMatch = c.match(/^size-(\d+)$/)
    if (sizeMatch) { const v = sizeValue(sizeMatch[1]); style.width = v; style.height = v }

    if (c === 'inset-0') { style.top = '0'; style.right = '0'; style.bottom = '0'; style.left = '0' }

    const topMatch = c.match(/^top-(\d+)$/)
    if (topMatch) style.top = sizeValue(topMatch[1])
    const topCustomMatch = c.match(/^top-\[(.+)]$/)
    if (topCustomMatch) style.top = topCustomMatch[1]
    const rightMatch = c.match(/^right-(\d+)$/)
    if (rightMatch) style.right = sizeValue(rightMatch[1])
    const rightCustomMatch = c.match(/^right-\[(.+)]$/)
    if (rightCustomMatch) style.right = rightCustomMatch[1]
    const bottomMatch = c.match(/^bottom-(\d+)$/)
    if (bottomMatch) style.bottom = sizeValue(bottomMatch[1])
    const bottomCustomMatch = c.match(/^bottom-\[(.+)]$/)
    if (bottomCustomMatch) style.bottom = bottomCustomMatch[1]
    const leftMatch = c.match(/^left-(\d+)$/)
    if (leftMatch) style.left = sizeValue(leftMatch[1])
    const leftCustomMatch = c.match(/^left-\[(.+)]$/)
    if (leftCustomMatch) style.left = leftCustomMatch[1]

    // Blur
    const blurMap: Record<string, string> = { 'none': '0', 'sm': '4px', 'md': '12px', 'lg': '16px', 'xl': '24px', '2xl': '40px', '3xl': '64px' }
    const blurMatch = c.match(/^blur(-\w+)?$/)
    if (blurMatch) {
      const size = blurMatch[1]?.slice(1) || 'DEFAULT'
      const blurVal = blurMap[size] || (size === 'DEFAULT' ? '8px' : sizeValue(size))
      style.filter = `blur(${blurVal})`
    }

    // Background clip
    if (c === 'bg-clip-text') style.backgroundClip = 'text'
    if (c === 'text-transparent') style.color = 'transparent'

    // Rotate
    const rotateMatch = c.match(/^rotate-(\d+)$/)
    if (rotateMatch) style.transform = `rotate(${rotateMatch[1]}deg)`

    // Ring
    const ringMatch = c.match(/^ring-(\d+|inset)$/)
    if (ringMatch) {
      if (ringMatch[1] === 'inset') {
        // handled separately
      } else {
        const ringWidth = ringMatch[1] === '0' ? '0px' : `${ringMatch[1]}px`
        const ringColor = style.borderColor || '#e2e8f0'
        style.boxShadow = `0 0 0 ${ringWidth} ${ringColor}`
      }
    }
    if (c === 'ring') style.boxShadow = `0 0 0 3px ${style.borderColor || '#e2e8f0'}`

    // sr-only
    if (c === 'sr-only') {
      style.position = 'absolute'
      style.width = '1px'
      style.height = '1px'
      style.padding = '0'
      style.margin = '-1px'
      style.overflow = 'hidden'
      style.clip = 'rect(0, 0, 0, 0)'
      style.whiteSpace = 'nowrap'
      style.borderWidth = '0'
    }

    // Transform GPU
    if (c === 'transform-gpu') style.transform = 'translate3d(0, 0, 0)'

    // Text balance
    if (c === 'text-balance') style.textWrap = 'balance'

    // Custom translate
    const translateXMatch = c.match(/^-?translate-x-\[(.+)]$/)
    if (translateXMatch) {
      const val = translateXMatch[1]
      const sign = c.startsWith('-translate-x-') ? '-' : ''
      style.transform = `translateX(${sign}${val})`
    }
    const translateYMatch = c.match(/^-?translate-y-\[(.+)]$/)
    if (translateYMatch) {
      const val = translateYMatch[1]
      const sign = c.startsWith('-translate-y-') ? '-' : ''
      style.transform = `translateY(${sign}${val})`
    }
  }

  return style
}

function isTextOnly(el: Element): boolean {
  return Array.from(el.childNodes).every(n => n.nodeType === Node.TEXT_NODE || (n.nodeType === Node.ELEMENT_NODE && ['span', 'strong', 'em', 'b', 'i', 'a'].includes((n as Element).tagName.toLowerCase())))
}

function extractText(el: Element): string {
  return el.textContent?.trim() || ''
}

function serializeSvg(el: Element): string {
  const serializer = new XMLSerializer()
  return serializer.serializeToString(el)
}

function elementToNode(el: Element): ComponentNode | null {
  const tag = el.tagName.toLowerCase()

  // Skip script/style/head/meta/link/title
  if (['script', 'style', 'head', 'meta', 'link', 'title', 'noscript'].includes(tag)) return null

  // SVG elements — serialize to raw HTML
  if (tag === 'svg') {
    return createNode('raw', {
      html: serializeSvg(el),
      style: { display: 'inline-block', width: '1.25rem', height: '1.25rem' },
    })
  }
  if (['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'use', 'clipPath'].includes(tag)) {
    // These should be inside <svg>, skip individually
    return null
  }

  const className = (el.getAttribute('class') || '')
  const style = parseTailwindClasses(className)
  const inlineStyle = el.getAttribute('style')
  if (inlineStyle) {
    inlineStyle.split(';').forEach(rule => {
      const colonIdx = rule.indexOf(':')
      if (colonIdx > 0) {
        const k = rule.slice(0, colonIdx).trim()
        const v = rule.slice(colonIdx + 1).trim()
        if (k && v) style[k] = v
      }
    })
  }

  // Image
  if (tag === 'img') {
    return createNode('image', {
      src: el.getAttribute('src') || '',
      alt: el.getAttribute('alt') || '',
      style,
    })
  }

  // Button
  if (tag === 'button') {
    return createNode('button', {
      text: extractText(el),
      style,
    })
  }

  // Headings
  if (tag.match(/^h[1-6]$/)) {
    if (el.children.length > 0) {
      // Heading with nested elements (e.g., gradient spans) -> preserve as raw HTML
      return createNode('raw', {
        html: el.outerHTML,
        style,
      })
    }
    return createNode('heading', {
      text: extractText(el),
      level: tag,
      style,
    })
  }

  // Input elements -> styled placeholders
  if (tag === 'input') {
    const inputType = (el as HTMLInputElement).type || 'text'
    const inputClass = el.getAttribute('class') || ''
    const inputStyle = parseTailwindClasses(inputClass)
    const parent = el.parentElement

    // Radio / checkbox inside rounded-full container -> styled circle
    if ((inputType === 'radio' || inputType === 'checkbox') && parent) {
      // If parent or input itself has rounded-full
      if (parent.className.includes('rounded-full') || inputClass.includes('rounded-full')) {
        const sizeClass = inputClass.match(/size-(\d+)/) || inputClass.match(/w-(\d+)/)
        const size = sizeClass ? sizeValue(sizeClass[1]) : '2rem'
        const bgClass = Array.from(el.classList).find(c => c.startsWith('bg-'))
        if (bgClass) {
          const colorMatch = bgClass.match(/^bg-(.+)$/)
          if (colorMatch) {
            inputStyle.backgroundColor = tailwindColors[colorMatch[1]] || colorMatch[1]
          }
        }
        return createNode('container', {
          isRadio: true,
          radioGroup: el.getAttribute('name') || '',
          radioValue: el.getAttribute('value') || '',
          style: {
            ...inputStyle,
            width: size,
            height: size,
            borderRadius: '50%',
            border: inputStyle.borderColor ? `2px solid ${inputStyle.borderColor}` : '2px solid #e2e8f0',
            flexShrink: 0,
            cursor: 'pointer',
          },
        })
      }
    }

    // Default input -> text placeholder
    return createNode('text', {
      text: el.getAttribute('placeholder') || `[${inputType}]`,
      style: { ...inputStyle, color: '#94a3b8', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' },
    })
  }

  // Label containing radio + span -> button with span text
  if (tag === 'label') {
    const input = el.querySelector('input')
    const span = el.querySelector('span')
    if (input && span) {
      const text = span.textContent?.trim() || ''
      // Check if disabled
      const isDisabled = input.hasAttribute('disabled')
      const checked = (input as HTMLInputElement).checked
      const labelStyle = { ...style }
      if (isDisabled) {
        labelStyle.opacity = '0.5'
        labelStyle.cursor = 'not-allowed'
      }
      if (checked) {
        labelStyle.backgroundColor = labelStyle.backgroundColor || '#4f46e5'
        labelStyle.color = '#ffffff'
        labelStyle.borderColor = '#4f46e5'
      }
      return createNode('button', {
        text,
        style: {
          ...labelStyle,
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        },
      })
    }
  }

  // Text elements (leaf)
  if ((tag === 'p' || tag === 'span' || tag === 'a' || tag === 'small') && el.children.length === 0) {
    return createNode('text', {
      text: extractText(el),
      style,
    })
  }

  // Input / Textarea as placeholder text
  if (tag === 'input' || tag === 'textarea') {
    return createNode('text', {
      text: el.getAttribute('placeholder') || `[${el.getAttribute('type') || tag}]`,
      style: { ...style, color: '#94a3b8' },
    })
  }

  // HR
  if (tag === 'hr') {
    return createNode('divider', { style })
  }

  // Container elements
  const children: ComponentNode[] = []
  for (const child of el.children) {
    const node = elementToNode(child)
    if (node) children.push(node)
  }

  // Determine container type
  let type: 'container' | 'flex' | 'grid' = 'container'
  if (style.display === 'flex' || className.includes('flex')) type = 'flex'
  if (style.display === 'grid' || className.includes('grid')) type = 'grid'

  // If container has only text children, merge into text node
  if (children.length === 0 && el.textContent?.trim()) {
    return createNode('text', { text: el.textContent.trim(), style })
  }

  // For custom elements and semantic tags -> treat as container
  if (['nav', 'ol', 'ul', 'li', 'datalist', 'fieldset', 'form', 'article', 'section', 'header', 'footer', 'aside', 'main', 'dialog'].includes(tag) || tag.startsWith('el-')) {
    type = 'container'
  }

  return createNode(type, { style }, children)
}

export function parseHtmlToNodes(html: string): ComponentNode[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const nodes: ComponentNode[] = []

  for (const child of doc.body.children) {
    const node = elementToNode(child)
    if (node) nodes.push(node)
  }

  return nodes
}
