import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { z } from 'zod'

import { env } from '#/env'
import {
  NoopTransactionalEmailAdapter,
  ResendTransactionalEmailAdapter,
} from '#/lib/integrations/email'
import { resolveIntegrationMode } from '#/lib/integrations/runtime'

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

    return submitInquiry(input, {
      email: createEmailAdapter(),
      rateLimiter,
      now: () => new Date(),
      receiverEmail: env.INQUIRY_RECEIVER_EMAIL ?? 'kontakt@engelaart.no',
      senderEmail: env.INQUIRY_SENDER_EMAIL ?? 'noreply@engelaart.no',
    })
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
