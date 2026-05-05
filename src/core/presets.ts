import { createNode } from './store'
import type { ComponentNode } from './types'

export interface PresetMeta {
  id: string
  label: string
  icon: string
  category: string
  build: () => ComponentNode[]
}

export const presetRegistry: Record<string, PresetMeta> = {
  navbar: {
    id: 'navbar',
    label: 'Navbar',
    icon: 'Menu',
    category: 'Sections',
    build: () => [
      createNode('flex', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 32px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
        },
      }, [
        createNode('heading', {
          text: 'Brand',
          level: 'h3',
          style: { fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: '0' },
        }),
        createNode('flex', {
          style: {
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
          },
        }, [
          createNode('text', {
            text: 'Features',
            style: { color: '#94a3b8', fontSize: '14px', margin: '0' },
          }),
          createNode('text', {
            text: 'Pricing',
            style: { color: '#94a3b8', fontSize: '14px', margin: '0' },
          }),
          createNode('text', {
            text: 'About',
            style: { color: '#94a3b8', fontSize: '14px', margin: '0' },
          }),
          createNode('button', {
            text: 'Get Started',
            style: {
              padding: '8px 20px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            },
          }),
        ]),
      ]),
    ],
  },

  hero: {
    id: 'hero',
    label: 'Hero Section',
    icon: 'Layout',
    category: 'Sections',
    build: () => [
      createNode('grid', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          padding: '80px 48px',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
        },
      }, [
        createNode('container', {
          style: { padding: '0', background: 'transparent', border: 'none' },
        }, [
          createNode('heading', {
            text: 'Build faster with our platform',
            level: 'h1',
            style: {
              fontSize: '48px',
              fontWeight: '800',
              color: '#0f172a',
              lineHeight: '1.1',
              marginBottom: '24px',
            },
          }),
          createNode('text', {
            text: 'Create stunning websites in minutes with our powerful drag-and-drop builder. No coding required.',
            style: {
              fontSize: '18px',
              color: '#475569',
              lineHeight: '1.6',
              marginBottom: '32px',
            },
          }),
          createNode('flex', {
            style: { display: 'flex', gap: '16px', background: 'transparent', border: 'none', padding: '0' },
          }, [
            createNode('button', {
              text: 'Get Started',
              style: {
                padding: '14px 32px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              },
            }),
            createNode('button', {
              text: 'Learn More',
              style: {
                padding: '14px 32px',
                backgroundColor: 'transparent',
                color: '#334155',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              },
            }),
          ]),
        ]),
        createNode('image', {
          src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop',
          alt: 'Hero',
          style: {
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
          },
        }),
      ]),
    ],
  },

  card: {
    id: 'card',
    label: 'Card',
    icon: 'CreditCard',
    category: 'UI',
    build: () => [
      createNode('container', {
        style: {
          padding: '0',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        },
      }, [
        createNode('image', {
          src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop',
          alt: 'Card image',
          style: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '0',
          },
        }),
        createNode('container', {
          style: {
            padding: '24px',
            backgroundColor: 'transparent',
            border: 'none',
          },
        }, [
          createNode('heading', {
            text: 'Card Title',
            level: 'h3',
            style: { fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' },
          }),
          createNode('text', {
            text: 'This is a description text for your card component. You can edit this however you like.',
            style: { fontSize: '14px', color: '#64748b', lineHeight: '1.5', marginBottom: '16px' },
          }),
          createNode('button', {
            text: 'Read More',
            style: {
              padding: '8px 16px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
            },
          }),
        ]),
      ]),
    ],
  },

  features: {
    id: 'features',
    label: 'Features Grid',
    icon: 'Grid3x3',
    category: 'Sections',
    build: () => [
      createNode('container', {
        style: {
          padding: '80px 48px',
          backgroundColor: '#ffffff',
        },
      }, [
        createNode('heading', {
          text: 'Why Choose Us',
          level: 'h2',
          style: {
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            color: '#0f172a',
            marginBottom: '16px',
          },
        }),
        createNode('text', {
          text: 'Everything you need to build amazing websites',
          style: {
            fontSize: '18px',
            textAlign: 'center',
            color: '#64748b',
            marginBottom: '48px',
          },
        }),
        createNode('grid', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            background: 'transparent',
            border: 'none',
            padding: '0',
          },
        }, [
          ...Array.from({ length: 3 }).map(() =>
            createNode('container', {
              style: {
                padding: '32px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
              },
            }, [
              createNode('heading', {
                text: 'Feature',
                level: 'h4',
                style: { fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#0f172a' },
              }),
              createNode('text', {
                text: 'Description of this amazing feature and why users will love it.',
                style: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' },
              }),
            ])
          ),
        ]),
      ]),
    ],
  },

  footer: {
    id: 'footer',
    label: 'Footer',
    icon: 'PanelBottom',
    category: 'Sections',
    build: () => [
      createNode('container', {
        style: {
          padding: '48px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
        },
      }, [
        createNode('grid', {
          style: {
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '32px',
            background: 'transparent',
            border: 'none',
            padding: '0',
          },
        }, [
          createNode('container', {
            style: { padding: '0', background: 'transparent', border: 'none' },
          }, [
            createNode('heading', {
              text: 'Brand',
              level: 'h3',
              style: { fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' },
            }),
            createNode('text', {
              text: 'Making the world more productive, one website at a time.',
              style: { fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' },
            }),
          ]),
          ...['Product', 'Company', 'Resources'].map((title) =>
            createNode('container', {
              style: { padding: '0', background: 'transparent', border: 'none' },
            }, [
              createNode('heading', {
                text: title,
                level: 'h4',
                style: { fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' },
              }),
              ...['Features', 'Pricing', 'Documentation', 'Support'].map((item) =>
                createNode('text', {
                  text: item,
                  style: { fontSize: '14px', color: '#94a3b8', marginBottom: '8px', cursor: 'pointer' },
                })
              ),
            ])
          ),
        ]),
        createNode('divider', {
          style: { backgroundColor: '#1e293b', margin: '32px 0' },
        }),
        createNode('text', {
          text: '© 2024 Brand Inc. All rights reserved.',
          style: { fontSize: '14px', color: '#64748b', textAlign: 'center' },
        }),
      ]),
    ],
  },

  pricing: {
    id: 'pricing',
    label: 'Pricing Table',
    icon: 'Tags',
    category: 'Sections',
    build: () => [
      createNode('container', {
        style: {
          padding: '80px 48px',
          backgroundColor: '#f8fafc',
        },
      }, [
        createNode('heading', {
          text: 'Simple, transparent pricing',
          level: 'h2',
          style: {
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            color: '#0f172a',
            marginBottom: '16px',
          },
        }),
        createNode('text', {
          text: 'Choose the plan that works best for you',
          style: {
            fontSize: '18px',
            textAlign: 'center',
            color: '#64748b',
            marginBottom: '48px',
          },
        }),
        createNode('grid', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            background: 'transparent',
            border: 'none',
            padding: '0',
          },
        }, [
          ...['Starter', 'Pro', 'Enterprise'].map((plan, i) =>
            createNode('container', {
              style: {
                padding: '32px',
                backgroundColor: i === 1 ? '#0f172a' : '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
              },
            }, [
              createNode('heading', {
                text: plan,
                level: 'h4',
                style: { fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: i === 1 ? '#ffffff' : '#0f172a' },
              }),
              createNode('heading', {
                text: i === 0 ? '$9/mo' : i === 1 ? '$29/mo' : '$99/mo',
                level: 'h3',
                style: { fontSize: '36px', fontWeight: '800', marginBottom: '24px', color: i === 1 ? '#ffffff' : '#0f172a' },
              }),
              ...['Unlimited projects', 'Analytics', 'Priority support'].map((feat) =>
                createNode('text', {
                  text: feat,
                  style: { fontSize: '14px', color: i === 1 ? '#94a3b8' : '#64748b', marginBottom: '12px' },
                })
              ),
              createNode('button', {
                text: 'Choose Plan',
                style: {
                  marginTop: '16px',
                  padding: '10px 24px',
                  backgroundColor: i === 1 ? '#3b82f6' : '#0f172a',
                  color: '#ffffff',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                },
              }),
            ])
          ),
        ]),
      ]),
    ],
  },

  testimonials: {
    id: 'testimonials',
    label: 'Testimonials',
    icon: 'MessageSquare',
    category: 'Sections',
    build: () => [
      createNode('container', {
        style: {
          padding: '80px 48px',
          backgroundColor: '#ffffff',
        },
      }, [
        createNode('heading', {
          text: 'What our customers say',
          level: 'h2',
          style: {
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            color: '#0f172a',
            marginBottom: '48px',
          },
        }),
        createNode('grid', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            background: 'transparent',
            border: 'none',
            padding: '0',
          },
        }, [
          ...Array.from({ length: 2 }).map(() =>
            createNode('container', {
              style: {
                padding: '32px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              },
            }, [
              createNode('text', {
                text: '"This platform completely changed how we build websites. It\'s intuitive, fast, and the results are stunning."',
                style: { fontSize: '16px', color: '#334155', lineHeight: '1.6', marginBottom: '24px', fontStyle: 'italic' },
              }),
              createNode('flex', {
                style: { display: 'flex', alignItems: 'center', gap: '16px', background: 'transparent', border: 'none', padding: '0' },
              }, [
                createNode('image', {
                  src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
                  alt: 'Avatar',
                  style: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' },
                }),
                createNode('container', {
                  style: { padding: '0', background: 'transparent', border: 'none' },
                }, [
                  createNode('heading', {
                    text: 'John Doe',
                    level: 'h5',
                    style: { fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '2px' },
                  }),
                  createNode('text', {
                    text: 'CEO at Company',
                    style: { fontSize: '14px', color: '#64748b' },
                  }),
                ]),
              ]),
            ])
          ),
        ]),
      ]),
    ],
  },

  stats: {
    id: 'stats',
    label: 'Stats Bar',
    icon: 'BarChart3',
    category: 'Sections',
    build: () => [
      createNode('grid', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
          padding: '64px 48px',
          backgroundColor: '#0f172a',
        },
      }, [
        ...[
          { number: '10K+', label: 'Users' },
          { number: '500+', label: 'Projects' },
          { number: '99.9%', label: 'Uptime' },
          { number: '24/7', label: 'Support' },
        ].map(({ number, label }) =>
          createNode('container', {
            style: {
              padding: '0',
              background: 'transparent',
              border: 'none',
              textAlign: 'center',
            },
          }, [
            createNode('heading', {
              text: number,
              level: 'h2',
              style: { fontSize: '40px', fontWeight: '800', color: '#ffffff', marginBottom: '8px' },
            }),
            createNode('text', {
              text: label,
              style: { fontSize: '16px', color: '#94a3b8' },
            }),
          ])
        ),
      ]),
    ],
  },

  cta: {
    id: 'cta',
    label: 'CTA Banner',
    icon: 'Megaphone',
    category: 'Sections',
    build: () => [
      createNode('container', {
        style: {
          padding: '80px 48px',
          backgroundColor: '#3b82f6',
          textAlign: 'center',
        },
      }, [
        createNode('heading', {
          text: 'Ready to get started?',
          level: 'h2',
          style: {
            fontSize: '36px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px',
          },
        }),
        createNode('text', {
          text: 'Join thousands of creators building amazing websites today.',
          style: {
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
          },
        }),
        createNode('button', {
          text: 'Start Building Now',
          style: {
            padding: '14px 32px',
            backgroundColor: '#ffffff',
            color: '#3b82f6',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          },
        }),
      ]),
    ],
  },

  contact: {
    id: 'contact',
    label: 'Contact Form',
    icon: 'Mail',
    category: 'Sections',
    build: () => [
      createNode('grid', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          padding: '80px 48px',
          backgroundColor: '#ffffff',
          alignItems: 'center',
        },
      }, [
        createNode('container', {
          style: { padding: '0', background: 'transparent', border: 'none' },
        }, [
          createNode('heading', {
            text: 'Get in touch',
            level: 'h2',
            style: { fontSize: '36px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' },
          }),
          createNode('text', {
            text: 'Have a question or want to work together? Fill out the form and we\'ll get back to you within 24 hours.',
            style: { fontSize: '18px', color: '#64748b', lineHeight: '1.6', marginBottom: '32px' },
          }),
          createNode('container', {
            style: { padding: '0', background: 'transparent', border: 'none' },
          }, [
            createNode('text', { text: 'hello@company.com', style: { fontSize: '16px', color: '#3b82f6', marginBottom: '8px' } }),
            createNode('text', { text: '+1 (555) 123-4567', style: { fontSize: '16px', color: '#64748b' } }),
          ]),
        ]),
        createNode('container', {
          style: {
            padding: '32px',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
          },
        }, [
          createNode('container', {
            style: { padding: '0', background: 'transparent', border: 'none', marginBottom: '16px' },
          }, [
            createNode('text', { text: 'Name', style: { fontSize: '14px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' } }),
            createNode('container', {
              style: {
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#94a3b8',
                fontSize: '14px',
              },
            }, [
              createNode('text', { text: 'Your name', style: { color: '#94a3b8', fontSize: '14px', margin: '0' } }),
            ]),
          ]),
          createNode('container', {
            style: { padding: '0', background: 'transparent', border: 'none', marginBottom: '16px' },
          }, [
            createNode('text', { text: 'Email', style: { fontSize: '14px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' } }),
            createNode('container', {
              style: {
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#94a3b8',
                fontSize: '14px',
              },
            }, [
              createNode('text', { text: 'you@example.com', style: { color: '#94a3b8', fontSize: '14px', margin: '0' } }),
            ]),
          ]),
          createNode('container', {
            style: { padding: '0', background: 'transparent', border: 'none', marginBottom: '24px' },
          }, [
            createNode('text', { text: 'Message', style: { fontSize: '14px', fontWeight: '500', color: '#0f172a', marginBottom: '6px' } }),
            createNode('container', {
              style: {
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                minHeight: '120px',
                color: '#94a3b8',
                fontSize: '14px',
              },
            }, [
              createNode('text', { text: 'Your message...', style: { color: '#94a3b8', fontSize: '14px', margin: '0' } }),
            ]),
          ]),
          createNode('button', {
            text: 'Send Message',
            style: {
              width: '100%',
              padding: '12px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            },
          }),
        ]),
      ]),
    ],
  },

  gallery: {
    id: 'gallery',
    label: 'Image Gallery',
    icon: 'Images',
    category: 'Sections',
    build: () => [
      createNode('container', {
        style: {
          padding: '80px 48px',
          backgroundColor: '#f8fafc',
        },
      }, [
        createNode('heading', {
          text: 'Our Work',
          level: 'h2',
          style: {
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            color: '#0f172a',
            marginBottom: '48px',
          },
        }),
        createNode('grid', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            background: 'transparent',
            border: 'none',
            padding: '0',
          },
        }, [
          ...[
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&auto=format&fit=crop',
          ].map((src) =>
            createNode('image', {
              src,
              alt: 'Gallery',
              style: {
                width: '100%',
                height: '240px',
                objectFit: 'cover',
                borderRadius: '12px',
              },
            })
          ),
        ]),
      ]),
    ],
  },

  animatedGallery: {
    id: 'animatedGallery',
    label: 'Animated Gallery',
    icon: 'Sparkles',
    category: 'Sections',
    build: () => [
      createNode('container', {
        style: {
          padding: '80px 48px',
          backgroundColor: '#0f172a',
        },
        animation: {
          type: 'fade-in',
          trigger: 'load',
          duration: 0.8,
          delay: 0,
          ease: 'easeOut',
          stagger: 0.1,
        },
      }, [
        createNode('heading', {
          text: 'Motion Gallery',
          level: 'h2',
          style: {
            fontSize: '42px',
            fontWeight: '800',
            textAlign: 'center',
            color: '#ffffff',
            marginBottom: '16px',
          },
        }),
        createNode('text', {
          text: 'Hover over the images to see them come alive',
          style: {
            fontSize: '18px',
            textAlign: 'center',
            color: '#94a3b8',
            marginBottom: '56px',
          },
        }),
        createNode('grid', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            background: 'transparent',
            border: 'none',
            padding: '0',
          },
        }, [
          ...[
            { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop', anim: 'scale' },
            { src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&auto=format&fit=crop', anim: 'rotate' },
            { src: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&auto=format&fit=crop', anim: 'slide-up' },
            { src: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&auto=format&fit=crop', anim: 'flip' },
            { src: 'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=400&auto=format&fit=crop', anim: 'slide-left' },
            { src: 'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=400&auto=format&fit=crop', anim: 'fade-in' },
          ].map(({ src, anim }) =>
            createNode('container', {
              style: {
                padding: '0',
                background: 'transparent',
                border: 'none',
                borderRadius: '16px',
                overflow: 'hidden',
              },
            }, [
              createNode('image', {
                src,
                alt: 'Gallery',
                style: {
                  width: '100%',
                  height: '280px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                },
                animation: {
                  type: anim as any,
                  trigger: 'hover',
                  duration: 0.4,
                  delay: 0,
                  ease: 'easeOut',
                  stagger: 0,
                },
              }),
            ])
          ),
        ]),
      ]),
    ],
  },

  videoHero: {
    id: 'videoHero',
    label: 'Video Hero',
    icon: 'Clapperboard',
    category: 'Sections',
    build: () => [
      createNode('container', {
        style: {
          position: 'relative',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
      }, [
        createNode('video', {
          src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          autoplay: true,
          loop: true,
          muted: true,
          controls: false,
          style: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: '0',
          },
        }),
        createNode('container', {
          style: {
            position: 'relative',
            zIndex: '10',
            textAlign: 'center',
            padding: '48px',
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderRadius: '16px',
            backdropFilter: 'blur(8px)',
            border: 'none',
          },
        }, [
          createNode('heading', {
            text: 'Cinematic Experience',
            level: 'h1',
            style: {
              fontSize: '56px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '16px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            },
          }),
          createNode('text', {
            text: 'Bring your vision to life with motion and sound',
            style: {
              fontSize: '20px',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '32px',
            },
          }),
          createNode('button', {
            text: 'Watch Showreel',
            style: {
              padding: '14px 32px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            },
          }),
        ]),
      ]),
    ],
  },

  colorProduct: {
    id: 'colorProduct',
    label: 'Color Product',
    icon: 'Palette',
    category: 'UI',
    build: () => [
      createNode('container', {
        style: {
          padding: '32px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
        },
      }, [
        createNode('container', {
          style: {
            position: 'relative',
            padding: '0',
            background: '#f8fafc',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '20px',
            border: 'none',
          },
        }, [
          createNode('image', {
            src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop',
            alt: 'Product',
            style: {
              width: '100%',
              height: '320px',
              objectFit: 'cover',
            },
          }),
          createNode('container', {
            style: {
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '12px',
              padding: '8px 16px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: '32px',
              border: 'none',
              backdropFilter: 'blur(4px)',
            },
          }, [
            ...['#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map((color) =>
              createNode('container', {
                style: {
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  padding: '0',
                },
              })
            ),
          ]),
        ]),
        createNode('heading', {
          text: 'Premium Cotton Tee',
          level: 'h3',
          style: { fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' },
        }),
        createNode('text', {
          text: '$49.00',
          style: { fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' },
        }),
        createNode('text', {
          text: 'Choose your color above. Premium quality organic cotton.',
          style: { fontSize: '14px', color: '#64748b', lineHeight: '1.5', marginBottom: '16px' },
        }),
        createNode('button', {
          text: 'Add to Cart',
          style: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          },
        }),
      ]),
    ],
  },

  glassCard: {
    id: 'glassCard',
    label: 'Glassmorphism Card',
    icon: 'Diamond',
    category: 'UI',
    build: () => [
      createNode('container', {
        style: {
          padding: '32px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          maxWidth: '360px',
        },
      }, [
        createNode('heading', {
          text: 'Glass Card',
          level: 'h3',
          style: { fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' },
        }),
        createNode('text', {
          text: 'Beautiful glassmorphism effect with backdrop blur and subtle borders.',
          style: { fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '20px' },
        }),
        createNode('button', {
          text: 'Explore',
          style: {
            padding: '10px 24px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#ffffff',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.3)',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          },
        }),
      ]),
    ],
  },

  gradientButton: {
    id: 'gradientButton',
    label: 'Gradient Button',
    icon: 'Zap',
    category: 'UI',
    build: () => [
      createNode('button', {
        text: 'Get Started',
        style: {
          padding: '14px 36px',
          backgroundImage: 'linear-gradient(to right, #4f46e5, #9333ea)',
          color: '#ffffff',
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
        },
      }),
    ],
  },

  gradientHero: {
    id: 'gradientHero',
    label: 'Gradient Hero',
    icon: 'Sunrise',
    category: 'Sections',
    build: () => [
      createNode('container', {
        style: {
          padding: '100px 48px',
          backgroundImage: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #be185d 100%)',
          textAlign: 'center',
        },
      }, [
        createNode('heading', {
          text: 'Digital Future',
          level: 'h1',
          style: {
            fontSize: '56px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '20px',
            backgroundImage: 'linear-gradient(to right, #818cf8, #c084fc, #f472b6)',
            backgroundClip: 'text',
            color: 'transparent',
          },
        }),
        createNode('text', {
          text: 'Create stunning experiences with modern design tools.',
          style: { fontSize: '20px', color: 'rgba(255,255,255,0.8)', marginBottom: '36px', maxWidth: '600px', margin: '0 auto 36px' },
        }),
        createNode('button', {
          text: 'Start Building',
          style: {
            padding: '14px 36px',
            backgroundColor: '#ffffff',
            color: '#4c1d95',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          },
        }),
      ]),
    ],
  },

  neonText: {
    id: 'neonText',
    label: 'Neon Text',
    icon: 'Flame',
    category: 'UI',
    build: () => [
      createNode('heading', {
        text: 'NEON',
        level: 'h1',
        style: {
          fontSize: '72px',
          fontWeight: '900',
          color: '#fff',
          textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899, 0 0 40px #ec4899, 0 0 80px #ec4899',
          letterSpacing: '0.1em',
        },
      }),
    ],
  },
}
