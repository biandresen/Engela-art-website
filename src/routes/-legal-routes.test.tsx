// @vitest-environment jsdom

import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { routeTree } from '#/routeTree.gen'

vi.mock('@tanstack/react-devtools', () => ({
  TanStackDevtools: () => null,
}))

vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => null,
}))

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(cleanup)

describe('legal and buyer guidance routes', () => {
  it('publishes the English privacy notice without exposing private contact details', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/privacy'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(
      within(main).getByRole('heading', { level: 1, name: 'Privacy' }),
    ).toBeTruthy()
    expect(main.textContent).toContain('Final legal review required')
    expect(main.textContent).toContain('Engela Art')
    expect(main.textContent).toContain('kontakt@engelaart.no')
    expect(main.textContent).toContain('language-preference cookie')
    expect(main.textContent).toContain('one year')
    expect(main.textContent).toContain('Resend')
    expect(main.textContent).toContain('Zoho')
    expect(main.textContent).toContain('PostHog')
    expect(main.textContent).toContain('Sentry')
    expect(main.textContent).toContain('No non-essential cookie banner')
    expect(main.textContent).toContain('Unsuccessful inquiries')
    expect(main.textContent).toContain('Completed-sale records')
    expect(main.textContent).not.toMatch(/gmail|hotmail|outlook/i)
    expect(main.textContent).not.toContain('home address')
  })

  it('publishes Norwegian sales and returns guidance with the full FAQ', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/no/salg-og-retur#faq-payment-methods'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(
      within(main).getByRole('heading', { level: 1, name: 'Salg og retur' }),
    ).toBeTruthy()
    expect(main.textContent).toContain('Juridisk sluttgjennomgang kreves')
    expect(main.textContent).toContain('uten ramme')
    expect(main.textContent).toContain('Prisen inkluderer ikke frakt')
    expect(main.textContent).toContain('Henting i Nannestad etter avtale')
    expect(main.textContent).toContain('Sporbar frakt')
    expect(main.textContent).toContain('Bankoverføring')
    expect(main.textContent).toContain('Vipps Business')
    expect(main.textContent).toContain('PayPal Business')
    expect(main.textContent).toContain('angrerett')
    expect(main.textContent).toContain('reklamasjon')
    expect(main.textContent).toContain('kontakt@engelaart.no')
    expect(main.textContent).toContain(
      'Manglende eller ufullstendige bilder fjerner ikke lovpålagte rettigheter.',
    )
    expect(within(main).queryByLabelText(/last opp|upload/i)).toBeNull()

    const paymentFaq = main.querySelector<HTMLDetailsElement>(
      '#faq-payment-methods',
    )

    expect(paymentFaq?.textContent).toContain(
      'Hvilke betalingsmåter kan jeg bruke?',
    )
    await waitFor(() => expect(paymentFaq?.hasAttribute('open')).toBe(true))
    expect(main.textContent).toContain('Er maleriene innrammet?')
    expect(main.textContent).toContain('Kan jeg hente maleriet selv?')
    expect(main.textContent).toContain('Sender dere internasjonalt?')
    expect(main.textContent).toContain('Kan jeg bestille et nytt maleri?')
  })

  it('renders a concise shared FAQ subset on Contact', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/contact'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(
      within(main).getByRole('heading', { level: 2, name: 'Frequently asked' }),
    ).toBeTruthy()
    expect(main.textContent).toContain('How quickly will Engela Art reply?')
    expect(main.textContent).toContain('Can I pick up a painting?')
    expect(main.textContent).toContain(
      'How do I ask about a reserved painting?',
    )
    expect(main.textContent).not.toContain('Withdrawal and complaint guidance')
  })
})
