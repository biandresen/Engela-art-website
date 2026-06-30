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
import { afterEach, describe, expect, it } from 'vitest'

import { routeTree } from '#/routeTree.gen'

afterEach(cleanup)

describe('gallery routes', () => {
  it('renders every public painting in default catalog order', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/paintings'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const gallery = await screen.findByRole('region', {
      name: 'Painting collection',
    })
    const cards = within(gallery).getAllByRole('article')

    expect(
      cards.map(
        (card) => within(card).getByRole('heading', { level: 2 }).textContent,
      ),
    ).toEqual([
      'Hjemlengsel',
      'Jordvarme',
      'Lys over åker',
      'Morgenro',
      'Sommerminne',
      'Stille glede',
    ])
  })

  it('combines status and orientation filters in the rendered URL state', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/paintings'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    fireEvent.click(await screen.findByRole('radio', { name: 'Available' }))
    await waitFor(() => {
      expect(
        isChecked(
          screen.getByRole('radio', {
            name: 'Available',
          }),
        ),
      ).toBe(true)
    })
    fireEvent.click(screen.getByRole('radio', { name: 'Landscape' }))

    await waitFor(() => {
      const cards = within(
        screen.getByRole('region', { name: 'Painting collection' }),
      ).getAllByRole('article')

      expect(cards).toHaveLength(1)
      expect(
        within(cards[0]).getByRole('heading', { level: 2 }).textContent,
      ).toBe('Sommerminne')
      expect(router.state.location.search).toEqual({
        status: 'available',
        orientation: 'landscape',
      })
      expect(router.state.location.searchStr).toBe(
        '?status=available&orientation=landscape',
      )
    })
  })

  it('sorts the rendered collection by listed price in both URL and DOM order', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/paintings'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const sortSelect = await screen.findByRole('combobox', {
      name: 'Sort by',
    })

    expect(getSelectOptions(sortSelect)).toEqual([
      'year-desc',
      'year-asc',
      'area-desc',
      'area-asc',
      'price-desc',
      'price-asc',
    ])

    fireEvent.change(sortSelect, {
      target: { value: 'price-desc' },
    })

    await waitFor(() => {
      const cards = within(
        screen.getByRole('region', { name: 'Painting collection' }),
      ).getAllByRole('article')

      expect(
        cards.map(
          (card) => within(card).getByRole('heading', { level: 2 }).textContent,
        ),
      ).toEqual([
        'Hjemlengsel',
        'Morgenro',
        'Sommerminne',
        'Stille glede',
        'Lys over åker',
        'Jordvarme',
      ])
      expect(router.state.location.searchStr).toBe('?sort=price-desc')
    })
  })

  it('restores shared URL state and browser history', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: [
          '/en/paintings?status=sold&orientation=square&sort=price-asc',
        ],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    expect(isChecked(await screen.findByRole('radio', { name: 'Sold' }))).toBe(
      true,
    )
    expect(isChecked(screen.getByRole('radio', { name: 'Square' }))).toBe(true)
    expect(
      getSelectValue(screen.getByRole('combobox', { name: 'Sort by' })),
    ).toBe('price-asc')

    fireEvent.click(
      within(screen.getByRole('group', { name: 'Status' })).getByRole('radio', {
        name: 'All',
      }),
    )

    await waitFor(() => {
      expect(router.state.location.searchStr).toBe(
        '?orientation=square&sort=price-asc',
      )
    })

    router.history.back()

    await waitFor(() => {
      expect(router.state.location.searchStr).toBe(
        '?status=sold&orientation=square&sort=price-asc',
      )
      expect(isChecked(screen.getByRole('radio', { name: 'Sold' }))).toBe(true)
      expect(
        within(screen.getByRole('region', { name: 'Painting collection' }))
          .getAllByRole('heading', { level: 2 })
          .map((heading) => heading.textContent),
      ).toEqual(['Stille glede', 'Hjemlengsel'])
    })

    router.history.forward()

    await waitFor(() => {
      expect(router.state.location.searchStr).toBe(
        '?orientation=square&sort=price-asc',
      )
      expect(
        isChecked(
          within(screen.getByRole('group', { name: 'Status' })).getByRole(
            'radio',
            { name: 'All' },
          ),
        ),
      ).toBe(true)
    })
  })

  it('normalizes invalid query values to the canonical gallery URL', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: [
          '/en/paintings?status=unknown&orientation=wide&sort=random',
        ],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    await screen.findByRole('region', { name: 'Painting collection' })

    await waitFor(() => {
      expect(router.state.location.searchStr).toBe('')
      expect(
        isChecked(
          within(screen.getByRole('group', { name: 'Status' })).getByRole(
            'radio',
            { name: 'All' },
          ),
        ),
      ).toBe(true)
    })
  })

  it('preserves zero-result filters until the visitor clears them', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/paintings?status=available&orientation=square'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    expect(
      await screen.findByText('No paintings match the selected filters.'),
    ).toBeTruthy()
    expect(isChecked(screen.getByRole('radio', { name: 'Available' }))).toBe(
      true,
    )
    expect(isChecked(screen.getByRole('radio', { name: 'Square' }))).toBe(true)
    expect(router.state.location.searchStr).toBe(
      '?status=available&orientation=square',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }))

    await waitFor(() => {
      expect(router.state.location.searchStr).toBe('')
      expect(
        within(
          screen.getByRole('region', { name: 'Painting collection' }),
        ).getAllByRole('article'),
      ).toHaveLength(6)
    })
  })

  it('renders localized metadata and responsive lazy-loaded artwork images', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/no/malerier?status=sold&sort=price-asc'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const collection = await screen.findByRole('region', {
      name: 'Malerisamling',
    })
    const cards = within(collection).getAllByRole('article')
    const firstCard = cards[0]
    const image = within(firstCard).getByRole('img', {
      name: /Rett forfra-bilde av maleri 03/,
    })
    const sources = image.closest('picture')?.querySelectorAll('source')

    expect(cards).toHaveLength(2)
    expect(firstCard.textContent).toContain('Solgt')
    expect(firstCard.textContent).toContain('Akryl og strukturpasta på lerret.')
    expect(firstCard.textContent).toContain('Lagvis arbeid med pensel')
    expect(firstCard.textContent).toContain('50 × 50 × 2 cm')
    expect(firstCard.textContent).toContain('Historisk oppgitt pris: 3 000 kr')
    expect(firstCard.textContent).toContain('2026')
    expect(image.getAttribute('loading')).toBe('lazy')
    expect(image.getAttribute('width')).toBe('960')
    expect(image.getAttribute('height')).toBe('957')
    expect(sources?.[0]?.getAttribute('srcset')).toContain(
      '/assets/paintings/temporary-painting-03/main-480.avif 480w',
    )
    expect(
      screen.getByRole('link', { name: 'English' }).getAttribute('href'),
    ).toContain('redirect=%2Fen%2Fpaintings%3Fstatus%3Dsold%26sort%3Dprice-asc')
  })
})

function isChecked(element: HTMLElement): boolean {
  return element instanceof HTMLInputElement && element.checked
}

function getSelectOptions(element: HTMLElement): Array<string> {
  if (!(element instanceof HTMLSelectElement)) {
    throw new Error('Expected a select element')
  }

  return Array.from(element.options).map((option) => option.value)
}

function getSelectValue(element: HTMLElement): string {
  if (!(element instanceof HTMLSelectElement)) {
    throw new Error('Expected a select element')
  }

  return element.value
}
