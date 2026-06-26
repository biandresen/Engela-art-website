import { z } from 'zod'

import type { TransactionalEmailAdapter } from '#/lib/integrations/email'
import { paintingCatalog } from '#/local-db/paintings'
import type { Locale } from '#/lib/i18n/locale'
import type { PaintingStatus } from '#/lib/paintings/types'

export type InquiryType =
  | 'general'
  | 'painting'
  | 'interest-list'
  | 'similar-work'
  | 'commission'

export type InquirySubmissionInput = {
  locale: Locale
  type?: string
  painting?: string
  name: string
  email: string
  phone?: string
  message: string
  website?: string
  loadedAt: string
  submittedAt?: string
  clientToken: string
  clientKey: string
}

export type InquiryFieldErrors = Partial<
  Record<'name' | 'email' | 'phone' | 'message', string>
>

export type InquirySubmissionResult =
  | {
      status: 'success'
      acknowledgement: 'sent' | 'delayed'
      inquiryType: InquiryType
      paintingSlug?: string
    }
  | {
      status: 'validation-error'
      fieldErrors: InquiryFieldErrors
    }
  | {
      status: 'delivery-error'
      reason: 'artist-notification-failed'
    }
  | {
      status: 'rejected' | 'duplicate' | 'rate-limited'
    }

export type InquirySubmissionDependencies = {
  email: TransactionalEmailAdapter
  rateLimiter: InquiryRateLimiter
  now: () => Date
  receiverEmail: string
  senderEmail: string
}

export type ResolvedInquiryContext = {
  inquiryType: InquiryType
  paintingSlug?: string
  title: string
  prefill: string
  fallbackNotice?: string
}

export type InquiryRateLimiter = ReturnType<typeof createInquiryRateLimiter>

const minimumSubmissionMs = 3000
const rateWindowMs = 60_000
const maxSubmissionsPerWindow = 6

const validInquiryTypes = new Set<InquiryType>([
  'general',
  'painting',
  'interest-list',
  'similar-work',
  'commission',
])

const submissionSchema = z.object({
  locale: z.enum(['no', 'en']),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(1).max(4000),
  clientToken: z.string().trim().min(1).max(200),
  clientKey: z.string().trim().min(1).max(200),
  loadedAt: z.string().datetime(),
  submittedAt: z.string().datetime().optional(),
})

export function createInquiryRateLimiter() {
  const submissionsByClient = new Map<string, Array<number>>()
  const seenTokens = new Set<string>()

  return {
    check({
      clientKey,
      clientToken,
      submittedAt,
    }: {
      clientKey: string
      clientToken: string
      submittedAt: Date
    }): 'accepted' | 'duplicate' | 'rate-limited' {
      if (seenTokens.has(clientToken)) {
        return 'duplicate'
      }

      const threshold = submittedAt.getTime() - rateWindowMs
      const recent = (submissionsByClient.get(clientKey) ?? []).filter(
        (timestamp) => timestamp >= threshold,
      )

      if (recent.length >= maxSubmissionsPerWindow) {
        submissionsByClient.set(clientKey, recent)
        return 'rate-limited'
      }

      recent.push(submittedAt.getTime())
      submissionsByClient.set(clientKey, recent)

      return 'accepted'
    },
    recordSuccess(clientToken: string): void {
      seenTokens.add(clientToken)
    },
  }
}

export async function submitInquiry(
  input: InquirySubmissionInput,
  dependencies: InquirySubmissionDependencies,
): Promise<InquirySubmissionResult> {
  if (input.website?.trim()) {
    return { status: 'rejected' }
  }

  const submittedAt = input.submittedAt ?? dependencies.now().toISOString()
  const validation = submissionSchema.safeParse({ ...input, submittedAt })

  if (!validation.success) {
    return {
      status: 'validation-error',
      fieldErrors: mapFieldErrors(validation.error),
    }
  }

  const loadedAtTime = Date.parse(validation.data.loadedAt)
  const submittedAtDate = new Date(submittedAt)
  if (submittedAtDate.getTime() - loadedAtTime < minimumSubmissionMs) {
    return { status: 'rejected' }
  }

  const rateLimit = dependencies.rateLimiter.check({
    clientKey: validation.data.clientKey,
    clientToken: validation.data.clientToken,
    submittedAt: submittedAtDate,
  })

  if (rateLimit !== 'accepted') {
    return { status: rateLimit }
  }

  const context = resolveInquiryContext({
    locale: validation.data.locale,
    type: input.type,
    painting: input.painting,
  })

  const artistMessage = createArtistNotification({
    input: validation.data,
    context,
    submittedAt,
    receiverEmail: dependencies.receiverEmail,
    senderEmail: dependencies.senderEmail,
  })

  try {
    const artistResult = await dependencies.email.send(artistMessage)
    if (artistResult.status !== 'accepted') {
      return {
        status: 'delivery-error',
        reason: 'artist-notification-failed',
      }
    }
  } catch {
    return {
      status: 'delivery-error',
      reason: 'artist-notification-failed',
    }
  }

  try {
    const acknowledgementResult = await dependencies.email.send(
      createBuyerAcknowledgement({
        input: validation.data,
        context,
        submittedAt,
        senderEmail: dependencies.senderEmail,
      }),
    )
    if (acknowledgementResult.status !== 'accepted') {
      dependencies.rateLimiter.recordSuccess(validation.data.clientToken)
      return {
        status: 'success',
        acknowledgement: 'delayed',
        inquiryType: context.inquiryType,
        paintingSlug: context.paintingSlug,
      }
    }
  } catch {
    dependencies.rateLimiter.recordSuccess(validation.data.clientToken)
    return {
      status: 'success',
      acknowledgement: 'delayed',
      inquiryType: context.inquiryType,
      paintingSlug: context.paintingSlug,
    }
  }

  dependencies.rateLimiter.recordSuccess(validation.data.clientToken)

  return {
    status: 'success',
    acknowledgement: 'sent',
    inquiryType: context.inquiryType,
    paintingSlug: context.paintingSlug,
  }
}

