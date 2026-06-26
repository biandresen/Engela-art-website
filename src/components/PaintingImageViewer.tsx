import { useEffect, useRef } from 'react'

import type { Locale } from '#/lib/i18n/locale'
import type { PaintingImage } from '#/lib/paintings/types'

import { ArtworkImage } from './ArtworkImage'
import { Button } from './ui/button'

type PaintingImageViewerProps = {
  locale: Locale
  images: ReadonlyArray<PaintingImage>
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  onClose: () => void
}

export function PaintingImageViewer({
  locale,
  images,
  activeIndex,
  onActiveIndexChange,
  onClose,
}: PaintingImageViewerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const image = images[activeIndex]
  const labels =
    locale === 'no'
      ? {
          viewer: 'Bildeviser',
          close: 'Lukk bildeviser',
          previous: 'Forrige bilde',
          next: 'Neste bilde',
        }
      : {
          viewer: 'Image viewer',
          close: 'Close image viewer',
          previous: 'Previous image',
          next: 'Next image',
        }

  useEffect(() => {
    closeButtonRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const showPrevious = () => {
    onActiveIndexChange(activeIndex === 0 ? images.length - 1 : activeIndex - 1)
  }
  const showNext = () => {
    onActiveIndexChange((activeIndex + 1) % images.length)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.viewer}
      className="fixed inset-0 z-50 flex flex-col bg-foreground/95 p-4 text-background sm:p-6"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onClose()
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          showPrevious()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          showNext()
        } else if (event.key === 'Tab') {
          trapFocus(event)
        }
      }}
    >
      <div className="flex items-center justify-end">
        <Button
          ref={closeButtonRef}
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          {labels.close}
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <ArtworkImage
          image={image}
          locale={locale}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="max-h-[calc(100vh-11rem)] max-w-full object-contain"
        />
      </div>

      <p className="mx-auto max-w-3xl text-center text-sm leading-6">
        {image.caption?.[locale] ?? image.alt[locale]}
      </p>

      {images.length > 1 ? (
        <div className="mt-4 flex justify-center gap-3">
          <Button type="button" variant="secondary" onClick={showPrevious}>
            {labels.previous}
          </Button>
          <Button type="button" variant="secondary" onClick={showNext}>
            {labels.next}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function trapFocus(event: React.KeyboardEvent<HTMLDivElement>) {
  const focusable = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  )

  if (focusable.length === 0) {
    return
  }

  const first = focusable[0]
  const last = focusable.at(-1)

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
