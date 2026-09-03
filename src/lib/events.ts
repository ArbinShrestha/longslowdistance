import type { Event } from '@/payload-types'

/** True when the event does not accept registrations right now. */
export const isRegistrationClosed = (event: Event, now: number = Date.now()): boolean =>
  !event.registrationOpen || (!!event.registrationCloseAt && new Date(event.registrationCloseAt).getTime() < now)
