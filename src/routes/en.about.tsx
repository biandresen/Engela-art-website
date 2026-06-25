import { createFileRoute } from '@tanstack/react-router'

import { LocalizedAboutPage } from '#/components/LocalizedAboutPage'

export const Route = createFileRoute('/en/about')({
  component: () => <LocalizedAboutPage locale="en" />,
})
