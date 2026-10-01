import type { CollectionConfig } from 'payload'
import { isLoggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields/slug'

/** Heritage / culture articles — the "story behind the snack" that sells oleh-oleh. */
export const Stories: CollectionConfig = {
  slug: 'stories',
  labels: { singular: 'Cerita', plural: 'Cerita & Budaya' },
  admin: {
    useAsTitle: 'title',
    group: 'Konten',
    defaultColumns: ['title', 'publishedAt', '_status'],
  },
  defaultSort: '-publishedAt',
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'title', type: 'text', label: 'Judul', required: true },
    { name: 'excerpt', type: 'textarea', label: 'Ringkasan', maxLength: 240 },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Foto sampul' },
    { name: 'content', type: 'richText', label: 'Isi cerita' },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Produk terkait',
    },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Tanggal terbit',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeChange: [({ value, siblingData }) => value ?? (siblingData._status === 'published' ? new Date() : value)],
      },
    },
  ],
}
