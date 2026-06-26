import { createFileRoute } from '@tanstack/react-router'

import { buildSitemapXml } from '#/lib/discovery/seo'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () =>
        new Response(buildSitemapXml(), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
          },
        }),
    },
  },
})
