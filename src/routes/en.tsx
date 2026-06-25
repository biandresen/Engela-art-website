import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'

import { LocalizedPage } from '#/components/LocalizedPage'

export const Route = createFileRoute('/en')({
  component: EnglishRoute,
})

function EnglishRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return pathname === '/en' ? (
    <LocalizedPage locale="en" page="home" />
  ) : (
    <Outlet />
  )
}
