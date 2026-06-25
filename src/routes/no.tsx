import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'

import { LocalizedPage } from '#/components/LocalizedPage'

export const Route = createFileRoute('/no')({
  component: NorwegianRoute,
})

function NorwegianRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return pathname === '/no' ? (
    <LocalizedPage locale="no" page="home" />
  ) : (
    <Outlet />
  )
}
