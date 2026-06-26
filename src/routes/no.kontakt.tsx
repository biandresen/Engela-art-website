import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { LocalizedContactPage } from '#/components/LocalizedContactPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

const contactSearchSchema = z.object({
  type: z.string().optional(),
  painting: z.string().optional(),
})

export const Route = createFileRoute('/no/kontakt')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'no',
        page: 'contact',
        path: '/no/kontakt',
      }),
    ),
  validateSearch: contactSearchSchema,
  component: ContactRoute,
})

function ContactRoute() {
  return <LocalizedContactPage locale="no" search={Route.useSearch()} />
}
