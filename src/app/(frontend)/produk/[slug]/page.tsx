import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Img } from '@/components/Img'
import { ProductCard } from '@/components/ProductCard'
import { RichText } from '@/components/RichText'
import { imgUrl, rupiah, waLink } from '@/lib/format'
import { getSettings, payloadClient } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

async function getProduct(slug: string) {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  return res.docs[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug)
  if (!p) return {}
  const og = imgUrl(p.image, 'wide')
  return { title: p.title, description: p.summary || undefined, openGraph: { images: og ? [og] : undefined } }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug)
  if (!product) notFound()
  const settings = await getSettings()
  const payload = await payloadClient()
  const categoryId = typeof product.category === 'object' ? product.category?.id : product.category
  const related = categoryId
    ? await payload.find({
        collection: 'products',
        where: { and: [{ category: { equals: categoryId } }, { id: { not_equals: product.id } }] },
        limit: 4,
        depth: 1,
      })
    : null
  const wa = waLink(settings.whatsapp, settings.whatsappMessage, product.title)
  const shops = product.shopLinks?.length ? product.shopLinks : settings.shops || []
  const gallery = (product.gallery || []).filter((g) => typeof g === 'object')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.summary,
    image: imgUrl(product.image, 'wide'),
    brand: settings.brandName,
    offers: product.price
      ? { '@type': 'Offer', priceCurrency: 'IDR', price: product.price, availability: 'https://schema.org/InStock' }
      : undefined,
  }

  return (
    <div className="wrap page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="crumbs">
        <Link href="/produk">Produk</Link>
        {typeof product.category === 'object' && product.category && (
          <>
            <span aria-hidden> / </span>
            <Link href={`/produk?kategori=${product.category.slug}`}>{product.category.title}</Link>
          </>
        )}
      </p>
      <div className="pdp">
        <div className="pdp-media">
          <div className="arch arch-soft">
            <Img media={product.image} size="wide" priority sizes="(max-width: 900px) 90vw, 50vw" />
          </div>
          {gallery.length > 0 && (
            <div className="gallery">
              {gallery.map((g, i) => (
                <Img key={i} media={g} size="thumb" />
              ))}
            </div>
          )}
        </div>
        <div className="pdp-info">
          <h1 className="h1">{product.title}</h1>
          <p className="pdp-price">
            {rupiah(product.price)}
            {product.unit && <span> {product.unit}</span>}
          </p>
          {product.summary && <p className="lede">{product.summary}</p>}
          <div className="actions">
            {wa && (
              <a className="btn" href={wa} target="_blank" rel="noopener">
                Pesan lewat WhatsApp
              </a>
            )}
            {shops.map((s) => (
              <a key={s.id} className="btn btn-ghost" href={s.url} target="_blank" rel="noopener">
                Beli di {s.label}
              </a>
            ))}
          </div>
          {!!product.specs?.length && (
            <dl className="specs">
              {product.specs.map((s) => (
                <div key={s.id}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <RichText data={product.description} />
        </div>
      </div>

      {related && related.docs.length > 0 && (
        <section className="section">
          <h2 className="h2">Sering dibeli bersama</h2>
          <div className="grid-products">
            {related.docs.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
