// @vitest-environment jsdom

import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { routeTree } from '#/routeTree.gen'

vi.mock('@tanstack/react-devtools', () => ({
  TanStackDevtools: () => null,
}))

vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => null,
}))

afterEach(() => {
  cleanup()
})

describe('commission routes', () => {
  it('explains the English commission discovery journey and links to the unified form', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/commissions'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(
      within(main).getByRole('heading', { level: 1, name: 'Commissions' }),
    ).toBeTruthy()
    expect(main.textContent).toContain(
      "New paintings are discussed only when they fit Anne Mari's existing artistic practice.",
    )
    expect(main.textContent).toContain('Exact reproductions are not promised.')
    expect(main.textContent).toContain('Small study, up to 30 x 30 cm')
    expect(main.textContent).toContain('from NOK 1,000')
    expect(main.textContent).toContain('approximately 2-4 weeks')
    expect(main.textContent).toContain('50% deposit')
    expect(main.textContent).toContain('50% final payment')
    expect(main.textContent).toContain('one concept confirmation')
    expect(main.textContent).toContain('one progress update')
    expect(main.textContent).toContain('portfolio')
    expect(
      within(main)
        .getByRole('link', { name: 'Start a commission inquiry' })
        .getAttribute('href'),
    ).toBe('/en/contact?type=commission')
  })

  it('renders the Norwegian commission page with non-binding guidance', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/no/bestillingsverk'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(
      within(main).getByRole('heading', {
        level: 1,
        name: 'Bestillingsverk',
      }),
    ).toBeTruthy()
    expect(main.textContent).toContain(
      'Forespørsler må være inspirert av Anne Maris eget uttrykk.',
    )
    expect(main.textContent).toContain('Veiledende fra-priser')
    expect(main.textContent).toContain('fra 1 000 kr')
    expect(main.textContent).toContain('omtrent 2-4 uker')
    expect(main.textContent).toContain('skriftlig forslag')
    expect(
      within(main)
        .getByRole('link', { name: 'Start en forespørsel om bestillingsverk' })
        .getAttribute('href'),
    ).toBe('/no/kontakt?type=commission')
  })
})
