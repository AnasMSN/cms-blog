/**
 * Demo content: a fictional oleh-oleh brand from Priangan (West Java).
 *   npm run seed           -> seeds only if the site is empty
 *   npm run seed -- --force -> wipes catalogue content and seeds again
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { placeholder } from './placeholder'
import { rich } from './richtext'

const force = process.argv.includes('--force')
const payload = await getPayload({ config })

const existing = await payload.count({ collection: 'products' })
if (existing.totalDocs > 0 && !force) {
  payload.logger.info('Site already has products. Run `npm run seed -- --force` to reset demo content.')
  process.exit(0)
}
if (force) {
  for (const slug of ['stories', 'products', 'categories', 'media'] as const) {
    await payload.delete({ collection: slug, where: { id: { exists: true } } })
  }
}

// Admin account
const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
const password = process.env.SEED_ADMIN_PASSWORD || 'ganti-password-ini'
const users = await payload.find({ collection: 'users', where: { email: { equals: email } } })
if (!users.docs.length) {
  await payload.create({ collection: 'users', data: { email, password, name: 'Admin', role: 'admin' } })
  payload.logger.info(`Admin created: ${email}`)
}

const image = async (alt: string, base: string, fg: string, variant: number, w?: number, h?: number) =>
  payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: await placeholder(base, fg, variant, w, h),
      mimetype: 'image/jpeg',
      name: `${alt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`,
      size: 0,
    },
  })

const cat = async (title: string, order: number) => payload.create({ collection: 'categories', data: { title, order } })
const makanan = await cat('Kue & camilan', 1)
const minuman = await cat('Minuman', 2)
const kerajinan = await cat('Kerajinan', 3)

type Seed = {
  title: string
  price: number
  unit: string
  summary: string
  category: number | string
  colors: [string, string]
  badges?: ('bestseller' | 'new' | 'halal' | 'limited')[]
  featured?: boolean
  specs: [string, string][]
  body: string[]
}

const catalogue: Seed[] = [
  {
    title: 'Dodol Garut Kacang',
    price: 45000,
    unit: 'per besek 500 g',
    summary: 'Ketan, gula aren, dan santan yang diaduk delapan jam di kuali tembaga. Kenyal, tidak lengket di gigi.',
    category: makanan.id,
    colors: ['#E9DCC6', '#6B3D1E'],
    badges: ['bestseller', 'halal'],
    featured: true,
    specs: [['Berat', '500 g'], ['Daya tahan', '3 bulan'], ['Komposisi', 'Ketan, gula aren, santan, kacang tanah']],
    body: ['Dibuat dalam jumlah kecil setiap pagi. Kami memakai gula aren dari Cisompet sehingga warnanya cokelat alami tanpa pewarna.'],
  },
  {
    title: 'Sale Pisang Gulung',
    price: 32000,
    unit: 'per toples 250 g',
    summary: 'Pisang ambon yang dijemur tiga hari, digulung kulit lumpia, lalu digoreng renyah.',
    category: makanan.id,
    colors: ['#F2D98B', '#9C5A14'],
    badges: ['halal'],
    featured: true,
    specs: [['Berat', '250 g'], ['Daya tahan', '2 bulan'], ['Komposisi', 'Pisang ambon, kulit lumpia, minyak kelapa']],
    body: ['Manisnya murni dari pisang yang dijemur. Cocok untuk teman kopi sore.'],
  },
  {
    title: 'Opak Ketan Bakar',
    price: 25000,
    unit: 'per bungkus isi 10',
    summary: 'Kerupuk ketan tipis yang dibakar di atas arang, gurih dengan aroma kelapa parut.',
    category: makanan.id,
    colors: ['#EFE7D6', '#B08A57'],
    badges: ['new'],
    specs: [['Isi', '10 lembar'], ['Daya tahan', '1 bulan'], ['Komposisi', 'Ketan, kelapa parut, garam']],
    body: ['Setiap lembar dijemur di bawah matahari sebelum dibakar, sehingga renyahnya tahan lama.'],
  },
  {
    title: 'Keripik Tempe Sagu',
    price: 28000,
    unit: 'per pouch 200 g',
    summary: 'Tempe diiris setipis kertas, dibalut adonan sagu berbumbu ketumbar dan daun jeruk.',
    category: makanan.id,
    colors: ['#E4E1C9', '#5E6B2C'],
    badges: ['halal'],
    specs: [['Berat', '200 g'], ['Daya tahan', '2 bulan'], ['Komposisi', 'Tempe, tepung sagu, bawang putih, ketumbar, daun jeruk']],
    body: ['Tempe kami datang dari perajin di Cibuntu yang masih membungkus dengan daun pisang.'],
  },
  {
    title: 'Bandrek Serbuk Jahe Merah',
    price: 35000,
    unit: 'per box isi 10 sachet',
    summary: 'Jahe merah, sereh, kayu manis, dan gula aren. Tinggal seduh air panas.',
    category: minuman.id,
    colors: ['#E8C9B5', '#8E2F1F'],
    badges: ['bestseller'],
    featured: true,
    specs: [['Isi', '10 sachet × 25 g'], ['Daya tahan', '12 bulan'], ['Penyajian', 'Seduh dengan 150 ml air panas']],
    body: ['## Cara menyajikan', 'Tuang satu sachet ke gelas, seduh dengan air mendidih, aduk rata. Tambahkan susu kental manis jika suka.'],
  },
  {
    title: 'Bajigur Instan',
    price: 33000,
    unit: 'per box isi 10 sachet',
    summary: 'Santan, gula aren, dan sedikit kopi. Minuman hangat khas malam di pegunungan.',
    category: minuman.id,
    colors: ['#EADFCB', '#7A5230'],
    specs: [['Isi', '10 sachet × 30 g'], ['Daya tahan', '9 bulan']],
    body: ['Paling nikmat disajikan bersama ubi atau kacang rebus.'],
  },
  {
    title: 'Tas Anyaman Pandan Mini',
    price: 55000,
    unit: 'per buah',
    summary: 'Dianyam tangan oleh ibu-ibu perajin Rajapolah. Muat satu besek dodol sebagai kemasan hadiah.',
    category: kerajinan.id,
    colors: ['#DDE5D2', '#3F6B3A'],
    badges: ['limited'],
    featured: true,
    specs: [['Ukuran', '22 × 15 × 10 cm'], ['Bahan', 'Daun pandan duri, pewarna alami']],
    body: ['Setiap tas sedikit berbeda karena dibuat manual. Pembelian ikut menopang 14 perajin di Tasikmalaya.'],
  },
]

const created: { id: number | string }[] = []
for (const [i, p] of catalogue.entries()) {
  const img = await image(p.title, p.colors[0], p.colors[1], i)
  const doc = await payload.create({
    collection: 'products',
    draft: false,
    data: {
      _status: 'published',
      title: p.title,
      price: p.price,
      unit: p.unit,
      summary: p.summary,
      category: p.category as number,
      image: img.id,
      badges: p.badges,
      featured: p.featured ?? false,
      order: i,
      specs: p.specs.map(([label, value]) => ({ label, value })),
      description: rich(...p.body),
    },
  })
  created.push(doc)
}

const stories = [
  {
    title: 'Dodol Garut: delapan jam di depan kuali',
    excerpt: 'Kenapa dodol yang baik tidak bisa dibuat cepat, dan apa hubungannya dengan tangan yang tidak boleh berhenti mengaduk.',
    colors: ['#E9DCC6', '#6B3D1E'] as [string, string],
    related: [0],
    body: [
      'Di dapur kami, dodol dimulai sebelum subuh. Ketan yang sudah digiling dicampur santan dan gula aren, lalu masuk ke kuali tembaga besar.',
      '## Kenapa harus diaduk terus',
      'Begitu adukan berhenti, dasar kuali gosong dan rasa pahit menyebar ke seluruh adonan. Karena itu dua orang bergantian mengaduk selama delapan jam.',
      'Hasilnya dodol yang kenyal, mengilap, dan harum gula aren. Tidak ada jalan pintas untuk itu.',
    ],
  },
  {
    title: 'Bandrek, penghangat malam di Priangan',
    excerpt: 'Minuman rempah yang menemani ronda, hujan, dan obrolan panjang di teras.',
    colors: ['#E8C9B5', '#8E2F1F'] as [string, string],
    related: [4, 5],
    body: [
      'Udara pegunungan Priangan bisa turun di bawah 18 derajat saat malam. Dari situlah bandrek lahir: jahe, sereh, dan gula aren yang direbus lama.',
      'Kami menyimpan resep itu dalam bentuk serbuk agar bisa dibawa pulang ke kota mana pun.',
    ],
  },
  {
    title: 'Opak ketan dan halaman yang penuh jemuran',
    excerpt: 'Musim kemarau adalah musim opak. Cerita tentang matahari sebagai bahan rahasia.',
    colors: ['#EFE7D6', '#B08A57'] as [string, string],
    related: [2],
    body: [
      'Saat kemarau, halaman rumah di kampung kami penuh tampah berisi lembaran opak yang dijemur.',
      'Matahari membuat opak kering merata sehingga saat dibakar di atas arang ia mengembang dan renyah tanpa perlu digoreng.',
    ],
  },
]

for (const [i, s] of stories.entries()) {
  const cover = await image(s.title, s.colors[0], s.colors[1], i + 2, 1600, 1000)
  await payload.create({
    collection: 'stories',
    draft: false,
    data: {
      _status: 'published',
      title: s.title,
      excerpt: s.excerpt,
      cover: cover.id,
      content: rich(...s.body),
      relatedProducts: s.related.map((r) => created[r].id as number),
      publishedAt: new Date(Date.now() - i * 9 * 86400000).toISOString(),
    },
  })
}

const hero = await image('Aneka oleh-oleh Sari Priangan', '#DCE6D8', '#2F6B45', 2, 1200, 1500)
const aboutImg = await image('Dapur produksi Sari Priangan', '#E6D5C3', '#5A3319', 0, 900, 1200)

await payload.updateGlobal({
  slug: 'settings',
  data: {
    brandName: 'Sari Priangan',
    tagline: 'Oleh-oleh khas Priangan sejak 1998',
    footerNote: 'Camilan dan kerajinan Priangan, dibuat dalam jumlah kecil oleh perajin lokal.',
    whatsapp: '6281234567890',
    whatsappMessage: 'Halo Sari Priangan, saya ingin memesan {produk}. Apakah masih tersedia?',
    email: 'halo@saripriangan.id',
    phone: '022 1234 5678',
    address: 'Jl. Cihampelas No. 88\nBandung, Jawa Barat 40131',
    hours: 'Setiap hari, 08.00–21.00',
    mapsUrl: 'https://maps.google.com/?q=Cihampelas+Bandung',
    shops: [
      { label: 'Shopee', url: 'https://shopee.co.id/' },
      { label: 'Tokopedia', url: 'https://www.tokopedia.com/' },
    ],
    socials: [{ label: 'Instagram', url: 'https://instagram.com/' }],
    seoTitle: 'Sari Priangan — Oleh-oleh khas Bandung & Garut',
    seoDescription: 'Dodol Garut, bandrek, sale pisang, dan kerajinan anyaman dari perajin Priangan. Pesan lewat WhatsApp atau marketplace.',
    ogImage: hero.id,
  },
})

await payload.updateGlobal({
  slug: 'home',
  data: {
    heroTitle: 'Rasa Priangan\nuntuk dibawa pulang',
    heroText: 'Dodol, bandrek, dan camilan kampung yang dibuat perajin di Garut, Bandung, dan Tasikmalaya. Dikemas rapi, siap jadi buah tangan.',
    heroImage: hero.id,
    heroPrimaryLabel: 'Lihat produk',
    heroSecondaryLabel: 'Pesan lewat WhatsApp',
    promises: [
      { title: 'Tanpa pengawet', text: 'Tahan lama karena proses, bukan bahan kimia.' },
      { title: 'Dari perajin lokal', text: 'Bekerja dengan 30+ keluarga perajin di Priangan.' },
      { title: 'Kirim ke seluruh Indonesia', text: 'Dikemas aman untuk perjalanan jauh.' },
    ],
    productsTitle: 'Yang paling sering dibawa pulang',
    productsText: 'Pilihan tamu kami dari tahun ke tahun.',
    storiesTitle: 'Cerita di balik rasa',
    aboutTitle: 'Berawal dari dapur Ibu Euis',
    aboutText: 'Tahun 1998, Ibu Euis menjual dodol buatannya di teras rumah. Hari ini resepnya masih sama, dapurnya saja yang lebih besar.',
    aboutImage: aboutImg.id,
    testimonials: [
      { quote: 'Dodolnya selalu jadi rebutan di kantor setiap saya pulang dinas.', name: 'Rina', from: 'Jakarta' },
      { quote: 'Kemasannya rapi, cocok untuk hantaran. Pengiriman ke Medan aman.', name: 'Pak Hasan', from: 'Medan' },
      { quote: 'Bandreknya pas, tidak terlalu manis. Sudah pesan ulang tiga kali.', name: 'Dewi', from: 'Surabaya' },
    ],
  },
})

await payload.updateGlobal({
  slug: 'about',
  data: {
    title: 'Tentang Sari Priangan',
    intro: 'Kami usaha keluarga yang menjaga resep dan kerajinan Priangan tetap hidup, dan memastikan perajinnya dibayar layak.',
    image: aboutImg.id,
    content: rich(
      'Semua produk kami dibuat dalam jumlah kecil. Kami membeli bahan langsung dari petani dan perajin, lalu mengemasnya di Bandung.',
      '## Cara kami bekerja',
      'Setiap produk baru kami uji bersama pelanggan tetap sebelum dijual. Jika rasanya belum pas, kami tunda.',
    ),
    milestones: [
      { year: '1998', text: 'Ibu Euis mulai menjual dodol dari teras rumah di Garut.' },
      { year: '2009', text: 'Toko pertama dibuka di Jalan Cihampelas, Bandung.' },
      { year: '2018', text: 'Mulai bermitra dengan perajin anyaman Rajapolah.' },
      { year: '2024', text: 'Pengiriman ke seluruh Indonesia lewat marketplace.' },
    ],
  },
})

payload.logger.info('Seed complete. Open /admin to edit everything.')
process.exit(0)
