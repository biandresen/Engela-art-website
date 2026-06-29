// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Header from './Header'

let pathname = '/en'

vi.mock('@tanstack/react-router', () => ({
  useRouterState: ({ select }: { select: (state: unknown) => unknown }) =>
    select({
      location: {
        pathname,
        searchStr: '',
      },
    }),
}))

afterEach(() => {
  cleanup()
  pathname = '/en'
})

describe('Header', () => {
  it('marks the matching desktop navigation link as active for nested language-prefixed routes', () => {
    pathname = '/en/paintings/hjemlengsel'

    render(<Header />)

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    })
    const homeLink = within(navigation).getByRole('link', { name: 'Home' })
    const paintingsLink = within(navigation).getByRole('link', {
      name: 'Paintings',
    })

    expect(homeLink.getAttribute('aria-current')).toBeNull()
    expect(paintingsLink.getAttribute('aria-current')).toBe('page')
    expect(paintingsLink.className).toContain('border-border')
    expect(paintingsLink.className).toContain('bg-muted')
    expect(paintingsLink.className).toContain('whitespace-nowrap')
  })

  it('marks the matching mobile navigation link as active for Norwegian routes', () => {
    pathname = '/no/bestillingsverk'

    render(<Header />)

    fireEvent.click(screen.getByRole('button', { name: 'Åpne meny' }))

    const navigation = screen.getByRole('navigation', { name: 'Åpne meny' })
    const activeLink = within(navigation).getByRole('link', {
      name: 'Bestillingsverk',
    })

    expect(activeLink.getAttribute('aria-current')).toBe('page')
    expect(activeLink.className).toContain('border-border')
    expect(activeLink.className).toContain('bg-muted')
  })
})
