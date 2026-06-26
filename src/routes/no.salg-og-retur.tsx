import { createFileRoute } from '@tanstack/react-router'

import { LocalizedLegalPage } from '#/components/LocalizedLegalPage'

export const Route = createFileRoute('/no/salg-og-retur')({
  component: () => <LocalizedLegalPage locale="no" page="sales" />,
})
