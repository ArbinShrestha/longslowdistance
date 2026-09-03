import type { CollectionConfig } from 'payload'

import { authenticated, authenticatedOrPublished } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Field note', plural: 'Field notes' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
  },
  versions: { drafts: true },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 240 },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    seoField,
  ],
}
