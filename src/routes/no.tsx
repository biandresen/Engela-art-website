import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'

import { LocalizedHomePage } from '#/components/LocalizedHomePage'
import { buildPageSeo, buildSeoHead } from '#/lib/discovery/seo'

export const Route = createFileRoute('/no')({
  head: () =>
    buildSeoHead(
      buildPageSeo({
        locale: 'no',
        page: 'home',
        path: '/no',
      }),
    ),
  component: NorwegianRoute,
})

function NorwegianRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return pathname === '/no' ? <LocalizedHomePage locale="no" /> : <Outlet />
}
