import type { MetadataRoute } from 'next'
import { payloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const payload = await payloadClient()
  const [products, stories] = await Promise.all([
    payload.find({ collection: 'products', limit: 1000, depth: 0, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'stories', limit: 1000, depth: 0, select: { slug: true, updatedAt: true } }),
  ])
  return [
    { url: base },
    { url: `${base}/produk` },
    { url: `${base}/cerita` },
    { url: `${base}/tentang` },
    ...products.docs.map((p) => ({ url: `${base}/produk/${p.slug}`, lastModified: p.updatedAt })),
    ...stories.docs.map((s) => ({ url: `${base}/cerita/${s.slug}`, lastModified: s.updatedAt })),
  ]
}
