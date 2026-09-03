import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: anyone, update: authenticated },
  fields: [
    { name: 'tagline', type: 'text', required: true, defaultValue: 'Run long. Run slow. Run together.' },
    {
      name: 'manifesto',
      type: 'array',
      admin: { description: 'Short lines shown as the pinned manifesto on the homepage and about page.' },
      fields: [{ name: 'line', type: 'text', required: true }],
    },
    {
      type: 'collapsible',
      label: 'Contact and social',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'whatsapp', type: 'text', admin: { description: 'International format, e.g. +9779800000000' } },
        { name: 'instagram', type: 'text', admin: { description: 'Handle without @' } },
        { name: 'strava', type: 'text', admin: { description: 'Full club URL' } },
      ],
    },
    { name: 'footerNote', type: 'text' },
  ],
}
