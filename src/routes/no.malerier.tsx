import { createFileRoute, stripSearchParams } from '@tanstack/react-router'

import { LocalizedGalleryPage } from '#/components/LocalizedGalleryPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'
import { galleryDefaults, validateGallerySearch } from '#/lib/gallery/gallery'

export const Route = createFileRoute('/no/malerier')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'no',
        page: 'paintings',
        path: '/no/malerier',
      }),
    ),
  validateSearch: validateGallerySearch,
  search: {
    middlewares: [stripSearchParams(galleryDefaults)],
  },
  component: NorwegianPaintingsRoute,
})

function NorwegianPaintingsRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <LocalizedGalleryPage
      locale="no"
      search={search}
      onSearchChange={(nextSearch) => {
        void navigate({ search: nextSearch })
      }}
    />
  )
}
