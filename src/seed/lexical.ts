// Converts the simple seed-content Block format (with **bold** and [text](url)
// inline markdown) into Payload's serialized Lexical editor state.
// KEEP IN SYNC with agents/lexical.mjs (the plain-JS port used by agents/submit.mjs).

export type Block =
  | { type: 'p' | 'h2' | 'h3' | 'quote'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'img'; media: number } // media doc id, resolved at seed time

type LexicalNode = Record<string, unknown>

const textNode = (text: string, format = 0): LexicalNode => ({
  type: 'text',
  version: 1,
  text,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
})

const linkNode = (url: string, children: LexicalNode[]): LexicalNode => ({
  type: 'link',
  version: 3,
  fields: {
    linkType: 'custom',
    url,
    newTab: !url.startsWith('/'),
  },
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
})

// Tokenizes **bold** and [label](url); bold inside link labels is not supported.
export const parseInline = (text: string): LexicalNode[] => {
  const nodes: LexicalNode[] = []
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(textNode(text.slice(lastIndex, match.index)))
    }
    if (match[1] !== undefined) {
      nodes.push(textNode(match[1], 1))
    } else {
      nodes.push(linkNode(match[3], [textNode(match[2])]))
    }
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < text.length) {
    nodes.push(textNode(text.slice(lastIndex)))
  }
  return nodes
}

const elementDefaults = {
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
}

const blockToNode = (block: Block): LexicalNode => {
  switch (block.type) {
    case 'p':
      return { type: 'paragraph', ...elementDefaults, textFormat: 0, children: parseInline(block.text) }
    case 'h2':
    case 'h3':
      return { type: 'heading', tag: block.type, ...elementDefaults, children: parseInline(block.text) }
    case 'quote':
      return { type: 'quote', ...elementDefaults, children: parseInline(block.text) }
    case 'img':
      return { type: 'upload', version: 3, relationTo: 'media', value: block.media, fields: null, format: '' }
    case 'ul':
    case 'ol':
      return {
        type: 'list',
        listType: block.type === 'ul' ? 'bullet' : 'number',
        tag: block.type,
        start: 1,
        ...elementDefaults,
        children: block.items.map((item, i) => ({
          type: 'listitem',
          value: i + 1,
          ...elementDefaults,
          children: parseInline(item),
        })),
      }
  }
}

export const blocksToLexical = (blocks: Block[]) => ({
  root: {
    type: 'root',
    ...elementDefaults,
    children: blocks.map(blockToNode),
  },
})
