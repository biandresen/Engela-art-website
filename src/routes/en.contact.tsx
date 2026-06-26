import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { LocalizedContactPage } from '#/components/LocalizedContactPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

const contactSearchSchema = z.object({
  type: z.string().optional(),
  painting: z.string().optional(),
})

export const Route = createFileRoute('/en/contact')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'en',
        page: 'contact',
        path: '/en/contact',
      }),
    ),
  validateSearch: contactSearchSchema,
  component: ContactRoute,
})

function ContactRoute() {
  return <LocalizedContactPage locale="en" search={Route.useSearch()} />
}
