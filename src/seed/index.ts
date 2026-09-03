// Idempotent seed: `npm run seed`. Upserts by slug / filename, safe to re-run.

import config from '@payload-config'
import { readFileSync } from 'fs'
import path from 'path'
import { getPayload, type Payload } from 'payload'

import { blocksToLexical, type Block } from './lexical'

const EVENT_SLUG = 'long-slow-distance-backyard-ultra'

type Photo = { title: string; key: string; alt: string }

// Free-licence photos from Wikimedia Commons, used as placeholders until the crew's own photos land.
const photos: Photo[] = [
  { title: 'File:Kathmandu Valley Night.jpg', key: 'valley-night', alt: 'Kathmandu Valley lights at night seen from the southern hills' },
  { title: 'File:Way to Top of Phulchoki Mountain, Lalitpur.jpg', key: 'phulchoki-trail', alt: 'Runners on the frosted dirt road up Phulchoki, Lalitpur' },
  { title: 'File:Dwellinmountain.jpg', key: 'annapurna-ridge', alt: 'Snow ridge of the Annapurna range above a forested hill' },
  { title: 'File:Kathmandu Valley View, Phulchoki, Lalitpur.jpg', key: 'valley-panorama', alt: 'Kathmandu Valley panorama from the Phulchoki ridge' },
]

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, '').trim()

