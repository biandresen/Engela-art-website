import { createFileRoute } from '@tanstack/react-router'

import { LocalizedLegalPage } from '#/components/LocalizedLegalPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

export const Route = createFileRoute('/no/personvern')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'no',
        page: 'privacy',
        path: '/no/personvern',
      }),
    ),
  component: () => <LocalizedLegalPage locale="no" page="privacy" />,
})
