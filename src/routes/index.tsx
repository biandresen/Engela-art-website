import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

import { resolvePreferredLocale } from '#/lib/i18n/locale'

const getRootLocale = createServerFn({ method: 'GET' }).handler(() =>
  resolvePreferredLocale({
    cookieHeader: getRequestHeader('cookie'),
    acceptLanguageHeader: getRequestHeader('accept-language'),
  }),
)

export const Route = createFileRoute('/')({
  loader: async () => {
    const locale = await getRootLocale()

    throw redirect({ href: `/${locale}` })
  },
})
