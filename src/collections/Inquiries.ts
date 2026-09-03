import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

export const INQUIRY_KINDS = [
  { label: 'A running event', value: 'running-event' },
  { label: 'Trail or adventure experience', value: 'trail-adventure' },
  { label: 'Corporate or team event', value: 'corporate' },
  { label: 'Something else', value: 'other' },
] as const

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    group: 'Work with us',
    useAsTitle: 'name',
    defaultColumns: ['name', 'organisation', 'kind', 'status', 'createdAt'],
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'organisation', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: INQUIRY_KINDS.map((k) => ({ ...k })),
    },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
