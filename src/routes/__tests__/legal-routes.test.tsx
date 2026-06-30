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
    expect(main.textContent).toContain('Last updated: June 29, 2026')
    expect(main.textContent).toContain('controller')
    expect(main.textContent).toContain('Engela Art')
    expect(main.textContent).toContain('kontakt@engelaart.no')
    expect(main.textContent).toContain('Contact page')
    expect(main.textContent).toContain('language-preference cookie')
    expect(main.textContent).toContain('one year')
    expect(main.textContent).toContain('Resend')
    expect(main.textContent).toContain('Zoho')
    expect(main.textContent).toContain('PostHog')
    expect(main.textContent).toContain('Sentry')
    expect(main.textContent).toContain('No non-essential cookie banner')
    expect(main.textContent).toContain('Unsuccessful inquiries')
    expect(main.textContent).toContain('Completed-sale records')
    expect(main.textContent).toContain('Norwegian Data Protection Authority')
    expect(main.textContent).not.toMatch(/gmail|hotmail|outlook/i)
    expect(main.textContent).not.toContain(
      'private residential address is public',
    )
    expect(main.textContent).not.toMatch(/newsletter signup|Meta Pixel/i)
  })

  it('publishes Norwegian sales, terms, payment, and delivery guidance with the full FAQ', async () => {
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
      within(main).getByRole('heading', {
        level: 1,
        name: 'Salg, vilkår og retur',
      }),
    ).toBeTruthy()
    expect(main.textContent).toContain('Juridisk sluttgjennomgang kreves')
    expect(main.textContent).toContain('Sist oppdatert: 29. juni 2026')
    expect(main.textContent).toContain(
      'Det opprettes ikke egne sider for vilkår eller betaling og levering',
    )
    expect(main.textContent).toContain('Selger er Engela Art')
    expect(main.textContent).toContain('originale fysiske malerier')
    expect(main.textContent).toContain('pris i NOK')
    expect(main.textContent).toContain('ingen handlekurv')
    expect(main.textContent).toContain('nettbasert checkout')
    expect(main.textContent).toContain('uten ramme')
    expect(main.textContent).toContain('Prisen inkluderer ikke frakt')
    expect(main.textContent).toContain('Henting i Nannestad etter avtale')
    expect(main.textContent).toContain('sporbar frakt')
    expect(main.textContent).toContain('Transportør velges')
    expect(main.textContent).toContain(
      'Internasjonalt salg vurderes fra sak til sak',
    )
    expect(main.textContent).toContain('bankoverføring')
    expect(main.textContent).toContain('Vipps Business')
    expect(main.textContent).toContain('PayPal Business')
    expect(main.textContent).toContain('angrerett')
    expect(main.textContent).toContain('reklamasjon')
    expect(main.textContent).toContain('Vent på returavklaring')
    expect(main.textContent).toContain('opphavsretten')
    expect(main.textContent).toContain('Engela Art kan oppdatere')
    expect(main.textContent).toContain('kontakt@engelaart.no')
    expect(main.textContent).toContain(
      'Manglende eller ufullstendige bilder fjerner ikke lovpålagte rettigheter.',
    )
    expect(within(main).queryByLabelText(/last opp|upload/i)).toBeNull()
    expect(main.textContent).not.toMatch(
      /Wix|Meta Pixel|nyhetsbrev|kunsttrykk|digitale produkter|Bergen/i,
    )

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

  it('publishes English terms and delivery guidance without borrowed webshop facts', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/sales-and-returns'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(
      within(main).getByRole('heading', {
        level: 1,
        name: 'Sales, terms, and returns',
      }),
    ).toBeTruthy()
    expect(main.textContent).toContain(
      'Separate Terms or Payment/Delivery pages are not added',
    )
    expect(main.textContent).toContain('Last updated: June 29, 2026')
    expect(main.textContent).toContain('The seller is Engela Art')
    expect(main.textContent).toContain('original physical paintings')
    expect(main.textContent).toContain('prices in NOK')
    expect(main.textContent).toContain('There is no cart or online checkout')
    expect(main.textContent).toContain(
      'invoice or other manual payment agreement',
    )
    expect(main.textContent).toContain('Pickup in Nannestad')
    expect(main.textContent).toContain('tracked shipping')
    expect(main.textContent).toContain('Carrier is selected')
    expect(main.textContent).toContain(
      'International sales are assessed case by case',
    )
    expect(main.textContent).toContain('Wait for return clarification')
    expect(main.textContent).toContain('not copyright')
    expect(main.textContent).toContain('mandatory consumer rights')
    expect(main.textContent).not.toMatch(
      /Wix|Meta Pixel|newsletter|webshop checkout|art prints|digital products|Bergen/i,
    )
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
