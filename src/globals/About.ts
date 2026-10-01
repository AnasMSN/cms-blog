import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '../access'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'Tentang Kami',
  admin: { group: 'Halaman' },
  access: { read: () => true, update: isLoggedIn },
  fields: [
    { name: 'title', type: 'text', label: 'Judul', required: true, defaultValue: 'Tentang kami' },
    { name: 'intro', type: 'textarea', label: 'Paragraf pembuka' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Foto' },
    { name: 'content', type: 'richText', label: 'Isi' },
    {
      name: 'milestones',
      type: 'array',
      label: 'Perjalanan usaha',
      labels: { singular: 'Tonggak', plural: 'Tonggak' },
      admin: { description: 'Ditampilkan sebagai garis waktu, urut dari yang terlama.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'year', type: 'text', required: true, label: 'Tahun', admin: { width: '25%' } },
            { name: 'text', type: 'text', required: true, label: 'Keterangan', admin: { width: '75%' } },
          ],
        },
      ],
    },
  ],
}
