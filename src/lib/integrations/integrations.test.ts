import { describe, expect, it } from 'vitest'

import {
  NoopAnalyticsAdapter,
  PostHogAnalyticsAdapter,
  RecordingAnalyticsAdapter,
  buildPostHogBrowserConfig,
  sanitizeAnalyticsEvent,
} from './analytics'
import {
  NoopTransactionalEmailAdapter,
  RecordingTransactionalEmailAdapter,
  ResendTransactionalEmailAdapter,
  TransactionalEmailConfigurationError,
  createTransactionalEmailConfiguration,
} from './email'
import {
  SentryErrorMonitoringAdapter,
  NoopErrorMonitoringAdapter,
  RecordingErrorMonitoringAdapter,
  scrubMonitoringPayload,
} from './monitoring'
import { resolveIntegrationMode } from './runtime'

describe('integration runtime safety', () => {
  it.each(['deploy-preview', 'branch-deploy', 'dev', 'unknown'] as const)(
    'keeps %s deployments safe',
    (deployContext) => {
      expect(
        resolveIntegrationMode({
          deployContext,
          requestedMode: 'production',
        }),
      ).toBe('safe')
    },
  )

  it('enables production integrations only for an explicit production deployment', () => {
    expect(
      resolveIntegrationMode({
        deployContext: 'production',
        requestedMode: 'production',
      }),
    ).toBe('production')
  })
})

describe('transactional email adapters', () => {
  const message = {
    to: 'buyer@example.com',
    from: 'contact@example.com',
    subject: 'Inquiry received',
    text: 'Thank you for your inquiry.',
  }

  it('does not claim delivery from the safe no-op adapter', async () => {
    const adapter = new NoopTransactionalEmailAdapter()

    await expect(adapter.send(message)).resolves.toEqual({
      status: 'skipped',
      reason: 'safe-mode',
    })
  })

  it('records messages without using a live provider', async () => {
    const adapter = new RecordingTransactionalEmailAdapter()

    await expect(adapter.send(message)).resolves.toEqual({
      status: 'accepted',
      messageId: 'recorded-1',
    })
    expect(adapter.messages).toEqual([message])
  })

  it('keeps transactional email in no-op mode outside production context', () => {
    const configuration = createTransactionalEmailConfiguration({
      deployContext: 'deploy-preview',
      requestedMode: 'production',
      apiKey: 'provider-key',
      receiverEmail: 'temporary-receiver@example.com',
      senderEmail: 'onboarding@resend.dev',
    })

    expect(configuration.email).toBeInstanceOf(NoopTransactionalEmailAdapter)
    expect(configuration.receiverEmail).toBe('temporary-receiver@example.com')
    expect(configuration.senderEmail).toBe('onboarding@resend.dev')
  })

  it('requires all transactional email settings in production mode', () => {
    expect(() =>
      createTransactionalEmailConfiguration({
        deployContext: 'production',
        requestedMode: 'production',
        apiKey: 'provider-key',
        receiverEmail: 'temporary-receiver@example.com',
      }),
    ).toThrow(TransactionalEmailConfigurationError)
  })

  it('configures the Resend request payload for accepted provider delivery', async () => {
    const requests: Array<{
      url: string
      body: unknown
      authorization: string
    }> = []
    const adapter = new ResendTransactionalEmailAdapter(
      'provider-key',
      async (url, init) => {
        requests.push({
          url: String(url),
          body: JSON.parse(String(init?.body)),
          authorization: String(
            (init?.headers as Record<string, string>).Authorization,
          ),
        })

        return new Response(JSON.stringify({ id: 'resend-message-id' }), {
          status: 200,
        })
      },
    )

    await expect(
      adapter.send({
        ...message,
        replyTo: 'buyer@example.com',
      }),
    ).resolves.toEqual({
      status: 'accepted',
      messageId: 'resend-message-id',
    })
    expect(requests).toEqual([
      {
        url: 'https://api.resend.com/emails',
        authorization: 'Bearer provider-key',
        body: {
          to: 'buyer@example.com',
          from: 'contact@example.com',
          reply_to: 'buyer@example.com',
          subject: 'Inquiry received',
          text: 'Thank you for your inquiry.',
        },
      },
    ])
  })
})

