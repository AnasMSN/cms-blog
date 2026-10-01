import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'
import { ProductCard } from '@/components/ProductCard'
import { payloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Produk' }

type Props = { searchParams: Promise<{ kategori?: string }> }

export default async function ProductsPage({ searchParams }: Props) {
  const { kategori } = await searchParams
  const payload = await payloadClient()
  const categories = await payload.find({ collection: 'categories', limit: 50, pagination: false })
  const active = categories.docs.find((c) => c.slug === kategori)
  const where: Where | undefined = active ? { category: { equals: active.id } } : undefined
  const products = await payload.find({ collection: 'products', where, limit: 100, depth: 1 })

  return (
    <div className="wrap page">
      <h1 className="h1">Produk</h1>
      <nav className="chips" aria-label="Filter kategori">
        <Link href="/produk" aria-current={!active ? 'page' : undefined}>
          Semua
        </Link>
        {categories.docs.map((c) => (
          <Link key={c.id} href={`/produk?kategori=${c.slug}`} aria-current={active?.id === c.id ? 'page' : undefined}>
            {c.title}
          </Link>
        ))}
      </nav>
      {products.docs.length ? (
        <div className="grid-products">
          {products.docs.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="empty">Belum ada produk di kategori ini. Coba kategori lain atau lihat semua produk.</p>
      )}
    </div>
  )
}
