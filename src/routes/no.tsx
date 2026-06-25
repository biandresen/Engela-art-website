import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'

import { LocalizedHomePage } from '#/components/LocalizedHomePage'

export const Route = createFileRoute('/no')({
  component: NorwegianRoute,
})

function NorwegianRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return pathname === '/no' ? <LocalizedHomePage locale="no" /> : <Outlet />
}
