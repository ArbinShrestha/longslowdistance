'use server'

import { z } from 'zod'

import { INQUIRY_KINDS } from '@/collections/Inquiries'
import { getPayloadClient } from '@/lib/queries'

const kinds = INQUIRY_KINDS.map((k) => k.value) as [string, ...string[]]

const schema = z.object({
  name: z.string().trim().min(2, 'Tell us your name.').max(120),
  organisation: z.string().trim().max(160).optional().or(z.literal('')),
  email: z.email('Enter a valid email.'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  kind: z.enum(kinds, { error: 'Pick what you have in mind.' }),
  message: z.string().trim().min(20, 'Give us a few sentences to work with.').max(4000),
  website: z.string().optional(), // honeypot: any value means a bot filled it
})

export type InquiryState = { ok: boolean; errors?: Record<string, string>; message?: string }

export async function inquireAction(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.message
    return { ok: false, errors }
  }
  const data = parsed.data
  if (data.website) return { ok: true }

  const payload = await getPayloadClient()
  try {
    await payload.create({
      collection: 'inquiries',
      data: {
        name: data.name,
        organisation: data.organisation || undefined,
        email: data.email,
        phone: data.phone || undefined,
        kind: data.kind as (typeof INQUIRY_KINDS)[number]['value'],
        message: data.message,
        status: 'new',
      },
      overrideAccess: true,
    })
  } catch (err) {
    payload.logger.error(err)
    return { ok: false, message: 'Something went wrong on our side. Email us directly instead.' }
  }

  const crew = process.env.CREW_EMAIL
  if (crew) {
    try {
      await payload.sendEmail({
        to: crew,
        subject: `New inquiry: ${data.kind} from ${data.name}`,
        html: `<p><strong>${data.name}</strong>${data.organisation ? ` (${data.organisation})` : ''}<br/>${data.email}${data.phone ? ` / ${data.phone}` : ''}</p><p>${data.message.replace(/\n/g, '<br/>')}</p>`,
      })
    } catch (err) {
      payload.logger.warn(`Inquiry email failed: ${String(err)}`)
    }
  }
  return { ok: true }
}
