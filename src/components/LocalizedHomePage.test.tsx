// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { LocalizedHomePage } from './LocalizedHomePage'
import type {
  CustomerPhoto,
  Testimonial,
} from '#/lib/testimonials/testimonials'

afterEach(cleanup)

const approvedTestimonial: Testimonial = {
  quote: {
    no: 'En trygg og personlig kjøpsopplevelse.',
    en: 'A thoughtful and personal buying experience.',
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
    no: 'Godkjent kundebilde med maleriet i rommet.',
    en: 'Approved customer photo with the painting in the room.',
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

describe('localized home page', () => {
  it('renders the configured seasonal painting in the Norwegian hero', () => {
    render(<LocalizedHomePage locale="no" />)

    const hero = screen.getByRole('region', {
      name: 'Midlertidig sesongutvalg',
    })

    expect(
      within(hero).getByRole('heading', {
        level: 1,
        name: 'Original kunst av Engela',
      }),
    ).toBeTruthy()
    expect(
      within(hero).getByRole('img', {
        name: /Midlertidig hovedbilde for maleri 04/,
      }),
    ).toBeTruthy()
    expect(
      screen
        .getByRole('link', { name: 'Se alle malerier' })
        .getAttribute('href'),
    ).toBe('/no/malerier')
    expect(
      screen
        .getByRole('link', { name: 'Les om bestillingsverk' })
        .getAttribute('href'),
    ).toBe('/no/bestillingsverk')
  })

  it('renders localized English buyer actions without carousel behavior', () => {
    render(<LocalizedHomePage locale="en" />)

    const hero = screen.getByRole('region', {
      name: 'Temporary seasonal selection',
    })

    expect(
      screen
        .getByRole('link', { name: 'View all paintings' })
        .getAttribute('href'),
    ).toBe('/en/paintings')
    expect(
      screen
        .getByRole('link', { name: 'Read about commissions' })
        .getAttribute('href'),
    ).toBe('/en/commissions')
    expect(within(hero).getAllByRole('img')).toHaveLength(2)
    expect(
      within(hero).getByRole('img', {
        name: /Temporary room visualization for painting 04/,
      }),
    ).toBeTruthy()
    expect(
      document.querySelector('[aria-roledescription="carousel"]'),
    ).toBeNull()
    expect(screen.queryByRole('button', { name: /previous|next/i })).toBeNull()
  })

  it('keeps featured works below the first viewport in both locales', () => {
    for (const locale of ['no', 'en'] as const) {
      const { unmount } = render(<LocalizedHomePage locale={locale} />)
      const hero = screen.getByRole('region', {
        name:
          locale === 'no'
            ? 'Midlertidig sesongutvalg'
            : 'Temporary seasonal selection',
      })
      const featured = screen.getByRole('region', {
        name: locale === 'no' ? 'Utvalgte malerier' : 'Featured paintings',
      })

      expect(hero.className).toContain('min-h-[calc(100svh-4.25rem)]')
      expect(hero.className).toContain('sm:min-h-[calc(100svh-6rem)]')
      expect(
        hero.compareDocumentPosition(featured) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()

      unmount()
    }
  })

  it('renders featured catalog paintings in editorial order across statuses', () => {
    render(<LocalizedHomePage locale="en" />)

    const featured = screen.getByRole('region', {
      name: 'Featured paintings',
    })
    const cards = within(featured).getAllByRole('article')

    expect(
      within(featured).getByRole('heading', {
        level: 2,
        name: 'Selected works',
      }),
    ).toBeTruthy()
    expect(
      cards.map(
        (card) => within(card).getByRole('heading', { level: 3 }).textContent,
      ),
    ).toEqual([
      'Temporary painting 01',
      'Temporary painting 02',
      'Temporary painting 03',
    ])
    expect(cards.map((card) => card.textContent)).toEqual([
      expect.stringContaining('Available'),
      expect.stringContaining('Reserved'),
      expect.stringContaining('Sold'),
    ])
  })

  it('labels English featured prices according to each painting status', () => {
    render(<LocalizedHomePage locale="en" />)

    const cards = within(
      screen.getByRole('region', { name: 'Featured paintings' }),
    ).getAllByRole('article')

    expect(cards[0]?.textContent).toContain('Price: NOK 1,000')
    expect(cards[1]?.textContent).toContain('Listed price: NOK 2,000')
    expect(cards[2]?.textContent).toContain(
      'Historical listed price: NOK 3,000',
    )
  })

  it('localizes Norwegian status and price context', () => {
    render(<LocalizedHomePage locale="no" />)

    const cards = within(
      screen.getByRole('region', { name: 'Utvalgte malerier' }),
    ).getAllByRole('article')

    expect(
      screen.getByRole('heading', { level: 2, name: 'Utvalgte verk' }),
    ).toBeTruthy()
    expect(cards[0]?.textContent).toContain('Tilgjengelig')
    expect(cards[0]?.textContent).toContain('Pris: 1 000 kr')
    expect(cards[1]?.textContent).toContain('Reservert')
    expect(cards[1]?.textContent).toContain('Oppgitt pris: 2 000 kr')
    expect(cards[2]?.textContent).toContain('Solgt')
    expect(cards[2]?.textContent).toContain('Historisk oppgitt pris: 3 000 kr')
  })

  it('uses responsive derivative sources and intrinsic dimensions', () => {
    render(<LocalizedHomePage locale="en" />)

    const heroImage = screen.getByRole('img', {
      name: /Temporary main image for painting 04/,
    })
    const picture = heroImage.closest('picture')
    const sources = picture?.querySelectorAll('source')

    expect(picture).not.toBeNull()
    expect(sources?.[0]?.getAttribute('type')).toBe('image/avif')
    expect(sources?.[0]?.getAttribute('srcset')).toContain(
      '/assets/paintings/temporary-painting-04/main-480.avif 480w',
    )
    expect(sources?.[1]?.getAttribute('type')).toBe('image/webp')
    expect(heroImage.getAttribute('src')).toBe(
      '/assets/paintings/temporary-painting-04/main-960.jpg',
    )
    expect(heroImage.getAttribute('width')).toBe('960')
    expect(heroImage.getAttribute('height')).toBe('722')
    expect(heroImage.getAttribute('sizes')).toBe(
      '(min-width: 1024px) 50vw, 100vw',
    )
  })

  it('matches the artwork-card radius and room-preview hover treatment in both locales', () => {
    for (const locale of ['no', 'en'] as const) {
      const { unmount } = render(<LocalizedHomePage locale={locale} />)
      const hero = screen.getByRole('region', {
        name:
          locale === 'no'
            ? 'Midlertidig sesongutvalg'
            : 'Temporary seasonal selection',
      })
      const heroImage = within(hero).getByRole('img', {
        name:
          locale === 'no'
            ? /Midlertidig hovedbilde for maleri 04/
            : /Temporary main image for painting 04/,
      })
      const imageStage = heroImage.closest('div')

      expect(imageStage?.className).toContain('rounded-lg')
      expect(imageStage?.className).toContain('overflow-hidden')
      expect(heroImage.className).toContain(
        '[@media(hover:hover)]:group-hover:opacity-0',
      )
      expect(
        within(hero).getByRole('img', {
          name:
            locale === 'no'
              ? /Midlertidig romvisualisering for maleri 04/
              : /Temporary room visualization for painting 04/,
        }),
      ).toBeTruthy()

      unmount()
    }
  })

  it('renders a concise temporary artist preview with a localized about link', () => {
    render(<LocalizedHomePage locale="en" />)

    const artistPreview = screen.getByRole('region', {
      name: 'About the artist',
    })

    expect(artistPreview.textContent).toContain(
      'Temporary artist preview — approved biography and process details are pending.',
    )
    expect(
      within(artistPreview)
        .getByRole('link', { name: 'About Engela' })
        .getAttribute('href'),
    ).toBe('/en/about')
    expect(
      within(artistPreview)
        .getByRole('link', { name: 'About Engela' })
        .getAttribute('data-variant'),
    ).toBe('secondary')
  })

  it('renders dummy testimonials but no customer-photo placeholders', () => {
    render(<LocalizedHomePage locale="en" />)

    const testimonials = screen.getByRole('region', { name: 'Testimonials' })

    expect(within(testimonials).getAllByRole('article')).toHaveLength(3)
    expect(testimonials.textContent).toContain('[DUMMY]')
    expect(screen.queryByRole('region', { name: 'Customer homes' })).toBeNull()
    expect(screen.queryByText(/coming soon/i)).toBeNull()
    expect(document.querySelector('script[type="application/ld+json"]')).toBe(
      null,
    )
  })

  it('renders approved testimonials and customer photos near the lower home page when local data exists', () => {
    render(
      <LocalizedHomePage
        locale="en"
        testimonialEntries={[approvedTestimonial]}
        customerPhotoEntries={[approvedCustomerPhoto]}
        googleProfileUrl="https://example.com/google-profile"
      />,
    )

    const artistPreview = screen.getByRole('region', {
      name: 'About the artist',
    })
    const testimonials = screen.getByRole('region', {
      name: 'Testimonials',
    })
    const customerPhotos = screen.getByRole('region', {
      name: 'Customer homes',
    })

    expect(testimonials.textContent).toContain(
      'A thoughtful and personal buying experience.',
    )
    expect(
      within(testimonials)
        .getByRole('link', { name: 'View Engela Art on Google' })
        .getAttribute('href'),
    ).toBe('https://example.com/google-profile')
    expect(
      within(customerPhotos)
        .getByRole('img', { name: 'Temporary painting 01 in a customer home' })
        .getAttribute('loading'),
    ).toBe('lazy')
    expect(customerPhotos.textContent).toContain('Temporary painting 01')
    expect(
      artistPreview.compareDocumentPosition(testimonials) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      testimonials.compareDocumentPosition(customerPhotos) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})
