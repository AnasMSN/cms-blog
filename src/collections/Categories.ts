import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '../access'
import { slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategori', plural: 'Kategori' },
  admin: { useAsTitle: 'title', group: 'Katalog', defaultColumns: ['title', 'order'] },
  defaultSort: 'order',
  access: { read: () => true, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'title', type: 'text', label: 'Nama kategori', required: true },
    { name: 'order', type: 'number', label: 'Urutan', defaultValue: 0, admin: { position: 'sidebar' } },
    slugField(),
  ],
}
