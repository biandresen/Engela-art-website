import { createFileRoute } from '@tanstack/react-router'

import { LocalizedAboutPage } from '#/components/LocalizedAboutPage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

export const Route = createFileRoute('/en/about')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'en',
        page: 'about',
        path: '/en/about',
      }),
    ),
  component: () => <LocalizedAboutPage locale="en" />,
})
