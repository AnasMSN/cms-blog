import Link from 'next/link'
import type { Product } from '@/payload-types'
import { rupiah } from '@/lib/format'
import { Img } from './Img'

const badgeText: Record<string, string> = {
  bestseller: 'Terlaris',
  new: 'Baru',
  halal: 'Halal',
  limited: 'Edisi terbatas',
}

export function ProductCard({ product }: { product: Product }) {
  const badge = product.badges?.[0]
  return (
    <Link href={`/products/${product.slug}`} className="product">
      <div className="product-media">
        <Img media={product.image} size="card" sizes="(max-width: 700px) 50vw, 25vw" />
        {badge && <span className={`tag tag-${badge}`}>{badgeText[badge]}</span>}
      </div>
      <h3 className="product-name">{product.title}</h3>
      <p className="product-price">
        {rupiah(product.price)}
        {product.unit && <span> {product.unit}</span>}
      </p>
    </Link>
  )
}
