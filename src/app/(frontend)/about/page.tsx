import type { Metadata } from 'next'
import { Img } from '@/components/Img'
import { RichText } from '@/components/RichText'
import { payloadClient } from '@/lib/payload'

export const metadata: Metadata = { title: 'Tentang kami' }

export default async function AboutPage() {
  const payload = await payloadClient()
  const about = await payload.findGlobal({ slug: 'about', depth: 1 })
  return (
    <div className="wrap page">
      <div className="about">
        <div>
          <h1 className="h1">{about.title}</h1>
          {about.intro && <p className="lede pre">{about.intro}</p>}
          <RichText data={about.content} />
        </div>
        <div className="arch arch-soft about-img">
          <Img media={about.image} size="card" sizes="(max-width: 900px) 90vw, 40vw" />
        </div>
      </div>
      {!!about.milestones?.length && (
        <section className="section">
          <h2 className="h2">Perjalanan kami</h2>
          <ol className="timeline">
            {about.milestones.map((m) => (
              <li key={m.id}>
                <span className="year">{m.year}</span>
                <span>{m.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
