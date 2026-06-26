import { createFileRoute } from '@tanstack/react-router'

import { LocalizedAboutPage } from '#/components/LocalizedAboutPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

export const Route = createFileRoute('/no/om')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'no',
        page: 'about',
        path: '/no/om',
      }),
    ),
  component: () => <LocalizedAboutPage locale="no" />,
})
