import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { LocalizedContactPage } from '#/components/LocalizedContactPage'

const contactSearchSchema = z.object({
  type: z.string().optional(),
  painting: z.string().optional(),
})

export const Route = createFileRoute('/en/contact')({
  validateSearch: contactSearchSchema,
  component: ContactRoute,
})

function ContactRoute() {
  return <LocalizedContactPage locale="en" search={Route.useSearch()} />
}
