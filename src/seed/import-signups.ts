// Imports a signups CSV (the leaderboard.y11k.com export format) into Registrations.
// Usage: SIGNUPS_FILE=~/Downloads/signups.csv EVENT_SLUG=long-slow-distance-backyard-ultra npm run seed:signups
// Idempotent: rows whose email is already registered for the event are skipped.

import config from '@payload-config'
import { readFileSync } from 'fs'
import { getPayload } from 'payload'

import { TSHIRT_SIZES } from '../collections/Registrations'

const parseCsv = (text: string): string[][] => {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += ch
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows.filter((r) => r.some((c) => c.trim()))
}

async function run() {
  const file = process.env.SIGNUPS_FILE
  const eventSlug = process.env.EVENT_SLUG || 'long-slow-distance-backyard-ultra'
  if (!file) throw new Error('SIGNUPS_FILE is required')

  const payload = await getPayload({ config })
  const event = (await payload.find({ collection: 'events', where: { slug: { equals: eventSlug } }, limit: 1, depth: 0 }))
    .docs[0]
  if (!event) throw new Error(`Event ${eventSlug} not found; run npm run seed first`)

  const [header, ...rows] = parseCsv(readFileSync(file, 'utf8').replace(/^﻿/, ''))
  const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name)
  const idx = {
    name: col('name'),
    email: col('email'),
    phone: col('phone_number'),
    emergencyPhone: col('emergency_contact_phone'),
    emergencyName: col('emergency_contact_name'),
    club: col('club_or_team'),
    size: col('t_shirt_size'),
    waiver: header.findIndex((h) => h.toLowerCase().startsWith('i_agree')),
  }

  let created = 0
  let skipped = 0
  for (const r of rows) {
    const email = (r[idx.email] || '').trim().toLowerCase()
    if (!email) continue
    const rawSize = (r[idx.size] || 'M').trim().toUpperCase()
    const tshirtSize = (TSHIRT_SIZES as readonly string[]).includes(rawSize) ? rawSize : 'M'
    try {
      await payload.create({
        collection: 'registrations',
        data: {
          event: event.id,
          name: r[idx.name].trim(),
          email,
          phone: r[idx.phone].trim(),
          emergencyName: r[idx.emergencyName].trim(),
          emergencyPhone: r[idx.emergencyPhone].trim(),
          club: (r[idx.club] || '').trim() || undefined,
          tshirtSize: tshirtSize as (typeof TSHIRT_SIZES)[number],
          waiverAccepted: /^(yes|true|1)$/i.test((r[idx.waiver] || '').trim()),
          status: 'pending',
          source: 'import',
        },
        overrideAccess: true,
      })
      created++
    } catch (err) {
      if (String(err).includes('already registered')) skipped++
      else throw err
    }
  }
  payload.logger.info(`Imported ${created} registrations, skipped ${skipped} duplicates.`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
