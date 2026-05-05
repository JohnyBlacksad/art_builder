import type { ComponentNode } from './types'

function nodeToHTML(node: ComponentNode): string {
  const style = node.props.style
    ? Object.entries(node.props.style as Record<string, string>)
        .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
        .join(';')
    : ''

  const styleAttr = style ? ` style="${style}"` : ''

  switch (node.type) {
    case 'container':
    case 'flex':
    case 'grid': {
      const tag = node.type === 'grid' ? 'div' : 'div'
      const children = node.children.map(nodeToHTML).join('\n')
      return `<div${styleAttr}>\n${indent(children)}\n</div>`
    }

    case 'heading': {
      const level = (node.props.level as string) || 'h2'
      const text = escapeHtml((node.props.text as string) || '')
      return `<${level}${styleAttr}>${text}</${level}>`
    }

    case 'text': {
      const text = escapeHtml((node.props.text as string) || '').replace(/\n/g, '<br>')
      return `<p${styleAttr}>${text}</p>`
    }

    case 'button': {
      const text = escapeHtml((node.props.text as string) || '')
      return `<button${styleAttr}>${text}</button>`
    }

    case 'image': {
      const src = escapeHtml((node.props.src as string) || '')
      const alt = escapeHtml((node.props.alt as string) || '')
      return `<img src="${src}" alt="${alt}"${styleAttr} />`
    }

    case 'divider':
      return `<hr${styleAttr} />`

    case 'spacer':
      return `<div${styleAttr}></div>`

    default:
      return `<div${styleAttr}>Unknown</div>`
  }
}

function indent(html: string): string {
  return html
    .split('\n')
    .map((line) => (line.trim() ? '  ' + line : line))
    .join('\n')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function exportToHTML(root: ComponentNode): string {
  const body = root.children.map(nodeToHTML).join('\n')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exported Site</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
${indent(body)}
</body>
</html>`
}
