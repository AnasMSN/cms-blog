import Link from 'next/link'
import { Img } from '@/components/Img'
import { ProductCard } from '@/components/ProductCard'
import { waLink } from '@/lib/format'
import { getSettings, payloadClient } from '@/lib/payload'

export default async function HomePage() {
  const payload = await payloadClient()
  const [home, settings, featured, stories] = await Promise.all([
    payload.findGlobal({ slug: 'home', depth: 1 }),
    getSettings(),
    payload.find({ collection: 'products', where: { featured: { equals: true } }, limit: 8, depth: 1 }),
    payload.find({ collection: 'stories', limit: 3, depth: 1 }),
  ])
  const wa = waLink(settings.whatsapp, settings.whatsappMessage)
  const titleLines = (home.heroTitle || '').split('\n').filter(Boolean)
  const [lead, ...rest] = stories.docs

  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <h1 className="hero-title">
            {titleLines.map((line, i) => (
              <span key={i} style={{ animationDelay: `${i * 90}ms` }}>
                {line}
              </span>
            ))}
          </h1>
          {home.heroText && <p className="lede">{home.heroText}</p>}
          <div className="actions">
            <Link className="btn" href="/produk">
              {home.heroPrimaryLabel || 'Lihat produk'}
            </Link>
            {wa && (
              <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener">
                {home.heroSecondaryLabel || 'Pesan lewat WhatsApp'}
              </a>
            )}
          </div>
        </div>
        <div className="hero-art">
          <div className="arch">
            <Img media={home.heroImage} size="wide" priority sizes="(max-width: 900px) 90vw, 45vw" />
          </div>
        </div>
      </section>

      {!!home.promises?.length && (
        <section className="promises wrap" aria-label="Keunggulan kami">
          {home.promises.map((p) => (
            <div key={p.id} className="promise">
              <h2>{p.title}</h2>
              {p.text && <p>{p.text}</p>}
            </div>
          ))}
        </section>
      )}

      {featured.docs.length > 0 && (
        <section className="section wrap">
          <div className="section-head">
            <div>
              <h2 className="h2">{home.productsTitle}</h2>
              {home.productsText && <p className="muted measure">{home.productsText}</p>}
            </div>
            <Link href="/produk" className="text-link">
              Semua produk
            </Link>
          </div>
          <div className="grid-products">
            {featured.docs.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {lead && (
        <section className="section wrap">
          <div className="section-head">
            <h2 className="h2">{home.storiesTitle}</h2>
            <Link href="/cerita" className="text-link">
              Semua cerita
            </Link>
          </div>
          <div className="stories">
            <Link href={`/cerita/${lead.slug}`} className="story-lead">
              <div className="arch arch-soft">
                <Img media={lead.cover} size="wide" sizes="(max-width: 900px) 90vw, 55vw" />
              </div>
              <h3 className="h3">{lead.title}</h3>
              {lead.excerpt && <p className="muted">{lead.excerpt}</p>}
            </Link>
            <div className="story-list">
              {rest.map((s) => (
                <Link key={s.id} href={`/cerita/${s.slug}`} className="story-row">
                  <Img media={s.cover} size="thumb" />
                  <div>
                    <h3>{s.title}</h3>
                    {s.excerpt && <p className="muted">{s.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {home.aboutTitle && (
        <section className="deep">
          <div className="wrap deep-inner">
            <div className="arch arch-small">
              <Img media={home.aboutImage} size="card" sizes="(max-width: 900px) 70vw, 30vw" />
            </div>
            <div>
              <h2 className="h2">{home.aboutTitle}</h2>
              {home.aboutText && <p className="lede pre">{home.aboutText}</p>}
              <Link href="/tentang" className="text-link on-deep">
                Kenali kami lebih dekat
              </Link>
            </div>
          </div>
        </section>
      )}

      {!!home.testimonials?.length && (
        <section className="section wrap" aria-label="Kata pelanggan">
          <div className="quotes">
            {home.testimonials.map((t) => (
              <figure key={t.id} className="quote">
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  {t.from && <span>{t.from}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
