import type { CollectionConfig } from 'payload'
import { isLoggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produk', plural: 'Produk' },
  admin: {
    useAsTitle: 'title',
    group: 'Katalog',
    defaultColumns: ['title', 'category', 'price', 'featured', '_status'],
    description: 'Semua produk yang tampil di katalog. Simpan sebagai draf dulu jika belum siap tayang.',
  },
  defaultSort: 'order',
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Info utama',
          fields: [
            { name: 'title', type: 'text', label: 'Nama produk', required: true },
            {
              type: 'row',
              fields: [
                { name: 'price', type: 'number', label: 'Harga (Rp)', min: 0, admin: { width: '50%' } },
                {
                  name: 'unit',
                  type: 'text',
                  label: 'Satuan',
                  admin: { width: '50%', placeholder: 'mis. per box 250 g' },
                },
              ],
            },
            {
              name: 'summary',
              type: 'textarea',
              label: 'Ringkasan singkat',
              maxLength: 180,
              admin: { description: 'Satu–dua kalimat. Tampil di kartu produk.' },
            },
            { name: 'description', type: 'richText', label: 'Deskripsi lengkap' },
          ],
        },
        {
          label: 'Foto',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Foto utama', required: true },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, label: 'Foto tambahan' },
          ],
        },
        {
          label: 'Detail',
          fields: [
            {
              name: 'specs',
              type: 'array',
              label: 'Spesifikasi',
              labels: { singular: 'Baris', plural: 'Baris' },
              admin: { description: 'Contoh: Berat — 250 g, Daya tahan — 3 bulan, Komposisi — …' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'value', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
            {
              name: 'shopLinks',
              type: 'array',
              label: 'Link marketplace khusus produk ini',
              admin: { description: 'Kosongkan untuk memakai link toko dari Pengaturan Situs.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '35%', placeholder: 'Shopee' } },
                    { name: 'url', type: 'text', required: true, admin: { width: '65%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Kategori',
      admin: { position: 'sidebar' },
    },
    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      label: 'Label',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Terlaris', value: 'bestseller' },
        { label: 'Baru', value: 'new' },
        { label: 'Halal', value: 'halal' },
        { label: 'Edisi terbatas', value: 'limited' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Tampilkan di beranda',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', label: 'Urutan', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
