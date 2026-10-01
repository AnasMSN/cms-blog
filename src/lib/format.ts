import type { Media } from '@/payload-types'

export const rupiah = (n?: number | null) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
    : ''

export const tanggal = (d?: string | null) =>
  d ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(d)) : ''

/** Upload fields come back as either an id or a populated doc. */
export const asMedia = (m: unknown): Media | null =>
  m && typeof m === 'object' && 'url' in (m as object) ? (m as Media) : null

export const imgUrl = (m: unknown, size?: 'thumb' | 'card' | 'wide') => {
  const media = asMedia(m)
  if (!media) return null
  const sized = size ? media.sizes?.[size]?.url : null
  return sized || media.url || null
}

export const waLink = (number?: string | null, template?: string | null, product?: string) => {
  if (!number) return null
  const text = (template || 'Halo, saya ingin bertanya tentang {produk}.').replace(
    /\{produk\}/g,
    product || 'produk Anda',
  )
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export const safeHex = (v: string | null | undefined, fallback: string) =>
  v && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : fallback
