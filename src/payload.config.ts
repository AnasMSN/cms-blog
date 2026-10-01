import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { id } from '@payloadcms/translations/languages/id'
import fs from 'fs'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Stories } from './collections/Stories'
import { Users } from './collections/Users'
import { About } from './globals/About'
import { Home } from './globals/Home'
import { Settings } from './globals/Settings'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUri = process.env.DATABASE_URI || 'file:./data/site.db'
// SQLite won't create missing folders, and data/ is gitignored — make sure it exists on a fresh clone.
if (databaseUri.startsWith('file:')) {
  fs.mkdirSync(path.dirname(databaseUri.slice('file:'.length)), { recursive: true })
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Admin' },
    dateFormat: 'd MMM yyyy',
  },
  // Admin panel in Bahasa Indonesia by default; each user can switch to English in their account page.
  i18n: { supportedLanguages: { id, en }, fallbackLanguage: 'id' },
  collections: [Products, Categories, Stories, Media, Users],
  globals: [Home, About, Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    // Local file by default; point at Turso (libsql://…) + auth token for serverless hosting.
    client: {
      url: databaseUri,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
    // Dev: schema is pushed automatically. Production: these migrations run on boot.
    // After changing a collection, run `npm run payload migrate:create <name>` and commit it.
    prodMigrations: migrations,
  }),
  sharp,
  upload: { limits: { fileSize: 8_000_000 } },
})
