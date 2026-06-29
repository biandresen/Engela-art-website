import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { z } from 'zod'

import { env } from '#/env'
import { getPublicContactEmail } from '#/lib/contact-email'
import {
  TransactionalEmailConfigurationError,
  createTransactionalEmailConfiguration,
} from '#/lib/integrations/email'
import { createErrorMonitoringAdapter } from '#/lib/integrations/runtime'
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
      const emailConfiguration = createEmailConfiguration()
      const result = await submitInquiry(input, {
        email: emailConfiguration.email,
        rateLimiter,
        now: () => new Date(),
        receiverEmail: emailConfiguration.receiverEmail,
        senderEmail: emailConfiguration.senderEmail,
        publicContactEmail: getPublicContactEmail(),
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
      if (error instanceof TransactionalEmailConfigurationError) {
        void monitoring
          .captureException({
            error,
            area: 'inquiry',
            operation: 'configure-transactional-email',
            inquiry: {
              locale: data.locale,
              type: data.type,
              painting: data.painting,
            },
          })
          .catch(() => undefined)

        return {
          status: 'delivery-error',
          reason: 'artist-notification-failed',
        }
      }

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

function createEmailConfiguration() {
  return createTransactionalEmailConfiguration({
    deployContext: env.CONTEXT ?? 'dev',
    requestedMode: env.INTEGRATIONS_MODE,
    apiKey: env.EMAIL_PROVIDER_API_KEY,
    receiverEmail: env.INQUIRY_RECEIVER_EMAIL,
    senderEmail: env.INQUIRY_SENDER_EMAIL,
  })
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
