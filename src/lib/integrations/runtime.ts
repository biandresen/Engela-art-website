import { NoopAnalyticsAdapter, PostHogAnalyticsAdapter } from './analytics'
import type { AnalyticsAdapter } from './analytics'
import {
  NoopErrorMonitoringAdapter,
  SentryErrorMonitoringAdapter,
} from './monitoring'
import type { ErrorMonitoringAdapter } from './monitoring'

export type DeployContext =
  | 'production'
  | 'deploy-preview'
  | 'branch-deploy'
  | 'dev'
  | 'unknown'

export type IntegrationMode = 'safe' | 'production'

type IntegrationRuntime = {
  deployContext: DeployContext
  requestedMode: IntegrationMode
}

/**
 * Production integrations require two independent signals. Any preview, local,
 * test, or unknown context remains safe even if its mode is misconfigured.
 */
export function resolveIntegrationMode({
  deployContext,
  requestedMode,
}: IntegrationRuntime): IntegrationMode {
  return deployContext === 'production' && requestedMode === 'production'
    ? 'production'
    : 'safe'
}

export function createAnalyticsAdapter({
  deployContext,
  requestedMode,
  postHogApiKey,
  postHogHost,
}: IntegrationRuntime & {
  postHogApiKey?: string
  postHogHost?: string
}): AnalyticsAdapter {
  const mode = resolveIntegrationMode({ deployContext, requestedMode })

  if (mode === 'production' && postHogApiKey) {
    return new PostHogAnalyticsAdapter({
      apiKey: postHogApiKey,
      host: postHogHost,
    })
  }

  return new NoopAnalyticsAdapter()
}

export function createErrorMonitoringAdapter({
  deployContext,
  requestedMode,
  sentryDsn,
}: IntegrationRuntime & {
  sentryDsn?: string
}): ErrorMonitoringAdapter {
  const mode = resolveIntegrationMode({ deployContext, requestedMode })

  if (mode === 'production' && sentryDsn) {
    return new SentryErrorMonitoringAdapter({ dsn: sentryDsn })
  }

  return new NoopErrorMonitoringAdapter()
}
