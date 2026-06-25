import { createFileRoute } from '@tanstack/react-router'

import { LocalizedPage } from '#/components/LocalizedPage'

export const Route = createFileRoute('/en/paintings')({
  component: () => <LocalizedPage locale="en" page="paintings" />,
})
