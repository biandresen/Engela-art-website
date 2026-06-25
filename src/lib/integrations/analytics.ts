export type AnalyticsEvent =
  | {
      name: 'page_viewed'
      page: 'home' | 'gallery' | 'painting' | 'about' | 'contact'
      language: 'no' | 'en'
    }
  | {
      name: 'painting_viewed'
      paintingId: `EA-${number}-${number}`
      language: 'no' | 'en'
    }
  | {
      name: 'inquiry_started' | 'inquiry_submitted'
      inquiryType:
        | 'general'
        | 'painting'
        | 'interest-list'
        | 'similar-work'
        | 'commission'
      language: 'no' | 'en'
    }

export interface AnalyticsAdapter {
  capture: (event: AnalyticsEvent) => void
}

export class NoopAnalyticsAdapter implements AnalyticsAdapter {
  capture(_event: AnalyticsEvent): void {}
}

export class RecordingAnalyticsAdapter implements AnalyticsAdapter {
  readonly events: Array<AnalyticsEvent> = []

  capture(event: AnalyticsEvent): void {
    this.events.push({ ...event })
  }
}
