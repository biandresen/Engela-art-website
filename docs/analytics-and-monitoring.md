# Analytics and Monitoring Operations

## Runtime Boundaries

Application code emits analytics and monitoring through local interfaces in
`src/lib/integrations/`. Route and component code must not import PostHog or
Sentry directly.

Production analytics uses PostHog EU ingestion only when both of these are true:

- `CONTEXT=production`
- `INTEGRATIONS_MODE=production`

All deploy previews, branch deploys, local development, tests, and unknown
contexts use safe no-op or recording adapters. Production PostHog capture uses
an anonymous aggregate identity, disables person profiles, and sends only the
allowlisted event fields.

Production monitoring uses Sentry only under the same production gate. Monitoring
payloads are scrubbed before provider submission. Form values, direct
identifiers, cookies, authorization data, tokens, and inquiry query references
must not leave the local monitoring interface.

## Three-Month Funnel Review

Review launch performance with aggregate counts rather than person-level
tracking. Useful PostHog summaries include:

- language selections
- gallery filter and sort usage
- painting detail views by public painting reference
- inquiry starts by category
- successful inquiry submissions by category
- outbound business email, Instagram, and Facebook clicks

Compare those totals with the private operations register only at an aggregate
level, for example:

- qualified inquiry count
- reservation count
- completed sale count
- commission discussion count

Do not export inquiry names, email addresses, phone numbers, message text, exact
interest-list membership, or custom budget text into analytics. Do not join
PostHog events to email threads, spreadsheet rows, invoices, or personal buyer
records. The review question is whether the public journey produces qualified
interest, not which anonymous event belongs to which person.

Use Sentry separately as a reliability signal. Review error frequency, affected
route or operation, and whether failures cluster around inquiry submission,
painting browsing, or deployment configuration. Do not paste raw buyer messages
or personal contact details into Sentry issues or GitHub follow-up issues.
