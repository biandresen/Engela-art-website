import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from '@tanstack/react-router'

import { LocalizedPaintingDetailPage } from '#/components/LocalizedPaintingDetailPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'
import { galleryDefaults, validateGallerySearch } from '#/lib/gallery/gallery'
import type { Painting } from '#/lib/paintings/types'
import { paintingCatalog } from '#/local-db/paintings'

export const Route = createFileRoute('/no/malerier_/$slug')({
  head: ({ params }) =>
    buildSeoHead(
      buildPageSeo({
        locale: 'no',
        page: 'painting',
        path: `/no/malerier/${params.slug}`,
        paintingSlug: params.slug,
      }),
    ),
  validateSearch: validateGallerySearch,
  search: {
    middlewares: [stripSearchParams(galleryDefaults)],
  },
  loader: ({ params }): Painting => {
    const painting = paintingCatalog.getBySlug(params.slug)

    if (!painting) {
      throw notFound()
    }

    return painting
  },
  component: PaintingPage,
})

function PaintingPage() {
  const painting = Route.useLoaderData()!

  return (
    <LocalizedPaintingDetailPage
      locale="no"
      painting={painting}
      gallerySearch={Route.useSearch()}
    />
  )
}
