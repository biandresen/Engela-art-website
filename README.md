# Engela Art Website

Portfolio and inquiry-first sales website for original paintings.

The project uses TanStack Start, React, TypeScript, Tailwind CSS, shadcn-style components, and Netlify deployment.

## Requirements

- Node `>=22.12.0`
- npm

If you use `nvm`:

```bash
nvm install
nvm use
```

## Setup

```bash
npm install
npm run dev
```

The local dev server runs on port `3000` by default.

## Scripts

```bash
npm run dev
npm run generate-routes
npm run lint
npm run check
npm test
npm run build
```

## Project Direction

V1 is intentionally simple:

- Portfolio and landing page experience
- Developer-managed painting data
- Inquiry/contact flow
- No database
- No cart
- No checkout
- No customer accounts

See the planning docs in `docs/` before making major architecture or UI decisions.

## Deployment

The project is configured for Netlify.

```txt
Build command: npm run build
Publish directory: dist/client
```

Custom domains can still be managed in Cloudflare DNS and pointed to Netlify.

## UI Stack

- Tailwind CSS for styling
- shadcn-style components for accessible UI building blocks
- `clsx` and `tailwind-merge` through `cn()` for class composition
- `class-variance-authority` for component variants

## Notes

Run `npm run generate-routes` after changing route files if route generation does not update automatically.
