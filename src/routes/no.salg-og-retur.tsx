import { createFileRoute } from '@tanstack/react-router'

import { LocalizedLegalPage } from '#/components/LocalizedLegalPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

export const Route = createFileRoute('/no/salg-og-retur')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'no',
        page: 'sales',
        path: '/no/salg-og-retur',
      }),
    ),
  component: () => <LocalizedLegalPage locale="no" page="sales" />,
})
