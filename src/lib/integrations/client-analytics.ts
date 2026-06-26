import { sanitizeAnalyticsEvent } from './analytics'
import type { AnalyticsAdapter, AnalyticsEvent } from './analytics'
import { captureAnalyticsServer } from './server'

let activeAnalyticsAdapter: AnalyticsAdapter | null = null

export function configureClientAnalytics(adapter: AnalyticsAdapter) {
  activeAnalyticsAdapter = adapter
}

export function resetClientAnalytics() {
  activeAnalyticsAdapter = null
}

export function captureAnalyticsEvent(event: AnalyticsEvent) {
  const sanitized = sanitizeAnalyticsEvent(event)

  if (!sanitized) {
    return
  }

  const capture =
    activeAnalyticsAdapter?.capture(sanitized) ??
    captureAnalyticsServer({ data: sanitized })

  void capture.catch(() => undefined)
}
