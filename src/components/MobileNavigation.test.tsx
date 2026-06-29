// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Home, Images } from 'lucide-react'
import { afterEach, describe, expect, it } from 'vitest'

import { MobileNavigation } from './MobileNavigation'

afterEach(cleanup)

const items = [
  { href: '/en', label: 'Home', icon: Home, isActive: true },
  { href: '/en/paintings', label: 'Paintings', icon: Images, isActive: false },
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

  it('renders decorative icons without changing link names', () => {
    render(
      <MobileNavigation
        items={items}
        menuLabel="Open menu"
        closeLabel="Close menu"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Paintings' })).toBeTruthy()

    const icons = document.querySelectorAll('#mobile-navigation a svg')

    expect(icons).toHaveLength(2)
    for (const icon of icons) {
      expect(icon.getAttribute('aria-hidden')).toBe('true')
      expect(icon.getAttribute('focusable')).toBe('false')
    }
  })

  it('marks the active mobile link with a visible fill and border', () => {
    render(
      <MobileNavigation
        items={items}
        menuLabel="Open menu"
        closeLabel="Close menu"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

    const activeLink = screen.getByRole('link', { name: 'Home' })
    const inactiveLink = screen.getByRole('link', { name: 'Paintings' })

    expect(activeLink.getAttribute('aria-current')).toBe('page')
    expect(activeLink.className).toContain('border-border')
    expect(activeLink.className).toContain('bg-muted')
    expect(inactiveLink.getAttribute('aria-current')).toBeNull()
    expect(inactiveLink.className).toContain('border-transparent')
    expect(inactiveLink.className).toContain('bg-transparent')
  })
})
