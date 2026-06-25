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

## Deploy previews

Use Netlify deploy previews for pull requests.

Preview environments must:

- Use a recording/fake email adapter or a dedicated test inbox
- Never receive the production Resend API key or production receiver address
- Disable production analytics or route it to a separate test site
- Disable production Sentry reporting or use a distinct preview environment
- Use preview-safe canonical and robots behavior so preview URLs are not indexed
- Display a visible non-production indicator when practical

Only the production deployment receives production email, analytics, monitoring, and domain configuration.

## Publishing authority

- Development changes use pull requests and Netlify deploy previews.
- The developer approves and merges changes to `main`.
- Required GitHub Actions verification passes before merge.
- Netlify deploys production from `main`.
- The artist approves artwork selection, images, prices, statuses, Norwegian copy, sales policies, and public business details.
- The developer approves English translations, technical verification, privacy configuration, and release readiness.

A successful preview is not production approval. Do not merge launch-sensitive content until both owners have approved their areas.
