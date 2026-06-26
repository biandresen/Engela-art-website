// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { TestimonialsSection } from './testimonials'
import type { Testimonial } from './testimonials'

afterEach(cleanup)

const approvedTestimonial: Testimonial = {
  quote: {
    no: 'Maleriet var enda vakrere i virkeligheten, og dialogen var trygg hele veien.',
    en: 'The painting was even more beautiful in person, and the conversation felt clear throughout.',
  },
  displayName: 'A. Buyer',
  date: '2026-06-01',
  source: {
    type: 'email',
    label: {
      no: 'Godkjent e-postuttalelse',
      en: 'Approved email testimonial',
    },
  },
  publicationConsent: {
    status: 'written',
    documentedAt: '2026-06-02',
  },
}

describe('testimonials section', () => {
  it('renders nothing publicly when there are no approved entries', () => {
    const { container } = render(
      <TestimonialsSection
        locale="en"
        entries={[]}
        heading="Collector words"
      />,
    )

    expect(container.innerHTML).toBe('')
    expect(screen.queryByText('Collector words')).toBeNull()
    expect(screen.queryByText(/coming soon/i)).toBeNull()
  })

  it('renders approved entries with attribution, permission-aware source, and display limit', () => {
    render(
      <TestimonialsSection
        locale="en"
        entries={[approvedTestimonial, approvedTestimonial]}
        heading="Collector words"
        intro="Selected approved feedback."
        limit={1}
      />,
    )

    const region = screen.getByRole('region', { name: 'Collector words' })
    const articles = within(region).getAllByRole('article')

    expect(articles).toHaveLength(1)
    expect(region.textContent).toContain(
      'The painting was even more beautiful in person',
    )
    expect(region.textContent).toContain('A. Buyer')
    expect(region.textContent).toContain('Approved email testimonial')
    expect(region.textContent).toContain('Selected approved feedback.')
  })
})
