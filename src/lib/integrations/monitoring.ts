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
  [key: string]: unknown
}

export type ErrorMonitoringResult =
  | {
      status: 'captured'
    }
  | {
      status: 'skipped'
      reason: 'safe-mode'
    }
  | {
      status: 'failed'
    }

export interface ErrorMonitoringAdapter {
  captureException: (
    report: UnexpectedErrorReport,
  ) => Promise<ErrorMonitoringResult>
}

export class NoopErrorMonitoringAdapter implements ErrorMonitoringAdapter {
  async captureException(
    _report: UnexpectedErrorReport,
  ): Promise<ErrorMonitoringResult> {
    return {
      status: 'skipped',
      reason: 'safe-mode',
    }
  }
}

export class RecordingErrorMonitoringAdapter implements ErrorMonitoringAdapter {
  readonly reports: Array<Record<string, unknown>> = []

  async captureException(
    report: UnexpectedErrorReport,
  ): Promise<ErrorMonitoringResult> {
    this.reports.push(scrubMonitoringPayload(report))

    return {
      status: 'captured',
    }
  }
}

export class SentryErrorMonitoringAdapter implements ErrorMonitoringAdapter {
  private readonly dsn: ParsedSentryDsn
  private readonly fetch: typeof fetch

  constructor({
    dsn,
    fetch: fetchImpl = globalThis.fetch,
  }: {
    dsn: string
    fetch?: typeof fetch
  }) {
    this.dsn = parseSentryDsn(dsn)
    this.fetch = fetchImpl
  }

  async captureException(
    report: UnexpectedErrorReport,
  ): Promise<ErrorMonitoringResult> {
    const payload = scrubMonitoringPayload(report)

    try {
      const response = await this.fetch(this.dsn.storeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sentry-Auth': [
            'Sentry sentry_version=7',
            `sentry_client=engela-art/1.0`,
            `sentry_key=${this.dsn.publicKey}`,
          ].join(', '),
        },
        body: JSON.stringify({
          platform: 'javascript',
          level: 'error',
          logger: 'engela-art',
          message: getScrubbedErrorMessage(payload),
          exception: {
            values: [
              {
                type: getScrubbedErrorName(payload),
                value: getScrubbedErrorMessage(payload),
              },
            ],
          },
          extra: payload,
          tags: {
            area: payload.area,
            operation: payload.operation,
          },
        }),
      })

      return response.ok ? { status: 'captured' } : { status: 'failed' }
    } catch {
      return { status: 'failed' }
    }
  }
}

type ParsedSentryDsn = {
  publicKey: string
  storeUrl: string
}

const sensitiveKeyPattern =
  /(^|_|-)(name|email|phone|message|budget|custombudget|token|secret|password|authorization|cookie|set-cookie|clienttoken|website|painting|inquirytype)($|_|-)/i

const sensitiveQueryKeys = new Set([
  'type',
  'painting',
  'name',
  'email',
  'phone',
  'message',
  'budget',
  'customBudget',
  'desiredDimensions',
])

export function scrubMonitoringPayload(
  value: unknown,
): Record<string, unknown> {
  const scrubbed = scrubValue(value)

  return isPlainRecord(scrubbed) ? scrubbed : { value: scrubbed }
}

function scrubValue(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: redactSensitiveText(value.message),
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => scrubValue(item))
  }

  if (!isPlainRecord(value)) {
    return typeof value === 'string' ? redactSensitiveText(value) : value
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      scrubRecordEntry(key, nestedValue),
    ]),
  )
}

function scrubRecordEntry(key: string, value: unknown) {
  if (sensitiveKeyPattern.test(key)) {
    return '[redacted]'
  }

  if (key === 'url' && typeof value === 'string') {
    return scrubUrl(value)
  }

  return scrubValue(value)
}

function scrubUrl(value: string) {
  try {
    const url = new URL(value)

    for (const key of sensitiveQueryKeys) {
      url.searchParams.delete(key)
    }

    return url.toString()
  } catch {
    return redactSensitiveText(value)
  }
}

function redactSensitiveText(value: string) {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/\+?\d[\d ()-]{6,}\d/g, '[redacted-phone]')
}

function getScrubbedErrorName(payload: Record<string, unknown>) {
  const error = payload.error

  return isPlainRecord(error) && typeof error.name === 'string'
    ? error.name
    : 'Error'
}

function getScrubbedErrorMessage(payload: Record<string, unknown>) {
  const error = payload.error

  return isPlainRecord(error) && typeof error.message === 'string'
    ? error.message
    : 'Unexpected error'
}

function parseSentryDsn(dsn: string): ParsedSentryDsn {
  const url = new URL(dsn)
  const publicKey = url.username
  const projectId = url.pathname.replace(/^\/+/, '')

  if (!publicKey || !projectId) {
    throw new Error('Invalid Sentry DSN')
  }

  return {
    publicKey,
    storeUrl: `${url.protocol}//${url.host}/api/${projectId}/store/`,
  }
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}
