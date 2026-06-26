// @vitest-environment jsdom

import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { routeTree } from '#/routeTree.gen'
import { paintingCatalog } from '#/local-db/paintings'

vi.mock('@tanstack/react-devtools', () => ({
  TanStackDevtools: () => null,
}))

vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => null,
}))

afterEach(cleanup)

describe('painting detail routes', () => {
  it('renders complete English identity, metadata, and catalog images', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/paintings/temporary-painting-01'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(
      within(main).getByRole('heading', {
        level: 1,
        name: 'Temporary painting 01',
      }),
    ).toBeTruthy()
    expect(main.textContent).toContain('EA-2026-001')
    expect(main.textContent).toContain(
      'Temporary medium text. Materials require artist approval.',
    )
    expect(main.textContent).toContain('40 × 60 × 2 cm')
    expect(main.textContent).toContain('2026')
    expect(main.textContent).toContain('Available')
    expect(main.textContent).toContain('Price: NOK 1,000')
    expect(main.textContent).toContain(
      'Temporary catalog copy for painting 01.',
    )

    const imageGallery = within(main).getByRole('region', {
      name: 'Painting images',
    })
    expect(within(imageGallery).getAllByRole('button')).toHaveLength(2)
    expect(imageGallery.textContent).toContain(
      'Temporary visualization using placeholder dimensions.',
    )
    const mainImage = within(imageGallery).getByRole('img', {
      name: /Temporary main image for painting 01/,
    })
    expect(mainImage.getAttribute('width')).toBe('960')
    expect(mainImage.getAttribute('height')).toBe('1280')
    expect(mainImage.getAttribute('sizes')).toBe(
      '(min-width: 1024px) 60vw, 100vw',
    )
    expect(
      imageGallery.querySelector<HTMLSourceElement>('source[type="image/avif"]')
        ?.srcset,
    ).toContain('/assets/paintings/temporary-painting-01/main-480.avif 480w')
    expect(imageGallery.innerHTML).not.toMatch(
      /blue-crow\.png|broken-woods\.png|purple-cotton\.png|rough-sea\.png|space\.png|winter-landscape\.png/,
    )
  })

  it('renders localized Norwegian metadata, pricing, and actions', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/no/malerier/temporary-painting-02'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(main.textContent).toContain('Midlertidig mediumtekst.')
    expect(main.textContent).toContain('Reservert')
    expect(main.textContent).toContain('Oppgitt pris: 2 000 kr')
    expect(main.textContent).toContain('Selges uten ramme.')
    expect(
      within(main).getAllByRole('link', {
        name: 'Bli med på interesselisten',
      }),
    ).toHaveLength(2)
  })

  it('resolves every catalog painting to the same identity in both languages', async () => {
    for (const painting of paintingCatalog.all()) {
      for (const locale of ['no', 'en'] as const) {
        cleanup()

        const gallerySegment = locale === 'no' ? 'malerier' : 'paintings'
        const router = createRouter({
          routeTree,
          history: createMemoryHistory({
            initialEntries: [`/${locale}/${gallerySegment}/${painting.slug}`],
          }),
        })

        await router.load()
        render(<RouterProvider router={router} />)

        const main = await screen.findByRole('main')

        expect(
          within(main).getByRole('heading', {
            level: 1,
            name: painting.title,
          }),
        ).toBeTruthy()
        expect(main.textContent).toContain(painting.paintingId)
      }
    }
  })

  it('renders truthful status-aware actions and purchase guidance', async () => {
    const cases = [
      {
        slug: 'temporary-painting-01',
        action: 'Inquire about this painting',
        href: '/en/contact?type=painting&painting=temporary-painting-01',
        notice: 'Sending an inquiry does not reserve the painting.',
      },
      {
        slug: 'temporary-painting-02',
        action: 'Join the interest list',
        href: '/en/contact?type=interest-list&painting=temporary-painting-02',
        notice:
          'Joining the interest list does not reserve or guarantee the painting.',
      },
      {
        slug: 'temporary-painting-03',
        action: 'Ask about similar work',
        href: '/en/contact?type=similar-work&painting=temporary-painting-03',
        notice:
          'A similar-work inquiry does not promise an exact copy or create a commission.',
      },
    ] as const

    for (const item of cases) {
      cleanup()

      const router = createRouter({
        routeTree,
        history: createMemoryHistory({
          initialEntries: [`/en/paintings/${item.slug}`],
        }),
      })

      await router.load()
      render(<RouterProvider router={router} />)

      const main = await screen.findByRole('main')
      const actions = within(main).getAllByRole('link', {
        name: item.action,
      })

      expect(actions).toHaveLength(2)
      expect(actions[0]?.getAttribute('href')).toBe(item.href)
      expect(main.textContent).toContain('Sold unframed.')
      expect(main.textContent).toContain('Listed price excludes shipping.')
      expect(main.textContent).toContain(
        'Availability is confirmed by the artist before a reservation is created.',
      )
      expect(main.textContent).toContain(item.notice)
      expect(actions[1]?.parentElement?.className).toContain(
        'safe-area-inset-bottom',
      )
      expect(actions[1]?.parentElement?.className).toContain('md:hidden')
    }
  })

  it('composes care guidance from selected profiles and the exceptional note', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/paintings/temporary-painting-01'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const care = within(await screen.findByRole('main')).getByRole('region', {
      name: 'Care guidance',
    })

    expect(care.textContent).toContain(
      'Keep the painting away from persistent direct sunlight',
    )
    expect(care.textContent).toContain(
      'Dust acrylic surfaces gently with a clean, dry, soft brush',
    )
    expect(care.textContent).toContain(
      'Temporary care profile. Final guidance awaits material confirmation.',
    )
  })

  it('provides direct gallery navigation and restores supported gallery state', async () => {
    const directRouter = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/paintings/temporary-painting-01'],
      }),
    })

    await directRouter.load()
    render(<RouterProvider router={directRouter} />)

    expect(
      (
        await screen.findByRole('link', {
          name: 'View all paintings',
        })
      ).getAttribute('href'),
    ).toBe('/en/paintings')

    cleanup()

    const galleryRouter = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: [
          '/en/paintings/temporary-painting-04?status=available&orientation=landscape&sort=price-desc',
        ],
      }),
    })

    await galleryRouter.load()
    render(<RouterProvider router={galleryRouter} />)

    expect(
      (
        await screen.findByRole('link', {
          name: 'Back to paintings',
        })
      ).getAttribute('href'),
    ).toBe(
      '/en/paintings?status=available&orientation=landscape&sort=price-desc',
    )
  })

  it('supports accessible fullscreen image inspection without private sources', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/paintings/temporary-painting-01'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const openButton = await screen.findByRole('button', {
      name: 'Painting images: 1',
    })

    fireEvent.click(openButton)

    const viewer = screen.getByRole('dialog', { name: 'Image viewer' })
    const closeButton = within(viewer).getByRole('button', {
      name: 'Close image viewer',
    })
    const viewerImage = within(viewer).getByRole('img', {
      name: /Temporary main image for painting 01/,
    })

    expect(document.activeElement).toBe(closeButton)
    expect(viewerImage.getAttribute('src')).toContain(
      '/assets/paintings/temporary-painting-01/main-960.jpg',
    )
    expect(viewer.innerHTML).not.toContain('blue-crow.png')

    fireEvent.keyDown(viewer, { key: 'ArrowRight' })

    expect(
      within(viewer).getByRole('img', {
        name: /Temporary room visualization for painting 01/,
      }),
    ).toBeTruthy()
    expect(viewer.textContent).toContain(
      'Temporary visualization using placeholder dimensions.',
    )

    fireEvent.keyDown(viewer, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Image viewer' })).toBeNull()
      expect(document.activeElement).toBe(openButton)
    })
  })

  it('renders localized not-found journeys for invalid painting slugs', async () => {
    for (const item of [
      {
        path: '/en/paintings/not-a-painting',
        heading: 'Page not found',
        gallery: 'View all paintings',
      },
      {
        path: '/no/malerier/ikke-et-maleri',
        heading: 'Siden finnes ikke',
        gallery: 'Se alle malerier',
      },
    ]) {
      cleanup()

      const router = createRouter({
        routeTree,
        history: createMemoryHistory({
          initialEntries: [item.path],
        }),
      })

      await router.load()
      render(<RouterProvider router={router} />)

      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: item.heading,
        }),
      ).toBeTruthy()
      expect(screen.getByRole('link', { name: item.gallery })).toBeTruthy()
      expect(router.state.statusCode).toBe(404)
    }
  })
})
