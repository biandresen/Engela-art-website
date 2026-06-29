// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Footer from './Footer'

const routerState = vi.hoisted(() => ({
  pathname: '/en',
}))

vi.mock('@tanstack/react-router', () => ({
  useRouterState: ({
    select,
  }: {
    select: (state: { location: { pathname: string } }) => unknown
  }) =>
    select({
      location: {
        pathname: routerState.pathname,
      },
    }),
}))

vi.mock('#/env', () => ({
  env: {
    VITE_GOOGLE_BUSINESS_PROFILE_URL: '',
  },
}))

vi.mock('#/lib/integrations/client-analytics', () => ({
  captureAnalyticsEvent: vi.fn(),
}))

afterEach(() => {
  cleanup()
  routerState.pathname = '/en'
})

describe('footer', () => {
  const currentYear = new Date().getFullYear()

  it('renders the complete localized English footer', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    const brandImage = within(footer).getByRole('img', { name: 'Engela Art' })
    const navigation = within(footer).getByRole('navigation', {
      name: 'Footer navigation',
    })
    const legal = within(footer).getByRole('navigation', {
      name: 'Legal and contact links',
    })

    expect(brandImage.getAttribute('src')).toBe(
      '/assets/brand/footer-image.webp',
    )
    expect(
      within(navigation)
        .getByRole('link', { name: 'Home' })
        .getAttribute('href'),
    ).toBe('/en')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Paintings' })
        .getAttribute('href'),
    ).toBe('/en/paintings')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Commissions' })
        .getAttribute('href'),
    ).toBe('/en/commissions')
    expect(
      within(navigation)
        .getByRole('link', { name: 'About' })
        .getAttribute('href'),
    ).toBe('/en/about')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Contact' })
        .getAttribute('href'),
    ).toBe('/en/contact')

    expect(
      within(legal).getByRole('link', { name: 'Privacy' }).getAttribute('href'),
    ).toBe('/en/privacy')
    expect(
      within(legal)
        .getByRole('link', { name: 'Sales, terms, and returns' })
        .getAttribute('href'),
    ).toBe('/en/sales-and-returns')
    expect(
      within(legal)
        .getByRole('link', { name: 'Email Engela Art' })
        .getAttribute('href'),
    ).toBe('mailto:kontakt@engelaart.no')

    expect(
      within(footer)
        .getByRole('link', { name: 'Engela Art on Instagram' })
        .getAttribute('href'),
    ).toBe('https://www.instagram.com/engela_art/')
    expect(within(footer).queryByRole('link', { name: /facebook/i })).toBeNull()
    expect(footer.textContent).not.toMatch(/facebook/i)
    expect(footer.textContent).toContain(`© ${currentYear} Art by Engela Art.`)
    expect(footer.textContent).toContain(
      'All content and artworks are protected by copyright and may not be used or copied without written permission from Engela Art.',
    )
  })

  it('renders the complete localized Norwegian footer', () => {
    routerState.pathname = '/no'

    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    const navigation = within(footer).getByRole('navigation', {
      name: 'Bunnnavigasjon',
    })
    const legal = within(footer).getByRole('navigation', {
      name: 'Juridiske lenker og kontakt',
    })

    expect(
      within(navigation)
        .getByRole('link', { name: 'Hjem' })
        .getAttribute('href'),
    ).toBe('/no')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Malerier' })
        .getAttribute('href'),
    ).toBe('/no/malerier')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Bestillingsverk' })
        .getAttribute('href'),
    ).toBe('/no/bestillingsverk')
    expect(
      within(navigation).getByRole('link', { name: 'Om' }).getAttribute('href'),
    ).toBe('/no/om')
    expect(
      within(navigation)
        .getByRole('link', { name: 'Kontakt' })
        .getAttribute('href'),
    ).toBe('/no/kontakt')

    expect(
      within(legal)
        .getByRole('link', { name: 'Personvernerklæring' })
        .getAttribute('href'),
    ).toBe('/no/personvern')
    expect(
      within(legal)
        .getByRole('link', { name: 'Salg, vilkår og retur' })
        .getAttribute('href'),
    ).toBe('/no/salg-og-retur')
    expect(
      within(legal)
        .getByRole('link', { name: 'Send e-post til Engela Art' })
        .getAttribute('href'),
    ).toBe('mailto:kontakt@engelaart.no')

    expect(footer.textContent).toContain(`© ${currentYear} Art by Engela Art.`)
    expect(footer.textContent).toContain(
      'Alt innhold og alle kunstverk er beskyttet av opphavsrett og må ikke brukes eller kopieres uten skriftlig tillatelse fra Engela Art.',
    )
  })
})
