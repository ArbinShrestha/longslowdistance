import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    defaultColumns: ['filename', 'alt', 'credit'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    // GPX route files ride along with the images so events can attach a course.
    mimeTypes: ['image/*', 'application/gpx+xml', 'application/xml', 'text/xml', 'application/octet-stream'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 480, withoutEnlargement: true },
      { name: 'card', width: 960, withoutEnlargement: true },
      { name: 'large', width: 1920, withoutEnlargement: true },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for screen readers and search engines. For GPX files, the course name.' },
    },
    { name: 'caption', type: 'text' },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photographer / source and licence, e.g. "Jane Doe, CC BY-SA 4.0".' },
    },
    { name: 'creditUrl', type: 'text' },
  ],
}
