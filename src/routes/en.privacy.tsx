import { createFileRoute } from '@tanstack/react-router'

import { LocalizedLegalPage } from '#/components/LocalizedLegalPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

export const Route = createFileRoute('/en/privacy')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'en',
        page: 'privacy',
        path: '/en/privacy',
      }),
    ),
  component: () => <LocalizedLegalPage locale="en" page="privacy" />,
})
