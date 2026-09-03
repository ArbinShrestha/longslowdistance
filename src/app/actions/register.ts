'use server'

import { z } from 'zod'

import { TSHIRT_SIZES } from '@/collections/Registrations'
import { formatDateTime } from '@/lib/format'
import { getPayloadClient } from '@/lib/queries'
import { absoluteUrl } from '@/lib/site'

const schema = z.object({
  eventId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2, 'Tell us your name.').max(120),
  email: z.email('Enter a valid email.'),
  phone: z.string().trim().min(7, 'Enter a phone number we can reach.').max(30),
  emergencyName: z.string().trim().min(2, 'Who should we call if needed?').max(120),
  emergencyPhone: z.string().trim().min(7, 'Enter their phone number.').max(30),
  club: z.string().trim().max(120).optional().or(z.literal('')),
  tshirtSize: z.enum(TSHIRT_SIZES, { error: 'Pick a size.' }),
  waiverAccepted: z.literal('on', { error: 'You need to accept the waiver to take part.' }),
  website: z.string().max(0).optional(), // honeypot
})

export type RegisterState = {
  ok: boolean
  errors?: Record<string, string>
  message?: string
  eventSlug?: string
}

export async function registerAction(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message
    return { ok: false, errors }
  }
  const data = parsed.data
  if (data.website) return { ok: true } // bot: pretend success, store nothing

  const payload = await getPayloadClient()
  const event = await payload.findByID({ collection: 'events', id: data.eventId, depth: 0 }).catch(() => null)
  if (!event) return { ok: false, message: 'This event no longer exists.' }
  const closed =
    !event.registrationOpen ||
    (event.registrationCloseAt && new Date(event.registrationCloseAt).getTime() < Date.now())
  if (closed) return { ok: false, message: 'Registration for this event is closed.' }

  if (event.capacity) {
    const count = await payload.count({ collection: 'registrations', where: { event: { equals: event.id } }, overrideAccess: true })
    if (count.totalDocs >= event.capacity) return { ok: false, message: 'This event is full. Follow us on Instagram for the next one.' }
  }

  try {
    await payload.create({
      collection: 'registrations',
      data: {
        event: event.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        emergencyName: data.emergencyName,
        emergencyPhone: data.emergencyPhone,
        club: data.club || undefined,
        tshirtSize: data.tshirtSize,
        waiverAccepted: true,
        status: 'pending',
        source: 'site',
      },
      overrideAccess: true,
    })
  } catch (err) {
    if (String(err).includes('already registered')) {
      return { ok: false, errors: { email: 'This email is already registered for this event.' } }
    }
    payload.logger.error(err)
    return { ok: false, message: 'Something went wrong on our side. Try again in a minute.' }
  }

  try {
    await payload.sendEmail({
      to: data.email,
      subject: `You are in: ${event.title}`,
      html: `<p>Hi ${data.name},</p><p>Your spot for <strong>${event.title}</strong> on ${formatDateTime(event.startAt)} at ${event.venue}, ${event.city} is held.</p><p>Payment details are on the event page: <a href="${absoluteUrl(`/events/${event.slug}`)}">${absoluteUrl(`/events/${event.slug}`)}</a>. We will email you again when the entry fee is confirmed.</p><p>Run long. Run slow. Run together.<br/>Long Slow Distance</p>`,
    })
  } catch (err) {
    payload.logger.warn(`Confirmation email failed: ${String(err)}`)
  }

  return { ok: true, eventSlug: event.slug ?? undefined }
}
