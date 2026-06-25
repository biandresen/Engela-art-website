import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'

import { LocalizedHomePage } from '#/components/LocalizedHomePage'

export const Route = createFileRoute('/en')({
  component: EnglishRoute,
})

function EnglishRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return pathname === '/en' ? <LocalizedHomePage locale="en" /> : <Outlet />
}
