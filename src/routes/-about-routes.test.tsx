// @vitest-environment jsdom

import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  AboutProcessSection,
  LocalizedAboutPage,
} from '#/components/LocalizedAboutPage'
import { routeTree } from '#/routeTree.gen'
import type { Testimonial } from '#/lib/testimonials/testimonials'

vi.mock('@tanstack/react-devtools', () => ({
  TanStackDevtools: () => null,
}))

vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => null,
}))

afterEach(cleanup)

const approvedTestimonial: Testimonial = {
  quote: {
    no: 'Maleriet kom trygt frem, og oppfølgingen var personlig.',
    en: 'The painting arrived safely, and the follow-up felt personal.',
  },
  displayName: 'A. Collector',
  date: '2026-06-10',
  rating: 5,
  source: {
    type: 'email',
    label: {
      no: 'Godkjent e-postuttalelse',
      en: 'Approved email testimonial',
    },
  },
  publicationConsent: {
    status: 'written',
    documentedAt: '2026-06-11',
  },
}

describe('about routes', () => {
  it('renders the English trust journey with polished artist copy and portrait derivatives', async () => {
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
      within(main).getByRole('heading', { level: 1, name: 'About Anne Mari' }),
    ).toBeTruthy()
    expect(main.textContent).toContain(
      'Anne Mari grew up on a farm in Nannestad.',
    )
    expect(
      within(main).getByRole('heading', {
        level: 2,
        name: 'How Anne Mari works',
      }),
    ).toBeTruthy()
    expect(main.textContent).toContain(
      'Anne Mari builds each painting layer by layer',
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
      name: 'Portrait of Anne Mari Engelsrud, the artist behind Engela Art',
    })
    const picture = portrait.closest('picture')

    expect(picture?.querySelector('source[type="image/avif"]')).toBeTruthy()
    expect(portrait.getAttribute('src')).toBe('/assets/portrait/engela-960.jpg')
    expect(portrait.getAttribute('width')).toBe('960')
    expect(portrait.getAttribute('height')).toBe('1200')

    const carousel = within(main).getByRole('region', {
      name: 'Process images',
    })
    expect(
      within(carousel).getByRole('img', {
        name: "Studio table with brushes, paint, and canvas in Anne Mari's workspace",
      }),
    ).toBeTruthy()
    expect(within(carousel).getAllByRole('img')).toHaveLength(4)
    expect(carousel.textContent).toContain(
      'Materials are set out before colour and composition are explored.',
    )
    expect(carousel.textContent).toContain('Image 1 of 4')

    fireEvent.click(
      within(carousel).getByRole('button', { name: 'Next process image' }),
    )
    expect(carousel.textContent).toContain('Image 2 of 4')

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' })
    expect(carousel.textContent).toContain('Image 1 of 4')

    expect(screen.queryByRole('region', { name: /testimonials/i })).toBeNull()
    expect(main.textContent).not.toMatch(/coming soon/i)
    expect(main.textContent).not.toMatch(/google rating/i)
    expect(main.textContent).not.toContain('[DUMMY]')
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
      within(main).getByRole('heading', { level: 1, name: 'Om Anne Mari' }),
    ).toBeTruthy()
    expect(main.textContent).toContain(
      'Anne Mari vokste opp på gård i Nannestad.',
    )
    expect(
      within(main).getByRole('heading', {
        level: 2,
        name: 'Hvordan Anne Mari jobber',
      }),
    ).toBeTruthy()
    expect(main.textContent).toContain(
      'Anne Mari bygger hvert maleri lag for lag',
    )
    expect(
      within(main)
        .getByRole('link', { name: 'Send en henvendelse' })
        .getAttribute('href'),
    ).toBe('/no/kontakt')
    expect(
      within(main).getByRole('img', {
        name: 'Portrett av Anne Mari Engelsrud, kunstneren bak Engela Art',
      }),
    ).toBeTruthy()

    const carousel = within(main).getByRole('region', {
      name: 'Prosessbilder',
    })
    expect(
      within(carousel).getByRole('img', {
        name: 'Arbeidsbord med pensler, maling og lerret hos Anne Mari',
      }),
    ).toBeTruthy()
    expect(carousel.textContent).toContain(
      'Materialene legges frem før farge og komposisjon prøves ut.',
    )
    expect(carousel.textContent).toContain('Bilde 1 av 4')
  })

  it('renders process copy without carousel controls when no process images exist', () => {
    render(
      <AboutProcessSection
        title="How I work"
        intro="Process copy remains useful without approved images."
        items={['Mix colour', 'Review in natural light']}
        images={[]}
        carouselLabel="Process images"
        previousLabel="Previous process image"
        nextLabel="Next process image"
        slideStatus={(current, total) => `Image ${current} of ${total}`}
      />,
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'How I work' }),
    ).toBeTruthy()
    expect(screen.getByText('Mix colour')).toBeTruthy()
    expect(screen.queryByRole('region', { name: 'Process images' })).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Next process image' }),
    ).toBeNull()
  })

  it('renders approved testimonials as a carousel on the About page', () => {
    render(
      <LocalizedAboutPage
        locale="en"
        testimonialEntries={[
          approvedTestimonial,
          {
            ...approvedTestimonial,
            displayName: 'Second Collector',
            date: '2026-06-12',
            rating: 4,
          },
        ]}
      />,
    )

    const testimonials = screen.getByRole('region', { name: 'Testimonials' })
    const carousel = within(testimonials).getByLabelText('Testimonial carousel')

    expect(testimonials.textContent).toContain(
      'The painting arrived safely, and the follow-up felt personal.',
    )
    expect(within(testimonials).getByLabelText('5 of 5 stars')).toBeTruthy()
    expect(carousel.textContent).toContain('Testimonial 1 of 2')

    fireEvent.click(
      within(carousel).getByRole('button', { name: 'Next testimonial' }),
    )

    expect(carousel.textContent).toContain('Testimonial 2 of 2')
    expect(within(testimonials).getByLabelText('4 of 5 stars')).toBeTruthy()
  })

  it('can show local testimonial preview cards on the About page for development review', () => {
    render(
      <LocalizedAboutPage
        locale="en"
        showTestimonialPreview
        testimonialPreviewEntries={[
          {
            ...approvedTestimonial,
            quote: {
              no: '[LOKAL FORHÅNDSVISNING] Forhåndsvisning.',
              en: '[LOCAL PREVIEW] Preview.',
            },
          },
          {
            ...approvedTestimonial,
            displayName: 'Preview Collector 2',
            date: '2026-06-12',
            rating: 4,
          },
        ]}
      />,
    )

    const testimonials = screen.getByRole('region', { name: 'Testimonials' })

    expect(testimonials.textContent).toContain('[LOCAL PREVIEW]')
    expect(within(testimonials).getByLabelText('5 of 5 stars')).toBeTruthy()
    expect(
      within(testimonials).getByRole('button', { name: 'Next testimonial' }),
    ).toBeTruthy()
  })
})
