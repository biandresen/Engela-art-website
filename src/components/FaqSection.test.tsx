// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FaqSection } from './FaqSection'

vi.mock('@tanstack/react-router', () => ({
  useRouterState: ({ select }: { select: (state: unknown) => unknown }) =>
    select({
      location: {
        hash: '',
      },
    }),
}))

afterEach(cleanup)

describe('FaqSection', () => {
  it('shows a clear toggle affordance while preserving native details behavior', () => {
    render(<FaqSection locale="en" scope="contact" />)

    const question = screen.getByText('How quickly will Engela Art reply?')
    const summary = question.closest('summary')
    const details = question.closest('details')

    expect(summary).toBeInstanceOf(HTMLElement)
    expect(summary?.tagName).toBe('SUMMARY')
    expect(details).toBeInstanceOf(HTMLDetailsElement)
    expect(details?.hasAttribute('open')).toBe(false)
    expect(
      within(details as HTMLDetailsElement).getByTestId(
        'faq-toggle-affordance',
      ),
    ).toBeTruthy()

    fireEvent.click(question)

    expect(details?.hasAttribute('open')).toBe(true)

    fireEvent.click(question)

    expect(details?.hasAttribute('open')).toBe(false)
  })
})
