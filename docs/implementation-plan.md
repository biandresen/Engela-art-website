# Implementation Plan: TanStack Start V1

## Build Principle

Build the smallest professional version that supports the real buyer journey:

```txt
discover artist -> browse paintings -> inspect one painting -> send inquiry
```

Each phase should be committed separately. Small commits make it easier to review, debug, and roll back changes.

## Phase 1: Project Setup

1. Initialize a TanStack Start project with React and TypeScript.
2. Confirm the app runs locally.
3. Add basic scripts for development, build, preview, linting, and tests.
4. Add formatting/linting tools only if they fit the generated project structure.
5. Add a short README section with setup commands.

Expected result:

- The app starts locally.
- The project has predictable commands for development and verification.

Suggested commit:

```txt
Initialize TanStack Start app
```

## Phase 2: Routing Structure

Create the public route structure:

```txt
/
/no/malerier
/no/malerier/$slug
/no/bestillingsverk
/no/om
/no/kontakt
/no/personvern
/no/salg-og-retur
/en/paintings
/en/paintings/$slug
/en/commissions
/en/about
/en/contact
/en/privacy
/en/sales-and-returns
```

Also prepare:

- Not-found route/state
- Shared root layout
- Navigation between main pages

Expected result:

- Every planned page exists.
- Navigation works before detailed UI is built.

Suggested commit:

```txt
Add public route structure
```

## Phase 3: Painting Data Model

Define a structured painting model and sample records.

Required fields:

- immutable painting ID
- title
- slug
- bilingual medium
- bilingual visual summary
- optional bilingual artist note
- numeric width, height, and depth
- creation year
- listed price in NOK
- status
- straight-on and room-context images with bilingual alt text
- featured flag and order when selected
- care profiles and optional exceptional care note

Add helper functions:

- get all paintings
- get featured paintings
- get painting by slug
- derive orientation and total area
- filter and sort paintings from validated URL state

Expected result:

- Pages can read painting data from one source of truth.
- Invalid IDs, duplicate slugs, missing translations, invalid measurements, missing image roles, and featured-order conflicts are caught by validation tests.
- Public painting images are generated as responsive watermarked derivatives while private masters stay outside Git.

Suggested commit:

```txt
Add painting content model
```

## Phase 4: Shared Layout and Base Styling

Build:

- Site header
- Navigation
- Footer
- Approved header, footer, favicon, manifest, portrait, and social-image brand derivatives
- Responsive content container
- Base typography
- Base button/link styles
- Basic status label styles

Design direction:

- Quiet gallery-like layout
- Large artwork images
- Restrained colors
- Strong whitespace
- Typography that supports the art instead of competing with it

Expected result:

- The app feels coherent before individual pages are polished.
- Brand assets render without checkerboard artifacts, broken manifest references, or oversized source downloads.

Suggested commit:

```txt
Add shared layout and base styles
```

## Phase 5: Home Page

Build the home page with:

- Artist-first hero
- Strong artwork presence in the first viewport
- Short artist introduction
- Featured paintings
- Link to full gallery
- Link to about/contact where relevant

Expected result:

- A first-time visitor understands whose site this is and what kind of work they make.

Suggested commit:

```txt
Build home page
```

## Phase 6: Paintings Gallery

Build the gallery page with:

- Responsive painting grid
- Painting cards
- Image, title, medium, width × height × depth
- Status label
- Public or historical NOK price
- Sold/reserved visual treatment
- Combined status and orientation filters
- URL-backed year, total-area, and price sorting

Expected result:

- A buyer can scan the collection and choose a painting to inspect.

Suggested commit:

```txt
Build paintings gallery
```

## Phase 7: Painting Detail Page

Build the detail page with:

- Image gallery or primary image layout
- Title
- Medium
- Dimensions
- Year if available
- Price in NOK if available
- Status
- Description
- Inquiry call-to-action for available works
- Different treatment for sold or reserved works

