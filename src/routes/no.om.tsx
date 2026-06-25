import { createFileRoute } from '@tanstack/react-router'

import { LocalizedAboutPage } from '#/components/LocalizedAboutPage'

export const Route = createFileRoute('/no/om')({
  component: () => <LocalizedAboutPage locale="no" />,
})
