import { createFileRoute, notFound } from '@tanstack/react-router'

import { LocalizedPage } from '#/components/LocalizedPage'
import { paintingCatalog } from '#/local-db/paintings'

export const Route = createFileRoute('/en/paintings_/$slug')({
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
    <LocalizedPage locale="en" page="painting" paintingTitle={painting.title} />
  )
}