Expected result:

- A buyer has enough information to decide whether to inquire.

Suggested commit:

```txt
Build painting detail page
```

## Phase 8: About Page

Build the about page with:

- Artist bio
- Artist portrait or process image area
- Artistic motivation or background
- Optional exhibitions/history section
- Contact link

Expected result:

- Buyers can understand the person behind the artwork.

Suggested commit:

```txt
Build about page
```

## Phase 9: Contact and Inquiry Form

Build form UI for:

- General contact from `/contact`
- Painting-specific inquiry from `/paintings/$slug`

Fields:

- Name
- Email
- Optional phone
- Message
- Hidden or prefilled painting reference when relevant

Server behavior:

- Validate input
- Send email through an email provider
- Return success state
- Return safe error state when email fails

Expected result:

- A buyer can send an inquiry and the artist receives enough information to reply.

Suggested commit:

```txt
Add inquiry form and email handling
```

## Phase 10: SEO and Metadata

Add:

- Page titles
- Page descriptions
- Painting-specific metadata
- Open Graph basics
- Structured data for artwork, business identity, and available offers
- Meaningful image alt text
- Site URL environment configuration

Expected result:

- Pages share well and have a good search foundation.

Suggested commit:

```txt
Add SEO metadata
```

## Phase 11: Accessibility and Responsive Polish

Verify and improve:

- Mobile layout
- Desktop layout
- Keyboard navigation
- Focus states
- Form labels
- Heading order
- Color contrast
- Image layout stability
- No overlapping text or UI

Expected result:

- The site is comfortable and reliable across common devices.

Suggested commit:

```txt
Polish responsive and accessibility behavior
```

## Phase 12: Testing

Add tests from `docs/testplan.md`, starting with the highest-value checks:

1. Painting data validation
2. Route rendering
3. Inquiry form validation
4. Not-found behavior
5. Manual responsive/accessibility checklist

Expected result:

- Common content and inquiry-flow mistakes are caught before release.

Suggested commit:

```txt
Add v1 test coverage
```

## Phase 13: Managed Deployment

Choose a managed hosting provider and configure deployment.

Deployment requirements:

- Build command works in CI/hosting environment.
- Required environment variables are documented.

## Future Enhancement: Safe Mobile Status Updates

If phone-based updates become useful, add a manually triggered GitHub Actions workflow that:

1. Accepts a painting identifier and allowed target status.
2. Validates the painting and state value.
3. Updates only the painting status.
4. Runs repository verification.
5. Opens a pull request for review rather than publishing directly.

This automation is explicitly outside v1 and the launch-critical path. Reconsider it only after manual updates demonstrate enough friction to justify maintenance.

## Other Future Enhancements

After the three-month review, consider only evidence-supported additions:

- CMS/database/admin dashboard
- Checkout and payment integration
- Customer accounts or tracking portal
- Automated invoicing and interest-list management
- Newsletter
- Embedded social feeds
- Gallery search, tags, or pagination
- Review and carrier integrations
- Production URL is configured.
- Inquiry email works in production.

Expected result:

- The site can be deployed reliably without Raspberry Pi self-hosting.

Suggested commit:

```txt
Configure managed deployment
```

## Phase 14: Release Checklist

Before first release:

- Replace placeholder text.
- Replace placeholder images.
- Confirm real inquiry receiver email.
- Confirm privacy/contact copy.
- Run tests.
- Run production build.
- Check mobile layout.
- Check desktop layout.
- Send a test inquiry.
- Confirm no secrets are committed.

Expected result:

- The site is ready for real visitors.

Suggested commit:

```txt
Prepare v1 release
```

## What Not To Build In V1

Do not build these yet:

- Shopping cart
- Direct payment
- Vipps integration
- Stripe integration
- Customer accounts
- Admin dashboard
- Database-backed orders
- Inventory reservation timers

These features are useful later, but adding them now would slow down the first release and make the learning surface much larger.