async function commonsInfo(title: string) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=2400&format=json`
  const res = await fetch(url, { headers: { 'User-Agent': 'longslowdistance-seed/1.0 (https://longslowdistance.vercel.app)' } })
  const json = (await res.json()) as {
    query: { pages: Record<string, { imageinfo: { thumburl: string; descriptionurl: string; extmetadata: Record<string, { value: string }> }[] }> }
  }
  const page = Object.values(json.query.pages)[0]
  const info = page.imageinfo[0]
  const meta = info.extmetadata
  return {
    src: info.thumburl,
    pageUrl: info.descriptionurl,
    credit: `${stripHtml(meta.Artist?.value || 'Unknown')}, ${meta.LicenseShortName?.value || 'CC'} via Wikimedia Commons`,
  }
}

async function upsertMedia(payload: Payload, filename: string, fetchFile: () => Promise<{ data: Buffer; mimetype: string }>, data: Record<string, unknown>) {
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0 })
  if (existing.docs[0]) return existing.docs[0].id
  const file = await fetchFile()
  const created = await payload.create({
    collection: 'media',
    data: data as never,
    file: { data: file.data, mimetype: file.mimetype, name: filename, size: file.data.length },
  })
  payload.logger.info(`uploaded ${filename}`)
  return created.id
}

async function upsertBySlug(payload: Payload, collection: 'events' | 'posts', slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true })
  if (existing.docs[0]) {
    await payload.update({ collection, id: existing.docs[0].id, data: data as never, depth: 0 })
    return existing.docs[0].id
  }
  return (await payload.create({ collection, data: data as never, depth: 0 })).id
}

const P = (text: string): Block => ({ type: 'p', text })
const H2 = (text: string): Block => ({ type: 'h2', text })
const Q = (text: string): Block => ({ type: 'quote', text })
const UL = (items: string[]): Block => ({ type: 'ul', items })

async function seed() {
  const payload = await getPayload({ config })

  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const users = await payload.find({ collection: 'users', limit: 1, depth: 0 })
    if (users.totalDocs === 0) {
      await payload.create({ collection: 'users', data: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD } })
      payload.logger.info(`created admin ${process.env.SEED_ADMIN_EMAIL}`)
    }
  }

  payload.logger.info('Seeding photos...')
  const media: Record<string, number> = {}
  for (const photo of photos) {
    const filename = `${photo.key}.jpg`
    media[photo.key] = await upsertMedia(
      payload,
      filename,
      async () => {
        const info = await commonsInfo(photo.title)
        const res = await fetch(info.src, { headers: { 'User-Agent': 'longslowdistance-seed/1.0' } })
        return { data: Buffer.from(await res.arrayBuffer()), mimetype: 'image/jpeg' }
      },
      await (async () => {
        const info = await commonsInfo(photo.title)
        return { alt: photo.alt, credit: info.credit, creditUrl: info.pageUrl }
      })(),
    )
  }

  payload.logger.info('Seeding course GPX...')
  const gpxId = await upsertMedia(
    payload,
    'backyard-loop.gpx',
    async () => ({ data: readFileSync(path.resolve(process.cwd(), 'src/seed/assets/backyard-loop.gpx')), mimetype: 'application/gpx+xml' }),
    { alt: 'Backyard Ultra loop, Life Vision Academy, Godawari' },
  )

  payload.logger.info('Seeding site settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      tagline: 'Run long. Run slow. Run together.',
      manifesto: [
        'We run long because the far side of tired is where the good stuff is.',
        'We run slow because pace is not the point. Showing up is.',
        'We run together because nobody finishes a night alone.',
        'We build events the way we run: patient, honest, all in.',
      ].map((line) => ({ line })),
      footerNote: 'Made in Kathmandu Valley.',
    },
  })

  payload.logger.info('Seeding the Backyard Ultra...')
  const eventId = await upsertBySlug(payload, 'events', EVENT_SLUG, {
    title: 'Long Slow Distance Backyard Ultra',
    slug: EVENT_SLUG,
    kind: 'backyard-ultra',
    status: 'upcoming',
    startAt: '2026-09-18T20:00:00+05:45',
    venue: 'Life Vision Academy',
    city: 'Godawari, Lalitpur',
    lat: 27.5975,
    lng: 85.3785,
    summary: 'A charity run in the backyard format: one 5.7 km loop on the hour, every hour, through the night, until one runner remains.',
    loopKm: 5.7,
    formatNotes:
      'Every hour, on the hour, everyone starts the same 5.7 km loop. Finish inside the hour and you are back on the start line for the next one. Miss the bell and your night is done. The last runner to complete a loop alone is the winner. Everyone else is a DNF, and proud of it.',
    gpx: gpxId,
    fee: null,
    feeIncludes: 'Timing, aid station on every loop, hot food through the night, event tee and a finisher patch.',
    registrationOpen: true,
    registrationCloseAt: '2026-09-16T23:59:00+05:45',
    charity: { name: '', url: '', blurb: 'Every entry goes to a cause we will announce shortly. All of it.' },
    heroImage: media['valley-night'],
    gallery: [{ image: media['phulchoki-trail'] }, { image: media['valley-panorama'] }],
    body: blocksToLexical([
      P('Life Vision Academy sits at the foot of Phulchoki, the highest hill on the valley rim. The loop leaves the school gate, climbs gently through Godawari village on quiet road and dirt, turns at the forest edge and comes back down to the bell. Nothing technical. Nothing flat either.'),
      H2('How the night goes'),
      P('20:00 is loop one. Headlamps on from the start. The aid station is at the start line, so you pass it every hour: water, electrolytes, salt, fruit, dal bhat after midnight. Your crew can sit right there with a flask and a blanket.'),
      P('You do not need to be fast. A 5.7 km loop in an hour is a walk with intent. What you need is patience, layers, and someone who will tell you to go back out when you do not want to.'),
      H2('Who it is for'),
      UL([
        'First-time ultra runners who want a safe way past 42 km.',
        'Trail regulars who want to see how far a body can go on a friendly course.',
        'Walkers. Yes, you can walk it. The bell does not care how you move.',
        'Anyone who wants to spend a night outside for a good reason.',
      ]),
      H2('The charity'),
      P('This is a charity run. We keep nothing. The beneficiary and the entry fee will be announced here and on Instagram in the coming days; register now and we will email you the details.'),
      Q('Nobody finishes a backyard. You just find out where your night ends.'),
    ]),
    paymentInstructions: blocksToLexical([
      P('Your spot is held for 72 hours. We will email you the entry fee and payment options (bank transfer or eSewa) as soon as they are confirmed. Reply to that email with a screenshot and you are in.'),
    ]),
  })

  payload.logger.info('Seeding field notes...')
  const notes: { slug: string; title: string; excerpt: string; hero: string; publishedAt: string; body: Block[] }[] = [
    {
      slug: 'why-a-backyard-ultra',
      title: 'Why our first event is a backyard ultra',
      excerpt: 'No distance, no cutoff, no podium. Just a bell every hour and the question of whether you go back out.',
      hero: 'valley-night',
      publishedAt: '2026-09-01',
      body: [
        P('We could have started with a 10K. Everybody starts with a 10K. We started with a format where the finish line does not exist because that is the closest thing to how we actually run: long, slow, and together, for as long as it takes.'),
        P('A backyard ultra is the most democratic race format we know. The 3-hour marathoner and the person who has never run past 15 km start every loop side by side. The course is short enough that nobody gets lost and short enough that your family can watch you come through every hour. Fast does not help you. Patience does.'),
        H2('What we are trying to prove'),
        P('That a small crew in Kathmandu Valley can put on an event that feels world class: honest timing, a real aid station, a course that has been walked a hundred times, and communication that treats runners like adults. If we can do it through a whole night on a hill in Godawari, we can do it anywhere in Nepal.'),
        Q('The bell rings. You stand up. That is the whole sport.'),
      ],
    },
    {
      slug: 'how-a-backyard-loop-works',
      title: 'How a backyard loop actually works',
      excerpt: 'Yards, bells, the corral, and the strange maths of finishing 5.7 km with four minutes to spare.',
      hero: 'phulchoki-trail',
      publishedAt: '2026-09-03',
      body: [
        P('The rules are short. Every hour a bell rings and every runner still in the race starts a loop. You must finish the loop inside the hour and be standing in the start corral when the next bell goes. If you are not, you are out. The winner is the last person to complete a loop alone, and only after everyone else has failed to start.'),
        H2('The maths'),
        UL([
          'Our loop is 5.7 km. At 10 min/km that is 57 minutes: tight. At 8:30/km you get about 12 minutes to eat, change socks and sit.',
          'Most people settle around 45 to 50 minutes a loop and rest the difference.',
          'Do not bank time by running fast early. You cannot carry minutes to the next hour, and you can carry fatigue.',
        ]),
        H2('Kit that matters at 3 a.m.'),
        UL(['A second headlamp, or spare batteries you have actually tested.', 'Dry socks for every three loops.', 'A warm layer for the corral. You will be still for ten minutes at a time.', 'Real food. Gels get old by midnight.']),
        P('The loop is drawn from the GPX on the event page. Walk it once before race day if you can. Knowing where the last climb ends is worth more than any training plan.'),
      ],
    },
    {
      slug: 'what-we-mean-by-long-slow-distance',
      title: 'What we mean by long slow distance',
      excerpt: 'It started as a training term. It became the only way we wanted to run, and then the way we wanted to build things.',
      hero: 'annapurna-ridge',
      publishedAt: '2026-08-20',
      body: [
        P('Long slow distance is a coaching phrase from the 1960s: run far, run easy, let the body adapt. We borrowed it for the Sunday runs that kept getting longer, and it stuck because it described something more than a workout.'),
        P('Long, because the interesting part of a run starts after the comfortable part ends. Slow, because pace was never what brought anybody back the next week. Distance, because we like how the valley looks from the ridges and you only get there on foot.'),
        H2('From a group chat to an events crew'),
        P('Somewhere between organising our own routes, aid drops and finish-line food for thirty friends, we noticed we were already running events. We just were not charging for them. Long Slow Distance the company is the same crew, the same standards, and a promise: if we put our name on an event, it is one we would happily run ourselves.'),
        P('Running first. Then the trails, the hills, and whatever else outdoors Nepal wants to do together.'),
      ],
    },
  ]
  for (const note of notes) {
    await upsertBySlug(payload, 'posts', note.slug, {
      title: note.title,
      slug: note.slug,
      excerpt: note.excerpt,
      heroImage: media[note.hero],
      publishedAt: note.publishedAt,
      body: blocksToLexical(note.body),
      _status: 'published',
    })
  }

  payload.logger.info(`Seed complete. Event id ${eventId}.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
