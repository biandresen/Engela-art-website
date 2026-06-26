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
  it('renders status-specific painting journeys through the unified contact form', async () => {
    const cases = [
      {
        url: '/en/contact?type=painting&painting=temporary-painting-01',
        title: 'Painting inquiry',
        prefill:
          'Hello Engela Art,\n\nI am interested in Temporary painting 01 (EA-2026-001). Please let me know whether it is available and what the next steps are.',
      },
      {
        url: '/en/contact?type=interest-list&painting=temporary-painting-02',
        title: 'Interest list',
        prefill:
          'Hello Engela Art,\n\nI would like to join the interest list for Temporary painting 02 (EA-2026-002). I understand this does not reserve or guarantee the painting, and that interest is handled in submission order with a 48-hour response window if contacted.',
      },
      {
        url: '/en/contact?type=similar-work&painting=temporary-painting-03',
        title: 'Similar work',
        prefill:
          'Hello Engela Art,\n\nI am interested in similar work with Temporary painting 03 (EA-2026-003) as a reference. I understand this does not request an exact reproduction or create an accepted commission.',
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
      expect(main.textContent).toContain('Temporary painting')
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
    ).toBe('Hei Engela Art,\n\n')
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
    expect(main.textContent).toContain('Temporary painting 03')
    expect(main.textContent).toContain(
      'A reference painting helps describe direction, but this is still a new commission inquiry.',
    )
    expect(
      within(main).getByLabelText<HTMLTextAreaElement>('Message').value,
    ).toContain(
      'possible commission inspired by Temporary painting 03 (EA-2026-003)',
    )
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
    expect(message.value).toBe('Hello Engela Art,\n\n')
    await waitFor(() => expect(submit.hasAttribute('disabled')).toBe(true))
  })
})
