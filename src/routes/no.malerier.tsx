import { createFileRoute } from '@tanstack/react-router'

import { LocalizedPage } from '#/components/LocalizedPage'

export const Route = createFileRoute('/no/malerier')({
  component: () => <LocalizedPage locale="no" page="paintings" />,
})
