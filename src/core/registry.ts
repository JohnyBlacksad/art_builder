import type { ComponentMeta, ComponentType } from './types'

export const componentRegistry: Record<ComponentType, ComponentMeta> = {
  container: {
    type: 'container',
    label: 'Container',
    icon: 'Square',
    category: 'layout',
    isContainer: true,
    defaultProps: {
      style: {
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        borderRadius: '8px',
      },
    },
  },
  flex: {
    type: 'flex',
    label: 'Flex Row',
    icon: 'Rows',
    category: 'layout',
    isContainer: true,
    defaultProps: {
      style: {
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
      },
    },
  },
  grid: {
    type: 'grid',
    label: 'Grid',
    icon: 'Grid3x3',
    category: 'layout',
    isContainer: true,
    defaultProps: {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
      },
    },
  },
  heading: {
    type: 'heading',
    label: 'Heading',
    icon: 'Heading',
    category: 'basic',
    defaultProps: {
      text: 'Heading',
      level: 'h2',
      style: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '8px',
      },
    },
  },
  text: {
    type: 'text',
    label: 'Text',
    icon: 'Type',
    category: 'basic',
    defaultProps: {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      style: {
        fontSize: '16px',
        color: '#334155',
        lineHeight: '1.6',
      },
    },
  },
  button: {
    type: 'button',
    label: 'Button',
    icon: 'MousePointerClick',
    category: 'basic',
    defaultProps: {
      text: 'Click me',
      style: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
  },
  image: {
    type: 'image',
    label: 'Image',
    icon: 'Image',
    category: 'media',
    defaultProps: {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop',
      alt: 'Image',
      style: {
        width: '100%',
        maxWidth: '400px',
        borderRadius: '8px',
        objectFit: 'cover',
      },
    },
  },
  divider: {
    type: 'divider',
    label: 'Divider',
    icon: 'Minus',
    category: 'basic',
    defaultProps: {
      style: {
        width: '100%',
        height: '1px',
        backgroundColor: '#e2e8f0',
        margin: '16px 0',
      },
    },
  },
  spacer: {
    type: 'spacer',
    label: 'Spacer',
    icon: 'MoveVertical',
    category: 'basic',
    defaultProps: {
      style: {
        height: '24px',
      },
    },
  },
  raw: {
    type: 'raw',
    label: 'Raw HTML',
    icon: 'Code',
    category: 'basic',
    defaultProps: {
      html: '',
    },
  },
}

export function getMeta(type: ComponentType): ComponentMeta {
  return componentRegistry[type]
}
