import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/paintings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/paintings"!</div>
}
