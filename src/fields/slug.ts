import type { Field, FieldHook } from 'payload'

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, operation }) => {
    if (typeof value === 'string' && value.length > 0) {
      return slugify(value)
    }
    if (operation === 'create' || operation === 'update') {
      const fallback = data?.[fallbackField]
      if (typeof fallback === 'string' && fallback.length > 0) {
        return slugify(fallback)
      }
    }
    return value
  }

export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL path segment. Auto-generated from the title if left empty.',
  },
  hooks: {
    beforeValidate: [formatSlug(fallbackField)],
  },
})
