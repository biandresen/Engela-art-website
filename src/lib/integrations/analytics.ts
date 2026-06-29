import { z } from 'zod'

import type { Locale } from '#/lib/i18n/locale'
import type { InquiryType } from '#/lib/inquiries/inquiry'
import type { PaintingStatus } from '#/lib/paintings/types'

type AnalyticsFetch = typeof fetch

export type AnalyticsEvent =
  | {
      name: 'page_viewed'
      page:
        | 'home'
        | 'gallery'
        | 'painting'
        | 'commissions'
        | 'about'
        | 'contact'
        | 'privacy'
        | 'sales-and-returns'
        | 'not-found'
      language: Locale
    }
  | {
      name: 'painting_viewed'
      paintingId: `EA-${number}-${string}`
      paintingSlug: string
      status: PaintingStatus
      language: Locale
    }
  | {
      name: 'inquiry_started' | 'inquiry_submitted'
      inquiryType: InquiryType
      language: Locale
    }
  | {
      name: 'language_selected'
      from: Locale
      to: Locale
    }
  | {
      name: 'gallery_controls_changed'
      language: Locale
      status: 'all' | PaintingStatus
      orientation: 'all' | 'landscape' | 'portrait' | 'square'
      sort:
        | 'year-desc'
        | 'year-asc'
        | 'area-desc'
        | 'area-asc'
        | 'price-desc'
        | 'price-asc'
    }
  | {
      name: 'outbound_link_clicked'
      language: Locale
      destination: 'email' | 'instagram'
    }

export type AnalyticsCaptureResult =
  | {
      status: 'captured'
    }
  | {
      status: 'skipped'
      reason: 'safe-mode' | 'not-allowlisted'
    }
  | {
      status: 'failed'
    }

export interface AnalyticsAdapter {
  capture: (event: AnalyticsEvent) => Promise<AnalyticsCaptureResult>
}

export class NoopAnalyticsAdapter implements AnalyticsAdapter {
  async capture(_event: AnalyticsEvent): Promise<AnalyticsCaptureResult> {
    return {
      status: 'skipped',
      reason: 'safe-mode',
    }
  }
}

export class RecordingAnalyticsAdapter implements AnalyticsAdapter {
  readonly events: Array<AnalyticsEvent> = []

  async capture(event: AnalyticsEvent): Promise<AnalyticsCaptureResult> {
    const sanitized = sanitizeAnalyticsEvent(event)

    if (!sanitized) {
      return {
        status: 'skipped',
        reason: 'not-allowlisted',
      }
    }

    this.events.push(sanitized)

    return {
      status: 'captured',
    }
  }
}

export class PostHogAnalyticsAdapter implements AnalyticsAdapter {
  private readonly apiKey: string
  private readonly host: string
  private readonly fetch: AnalyticsFetch

  constructor({
    apiKey,
    host = 'https://eu.i.posthog.com',
    fetch: fetchImpl = globalThis.fetch,
  }: {
    apiKey: string
    host?: string
    fetch?: AnalyticsFetch
  }) {
    this.apiKey = apiKey
    this.host = host.replace(/\/$/, '')
    this.fetch = fetchImpl
  }

  async capture(event: AnalyticsEvent): Promise<AnalyticsCaptureResult> {
    const sanitized = sanitizeAnalyticsEvent(event)

    if (!sanitized) {
      return {
        status: 'skipped',
        reason: 'not-allowlisted',
      }
    }

    try {
      const response = await this.fetch(`${this.host}/capture/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          event: sanitized.name,
          distinct_id: 'anonymous-aggregate',
          properties: {
            ...toPostHogProperties(sanitized),
            $process_person_profile: false,
          },
        }),
      })

      return response.ok ? { status: 'captured' } : { status: 'failed' }
    } catch {
      return { status: 'failed' }
    }
  }
}

const localeSchema = z.enum(['no', 'en'])
const inquiryTypeSchema = z.enum([
  'general',
  'painting',
  'interest-list',
  'similar-work',
  'commission',
])
const paintingStatusSchema = z.enum(['available', 'reserved', 'sold'])
const orientationSchema = z.enum(['all', 'landscape', 'portrait', 'square'])
const sortSchema = z.enum([
  'year-desc',
  'year-asc',
  'area-desc',
  'area-asc',
  'price-desc',
  'price-asc',
])

const analyticsEventSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('page_viewed'),
    page: z.enum([
      'home',
      'gallery',
      'painting',
      'commissions',
      'about',
      'contact',
      'privacy',
      'sales-and-returns',
      'not-found',
    ]),
    language: localeSchema,
  }),
  z.object({
    name: z.literal('painting_viewed'),
    paintingId: z.custom<`EA-${number}-${string}`>((value) =>
      /^EA-\d{4}-\d{3}$/.test(String(value)),
    ),
    paintingSlug: z.string().min(1).max(120),
    status: paintingStatusSchema,
    language: localeSchema,
  }),
  z.object({
    name: z.enum(['inquiry_started', 'inquiry_submitted']),
    inquiryType: inquiryTypeSchema,
    language: localeSchema,
  }),
  z.object({
    name: z.literal('language_selected'),
    from: localeSchema,
    to: localeSchema,
  }),
  z.object({
    name: z.literal('gallery_controls_changed'),
    language: localeSchema,
    status: z.union([z.literal('all'), paintingStatusSchema]),
    orientation: orientationSchema,
    sort: sortSchema,
  }),
  z.object({
    name: z.literal('outbound_link_clicked'),
    language: localeSchema,
    destination: z.enum(['email', 'instagram']),
  }),
])

export function sanitizeAnalyticsEvent(event: unknown): AnalyticsEvent | null {
  const result = analyticsEventSchema.safeParse(event)

  return result.success ? result.data : null
}

export function buildPostHogBrowserConfig(
  apiKey: string,
  apiHost = 'https://eu.i.posthog.com',
) {
  return {
    apiKey,
    apiHost,
    autocapture: false,
    capturePageview: false,
    capturePageleave: false,
    disableSessionRecording: true,
    persistence: 'memory',
    personProfiles: 'never',
    advancedDisableSurveys: true,
  } as const
}

function toPostHogProperties(event: AnalyticsEvent) {
  const { name: _name, ...properties } = event

  return properties
}
