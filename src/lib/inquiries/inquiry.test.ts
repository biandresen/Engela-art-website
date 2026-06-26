import { describe, expect, it } from 'vitest'

import { RecordingTransactionalEmailAdapter } from '#/lib/integrations/email'

import { createInquiryRateLimiter, submitInquiry } from './inquiry'
import type { InquirySubmissionInput } from './inquiry'

const validInput: InquirySubmissionInput = {
  locale: 'en',
  type: 'painting',
  painting: 'temporary-painting-01',
  name: 'Ada Buyer',
  email: 'ada@example.com',
  phone: '+47 123 45 678',
  message: 'I am interested in this painting.',
  website: '',
  loadedAt: new Date('2026-06-26T10:00:00.000Z').toISOString(),
  submittedAt: new Date('2026-06-26T10:00:04.000Z').toISOString(),
  clientToken: 'test-token-1',
  clientKey: '127.0.0.1',
}

function dependencies() {
  return {
    email: new RecordingTransactionalEmailAdapter(),
    rateLimiter: createInquiryRateLimiter(),
    now: () => new Date('2026-06-26T10:00:04.000Z'),
    receiverEmail: 'kontakt@engelaart.no',
    senderEmail: 'noreply@engelaart.no',
  }
}

describe('inquiry submission seam', () => {
  it('sends the artist notification first and then the buyer acknowledgement', async () => {
    const deps = dependencies()

    const result = await submitInquiry(validInput, deps)

    expect(result).toEqual({
      status: 'success',
      acknowledgement: 'sent',
      inquiryType: 'painting',
      paintingSlug: 'temporary-painting-01',
    })
    expect(deps.email.messages).toHaveLength(2)
    expect(deps.email.messages[0]).toMatchObject({
      to: 'kontakt@engelaart.no',
      replyTo: 'ada@example.com',
      subject: 'Engela Art painting inquiry: Temporary painting 01',
    })
    expect(deps.email.messages[0]?.text).toContain('EA-2026-001')
    expect(deps.email.messages[0]?.text).toContain(
      'Submitted at: 2026-06-26T10:00:04.000Z',
    )
    expect(deps.email.messages[1]).toMatchObject({
      to: 'ada@example.com',
      subject: 'Engela Art received your inquiry',
    })
    expect(deps.email.messages[1]?.text).toContain(
      'This does not reserve the painting.',
    )
  })

  it('falls back to a general inquiry when query context is invalid or stale', async () => {
    const deps = dependencies()

    const result = await submitInquiry(
      {
        ...validInput,
        type: 'similar-work',
        painting: 'missing-painting',
        clientToken: 'test-token-2',
      },
      deps,
    )

    expect(result.status).toBe('success')
    if (result.status !== 'success') {
      throw new Error('Expected successful fallback inquiry')
    }
    expect(result.inquiryType).toBe('general')
    expect(result.paintingSlug).toBeUndefined()
    expect(deps.email.messages[0]?.subject).toBe('Engela Art general inquiry')
  })

  it('derives status-specific categories and subjects from trusted painting data', async () => {
    const cases = [
      {
        painting: 'temporary-painting-01',
        requestedType: 'similar-work',
        inquiryType: 'painting',
        subject: 'Engela Art painting inquiry: Temporary painting 01',
        acknowledgement:
          'This does not reserve the painting. The artist confirms availability before any reservation.',
      },
      {
        painting: 'temporary-painting-02',
        requestedType: 'painting',
        inquiryType: 'interest-list',
        subject: 'Engela Art interest-list inquiry: Temporary painting 02',
        acknowledgement:
          'This does not reserve or guarantee the painting. Interest-list order uses the server submission time.',
      },
      {
        painting: 'temporary-painting-03',
        requestedType: 'painting',
        inquiryType: 'similar-work',
        subject: 'Engela Art similar-work inquiry: Temporary painting 03',
        acknowledgement:
          'This does not request an exact reproduction or create an accepted commission.',
      },
    ] as const

    for (const item of cases) {
      const deps = dependencies()

      const result = await submitInquiry(
        {
          ...validInput,
          type: item.requestedType,
          painting: item.painting,
          message: 'Visitor-edited message text.',
          clientToken: `trusted-${item.painting}`,
        },
        deps,
      )

      expect(result).toMatchObject({
        status: 'success',
        inquiryType: item.inquiryType,
        paintingSlug: item.painting,
      })
      expect(deps.email.messages[0]).toMatchObject({
        subject: item.subject,
      })
      expect(deps.email.messages[0]?.text).toContain(
        `Inquiry type: ${item.inquiryType}`,
      )
      expect(deps.email.messages[0]?.text).toContain(
        'Submitted at: 2026-06-26T10:00:04.000Z',
      )
      expect(deps.email.messages[0]?.text).toContain(
        'Visitor-edited message text.',
      )
      expect(deps.email.messages[1]?.text).toContain(item.acknowledgement)
    }
  })

  it('categorizes commission inquiries separately with optional dimensions, budget, and trusted reference context', async () => {
    const deps = dependencies()

    const result = await submitInquiry(
      {
        ...validInput,
        type: 'commission',
        painting: 'temporary-painting-03',
        desiredDimensions: 'About 50 x 70 cm',
        budget: 'custom',
        customBudget: 'NOK 12,000-15,000',
        message: 'I want a new work with a related mood, not a copy.',
        clientToken: 'commission-token',
      },
      deps,
    )

    expect(result).toEqual({
      status: 'success',
      acknowledgement: 'sent',
      inquiryType: 'commission',
      paintingSlug: 'temporary-painting-03',
    })
    expect(deps.email.messages[0]).toMatchObject({
      subject: 'Engela Art commission inquiry: Temporary painting 03',
    })
    expect(deps.email.messages[0]?.text).toContain('Inquiry type: commission')
    expect(deps.email.messages[0]?.text).toContain(
      'Desired dimensions: About 50 x 70 cm',
    )
    expect(deps.email.messages[0]?.text).toContain('Budget: NOK 12,000-15,000')
    expect(deps.email.messages[0]?.text).toContain(
      'I want a new work with a related mood, not a copy.',
    )
    expect(deps.email.messages[1]?.text).toContain(
      'This does not create an accepted commission. Any commission requires artist review and a written proposal.',
    )
  })

  it('validates custom commission budget text without requiring commission details', async () => {
    const deps = dependencies()

    const invalidCustomBudget = await submitInquiry(
      {
        ...validInput,
        type: 'commission',
        desiredDimensions: '',
        budget: 'custom',
        customBudget: 'later',
        clientToken: 'commission-invalid-budget',
      },
      deps,
    )

    expect(invalidCustomBudget.status).toBe('validation-error')
    if (invalidCustomBudget.status !== 'validation-error') {
      throw new Error('Expected validation errors')
    }
    expect(invalidCustomBudget.fieldErrors).toMatchObject({
      customBudget: expect.any(String),
    })
    expect(deps.email.messages).toHaveLength(0)

    const validWithoutDetails = await submitInquiry(
      {
        ...validInput,
        type: 'commission',
        desiredDimensions: '',
        budget: '',
        customBudget: '',
        clientToken: 'commission-without-details',
      },
      deps,
    )

    expect(validWithoutDetails).toMatchObject({
      status: 'success',
      inquiryType: 'commission',
    })
  })

  it('rejects validation errors and abuse controls without sending email', async () => {
    const deps = dependencies()

    const missingFields = await submitInquiry(
      {
        ...validInput,
        name: '',
        email: 'not-an-email',
        message: '',
      },
      deps,
    )
    const honeypot = await submitInquiry(
      {
        ...validInput,
        website: 'spam',
      },
      deps,
    )
    const tooFast = await submitInquiry(
      {
        ...validInput,
        loadedAt: new Date('2026-06-26T10:00:03.000Z').toISOString(),
      },
      deps,
    )

    expect(missingFields.status).toBe('validation-error')
    if (missingFields.status !== 'validation-error') {
      throw new Error('Expected validation errors')
    }
    expect(missingFields.fieldErrors).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      message: expect.any(String),
    })
    expect(honeypot.status).toBe('rejected')
    expect(tooFast.status).toBe('rejected')
    expect(deps.email.messages).toHaveLength(0)
  })

  it('reports artist delivery failure as submission failure but tolerates acknowledgement failure', async () => {
    const failingArtist = dependencies()
    failingArtist.email.send = async () => {
      throw new Error('provider unavailable')
    }

    await expect(submitInquiry(validInput, failingArtist)).resolves.toEqual({
      status: 'delivery-error',
      reason: 'artist-notification-failed',
    })
    failingArtist.email.send = async (message) => {
      failingArtist.email.messages.push({ ...message })
      return {
        status: 'accepted',
        messageId: `retry-${failingArtist.email.messages.length}`,
      }
    }

    await expect(submitInquiry(validInput, failingArtist)).resolves.toEqual({
      status: 'success',
      acknowledgement: 'sent',
      inquiryType: 'painting',
      paintingSlug: 'temporary-painting-01',
    })

    const failingBuyer = dependencies()
    let sends = 0
    failingBuyer.email.send = async (message) => {
      sends += 1
      if (sends === 2) {
        throw new Error('buyer mailbox unavailable')
      }
      failingBuyer.email.messages.push({ ...message })
      return { status: 'accepted', messageId: 'recorded-1' }
    }

    await expect(submitInquiry(validInput, failingBuyer)).resolves.toEqual({
      status: 'success',
      acknowledgement: 'delayed',
      inquiryType: 'painting',
      paintingSlug: 'temporary-painting-01',
    })
    expect(failingBuyer.email.messages).toHaveLength(1)
  })

  it('prevents duplicate and rate-limited rapid submissions', async () => {
    const deps = dependencies()

    await expect(submitInquiry(validInput, deps)).resolves.toMatchObject({
      status: 'success',
    })

    await expect(submitInquiry(validInput, deps)).resolves.toEqual({
      status: 'duplicate',
    })

    for (const index of [2, 3, 4, 5, 6]) {
      await submitInquiry(
        {
          ...validInput,
          clientToken: `test-token-${index}`,
          email: `buyer-${index}@example.com`,
        },
        deps,
      )
    }

    await expect(
      submitInquiry(
        {
          ...validInput,
          clientToken: 'test-token-7',
          email: 'buyer-7@example.com',
        },
        deps,
      ),
    ).resolves.toEqual({
      status: 'rate-limited',
    })
  })
})
