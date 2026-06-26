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

afterEach(cleanup)

describe('about routes', () => {
  it('renders the English trust journey with approved portrait derivatives and dummy testimonial preview content', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/about'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(
      within(main).getByRole('heading', { level: 1, name: 'About Engela' }),
    ).toBeTruthy()
    expect(main.textContent).toContain('Artist-approved biography pending')
    expect(main.textContent).toContain(
      'Engela Art will replace this temporary page copy after the artist approves the final Norwegian source text and English translation.',
    )
    expect(
      within(main)
        .getByRole('link', { name: 'Send an inquiry' })
        .getAttribute('href'),
    ).toBe('/en/contact')
    expect(
      within(main)
        .getByRole('link', { name: 'Visit Instagram' })
        .getAttribute('href'),
    ).toBe('https://www.instagram.com/')

    const portrait = within(main).getByRole('img', {
      name: 'Portrait of Engela, the artist behind Engela Art',
    })
    const picture = portrait.closest('picture')

    expect(picture?.querySelector('source[type="image/avif"]')).toBeTruthy()
    expect(portrait.getAttribute('src')).toBe('/assets/portrait/engela-960.jpg')
    expect(portrait.getAttribute('width')).toBe('960')
    expect(portrait.getAttribute('height')).toBe('1200')
    const testimonials = screen.getByRole('region', { name: /testimonials/i })

    expect(within(testimonials).getAllByRole('article')).toHaveLength(3)
    expect(testimonials.textContent).toContain('[DUMMY]')
    expect(main.textContent).not.toMatch(/coming soon/i)
    expect(main.textContent).not.toMatch(/google rating/i)
  })

  it('renders localized Norwegian About content and inquiry path', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/no/om'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(
      within(main).getByRole('heading', { level: 1, name: 'Om Engela' }),
    ).toBeTruthy()
    expect(main.textContent).toContain('Kunstnergodkjent biografi mangler')
    expect(main.textContent).toContain(
      'Engela Art erstatter denne midlertidige sideteksten når kunstneren har godkjent norsk kildetekst og engelsk oversettelse.',
    )
    expect(
      within(main)
        .getByRole('link', { name: 'Send en henvendelse' })
        .getAttribute('href'),
    ).toBe('/no/kontakt')
    expect(
      within(main).getByRole('img', {
        name: 'Portrett av Engela, kunstneren bak Engela Art',
      }),
    ).toBeTruthy()
  })
})
