// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import {
  CustomerPhotosSection,
  TestimonialsSection,
  getApprovedCustomerPhotos,
  getApprovedTestimonials,
  getTestimonialsForDisplay,
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
  rating: 4,
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

const invalidRatingTestimonial = {
  ...approvedTestimonial,
  displayName: 'Invalid Rating Buyer',
  rating: 6,
} as unknown as Testimonial

const approvedCustomerPhoto: CustomerPhoto = {
  image: {
    src: '/assets/customer-stories/example-room.jpg',
    width: 1200,
    height: 900,
    alt: {
      no: 'Maleriet Jordvarme hjemme hos en kunde',
      en: 'Jordvarme in a customer home',
    },
  },
  caption: {
    no: 'Godkjent kundeinteriør med maleriet på veggen.',
    en: 'Approved customer interior with the painting on the wall.',
  },
  paintingReference: {
    slug: 'temporary-painting-01',
    title: 'Jordvarme',
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

  it('suppresses entries with ratings outside the five-star range', () => {
    render(
      <TestimonialsSection
        locale="en"
        entries={[invalidRatingTestimonial]}
        heading="Collector words"
      />,
    )

    expect(screen.queryByText('Collector words')).toBeNull()
    expect(screen.queryByText('Invalid Rating Buyer')).toBeNull()
  })

  it('renders approved entries as cards with attribution, date, rating, source, and display limit', () => {
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
    expect(within(articles[0]).getByLabelText('4 of 5 stars')).toBeTruthy()
    expect(within(articles[0]).getByText('2026-06-01')).toBeTruthy()
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

  it('renders carousel controls with clear accessible names and keyboard navigation', () => {
    render(
      <TestimonialsSection
        locale="en"
        entries={[
          approvedTestimonial,
          {
            ...approvedTestimonial,
            displayName: 'Second Buyer',
            date: '2026-06-04',
            rating: 5,
            quote: {
              no: 'Oppfølgingen var varm og ryddig.',
              en: 'The follow-up was warm and orderly.',
            },
          },
        ]}
        heading="Collector words"
      />,
    )

    const carousel = screen.getByLabelText('Testimonial carousel')

    expect(carousel.textContent).toContain('Testimonial 1 of 2')
    expect(screen.getByLabelText('4 of 5 stars')).toBeTruthy()

    fireEvent.click(
      within(carousel).getByRole('button', { name: 'Next testimonial' }),
    )
    expect(carousel.textContent).toContain('Testimonial 2 of 2')
    expect(screen.getByLabelText('5 of 5 stars')).toBeTruthy()

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' })
    expect(carousel.textContent).toContain('Testimonial 1 of 2')
  })

  it('can link to a configured Google profile without rendering structured review data', () => {
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

    expect(region.textContent).toContain('See all customer testimonials here:')
    expect(link.getAttribute('href')).toBe('https://example.com/google-profile')
    expect(document.querySelector('script[type="application/ld+json"]')).toBe(
      null,
    )
  })
})

describe('testimonial data sources', () => {
  it('exposes the requested fake testimonials as approved placeholder content', () => {
    const entries = getApprovedTestimonials()

    expect(entries).toHaveLength(2)
    expect(entries.map((entry) => entry.displayName)).toEqual([
      'Kari Nordmann',
      'Ola Nordmann',
    ])
    expect(entries.map((entry) => entry.rating)).toEqual([5, 4])
    expect(
      entries.every(
        (entry) =>
          entry.source.type === 'email' &&
          entry.source.label.en === 'Fake placeholder',
      ),
    ).toBe(true)
  })

  it('prefers approved testimonial content over local preview testimonials', () => {
    const entries = getTestimonialsForDisplay({
      includePreview: true,
      previewEntries: [
        {
          ...approvedTestimonial,
          quote: {
            no: '[LOKAL FORHÅNDSVISNING] Forhåndsvisning.',
            en: '[LOCAL PREVIEW] Preview.',
          },
          rating: 5,
        },
        {
          ...approvedTestimonial,
          displayName: 'Preview Buyer 2',
          date: '2026-06-04',
          quote: {
            no: '[LOKAL FORHÅNDSVISNING] Forhåndsvisning nummer to.',
            en: '[LOCAL PREVIEW] Preview two.',
          },
        },
      ],
    })

    expect(entries).toHaveLength(2)
    expect(entries.map((entry) => entry.displayName)).toEqual([
      'Kari Nordmann',
      'Ola Nordmann',
    ])
    expect(entries.map((entry) => entry.rating)).toEqual([5, 4])
  })

  it('returns approved testimonials without requiring local preview mode', () => {
    expect(getTestimonialsForDisplay()).toEqual(getApprovedTestimonials())
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
    expect(screen.queryByText('Jordvarme')).toBeNull()
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
      name: 'Jordvarme in a customer home',
    })

    expect(image.getAttribute('loading')).toBe('lazy')
    expect(image.getAttribute('src')).toBe(
      '/assets/customer-stories/example-room.jpg',
    )
    expect(region.textContent).toContain('Jordvarme')
    expect(region.textContent).toContain(
      'Approved customer interior with the painting on the wall.',
    )
    expect(region.textContent).toContain(
      'Permissioned homes after completed sales.',
    )
  })
})
