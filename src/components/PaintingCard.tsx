import type { Locale } from '#/lib/i18n/locale'
import type { PaintingPresentation } from '#/lib/paintings/presentation'
import { getPaintingStatusClassName } from '#/lib/paintings/presentation'
import { cn } from '#/lib/utils'

import { ArtworkImage } from './ArtworkImage'
import { Badge } from './ui/badge'

type PaintingCardProps = {
  presentation: PaintingPresentation
  locale: Locale
  href: string
  headingLevel: 2 | 3
  imageSizes: string
  metadataNotice: string
  showFullMetadata?: boolean
}

export function PaintingCard({
  presentation,
  locale,
  href,
  headingLevel,
  imageSizes,
  metadataNotice,
  showFullMetadata = false,
}: PaintingCardProps) {
  const { painting, mainImage, roomContextImage } = presentation
  const Heading = `h${headingLevel}` as const
  const hasRoomPreview = roomContextImage !== undefined
  const roomCaption = roomContextImage?.caption?.[locale]

  return (
    <article className="h-full overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-muted-foreground/70 focus-within:border-muted-foreground/70">
      <a
        href={href}
        className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <div className="relative flex aspect-[4/5] items-center justify-center bg-muted p-4">
          <ArtworkImage
            image={mainImage}
            locale={locale}
            sizes={imageSizes}
            className={cn(
              'max-h-full w-full object-contain transition-opacity duration-300 motion-reduce:transition-none',
              hasRoomPreview &&
                '[@media(hover:hover)]:group-hover:opacity-0 group-focus-visible:opacity-0',
            )}
          />
          {hasRoomPreview ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 opacity-0 transition-opacity duration-300 motion-reduce:transition-none [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:opacity-100">
              <ArtworkImage
                image={roomContextImage}
                locale={locale}
                sizes={imageSizes}
                className="max-h-full w-full object-contain"
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-4">
            <Heading className="text-lg font-semibold">
              {painting.title}
            </Heading>
            <Badge
              variant="outline"
              className={getPaintingStatusClassName(painting.status)}
            >
              {presentation.statusLabel}
            </Badge>
          </div>

          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            {showFullMetadata ? <p>{painting.medium[locale]}</p> : null}
            {showFullMetadata ? <p>{painting.technique[locale]}</p> : null}
            {showFullMetadata ? (
              <p>
                {painting.year} · {painting.widthCm} × {painting.heightCm} ×{' '}
                {painting.depthCm} cm
              </p>
            ) : null}
            <p className="font-semibold text-foreground">
              {presentation.priceLabel}
            </p>
          </div>

          {roomCaption ? <p className="sr-only">{roomCaption}</p> : null}

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {metadataNotice}
          </p>
        </div>
      </a>
    </article>
  )
}