export function resolveInquiryContext({
  locale,
  type,
  painting,
}: {
  locale: Locale
  type?: string
  painting?: string
}): ResolvedInquiryContext {
  const requestedType =
    type && validInquiryTypes.has(type as InquiryType)
      ? (type as InquiryType)
      : 'general'
  const resolvedPainting = painting ? paintingCatalog.getBySlug(painting) : null
  const needsPainting = isPaintingInquiryType(requestedType)

  if (needsPainting && !resolvedPainting) {
    return {
      inquiryType: 'general',
      title: labels[locale].generalTitle,
      prefill: labels[locale].generalPrefill,
      fallbackNotice: labels[locale].fallbackNotice,
    }
  }

  if (requestedType === 'general' || requestedType === 'commission') {
    return {
      inquiryType: requestedType === 'commission' ? 'commission' : 'general',
      title:
        requestedType === 'commission'
          ? labels[locale].commissionTitle
          : labels[locale].generalTitle,
      prefill:
        requestedType === 'commission'
          ? labels[locale].commissionPrefill
          : labels[locale].generalPrefill,
    }
  }

  if (!resolvedPainting) {
    return {
      inquiryType: 'general',
      title: labels[locale].generalTitle,
      prefill: labels[locale].generalPrefill,
    }
  }

  const paintingReference = `${resolvedPainting.title} (${resolvedPainting.paintingId})`
  const inquiryType = getInquiryTypeForPaintingStatus(resolvedPainting.status)

  return {
    inquiryType,
    paintingSlug: resolvedPainting.slug,
    title: labels[locale].contextTitles[inquiryType],
    prefill: labels[locale].prefill(inquiryType, paintingReference),
  }
}

function isPaintingInquiryType(
  inquiryType: InquiryType,
): inquiryType is 'painting' | 'interest-list' | 'similar-work' {
  return (
    inquiryType === 'painting' ||
    inquiryType === 'interest-list' ||
    inquiryType === 'similar-work'
  )
}

export function getInquiryTypeForPaintingStatus(
  status: PaintingStatus,
): 'painting' | 'interest-list' | 'similar-work' {
  if (status === 'available') {
    return 'painting'
  }

  if (status === 'reserved') {
    return 'interest-list'
  }

  return 'similar-work'
}

function mapFieldErrors(error: z.ZodError): InquiryFieldErrors {
  const fieldErrors: InquiryFieldErrors = {}

  for (const issue of error.issues) {
    const field = issue.path[0]
    if (
      field === 'name' ||
      field === 'email' ||
      field === 'phone' ||
      field === 'message'
    ) {
      fieldErrors[field] = issue.message
    }
  }

  return fieldErrors
}

function createArtistNotification({
  input,
  context,
  submittedAt,
  receiverEmail,
  senderEmail,
}: {
  input: z.infer<typeof submissionSchema>
  context: ResolvedInquiryContext
  submittedAt: string
  receiverEmail: string
  senderEmail: string
}) {
  const painting = context.paintingSlug
    ? paintingCatalog.getBySlug(context.paintingSlug)
    : undefined
  const subject = painting
    ? `Engela Art ${context.inquiryType} inquiry: ${painting.title}`
    : `Engela Art ${context.inquiryType} inquiry`
  const paintingLines = painting
    ? [
        `Painting: ${painting.title}`,
        `Painting ID: ${painting.paintingId}`,
        `Painting slug: ${painting.slug}`,
        `Status: ${painting.status}`,
      ]
    : []

  return {
    to: receiverEmail,
    from: senderEmail,
    replyTo: input.email,
    subject,
    text: [
      `Inquiry type: ${context.inquiryType}`,
      `Language: ${input.locale}`,
      `Submitted at: ${submittedAt}`,
      ...paintingLines,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      input.phone ? `Phone: ${input.phone}` : 'Phone: not provided',
      '',
      'Message:',
      input.message,
    ].join('\n'),
  }
}

