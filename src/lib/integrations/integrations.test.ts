import { describe, expect, it } from 'vitest'

import { NoopAnalyticsAdapter, RecordingAnalyticsAdapter } from './analytics'
import {
  NoopTransactionalEmailAdapter,
  RecordingTransactionalEmailAdapter,
} from './email'
import {
  NoopErrorMonitoringAdapter,
  RecordingErrorMonitoringAdapter,
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

    expect(adapter.reports).toEqual([report])
  })
})
