import { createFileRoute, notFound } from '@tanstack/react-router'

import { LocalizedPage } from '#/components/LocalizedPage'
import { getPaintingBySlug } from '#/lib/helpers/getPaintingBySlug'

export const Route = createFileRoute('/no/malerier_/$slug')({
  loader: ({ params }) => {
    const painting = getPaintingBySlug(params.slug)

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
    <LocalizedPage locale="no" page="painting" paintingTitle={painting.title} />
  )
}
