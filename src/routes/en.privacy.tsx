import { createFileRoute } from '@tanstack/react-router'

import { LocalizedLegalPage } from '#/components/LocalizedLegalPage'

export const Route = createFileRoute('/en/privacy')({
  component: () => <LocalizedLegalPage locale="en" page="privacy" />,
})
