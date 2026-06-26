import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'

import { LocalizedHomePage } from '#/components/LocalizedHomePage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

export const Route = createFileRoute('/en')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'en',
        page: 'home',
        path: '/en',
      }),
    ),
  component: EnglishRoute,
})

function EnglishRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return pathname === '/en' ? <LocalizedHomePage locale="en" /> : <Outlet />
}
