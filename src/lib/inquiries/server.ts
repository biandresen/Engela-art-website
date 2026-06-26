import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { z } from 'zod'

import { env } from '#/env'
import {
  NoopTransactionalEmailAdapter,
  ResendTransactionalEmailAdapter,
} from '#/lib/integrations/email'
import {
  createErrorMonitoringAdapter,
  resolveIntegrationMode,
} from '#/lib/integrations/runtime'
import { createConfiguredAnalyticsAdapter } from '#/lib/integrations/server'

import { createInquiryRateLimiter, submitInquiry } from './inquiry'
import type { InquirySubmissionInput } from './inquiry'

const clientSubmissionSchema = z.object({
  locale: z.enum(['no', 'en']),
  type: z.string().optional(),
  painting: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  desiredDimensions: z.string().optional(),
  budget: z.string().optional(),
  customBudget: z.string().optional(),
  message: z.string(),
  website: z.string().optional(),
  loadedAt: z.string(),
  clientToken: z.string(),
})

const rateLimiter = createInquiryRateLimiter()

export const submitInquiryServer = createServerFn({ method: 'POST' })
  .validator(clientSubmissionSchema)
  .handler(async ({ data }) => {
    const input: InquirySubmissionInput = {
      ...data,
      submittedAt: new Date().toISOString(),
      clientKey: getClientKey(),
    }

    const analytics = createConfiguredAnalyticsAdapter()
    const monitoring = createConfiguredMonitoringAdapter()

    try {
      const result = await submitInquiry(input, {
        email: createEmailAdapter(),
        rateLimiter,
        now: () => new Date(),
        receiverEmail: env.INQUIRY_RECEIVER_EMAIL ?? 'kontakt@engelaart.no',
        senderEmail: env.INQUIRY_SENDER_EMAIL ?? 'noreply@engelaart.no',
      })

      if (result.status === 'success') {
        void analytics
          .capture({
            name: 'inquiry_submitted',
            inquiryType: result.inquiryType,
            language: data.locale,
          })
          .catch(() => undefined)
      }

      if (result.status === 'delivery-error') {
        void monitoring
          .captureException({
            error: new Error(result.reason),
            area: 'inquiry',
            operation: 'send-artist-notification',
            inquiry: {
              locale: data.locale,
              type: data.type,
              painting: data.painting,
            },
          })
          .catch(() => undefined)
      }

      return result
    } catch (error) {
      void monitoring
        .captureException({
          error,
          area: 'server',
          operation: 'submit-inquiry',
          inquiry: {
            locale: data.locale,
            type: data.type,
            painting: data.painting,
          },
        })
        .catch(() => undefined)

      throw error
    }
  })

function createEmailAdapter() {
  const mode = resolveIntegrationMode({
    deployContext: env.CONTEXT ?? 'dev',
    requestedMode: env.INTEGRATIONS_MODE,
  })

  if (mode === 'production' && env.EMAIL_PROVIDER_API_KEY) {
    return new ResendTransactionalEmailAdapter(env.EMAIL_PROVIDER_API_KEY)
  }

  return new NoopTransactionalEmailAdapter()
}

function getClientKey() {
  return (
    getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() ||
    getRequestHeader('x-real-ip') ||
    'unknown-client'
  )
}

function createConfiguredMonitoringAdapter() {
  return createErrorMonitoringAdapter({
    deployContext: env.CONTEXT ?? 'dev',
    requestedMode: env.INTEGRATIONS_MODE,
    sentryDsn: env.SENTRY_DSN,
  })
}
