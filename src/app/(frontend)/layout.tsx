import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { imgUrl, safeHex, waLink } from '@/lib/format'
import { getSettings } from '@/lib/payload'
import { Img } from '@/components/Img'
import './styles.css'

// Content comes from the admin panel, so render on request: edits show up immediately
// and the Docker build never needs a database.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const title = s.seoTitle || s.brandName
  const og = imgUrl(s.ogImage, 'wide')
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: title, template: `%s | ${s.brandName}` },
    description: s.seoDescription || s.tagline || undefined,
    openGraph: { siteName: s.brandName, images: og ? [og] : undefined, locale: 'id_ID', type: 'website' },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings()
  const theme = `:root{
    --primary:${safeHex(s.colorPrimary, '#2F6B45')};
    --accent:${safeHex(s.colorAccent, '#D99A1E')};
    --ink:${safeHex(s.colorInk, '#1C2340')};
    --paper:${safeHex(s.colorPaper, '#F4F5F0')};
    --deep:${safeHex(s.colorDeep, '#5A3319')};
  }`
  const wa = waLink(s.whatsapp, s.whatsappMessage)
  const year = new Date().getFullYear()

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;700&family=Rozha+One&display=swap"
        />
        <style dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body>
        <a className="skip" href="#content">
          Langsung ke isi
        </a>
        <header className="site-header">
          <div className="wrap header-inner">
            <Link href="/" className="brand" aria-label={`${s.brandName}, beranda`}>
              {s.logo ? <Img media={s.logo} size="thumb" className="brand-logo" /> : null}
              <span>{s.brandName}</span>
            </Link>
            <nav aria-label="Menu utama" className="nav">
              <Link href="/products">Produk</Link>
              <Link href="/stories">Cerita</Link>
              <Link href="/about">Tentang</Link>
              {wa && (
                <a className="btn btn-small" href={wa} target="_blank" rel="noopener">
                  Pesan
                </a>
              )}
            </nav>
          </div>
        </header>

        <main id="content">{children}</main>

        <footer className="site-footer" id="contact">
          <div className="wrap footer-grid">
            <div>
              <p className="footer-brand">{s.brandName}</p>
              {s.footerNote && <p className="muted">{s.footerNote}</p>}
            </div>
            <div>
              <h2 className="footer-h">Kunjungi toko</h2>
              {s.address && <p className="pre">{s.address}</p>}
              {s.hours && <p>{s.hours}</p>}
              {s.mapsUrl && (
                <a href={s.mapsUrl} target="_blank" rel="noopener">
                  Buka di Google Maps
                </a>
              )}
            </div>
            <div>
              <h2 className="footer-h">Hubungi kami</h2>
              <ul className="plain">
                {wa && (
                  <li>
                    <a href={wa} target="_blank" rel="noopener">
                      WhatsApp
                    </a>
                  </li>
                )}
                {s.phone && <li>{s.phone}</li>}
                {s.email && (
                  <li>
                    <a href={`mailto:${s.email}`}>{s.email}</a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="footer-h">Belanja online</h2>
              <ul className="plain">
                {s.shops?.map((x) => (
                  <li key={x.id}>
                    <a href={x.url} target="_blank" rel="noopener">
                      {x.label}
                    </a>
                  </li>
                ))}
                {s.socials?.map((x) => (
                  <li key={x.id}>
                    <a href={x.url} target="_blank" rel="noopener">
                      {x.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="wrap footer-base">
            <span>
              © {year} {s.brandName}
            </span>
          </div>
        </footer>

        {wa && (
          <a className="wa-float" href={wa} target="_blank" rel="noopener" aria-label="Chat WhatsApp">
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"
              />
            </svg>
          </a>
        )}
      </body>
    </html>
  )
}
