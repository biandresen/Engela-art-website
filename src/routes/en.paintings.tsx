import { createFileRoute, stripSearchParams } from '@tanstack/react-router'

import { LocalizedGalleryPage } from '#/components/LocalizedGalleryPage'
import { galleryDefaults, validateGallerySearch } from '#/lib/gallery/gallery'

export const Route = createFileRoute('/en/paintings')({
  validateSearch: validateGallerySearch,
  search: {
    middlewares: [stripSearchParams(galleryDefaults)],
  },
  component: EnglishPaintingsRoute,
})

function EnglishPaintingsRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <LocalizedGalleryPage
      locale="en"
      search={search}
      onSearchChange={(nextSearch) => {
        void navigate({ search: nextSearch })
      }}
    />
  )
}
