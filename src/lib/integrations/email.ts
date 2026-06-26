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
  constructor(private readonly apiKey: string) {}

  async send(message: TransactionalEmailMessage): Promise<EmailSendResult> {
    const response = await fetch('https://api.resend.com/emails', {
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
