import { defaultPublicContactEmail } from '#/lib/contact-email'

import { resolveIntegrationMode } from './runtime'
import type { DeployContext, IntegrationMode } from './runtime'

export type TransactionalEmailMessage = {
  to: string
  from: string
  replyTo?: string
  subject: string
  text: string
  html?: string
}

export type EmailSendResult =
  | {
      status: 'accepted'
      messageId: string
    }
  | {
      status: 'skipped'
      reason: 'safe-mode'
    }

export interface TransactionalEmailAdapter {
  send: (message: TransactionalEmailMessage) => Promise<EmailSendResult>
}

export type TransactionalEmailConfiguration = {
  email: TransactionalEmailAdapter
  receiverEmail: string
  senderEmail: string
}

export type TransactionalEmailRuntimeConfig = {
  deployContext: DeployContext
  requestedMode: IntegrationMode
  apiKey?: string
  receiverEmail?: string
  senderEmail?: string
}

export class TransactionalEmailConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TransactionalEmailConfigurationError'
  }
}

export class NoopTransactionalEmailAdapter implements TransactionalEmailAdapter {
  async send(_message: TransactionalEmailMessage): Promise<EmailSendResult> {
    return {
      status: 'skipped',
      reason: 'safe-mode',
    }
  }
}

export class RecordingTransactionalEmailAdapter implements TransactionalEmailAdapter {
  readonly messages: Array<TransactionalEmailMessage> = []

  async send(message: TransactionalEmailMessage): Promise<EmailSendResult> {
    this.messages.push({ ...message })

    return {
      status: 'accepted',
      messageId: `recorded-${this.messages.length}`,
    }
  }
}

export class ResendTransactionalEmailAdapter implements TransactionalEmailAdapter {
  constructor(
    private readonly apiKey: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async send(message: TransactionalEmailMessage): Promise<EmailSendResult> {
    const response = await this.fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: message.to,
        from: message.from,
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
    })

    if (!response.ok) {
      throw new Error('Resend rejected transactional email')
    }

    const body = (await response.json()) as { id?: string }

    return {
      status: 'accepted',
      messageId: body.id ?? 'resend-accepted',
    }
  }
}

export function createTransactionalEmailConfiguration({
  deployContext,
  requestedMode,
  apiKey,
  receiverEmail,
  senderEmail,
}: TransactionalEmailRuntimeConfig): TransactionalEmailConfiguration {
  const mode = resolveIntegrationMode({ deployContext, requestedMode })

  if (mode === 'safe') {
    return {
      email: new NoopTransactionalEmailAdapter(),
      receiverEmail: receiverEmail ?? defaultPublicContactEmail,
      senderEmail: senderEmail ?? 'noreply@engelaart.no',
    }
  }

  if (!apiKey || !receiverEmail || !senderEmail) {
    const missing = [
      apiKey ? null : 'EMAIL_PROVIDER_API_KEY',
      receiverEmail ? null : 'INQUIRY_RECEIVER_EMAIL',
      senderEmail ? null : 'INQUIRY_SENDER_EMAIL',
    ].filter(Boolean)

    throw new TransactionalEmailConfigurationError(
      `Production transactional email is missing ${missing.join(', ')}`,
    )
  }

  return {
    email: new ResendTransactionalEmailAdapter(apiKey),
    receiverEmail,
    senderEmail,
  }
}
