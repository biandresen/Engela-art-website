https://docs.netlify.com

# Canonical domain

Use `engelaart.no` as the production domain. If `engela-art.no` is also purchased, configure it only as a permanent redirect to `https://engelaart.no`.

Before launch:

- Purchase and configure the domain through a Norwegian registrar.
- Connect `engelaart.no` to Netlify.
- Configure `kontakt@engelaart.no` and optional `contact@engelaart.no` aliasing.
- Configure Zoho Mail Free, or Zoho Mail Lite if the free custom-domain plan is unavailable.
- Add Resend SPF and DKIM records.
- Configure SPF, DKIM, and DMARC so Zoho and Resend are authorized without conflicting records.
- Verify HTTPS, canonical URLs, redirects, and both language paths.

## Temporary email before domain setup

Until `engelaart.no` and the dedicated mailbox are purchased and configured, use
a dedicated temporary Engela Art contact address rather than the artist's
personal private email. This keeps the launch implementation realistic while
avoiding hard-coded domain addresses that do not work yet.

Recommended temporary configuration:

| Variable                    | Temporary value                                                                 |
| --------------------------- | ------------------------------------------------------------------------------- |
| `VITE_PUBLIC_CONTACT_EMAIL` | Dedicated temporary public contact address shown on the website.                |
| `INQUIRY_RECEIVER_EMAIL`    | Same dedicated temporary address, or another mailbox checked by the site owner. |
| `INQUIRY_SENDER_EMAIL`      | Resend-approved sender address for the current account setup.                   |
| `EMAIL_PROVIDER_API_KEY`    | Resend API key scoped to transactional email sending.                           |

If Resend is used before domain verification, use only a sender address that
Resend accepts for the account, such as the onboarding sender or another
verified sender allowed by the provider. Test both the artist notification and
buyer acknowledgement with the temporary configuration.

After the domain and mailbox are ready, switch production to:

```txt
VITE_PUBLIC_CONTACT_EMAIL=kontakt@engelaart.no
INQUIRY_RECEIVER_EMAIL=kontakt@engelaart.no
INQUIRY_SENDER_EMAIL=<authenticated engelaart.no transactional sender>
```

Then send a real test inquiry and confirm:

- the artist notification reaches the Engela Art inbox;
- the buyer acknowledgement reaches the submitted buyer email;
- reply-to on the artist notification points to the buyer's submitted email;
- no deploy-preview or branch-deploy environment has production email secrets.

## Deploy previews

Use Netlify deploy previews for pull requests.

Preview environments must:

- Use the safe integration mode configured in `netlify.toml`
- Never receive the production Resend API key or production receiver address
- Disable production analytics and Sentry reporting
- Use preview-safe canonical behavior
- Display a visible non-production indicator when practical

Netlify automatically adds an `X-Robots-Tag: noindex` response header to Deploy
Previews. Verify that header on a real preview before merging changes to preview
configuration.

Only the production deployment receives production email, analytics, monitoring,
and domain configuration. Configure secrets in the Netlify UI and scope them to
the production deploy context. Do not place secret values in `netlify.toml`.

See `docs/analytics-and-monitoring.md` for the production analytics and
monitoring operating rules, including the three-month aggregate funnel review.

The application resolves integrations defensively:

- `production` context plus `INTEGRATIONS_MODE=production` enables production
  adapters once they are implemented.
- Every other combination uses safe no-op or recording adapters.
- An unknown or missing deploy context is safe by default.

This means an accidentally misconfigured preview cannot enable production
integrations merely by receiving `INTEGRATIONS_MODE=production`.

## Environment variables

Copy `.env.example` to `.env.local` for local development. Keep
`INTEGRATIONS_MODE=safe`; local development and automated tests must not contact
live providers.

| Variable                    | Responsibility                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `SITE_URL`                  | Canonical application origin. Production is `https://engelaart.no`.                          |
| `CONTEXT`                   | Netlify deploy context. Local development uses `dev`.                                        |
| `INTEGRATIONS_MODE`         | Requests safe or production adapters. Production still requires a production deploy context. |
| `VITE_PUBLIC_CONTACT_EMAIL` | Public fallback contact address shown in the site UI and buyer acknowledgement.              |
| `INQUIRY_RECEIVER_EMAIL`    | Production Engela Art inbox receiving inquiries.                                             |
| `INQUIRY_SENDER_EMAIL`      | Authenticated `engelaart.no` sender used for transactional email.                            |
| `EMAIL_PROVIDER_API_KEY`    | Production Resend credential.                                                                |
| `POSTHOG_API_KEY`           | Production PostHog project credential.                                                       |
| `POSTHOG_HOST`              | PostHog EU ingestion host.                                                                   |
| `SENTRY_DSN`                | Production Sentry project DSN.                                                               |

Production credentials belong in Netlify's environment-variable settings with
production-only scope. Preview, branch-deploy, and local contexts receive none of
these credentials.

## Publishing authority

- Development changes use pull requests and Netlify deploy previews.
- The developer approves and merges changes to `main`.
- Required GitHub Actions verification passes before merge.
- Netlify deploys production from `main`.
- The artist approves artwork selection, images, prices, statuses, Norwegian copy, sales policies, and public business details.
- The developer approves English translations, technical verification, privacy configuration, and release readiness.

A successful preview is not production approval. Do not merge launch-sensitive content until both owners have approved their areas.
