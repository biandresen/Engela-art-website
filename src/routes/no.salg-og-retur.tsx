import { createFileRoute } from '@tanstack/react-router'

import { LocalizedPage } from '#/components/LocalizedPage'

export const Route = createFileRoute('/no/salg-og-retur')({
  component: () => <LocalizedPage locale="no" page="sales" />,
})
