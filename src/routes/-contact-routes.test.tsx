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
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { routeTree } from '#/routeTree.gen'

const { submitInquiryServerMock } = vi.hoisted(() => ({
  submitInquiryServerMock: vi.fn(),
}))

vi.mock('@tanstack/react-devtools', () => ({
  TanStackDevtools: () => null,
}))

vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => null,
}))

vi.mock('#/lib/inquiries/server', () => ({
  submitInquiryServer: submitInquiryServerMock,
}))

afterEach(() => {
  cleanup()
  submitInquiryServerMock.mockReset()
})

describe('contact routes', () => {
  it('shows English response-time and confirmation guidance before submission', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/contact'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(main.textContent).toContain(
      'You can expect a personal response from Anne Mari within two business days.',
    )
    expect(main.textContent).toContain(
      'After sending, an automatic confirmation email is sent to the email address you enter.',
    )
  })

  it('shows Norwegian response-time and confirmation guidance before submission', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/no/kontakt'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(main.textContent).toContain(
      'Du kan forvente personlig svar fra Anne Mari innen to virkedager.',
    )
    expect(main.textContent).toContain(
      'Etter sending sendes en automatisk bekreftelse til e-postadressen du oppgir.',
    )
  })

  it('renders status-specific painting journeys through the unified contact form', async () => {
    const cases = [
      {
        url: '/en/contact?type=painting&painting=temporary-painting-01',
        title: 'Painting inquiry',
        prefill:
          'Hello Anne Mari,\n\nI am interested in Jordvarme (EA-2026-001). Please let me know whether it is available and what the next steps are.',
      },
      {
        url: '/en/contact?type=interest-list&painting=temporary-painting-02',
        title: 'Interest list',
        prefill:
          'Hello Anne Mari,\n\nI would like to join the interest list for Lys over åker (EA-2026-002). I understand this does not reserve or guarantee the painting, and that interest is handled in submission order with a 48-hour response window if contacted.',
      },
      {
        url: '/en/contact?type=similar-work&painting=temporary-painting-03',
        title: 'Similar work',
        prefill:
          'Hello Anne Mari,\n\nI am interested in similar work with Stille glede (EA-2026-003) as a reference. I understand this does not request an exact reproduction or create an accepted commission.',
      },
    ] as const

    for (const item of cases) {
      cleanup()

      const router = createRouter({
        routeTree,
        history: createMemoryHistory({
          initialEntries: [item.url],
        }),
      })

      await router.load()
      render(<RouterProvider router={router} />)

      const main = await screen.findByRole('main')

      expect(
        within(main).getByRole('heading', { level: 1, name: 'Contact' }),
      ).toBeTruthy()
      expect(main.textContent).toContain(
        'Use the form for painting inquiries. You can also email kontakt@engelaart.no.',
      )
      expect(main.textContent).toContain(item.title)
      expect(main.textContent).toMatch(/Jordvarme|Lys over åker|Stille glede/)
      expect(
        within(main).getByLabelText<HTMLTextAreaElement>('Message').value,
      ).toBe(item.prefill)
      expect(within(main).getByLabelText('Name').hasAttribute('required')).toBe(
        true,
      )
      expect(
        within(main).getByLabelText('Email').hasAttribute('required'),
      ).toBe(true)
      expect(within(main).getByLabelText('Phone (optional)')).toBeTruthy()
      expect(within(main).queryByLabelText(/address/i)).toBeNull()
      expect(main.textContent).toContain(
        'Engela Art processes this information to answer your inquiry.',
      )
      expect(
        within(main)
          .getByRole('link', { name: 'privacy notice' })
          .getAttribute('href'),
      ).toBe('/en/privacy')
      expect(
        within(main)
          .getByRole('link', { name: 'Instagram' })
          .getAttribute('href'),
      ).toBe('https://www.instagram.com/engela_art/')
      expect(within(main).queryByRole('link', { name: 'Facebook' })).toBeNull()
      expect(main.textContent).not.toMatch(/facebook/i)
    }
  })

  it('derives trusted inquiry category from the current painting status', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: [
          '/en/contact?type=painting&painting=temporary-painting-03',
        ],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(main.textContent).toContain('Similar work')
    expect(
      within(main).getByLabelText<HTMLTextAreaElement>('Message').value,
    ).toContain('does not request an exact reproduction')
  })

  it('falls back to a localized general inquiry for stale query context', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/no/kontakt?type=similar-work&painting=missing'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(main.textContent).toContain('Generell henvendelse')
    expect(main.textContent).toContain(
      'Lenken inneholdt en ugyldig eller utdatert referanse, så skjemaet er satt til en generell henvendelse.',
    )
    expect(
      within(main).getByLabelText<HTMLTextAreaElement>('Melding').value,
    ).toBe('Hei Anne Mari,\n\n')
  })

  it('renders commission inquiry fields and preserves trusted reference context', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: [
          '/en/contact?type=commission&painting=temporary-painting-03',
        ],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')

    expect(main.textContent).toContain('Commission inquiry')
    expect(main.textContent).toContain('Stille glede')
    expect(main.textContent).toContain(
      'A reference painting helps describe direction, but this is still a new commission inquiry.',
    )
    expect(
      within(main).getByLabelText<HTMLTextAreaElement>('Message').value,
    ).toContain('possible commission inspired by Stille glede (EA-2026-003)')
    expect(
      within(main).getByLabelText('Desired dimensions (optional)'),
    ).toBeTruthy()
    expect(within(main).getByLabelText('Budget (optional)')).toBeTruthy()
  })

  it('preserves values after delivery failure and clears them after success', async () => {
    submitInquiryServerMock
      .mockResolvedValueOnce({
        status: 'delivery-error',
        reason: 'artist-notification-failed',
      })
      .mockResolvedValueOnce({
        status: 'success',
        acknowledgement: 'sent',
        inquiryType: 'general',
      })
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/contact'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')
    const name = within(main).getByLabelText<HTMLInputElement>('Name')
    const email = within(main).getByLabelText<HTMLInputElement>('Email')
    const message = within(main).getByLabelText<HTMLTextAreaElement>('Message')
    const submit = within(main).getByRole('button', { name: 'Send inquiry' })

    fireEvent.change(name, { target: { value: 'Ada Buyer' } })
    fireEvent.change(email, { target: { value: 'ada@example.com' } })
    fireEvent.change(message, { target: { value: 'Please keep this draft.' } })
    fireEvent.click(submit)

    await screen.findByRole('alert')

    expect(name.value).toBe('Ada Buyer')
    expect(email.value).toBe('ada@example.com')
    expect(message.value).toBe('Please keep this draft.')
    expect(localStorage.getItem('message')).toBeNull()

    fireEvent.click(submit)

    await screen.findByRole('status')

    expect(name.value).toBe('')
    expect(email.value).toBe('')
    expect(message.value).toBe('Hello Anne Mari,\n\n')
    await waitFor(() => expect(submit.hasAttribute('disabled')).toBe(true))
  })

  it('shows normal success copy with confirmation, spam, and no-agreement guidance', async () => {
    submitInquiryServerMock.mockResolvedValueOnce({
      status: 'success',
      acknowledgement: 'sent',
      inquiryType: 'general',
    })
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/contact'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')
    await submitValidInquiry(main)

    const status = await screen.findByRole('status')

    expect(status.textContent).toContain('Your inquiry has been received.')
    expect(status.textContent).toContain(
      'This does not create a reservation or agreement.',
    )
    expect(status.textContent).toContain(
      'The confirmation email should arrive shortly.',
    )
    expect(status.textContent).toContain('Check spam or junk if it is missing.')
    expect(status.textContent).toContain(
      'If the confirmation never arrives, email kontakt@engelaart.no.',
    )
    expect(status.textContent).not.toContain('Try again')
  })

  it('keeps delayed acknowledgement distinct from normal success', async () => {
    submitInquiryServerMock.mockResolvedValueOnce({
      status: 'success',
      acknowledgement: 'delayed',
      inquiryType: 'general',
    })
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/en/contact'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')
    await submitValidInquiry(main)

    const status = await screen.findByRole('status')

    expect(status.textContent).toContain('Your inquiry has been received.')
    expect(status.textContent).toContain(
      'The automatic confirmation email may be delayed and may not arrive immediately.',
    )
    expect(status.textContent).toContain(
      'This does not create a reservation or agreement.',
    )
    expect(status.textContent).not.toContain(
      'The confirmation email should arrive shortly.',
    )
  })

  it('shows Norwegian delivery failure fallback copy without provider details', async () => {
    submitInquiryServerMock.mockResolvedValueOnce({
      status: 'delivery-error',
      reason: 'artist-notification-failed',
    })
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: ['/no/kontakt'],
      }),
    })

    await router.load()
    render(<RouterProvider router={router} />)

    const main = await screen.findByRole('main')
    const name = within(main).getByLabelText<HTMLInputElement>('Navn')
    const email = within(main).getByLabelText<HTMLInputElement>('E-post')
    const message = within(main).getByLabelText<HTMLTextAreaElement>('Melding')

    await submitValidInquiry(main, {
      nameLabel: 'Navn',
      emailLabel: 'E-post',
      messageLabel: 'Melding',
      submitLabel: 'Send henvendelse',
    })

    const alert = await screen.findByRole('alert')

    expect(alert.textContent).toContain(
      'Henvendelsen kunne ikke sendes akkurat nå.',
    )
    expect(alert.textContent).toContain('Prøv igjen')
    expect(alert.textContent).toContain('kontakt@engelaart.no')
    expect(alert.textContent).not.toContain('artist-notification-failed')
    expect(name.value).toBe('Ada Buyer')
    expect(email.value).toBe('ada@example.com')
    expect(message.value).toBe('Please keep this draft.')
  })
})

async function submitValidInquiry(
  main: HTMLElement,
  labels: {
    nameLabel: string
    emailLabel: string
    messageLabel: string
    submitLabel: string
  } = {
    nameLabel: 'Name',
    emailLabel: 'Email',
    messageLabel: 'Message',
    submitLabel: 'Send inquiry',
  },
) {
  const name = within(main).getByLabelText<HTMLInputElement>(labels.nameLabel)
  const email = within(main).getByLabelText<HTMLInputElement>(labels.emailLabel)
  const message = within(main).getByLabelText<HTMLTextAreaElement>(
    labels.messageLabel,
  )
  const submit = within(main).getByRole('button', { name: labels.submitLabel })

  await waitFor(() => expect(submit.hasAttribute('disabled')).toBe(false))
  fireEvent.change(name, { target: { value: 'Ada Buyer' } })
  fireEvent.change(email, { target: { value: 'ada@example.com' } })
  fireEvent.change(message, { target: { value: 'Please keep this draft.' } })
  fireEvent.click(submit)
}
