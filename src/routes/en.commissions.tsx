import { createFileRoute } from '@tanstack/react-router'

import { LocalizedCommissionsPage } from '#/components/LocalizedCommissionsPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

export const Route = createFileRoute('/en/commissions')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'en',
        page: 'commissions',
        path: '/en/commissions',
      }),
    ),
  component: () => <LocalizedCommissionsPage locale="en" />,
})
