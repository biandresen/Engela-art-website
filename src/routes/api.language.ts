import { createFileRoute } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'

import { createLanguagePreferenceCookie, isLocale } from '#/lib/i18n/locale'
import { isSafeLocalizedRedirect } from '#/lib/i18n/routes'

export const Route = createFileRoute('/api/language')({
  server: {
    handlers: {
      GET: () => {
        const request = getRequest()
        const requestUrl = new URL(request.url)
        const localeValue = requestUrl.searchParams.get('locale') ?? undefined
        const requestedRedirect =
          requestUrl.searchParams.get('redirect') ?? undefined
        const locale = isLocale(localeValue) ? localeValue : 'no'
        const redirectPath =
          requestedRedirect &&
          isSafeLocalizedRedirect(requestedRedirect, locale)
            ? requestedRedirect
            : `/${locale}`

        return new Response(null, {
          status: 302,
          headers: {
            Location: redirectPath,
            'Set-Cookie': createLanguagePreferenceCookie(
              locale,
              requestUrl.protocol === 'https:',
            ),
          },
        })
      },
    },
  },
})
