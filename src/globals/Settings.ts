import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access'

const hex = (v: unknown) =>
  !v || /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(v)) || 'Gunakan kode warna hex, mis. #2F6B45'

const colorField = (name: string, label: string, defaultValue: string, description: string) => ({
  name,
  type: 'text' as const,
  label,
  defaultValue,
  validate: hex,
  admin: { description, width: '50%' },
})

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Pengaturan Situs',
  admin: { group: 'Pengaturan', description: 'Identitas merek, warna, kontak, dan link toko.' },
  access: { read: () => true, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Merek',
          fields: [
            { name: 'brandName', type: 'text', label: 'Nama merek', required: true, defaultValue: 'Nama Toko' },
            { name: 'tagline', type: 'text', label: 'Tagline' },
            { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo (opsional)' },
            {
              name: 'footerNote',
              type: 'textarea',
              label: 'Kalimat penutup di footer',
            },
          ],
        },
        {
          label: 'Warna',
          description: 'Perubahan warna langsung berlaku di seluruh situs.',
          fields: [
            {
              type: 'row',
              fields: [
                colorField('colorPrimary', 'Warna utama', '#2F6B45', 'Tombol dan penanda.'),
                colorField('colorAccent', 'Warna aksen', '#D99A1E', 'Sorotan kecil dan label.'),
              ],
            },
            {
              type: 'row',
              fields: [
                colorField('colorInk', 'Warna teks', '#1C2340', 'Teks dan judul.'),
                colorField('colorPaper', 'Warna latar', '#F4F5F0', 'Latar halaman.'),
              ],
            },
            {
              type: 'row',
              fields: [colorField('colorDeep', 'Warna blok gelap', '#5A3319', 'Latar bagian "Tentang".')],
            },
          ],
        },
        {
          label: 'Kontak & pemesanan',
          fields: [
            {
              name: 'whatsapp',
              type: 'text',
              label: 'Nomor WhatsApp',
              admin: { description: 'Format internasional tanpa +, mis. 6281234567890.' },
              validate: (v: unknown) => !v || /^\d{8,15}$/.test(String(v)) || 'Hanya angka, mis. 6281234567890',
            },
            {
              name: 'whatsappMessage',
              type: 'textarea',
              label: 'Template pesan WhatsApp',
              defaultValue: 'Halo, saya ingin memesan {produk}. Apakah masih tersedia?',
              admin: { description: 'Tulis {produk} untuk menyisipkan nama produk secara otomatis.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', label: 'Email', admin: { width: '50%' } },
                { name: 'phone', type: 'text', label: 'Telepon', admin: { width: '50%' } },
              ],
            },
            { name: 'address', type: 'textarea', label: 'Alamat toko' },
            { name: 'hours', type: 'text', label: 'Jam buka', admin: { placeholder: 'Setiap hari, 08.00–21.00' } },
            { name: 'mapsUrl', type: 'text', label: 'Link Google Maps' },
          ],
        },
        {
          label: 'Toko online & sosial',
          fields: [
            {
              name: 'shops',
              type: 'array',
              label: 'Toko online',
              labels: { singular: 'Toko', plural: 'Toko' },
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
            {
              name: 'socials',
              type: 'array',
              label: 'Media sosial',
              labels: { singular: 'Akun', plural: 'Akun' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '35%', placeholder: 'Instagram' } },
                    { name: 'url', type: 'text', required: true, admin: { width: '65%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text', label: 'Judul di Google' },
            { name: 'seoDescription', type: 'textarea', label: 'Deskripsi di Google', maxLength: 160 },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Gambar saat dibagikan' },
          ],
        },
      ],
    },
  ],
}
