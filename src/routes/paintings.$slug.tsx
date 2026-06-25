import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/paintings/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/paintings/$slug"!</div>
}