describe('analytics adapters', () => {
  const event = {
    name: 'inquiry_submitted',
    inquiryType: 'painting',
    language: 'en',
  } as const

  it('accepts allowlisted events without reporting them in safe mode', () => {
    const adapter = new NoopAnalyticsAdapter()

    expect(() => adapter.capture(event)).not.toThrow()
  })

  it('records allowlisted events for automated tests', () => {
    const adapter = new RecordingAnalyticsAdapter()

    adapter.capture(event)

    expect(adapter.events).toEqual([event])
  })

  it('keeps only the approved analytics vocabulary and safe properties', () => {
    const unsafeEvent = {
      name: 'inquiry_submitted',
      inquiryType: 'painting',
      language: 'en',
      email: 'buyer@example.com',
      message: 'I want to buy this painting.',
      customBudget: 'My private budget is NOK 8,500.',
    }

    expect(sanitizeAnalyticsEvent(unsafeEvent)).toEqual(event)
  })

  it('rejects unknown analytics events before they reach a provider', () => {
    expect(
      sanitizeAnalyticsEvent({
        name: 'form_field_changed',
        field: 'email',
        value: 'buyer@example.com',
      }),
    ).toBeNull()
  })

  it('configures PostHog for EU cookieless aggregate capture', () => {
    expect(buildPostHogBrowserConfig('project-key')).toEqual({
      apiKey: 'project-key',
      apiHost: 'https://eu.i.posthog.com',
      autocapture: false,
      capturePageview: false,
      capturePageleave: false,
      disableSessionRecording: true,
      persistence: 'memory',
      personProfiles: 'never',
      advancedDisableSurveys: true,
    })
  })

  it('sends sanitized allowlisted events to PostHog without persistent identity', async () => {
    const requests: Array<{ url: string; body: unknown }> = []
    const adapter = new PostHogAnalyticsAdapter({
      apiKey: 'project-key',
      host: 'https://eu.i.posthog.com',
      fetch: async (url, init) => {
        requests.push({
          url: String(url),
          body: JSON.parse(String(init?.body)),
        })

        return new Response('{}', { status: 200 })
      },
    })

    await adapter.capture({
      ...event,
      email: 'buyer@example.com',
    } as never)

    expect(requests).toEqual([
      {
        url: 'https://eu.i.posthog.com/capture/',
        body: {
          api_key: 'project-key',
          event: 'inquiry_submitted',
          distinct_id: 'anonymous-aggregate',
          properties: {
            inquiryType: 'painting',
            language: 'en',
            $process_person_profile: false,
          },
        },
      },
    ])
  })
})

describe('error monitoring adapters', () => {
  const report = {
    error: new Error('Unexpected failure'),
    area: 'server',
    operation: 'render-page',
  } as const

  it('ignores reports in safe mode', () => {
    const adapter = new NoopErrorMonitoringAdapter()

    expect(() => adapter.captureException(report)).not.toThrow()
  })

  it('records reports for automated tests', () => {
    const adapter = new RecordingErrorMonitoringAdapter()

    adapter.captureException(report)

    expect(adapter.reports).toEqual([
      {
        error: {
          name: 'Error',
          message: 'Unexpected failure',
        },
        area: 'server',
        operation: 'render-page',
      },
    ])
  })

  it('scrubs form values, direct identifiers, cookies, auth, and inquiry query values', () => {
    expect(
      scrubMonitoringPayload({
        error: new Error('Failed for buyer@example.com'),
        area: 'server',
        operation: 'submit-inquiry',
        form: {
          name: 'Buyer Name',
          email: 'buyer@example.com',
          phone: '+47 400 00 000',
          message: 'Private inquiry text',
          customBudget: 'NOK 8,500',
        },
        request: {
          url: 'https://engelaart.no/en/contact?type=painting&painting=sommer',
          headers: {
            cookie: 'language=en',
            authorization: 'Bearer secret',
            accept: 'text/html',
          },
        },
      }),
    ).toEqual({
      error: {
        name: 'Error',
        message: 'Failed for [redacted-email]',
      },
      area: 'server',
      operation: 'submit-inquiry',
      form: {
        name: '[redacted]',
        email: '[redacted]',
        phone: '[redacted]',
        message: '[redacted]',
        customBudget: '[redacted]',
      },
      request: {
        url: 'https://engelaart.no/en/contact',
        headers: {
          cookie: '[redacted]',
          authorization: '[redacted]',
          accept: 'text/html',
        },
      },
    })
  })

  it('isolates Sentry provider failures from application flow', async () => {
    const adapter = new SentryErrorMonitoringAdapter({
      dsn: 'https://public@example.com/123',
      fetch: async () => new Response('rejected', { status: 500 }),
    })

    await expect(adapter.captureException(report)).resolves.toEqual({
      status: 'failed',
    })
  })
})
