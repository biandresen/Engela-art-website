import { createFileRoute } from '@tanstack/react-router'

import { LocalizedPage } from '#/components/LocalizedPage'

export const Route = createFileRoute('/no/bestillingsverk')({
  component: () => <LocalizedPage locale="no" page="commissions" />,
})
