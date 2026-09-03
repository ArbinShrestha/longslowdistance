import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Events } from './collections/Events'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Registrations } from './collections/Registrations'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { withEmDashGuard } from './hooks/stripEmDashes'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Postgres (Neon) in production, SQLite locally. Accepts the connection string in
// DATABASE_URI or DATABASE_URL (Vercel's Neon integration injects DATABASE_URL).
const connectionString = process.env.DATABASE_URI || process.env.DATABASE_URL || 'file:./lsd.db'

// The Vercel Postgres adapter talks to Neon over WebSockets (port 443),
// which also works from networks that block the raw Postgres port.
const db = connectionString.startsWith('postgres')
  ? vercelPostgresAdapter({ pool: { connectionString } })
  : sqliteAdapter({ client: { url: connectionString } })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' | Long Slow Distance' },
  },
  collections: [Events, Registrations, Inquiries, Posts, Media, Users].map(withEmDashGuard),
  globals: [withEmDashGuard(SiteSettings)],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db,
  sharp,
  // Emails only go out when a Resend key is present; otherwise Payload logs them.
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          apiKey: process.env.RESEND_API_KEY,
          defaultFromAddress: process.env.EMAIL_FROM || 'crew@longslowdistance.run',
          defaultFromName: 'Long Slow Distance',
        }),
      }
    : {}),
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [vercelBlobStorage({ collections: { media: true }, token: process.env.BLOB_READ_WRITE_TOKEN })]
      : []),
  ],
})
