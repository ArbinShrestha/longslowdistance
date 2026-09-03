import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    group: 'Events',
    useAsTitle: 'title',
    defaultColumns: ['title', 'startAt', 'status', 'registrationOpen'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'backyard-ultra',
          options: [
            { label: 'Backyard ultra', value: 'backyard-ultra' },
            { label: 'Trail run', value: 'trail' },
            { label: 'Road run', value: 'road' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'upcoming',
          options: [
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Live', value: 'live' },
            { label: 'Past', value: 'past' },
          ],
        },
      ],
    },
    {
      name: 'startAt',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'Local time (Asia/Kathmandu).' },
    },
    {
      type: 'row',
      fields: [
        { name: 'venue', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'lat', type: 'number', min: -90, max: 90 },
        { name: 'lng', type: 'number', min: -180, max: 180 },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 240,
      admin: { description: 'One or two sentences for cards and social previews.' },
    },
    { name: 'body', type: 'richText' },
    {
      type: 'collapsible',
      label: 'Format',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'loopKm', type: 'number', min: 0, admin: { description: 'Loop length in km, if the course is a loop.' } },
            { name: 'distanceLabel', type: 'text', admin: { description: 'Shown when there is no single loop, e.g. "21 km / 42 km".' } },
          ],
        },
        {
          name: 'formatNotes',
          type: 'textarea',
          admin: { description: 'How it works, e.g. one loop every hour, on the hour, until one runner remains.' },
        },
        {
          name: 'gpx',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'GPX file of the course. Rendered as the route drawing.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Entry',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'fee', type: 'number', min: 0, admin: { description: 'NPR. Leave empty to show "Announced soon".' } },
            { name: 'capacity', type: 'number', min: 1 },
          ],
        },
        { name: 'feeIncludes', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'registrationOpen', type: 'checkbox', defaultValue: false },
            { name: 'registrationCloseAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
          ],
        },
        {
          name: 'externalRegisterUrl',
          type: 'text',
          admin: { description: 'Optional. If set, the register button links here instead of the built-in form.' },
        },
        {
          name: 'paymentInstructions',
          type: 'richText',
          admin: { description: 'Shown to a runner right after they register (bank details, eSewa, deadline).' },
        },
        { name: 'paymentQr', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'charity',
      type: 'group',
      admin: { description: 'Leave name empty to show "Beneficiary announced soon".' },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'blurb', type: 'textarea' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Imagery',
      fields: [
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
        { name: 'poster', type: 'upload', relationTo: 'media' },
        {
          name: 'gallery',
          type: 'array',
          fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
        },
      ],
    },
    seoField,
  ],
}
