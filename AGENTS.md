# AGENTS.md

This project is a TanStack Start artist portfolio and inquiry-first sales site.

## Project Direction

- Build v1 as a landing page, portfolio, and inquiry flow for original paintings.
- Use TanStack Start, React, TypeScript, Tailwind CSS, and shadcn-style components.
- Use npm, not pnpm or yarn.
- Use managed hosting with Netlify.
- Keep v1 inquiry-first: no database, cart, checkout, payment provider, auth, customer accounts, or admin dashboard.
- Painting content is developer-managed until the workflow proves it needs a CMS or database.

## Before Making Architecture Changes

Read the planning docs in `docs/`:

- `docs/architecture.md`
- `docs/developer-tooling.md`
- `docs/implementation-plan.md`
- `docs/strategy.md`
- `docs/ui-ux/design-system.md`
- `docs/testplan.md`

If a requested change conflicts with those docs, explain the tradeoff before changing direction.

## Coding Rules

- Match existing TanStack Start routing and project conventions.
- Prefer simple, explicit TypeScript.
- Use Tailwind for styling and keep visual decisions aligned with `docs/ui-ux/design-system.md`.
- Use shadcn-style components selectively; do not add a full UI kit.
- Add dependencies only when they solve an actual v1 problem.
- Keep generated output and local caches out of Git.
- Use environment variables for secrets and document names in `.env.example`.

## Verification

Run this before considering implementation work complete:

```bash
npm run verify
```

If that is too broad while actively developing, run the relevant subset and explain what was skipped.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues; external pull requests are not a triage request surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the canonical `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix` labels. See `docs/agents/triage-labels.md`.

### Domain docs

Use the single-context layout with `CONTEXT.md` at the repository root and ADRs in `docs/adr/`. See `docs/agents/domain.md`.
