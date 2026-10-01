import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '../access'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Beranda',
  admin: { group: 'Halaman' },
  access: { read: () => true, update: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Pembuka',
          fields: [
            { name: 'heroTitle', type: 'textarea', label: 'Judul besar', required: true, defaultValue: 'Oleh-oleh khas daerah kami' },
            { name: 'heroText', type: 'textarea', label: 'Paragraf pembuka' },
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Foto pembuka' },
            {
              type: 'row',
              fields: [
                { name: 'heroPrimaryLabel', type: 'text', label: 'Tombol utama', defaultValue: 'Lihat produk', admin: { width: '50%' } },
                { name: 'heroSecondaryLabel', type: 'text', label: 'Tombol kedua', defaultValue: 'Pesan lewat WhatsApp', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Keunggulan',
          fields: [
            {
              name: 'promises',
              type: 'array',
              label: 'Poin keunggulan',
              maxRows: 4,
              labels: { singular: 'Poin', plural: 'Poin' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Produk & cerita',
          fields: [
            { name: 'productsTitle', type: 'text', label: 'Judul bagian produk', defaultValue: 'Yang paling sering dibawa pulang' },
            {
              name: 'productsText',
              type: 'textarea',
              label: 'Keterangan bagian produk',
              admin: { description: 'Produk yang tampil adalah yang dicentang "Tampilkan di beranda".' },
            },
            { name: 'storiesTitle', type: 'text', label: 'Judul bagian cerita', defaultValue: 'Cerita di balik rasa' },
          ],
        },
        {
          label: 'Tentang singkat',
          fields: [
            { name: 'aboutTitle', type: 'text', label: 'Judul' },
            { name: 'aboutText', type: 'textarea', label: 'Isi' },
            { name: 'aboutImage', type: 'upload', relationTo: 'media', label: 'Foto' },
          ],
        },
        {
          label: 'Testimoni',
          fields: [
            {
              name: 'testimonials',
              type: 'array',
              label: 'Testimoni',
              maxRows: 6,
              labels: { singular: 'Testimoni', plural: 'Testimoni' },
              fields: [
                { name: 'quote', type: 'textarea', required: true, label: 'Kutipan' },
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, label: 'Nama', admin: { width: '50%' } },
                    { name: 'from', type: 'text', label: 'Asal / keterangan', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
