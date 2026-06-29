// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import {
  CustomerPhotosSection,
  TestimonialsSection,
  getApprovedCustomerPhotos,
  getApprovedTestimonials,
} from './testimonials'
import type { CustomerPhoto, Testimonial } from './testimonials'

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

const pendingTestimonial: Testimonial = {
  ...approvedTestimonial,
  displayName: 'Unapproved Buyer',
  publicationConsent: {
    status: 'pending',
    documentedAt: '2026-06-02',
  },
}

const approvedCustomerPhoto: CustomerPhoto = {
  image: {
    src: '/assets/customer-stories/example-room.jpg',
    width: 1200,
    height: 900,
    alt: {
      no: 'Maleriet Temporary painting 01 hjemme hos en kunde',
      en: 'Temporary painting 01 in a customer home',
    },
  },
  caption: {
    no: 'Godkjent kundeinteriør med maleriet på veggen.',
    en: 'Approved customer interior with the painting on the wall.',
  },
  paintingReference: {
    slug: 'temporary-painting-01',
    title: 'Temporary painting 01',
  },
  publicationConsent: {
    status: 'written',
    documentedAt: '2026-06-03',
  },
}

const pendingCustomerPhoto: CustomerPhoto = {
  ...approvedCustomerPhoto,
  publicationConsent: {
    status: 'pending',
    documentedAt: '2026-06-03',
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

  it('suppresses entries without written publication permission', () => {
    render(
      <TestimonialsSection
        locale="en"
        entries={[pendingTestimonial]}
        heading="Collector words"
      />,
    )

    expect(screen.queryByText('Collector words')).toBeNull()
    expect(screen.queryByText('Unapproved Buyer')).toBeNull()
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

  it('can render as a full-width semantic background band', () => {
    render(
      <TestimonialsSection
        locale="en"
        entries={[approvedTestimonial]}
        heading="Collector words"
        className="bg-muted"
      />,
    )

    const region = screen.getByRole('region', { name: 'Collector words' })
    const content = region.firstElementChild

    expect(region.className).toContain('bg-muted')
    expect(content?.className).toContain('max-w-7xl')
  })

  it('can link to a configured Google profile without rendering ratings or structured review data', () => {
    render(
      <TestimonialsSection
        locale="en"
        entries={[approvedTestimonial]}
        heading="Collector words"
        googleProfileUrl="https://example.com/google-profile"
        googleProfileLabel="Read Google reviews"
      />,
    )

    const region = screen.getByRole('region', { name: 'Collector words' })
    const link = within(region).getByRole('link', {
      name: 'Read Google reviews',
    })

    expect(link.getAttribute('href')).toBe('https://example.com/google-profile')
    expect(region.textContent).not.toMatch(/rating|stars/i)
    expect(document.querySelector('script[type="application/ld+json"]')).toBe(
      null,
    )
  })
})

describe('testimonial data sources', () => {
  it('exposes three clearly marked dummy testimonials for temporary visual review', () => {
    const testimonials = getApprovedTestimonials()

    expect(testimonials).toHaveLength(3)
    expect(testimonials.map((entry) => entry.displayName)).toEqual([
      'Dummy Kunde 1',
      'Dummy Kunde 2',
      'Dummy Kunde 3',
    ])
    expect(
      testimonials.every((entry) => entry.quote.en.includes('[DUMMY]')),
    ).toBe(true)
  })

  it('keeps customer-photo production content empty until permissioned photos exist', () => {
    expect(getApprovedCustomerPhotos()).toEqual([])
  })
})

describe('customer photos section', () => {
  it('renders nothing when there are no permissioned customer photos', () => {
    const { container } = render(
      <CustomerPhotosSection
        locale="en"
        entries={[]}
        heading="Customer stories"
      />,
    )

    expect(container.innerHTML).toBe('')
    expect(screen.queryByText('Customer stories')).toBeNull()
  })

  it('suppresses customer photos without written permission', () => {
    render(
      <CustomerPhotosSection
        locale="en"
        entries={[pendingCustomerPhoto]}
        heading="Customer stories"
      />,
    )

    expect(screen.queryByText('Customer stories')).toBeNull()
    expect(screen.queryByText('Temporary painting 01')).toBeNull()
  })

  it('renders approved customer photos with lazy-loaded image, caption, and painting reference', () => {
    render(
      <CustomerPhotosSection
        locale="en"
        entries={[approvedCustomerPhoto]}
        heading="Customer stories"
        intro="Permissioned homes after completed sales."
      />,
    )

    const region = screen.getByRole('region', { name: 'Customer stories' })
    const image = within(region).getByRole('img', {
      name: 'Temporary painting 01 in a customer home',
    })

    expect(image.getAttribute('loading')).toBe('lazy')
    expect(image.getAttribute('src')).toBe(
      '/assets/customer-stories/example-room.jpg',
    )
    expect(region.textContent).toContain('Temporary painting 01')
    expect(region.textContent).toContain(
      'Approved customer interior with the painting on the wall.',
    )
    expect(region.textContent).toContain(
      'Permissioned homes after completed sales.',
    )
  })
})
