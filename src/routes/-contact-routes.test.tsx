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
  it('renders the English inquiry form with safe painting context from the URL', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: [
          '/en/contact?type=painting&painting=temporary-painting-01',
        ],
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
    expect(main.textContent).toContain('Painting inquiry')
    expect(main.textContent).toContain('Temporary painting 01')
    expect(
      within(main).getByLabelText<HTMLTextAreaElement>('Message').value,
    ).toBe(
      'Hello Engela Art,\n\nI am interested in Temporary painting 01 (EA-2026-001). Please let me know whether it is available and what the next steps are.',
    )
    expect(within(main).getByLabelText('Name').hasAttribute('required')).toBe(
      true,
    )
    expect(within(main).getByLabelText('Email').hasAttribute('required')).toBe(
      true,
    )
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
