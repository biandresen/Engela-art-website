import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from '@tanstack/react-router'

import { LocalizedPaintingDetailPage } from '#/components/LocalizedPaintingDetailPage'
import { galleryDefaults, validateGallerySearch } from '#/lib/gallery/gallery'
import { paintingCatalog } from '#/local-db/paintings'

export const Route = createFileRoute('/no/malerier_/$slug')({
  validateSearch: validateGallerySearch,
  search: {
    middlewares: [stripSearchParams(galleryDefaults)],
  },
  loader: ({ params }) => {
    const painting = paintingCatalog.getBySlug(params.slug)

    if (!painting) {
      throw notFound()
    }

    return painting
  },
  component: PaintingPage,
})

function PaintingPage() {
  const painting = Route.useLoaderData()

  return (
    <LocalizedPaintingDetailPage
      locale="no"
      painting={painting}
      gallerySearch={Route.useSearch()}
    />
  )
}
