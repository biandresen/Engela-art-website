import { createFileRoute } from '@tanstack/react-router'

import { LocalizedPage } from '#/components/LocalizedPage'

export const Route = createFileRoute('/en/contact')({
  component: () => <LocalizedPage locale="en" page="contact" />,
})
