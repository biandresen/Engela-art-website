export type MonitoringArea = 'browser' | 'server' | 'inquiry'

export type MonitoringOperation =
  | 'render-page'
  | 'submit-inquiry'
  | 'send-artist-notification'
  | 'send-buyer-acknowledgement'

export type UnexpectedErrorReport = {
  error: unknown
  area: MonitoringArea
  operation?: MonitoringOperation
}

export interface ErrorMonitoringAdapter {
  captureException: (report: UnexpectedErrorReport) => void
}

export class NoopErrorMonitoringAdapter implements ErrorMonitoringAdapter {
  captureException(_report: UnexpectedErrorReport): void {}
}

export class RecordingErrorMonitoringAdapter implements ErrorMonitoringAdapter {
  readonly reports: Array<UnexpectedErrorReport> = []

  captureException(report: UnexpectedErrorReport): void {
    this.reports.push({ ...report })
  }
}
