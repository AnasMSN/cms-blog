import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Product } from '@/payload-types'
import { Img } from '@/components/Img'
import { ProductCard } from '@/components/ProductCard'
import { RichText } from '@/components/RichText'
import { imgUrl, tanggal } from '@/lib/format'
import { payloadClient } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

async function getStory(slug: string) {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'stories', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  return res.docs[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getStory((await params).slug)
  if (!s) return {}
  const og = imgUrl(s.cover, 'wide')
  return { title: s.title, description: s.excerpt || undefined, openGraph: { images: og ? [og] : undefined } }
}

export default async function StoryPage({ params }: Props) {
  const story = await getStory((await params).slug)
  if (!story) notFound()
  const related = (story.relatedProducts || []).filter((p): p is Product => typeof p === 'object')

  return (
    <article className="page">
      <header className="wrap article-head">
        <p className="crumbs">
          <Link href="/cerita">Cerita</Link>
        </p>
        <h1 className="h1 measure">{story.title}</h1>
        <time className="muted">{tanggal(story.publishedAt)}</time>
      </header>
      <div className="wrap">
        <div className="arch arch-wide">
          <Img media={story.cover} size="wide" priority sizes="100vw" />
        </div>
      </div>
      <div className="wrap article-body">
        {story.excerpt && <p className="lede">{story.excerpt}</p>}
        <RichText data={story.content} />
      </div>
      {related.length > 0 && (
        <section className="wrap section">
          <h2 className="h2">Cicipi sendiri</h2>
          <div className="grid-products">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
