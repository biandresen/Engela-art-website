import { createFileRoute } from '@tanstack/react-router'

import { LocalizedCommissionsPage } from '#/components/LocalizedCommissionsPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

export const Route = createFileRoute('/no/bestillingsverk')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'no',
        page: 'commissions',
        path: '/no/bestillingsverk',
      }),
    ),
  component: () => <LocalizedCommissionsPage locale="no" />,
})
