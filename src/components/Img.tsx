import { asMedia, imgUrl } from '@/lib/format'

type Props = {
  media: unknown
  size?: 'thumb' | 'card' | 'wide'
  className?: string
  priority?: boolean
  sizes?: string
}

/** Plain <img> with focal point support — works the same on every host, no image optimizer needed. */
export function Img({ media, size = 'card', className, priority, sizes }: Props) {
  const m = asMedia(media)
  const src = imgUrl(media, size)
  if (!m || !src) return <div className={`img-empty ${className ?? ''}`} aria-hidden />
  const srcSet = (['thumb', 'card', 'wide'] as const)
    .map((k) => (m.sizes?.[k]?.url && m.sizes[k]?.width ? `${m.sizes[k]!.url} ${m.sizes[k]!.width}w` : null))
    .filter(Boolean)
    .join(', ')
  const pos = `${m.focalX ?? 50}% ${m.focalY ?? 50}%`
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={m.alt ?? ''}
      className={className}
      style={{ objectPosition: pos }}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      width={m.width ?? undefined}
      height={m.height ?? undefined}
    />
  )
}
