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
