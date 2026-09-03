import type { CollectionConfig, GlobalConfig } from 'payload'

// Final safety net for the no-em-dash rule: rewrites every string in a document
// (including Lexical rich text nodes) before it is saved, whether it arrives via
// the admin UI, the REST API or the Local API.
const EM_DASH = '\u2014'

export const stripEmDashesFromString = (value: string): string =>
  value.includes(EM_DASH)
    ? value.replace(/\s+\u2014\s+/g, ', ').replace(/\u2014/g, '-')
    : value

const deepStrip = <T,>(value: T): T => {
  if (typeof value === 'string') return stripEmDashesFromString(value) as T
  if (Array.isArray(value)) return value.map(deepStrip) as T
  if (value && typeof value === 'object' && !(value instanceof Date) && !Buffer.isBuffer(value)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = deepStrip(v)
    return out as T
  }
  return value
}

const beforeChange = ({ data }: { data: Record<string, unknown> }) => deepStrip(data)

export const withEmDashGuard = <T extends CollectionConfig | GlobalConfig>(config: T): T => ({
  ...config,
  hooks: {
    ...config.hooks,
    beforeChange: [beforeChange, ...(config.hooks?.beforeChange ?? [])],
  },
})
