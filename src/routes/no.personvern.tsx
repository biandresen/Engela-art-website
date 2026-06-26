import { createFileRoute } from '@tanstack/react-router'

import { LocalizedLegalPage } from '#/components/LocalizedLegalPage'

export const Route = createFileRoute('/no/personvern')({
  component: () => <LocalizedLegalPage locale="no" page="privacy" />,
})
