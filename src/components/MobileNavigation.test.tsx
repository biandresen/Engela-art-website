// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MobileNavigation } from './MobileNavigation'

const items = [
  { href: '/en', label: 'Home' },
  { href: '/en/paintings', label: 'Paintings' },
]

describe('mobile navigation', () => {
  it('manages expanded state, focus, Escape, and close-after-navigation', () => {
    render(
      <MobileNavigation
        items={items}
        menuLabel="Open menu"
        closeLabel="Close menu"
      />,
    )

    const menuButton = screen.getByRole('button', { name: 'Open menu' })

    fireEvent.click(menuButton)

    expect(menuButton.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('link', { name: 'Home' })).toBe(
      document.activeElement,
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(menuButton.getAttribute('aria-expanded')).toBe('false')
    expect(menuButton).toBe(document.activeElement)

    fireEvent.click(menuButton)
    fireEvent.click(screen.getByRole('link', { name: 'Paintings' }))

    expect(menuButton.getAttribute('aria-expanded')).toBe('false')
  })
})
