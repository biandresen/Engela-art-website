import type { Locale } from '#/lib/i18n/locale'
import type { PaintingImage } from '#/lib/paintings/types'

type ArtworkImageProps = {
  image: PaintingImage
  locale: Locale
  sizes: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  className?: string
  alt?: string
}

export function ArtworkImage({
  image,
  locale,
  sizes,
  loading = 'lazy',
  fetchPriority = 'auto',
  className,
  alt,
}: ArtworkImageProps) {
  const largestVariant = image.variants.at(-1)

  if (!largestVariant) {
    throw new Error('Artwork image requires at least one responsive variant')
  }

  const avifSrcSet = image.variants
    .map((variant) => `${variant.avif} ${variant.width}w`)
    .join(', ')
  const webpSrcSet = image.variants
    .map((variant) => `${variant.webp} ${variant.width}w`)
    .join(', ')

  return (
    <picture className="block">
      <source srcSet={avifSrcSet} sizes={sizes} type="image/avif" />
      <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
      <img
        src={largestVariant.fallback}
        width={image.width}
        height={image.height}
        sizes={sizes}
        alt={alt ?? image.alt[locale]}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