function createBuyerAcknowledgement({
  input,
  context,
  submittedAt,
  senderEmail,
}: {
  input: z.infer<typeof submissionSchema>
  context: ResolvedInquiryContext
  submittedAt: string
  senderEmail: string
}) {
  const painting = context.paintingSlug
    ? paintingCatalog.getBySlug(context.paintingSlug)
    : undefined
  const reservationText = getAcknowledgementSafetyText(context.inquiryType)

  return {
    to: input.email,
    from: senderEmail,
    subject: 'Engela Art received your inquiry',
    text: [
      `Hello ${input.name},`,
      '',
      'Engela Art has received your inquiry.',
      reservationText,
      'You can expect a personal response within two business days.',
      'Please check spam if the automatic acknowledgement is delayed. If no personal response arrives within two business days, email kontakt@engelaart.no.',
      '',
      painting
        ? `Reference: ${painting.title} (${painting.paintingId})`
        : 'Reference: general inquiry',
      `Submitted at: ${submittedAt}`,
      '',
      'Your message:',
      input.message,
    ].join('\n'),
  }
}

function getAcknowledgementSafetyText(inquiryType: InquiryType): string {
  if (inquiryType === 'painting') {
    return 'This does not reserve the painting. The artist confirms availability before any reservation.'
  }

  if (inquiryType === 'interest-list') {
    return 'This does not reserve or guarantee the painting. Interest-list order uses the server submission time.'
  }

  if (inquiryType === 'similar-work') {
    return 'This does not request an exact reproduction or create an accepted commission.'
  }

  if (inquiryType === 'commission') {
    return 'This does not create an accepted commission. Any commission requires artist review and a written proposal.'
  }

  return 'This does not create a reservation, sale, or accepted commission.'
}

const labels = {
  no: {
    generalTitle: 'Generell henvendelse',
    commissionTitle: 'Forespørsel om bestillingsverk',
    fallbackNotice:
      'Lenken inneholdt en ugyldig eller utdatert referanse, så skjemaet er satt til en generell henvendelse.',
    generalPrefill: 'Hei Engela Art,\n\n',
    commissionPrefill:
      'Hei Engela Art,\n\nJeg ønsker å høre om et mulig bestillingsverk inspirert av Engelas uttrykk.',
    contextTitles: {
      painting: 'Forespørsel om maleri',
      'interest-list': 'Interesseliste',
      'similar-work': 'Lignende arbeid',
    },
    prefill(type: InquiryType, paintingReference: string): string {
      if (type === 'interest-list') {
        return `Hei Engela Art,\n\nJeg ønsker å stå på interesselisten for ${paintingReference}. Jeg forstår at dette ikke reserverer eller garanterer maleriet, og at interessen behandles i rekkefølgen forespørslene mottas med 48 timers svarfrist hvis jeg blir kontaktet.`
      }
      if (type === 'similar-work') {
        return `Hei Engela Art,\n\nJeg er interessert i lignende arbeid med utgangspunkt i ${paintingReference}. Jeg forstår at dette ikke er en forespørsel om en nøyaktig kopi eller et godkjent bestillingsoppdrag.`
      }

      return `Hei Engela Art,\n\nJeg er interessert i ${paintingReference}. Gi meg gjerne beskjed om maleriet er tilgjengelig og hva neste steg er.`
    },
  },
  en: {
    generalTitle: 'General inquiry',
    commissionTitle: 'Commission inquiry',
    fallbackNotice:
      'The link contained an invalid or outdated reference, so the form has fallen back to a general inquiry.',
    generalPrefill: 'Hello Engela Art,\n\n',
    commissionPrefill:
      "Hello Engela Art,\n\nI would like to ask about a possible commission inspired by Engela's work.",
    contextTitles: {
      painting: 'Painting inquiry',
      'interest-list': 'Interest list',
      'similar-work': 'Similar work',
    },
    prefill(type: InquiryType, paintingReference: string): string {
      if (type === 'interest-list') {
        return `Hello Engela Art,\n\nI would like to join the interest list for ${paintingReference}. I understand this does not reserve or guarantee the painting, and that interest is handled in submission order with a 48-hour response window if contacted.`
      }
      if (type === 'similar-work') {
        return `Hello Engela Art,\n\nI am interested in similar work with ${paintingReference} as a reference. I understand this does not request an exact reproduction or create an accepted commission.`
      }

      return `Hello Engela Art,\n\nI am interested in ${paintingReference}. Please let me know whether it is available and what the next steps are.`
    },
  },
} as const
