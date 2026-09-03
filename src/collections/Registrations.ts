import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

export const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    group: 'Events',
    useAsTitle: 'name',
    defaultColumns: ['name', 'event', 'status', 'tshirtSize', 'createdAt'],
  },
  // The public form writes through a server action using the Local API with
  // overrideAccess, so no anonymous create access is exposed over REST.
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data?.email || !data?.event) return data
        const email = String(data.email).trim().toLowerCase()
        const eventId = typeof data.event === 'object' ? data.event.id : data.event
        const existing = await req.payload.find({
          collection: 'registrations',
          where: { and: [{ event: { equals: eventId } }, { email: { equals: email } }] },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const clash = existing.docs[0]
        if (clash && (operation === 'create' || clash.id !== originalDoc?.id)) {
          throw new Error('This email is already registered for this event.')
        }
        return { ...data, email }
      },
    ],
  },
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events', required: true, index: true },
    { name: 'name', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, index: true },
        { name: 'phone', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'emergencyName', type: 'text', required: true },
        { name: 'emergencyPhone', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'club', type: 'text' },
        {
          name: 'tshirtSize',
          type: 'select',
          required: true,
          options: TSHIRT_SIZES.map((s) => ({ label: s, value: s })),
        },
      ],
    },
    { name: 'waiverAccepted', type: 'checkbox', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Pending payment', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Paid', value: 'paid' },
          ],
        },
        {
          name: 'source',
          type: 'select',
          required: true,
          defaultValue: 'site',
          options: [
            { label: 'Website', value: 'site' },
            { label: 'Imported', value: 'import' },
          ],
        },
      ],
    },
    { name: 'notes', type: 'textarea', admin: { description: 'Internal notes (payment reference, bib number).' } },
  ],
}
