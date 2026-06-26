import { createFileRoute } from '@tanstack/react-router'

import { LocalizedLegalPage } from '#/components/LocalizedLegalPage'

export const Route = createFileRoute('/en/sales-and-returns')({
  component: () => <LocalizedLegalPage locale="en" page="sales" />,
})
