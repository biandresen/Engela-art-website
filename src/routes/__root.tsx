import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { BackToTopControl } from '../components/BackToTopControl'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { NotFoundPage } from '../components/NotFoundPage'
import { getLocaleFromPathname } from '../lib/i18n/routes'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Engela Art',
      },
      {
        name: 'theme-color',
        content: '#F7F1E8',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'Engela Art',
      },
      {
        property: 'og:image',
        content: 'https://engelaart.no/assets/brand/og-default.jpg',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'Engela Art palette-and-leaves brand artwork',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: 'any',
      },
      {
        rel: 'icon',
        href: '/assets/brand/icon-32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        rel: 'apple-touch-icon',
        href: '/assets/brand/icon-192.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const locale = getLocaleFromPathname(pathname)

  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <Header />
        <div className="min-h-[calc(100vh-12rem)]">{children}</div>
        <Footer />
        <BackToTopControl locale={locale} />

        <Scripts />
      </body>
    </html>
  )
}
