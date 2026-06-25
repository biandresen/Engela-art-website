import { createFileRoute } from '@tanstack/react-router'

import { LocalizedPage } from '#/components/LocalizedPage'

export const Route = createFileRoute('/en/sales-and-returns')({
  component: () => <LocalizedPage locale="en" page="sales" />,
})
