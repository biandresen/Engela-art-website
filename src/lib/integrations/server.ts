import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { env } from '#/env'

import { sanitizeAnalyticsEvent } from './analytics'
import type { AnalyticsCaptureResult, AnalyticsEvent } from './analytics'
import { createAnalyticsAdapter } from './runtime'

export const captureAnalyticsServer = createServerFn({ method: 'POST' })
  .validator(z.unknown())
  .handler(async ({ data }): Promise<AnalyticsCaptureResult> => {
    const event = sanitizeAnalyticsEvent(data)

    if (!event) {
      return {
        status: 'skipped',
        reason: 'not-allowlisted',
      }
    }

    return createConfiguredAnalyticsAdapter().capture(event)
  })

export function createConfiguredAnalyticsAdapter() {
  return createAnalyticsAdapter({
    deployContext: env.CONTEXT ?? 'dev',
    requestedMode: env.INTEGRATIONS_MODE,
    postHogApiKey: env.POSTHOG_API_KEY,
    postHogHost: env.POSTHOG_HOST,
  })
}

export async function captureServerAnalyticsEvent(event: AnalyticsEvent) {
  return createConfiguredAnalyticsAdapter().capture(event)
}
