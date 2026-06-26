import { createFileRoute } from '@tanstack/react-router'

import { LocalizedCommissionsPage } from '#/components/LocalizedCommissionsPage'

export const Route = createFileRoute('/en/commissions')({
  component: () => <LocalizedCommissionsPage locale="en" />,
})
