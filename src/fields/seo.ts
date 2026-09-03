import type { Field } from 'payload'

export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: {
    description: 'Overrides for search engines and social cards. Falls back to the main content fields when empty.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      maxLength: 70,
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      maxLength: 170,
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
