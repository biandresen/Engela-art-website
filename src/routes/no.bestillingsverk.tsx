import { createFileRoute } from '@tanstack/react-router'

import { LocalizedCommissionsPage } from '#/components/LocalizedCommissionsPage'

export const Route = createFileRoute('/no/bestillingsverk')({
  component: () => <LocalizedCommissionsPage locale="no" />,
})
