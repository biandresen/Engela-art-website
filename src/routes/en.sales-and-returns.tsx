import { createFileRoute } from '@tanstack/react-router'

import { LocalizedLegalPage } from '#/components/LocalizedLegalPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

export const Route = createFileRoute('/en/sales-and-returns')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'en',
        page: 'sales',
        path: '/en/sales-and-returns',
      }),
    ),
  component: () => <LocalizedLegalPage locale="en" page="sales" />,
})
