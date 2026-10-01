import type { Metadata } from 'next'
import Link from 'next/link'
import { Img } from '@/components/Img'
import { tanggal } from '@/lib/format'
import { payloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Cerita & budaya' }

export default async function StoriesPage() {
  const payload = await payloadClient()
  const stories = await payload.find({ collection: 'stories', limit: 50, depth: 1 })
  return (
    <div className="wrap page">
      <h1 className="h1">Cerita & budaya</h1>
      <p className="lede measure">Asal-usul setiap rasa, dari dapur sampai ke tangan Anda.</p>
      {stories.docs.length ? (
        <div className="story-grid">
          {stories.docs.map((s) => (
            <Link key={s.id} href={`/stories/${s.slug}`} className="story-card">
              <div className="arch arch-soft">
                <Img media={s.cover} size="card" sizes="(max-width: 700px) 90vw, 33vw" />
              </div>
              <time className="muted small">{tanggal(s.publishedAt)}</time>
              <h2 className="h3">{s.title}</h2>
              {s.excerpt && <p className="muted">{s.excerpt}</p>}
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty">Cerita pertama sedang ditulis. Sementara itu, lihat produk kami.</p>
      )}
    </div>
  )
}
