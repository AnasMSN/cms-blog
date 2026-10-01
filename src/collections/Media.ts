import path from 'path'
import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Foto', plural: 'Foto & Media' },
  admin: { group: 'Konten' },
  access: { read: () => true, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Deskripsi foto',
      required: true,
      admin: { description: 'Jelaskan isi foto singkat. Dipakai untuk SEO dan pembaca layar.' },
    },
  ],
  upload: {
    // Files live outside the build so they survive redeploys (mounted as a Docker volume).
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 400, height: 400, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 800, height: 800, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'wide', width: 1600, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 80 } } },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
}
