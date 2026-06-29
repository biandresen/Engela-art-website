# Architecture: TanStack Start V1

## Purpose

This site is a portfolio-first sales website for an artist. The v1 goal is to present the artist professionally, show paintings clearly, and let interested buyers send inquiries about available work.

The site is intentionally not a full e-commerce platform in v1. Original paintings are usually low-volume, high-trust purchases, so the first version should support conversation, availability confirmation, pickup/shipping decisions, and manual payment follow-up.

## Recommended Stack

- **Framework:** TanStack Start
- **UI:** React
- **Language:** TypeScript
- **Hosting:** managed hosting provider
- **Data source:** developer-managed TypeScript or JSON painting records
- **Backend:** TanStack Start server functions
- **Database:** none in v1
- **Payments:** none in v1
- **Shopping cart:** none in v1
- **Customer accounts:** none in v1
- **Order/tracking portal:** none in v1
- **Operational sales register:** private shared spreadsheet outside the application
- **Accounting/invoicing:** Fiken outside the application, with no v1 API integration
- **Authenticity certificates:** manually produced from a controlled template outside the application
- **Newsletter/subscriber store:** none in v1
- **Customer file uploads/claim storage:** none in v1
- **Dark mode/theme switching:** none in v1
- **Email:** transactional email provider for inquiry notifications
- **Analytics:** cookieless privacy-focused provider behind a local analytics interface
- **Error monitoring:** privacy-filtered Sentry adapter behind a local monitoring interface

## V1 System Architecture

```txt
Visitor
  -> Managed Hosting
  -> TanStack Start App
  -> Gallery / Painting Detail
  -> Inquiry Form
  -> Server Function
  -> Email Service
  -> Artist receives inquiry
```

The TanStack Start app owns both the frontend pages and the small server-side behavior needed for the inquiry form. This keeps the architecture simple while still teaching real full-stack boundaries.

Analytics calls use one local interface rather than importing a provider throughout route modules. The production adapter uses PostHog Cloud's EU region and free analytics tier with an explicit event allowlist, no persistent identity, no autocapture, no session replay, and no form capture. Development and tests use a no-op or recording adapter.

Unexpected browser and server errors use a separate local monitoring interface with a Sentry production adapter. Strip form values, names, email addresses, phone numbers, messages, authorization data, cookies, and inquiry query context before sending events. Development and tests use a no-op or recording adapter.

Transactional email also uses one local interface. The production adapter is Resend's free tier; tests use a recording adapter and local development must not send real email by default. Configure an authenticated Engela Art domain with SPF, DKIM, and DMARC before production sending.

The artist notification is the critical send:

1. Send the artist notification first.
2. If it fails, report submission failure and preserve the form.
3. If it succeeds, attempt the buyer acknowledgement.
4. If acknowledgement fails, the inquiry remains successful; log the secondary failure and tell the buyer that confirmation email may be delayed.

Never report success unless the artist notification was accepted by the email provider.

Visual color decisions use semantic CSS custom properties mapped into Tailwind. UI modules consume roles such as background, surface, primary, border, and status rather than hard-coded palette values, keeping theme changes localized to the global token definition.

Typography uses one self-hosted Manrope variable font with a system sans-serif fallback. Font assets remain local to avoid third-party requests and reduce privacy and availability dependencies.

## Application Boundaries

### Frontend

The frontend renders:

- Home page
- Paintings gallery
- Painting detail pages
- About page
- Contact page
- Inquiry form states
- Not-found page

The frontend should stay focused on presentation, navigation, and user interaction. It should not contain email credentials, payment secrets, or private operational logic.

### Server Functions

TanStack Start server functions handle trusted server-side work:

- Receive inquiry/contact form submissions
- Validate submitted data
- Attach the selected painting reference
- Send notification email to the artist or site owner
- Return success or safe error responses to the UI

Server functions are a good fit because they make the client/server boundary explicit while keeping everything in one project.

### Inquiry Form Seam

All inquiry actions use one Contact-page form and one server-side submission path. Painting pages and the Commissions page link to localized Contact URLs with validated query context, for example:

```txt
/en/contact?type=painting&painting=sommer
```

The form derives translated prefill text from the inquiry type and painting reference. Visitors may edit their message, while trusted metadata such as the resolved painting, inquiry category, language, and server timestamp is reconstructed and validated on the server rather than trusted from hidden client fields.

### Inquiry Abuse Protection

V1 uses layered, low-friction protection:

- Hidden honeypot field
- Minimum realistic submission-time check
- Server-side rate limiting
- Explicit input length limits
- Safe generic failure responses

Do not add CAPTCHA at launch. If production metrics show meaningful automated abuse, add Cloudflare Turnstile or an equivalent privacy-conscious challenge behind the submission seam without changing the public form contract.

### Painting Data

V1 painting records should live in a structured TypeScript or JSON data file.

Suggested fields:

```ts
type LocalizedText = {
  no: string
  en: string
}

type Painting = {
  paintingId: `EA-${number}-${string}`
  title: string
  slug: string
  medium: LocalizedText
  technique: LocalizedText
  visualSummary: LocalizedText
  artistNote?: LocalizedText
  widthCm: number
  heightCm: number
  depthCm: number
  year: number
  listedPriceNok: number
  status: 'available' | 'reserved' | 'sold'
  images: Array<{
    src: string
    alt: LocalizedText
    caption?: LocalizedText
    role: 'main' | 'room-context' | 'detail'
    width: number
    height: number
  }>
  featured: boolean
  featuredOrder?: number
  careProfiles: Array<
    'acrylic' | 'textured-surface' | 'oil' | 'pastel-chalk' | 'glitter-delicate'
  >
  exceptionalCareNote?: LocalizedText
}
```

Orientation and total face area are derived from numeric width and height. Painting titles and slugs remain identical across languages, while descriptive content, medium, technique, and image text are bilingual. Runtime validation checks identifiers, dimensions, price, translated fields, image roles, care profiles, and featured ordering before routes render.

### Artwork Image Pipeline

Keep high-quality master artwork files outside the repository and public deployment. A repeatable local preparation step creates approved responsive web derivatives, such as AVIF, WebP, and JPEG fallbacks with known dimensions.

All public painting derivatives receive the approved Engela Art text watermark during preparation. Bake the watermark into each public file rather than relying on a CSS overlay. The process must support consistent responsive scale, lower-third placement, opacity, and contrast handling so the watermark remains readable without becoming the visual focus.

The repository contains only watermarked web-ready painting derivatives and painting image metadata. Do not commit original-resolution masters, buyer-supplied claim photos, private commission references, or unapproved work-in-progress images. Netlify serves prepared assets rather than performing complex request-time transformation in v1.

Brand assets, the artist portrait, private operational photos, and certificate imagery follow their own export rules and are not automatically watermarked.

## Environment Variables

Secrets and deployment-specific values should use environment variables.

Expected variables:

```txt
EMAIL_PROVIDER_API_KEY
INQUIRY_RECEIVER_EMAIL
INQUIRY_SENDER_EMAIL
SITE_URL
```

Production uses `https://engelaart.no` as `SITE_URL`. Canonical URLs, `hreflang`, sitemap entries, Open Graph URLs, and transactional-email authentication use the same primary domain. Any secondary domain redirects permanently to it.

Generate one sitemap containing every canonical Norwegian and English public page. Equivalent pages reference each other with `hreflang`, and `x-default` points to the root language entry. Exclude filtered query combinations, form-success states, private commissions, and other non-canonical URLs.

The root language decision is server-readable:

1. Use the first-party language-preference cookie if the visitor explicitly selected a language.
2. Otherwise use the request's `Accept-Language` header.
3. Fall back to Norwegian.

Do not use `localStorage` as the source of truth because it is unavailable during server rendering and can cause a wrong-language flash. Direct `/no/...` and `/en/...` requests are never overridden.

The language-preference cookie lasts one year, is first-party, `Secure` in production, `SameSite=Lax`, and contains only the language code. Because it is strictly functional and launch analytics is cookieless, v1 does not show a cookie-consent banner. Reassess consent before adding any non-essential cookie or tracker.

`INQUIRY_RECEIVER_EMAIL` points to the dedicated Engela Art inbox. `INQUIRY_SENDER_EMAIL` uses an authenticated address on `engelaart.no`; artist notifications set reply-to to the interested buyer's validated address so the artist can continue the conversation from the business mailbox.

The human-operated business inbox uses Zoho Mail Free where available, with Zoho Mail Lite as the paid fallback. Cloudflare manages DNS, Zoho receives and sends normal correspondence, and Resend sends website-generated transactional messages. Keep SPF, DKIM, and DMARC records aligned across authorized senders.

Do not host production email on a Raspberry Pi or treat Nextcloud Mail as a mail server. Nextcloud may be used only as an optional client for an existing reliable mailbox.

These must not be committed to Git. A local `.env.example` can document required names without real values.

## Why No Database in V1

A database is useful when content changes frequently, when non-developers need an admin interface, or when orders/payments need durable records.

For v1, developer-managed content is simpler:

- Fewer moving parts
- No migrations
- No authentication
- No database hosting
- Easier debugging
- Easy Git history for content changes

The drawback is that content updates require a code change and redeploy. That is acceptable while the number of paintings is small and updates are infrequent.

## Why No Cart in V1

A shopping cart is usually designed for multiple products and instant checkout. Original paintings are one-of-one items, so cart behavior creates extra edge cases:

- Two buyers may try to buy the same painting
- A painting may be sold offline before the site is updated
- Cart reservations need expiration rules
- Shipping and pickup may need manual agreement

For v1, each painting should have a clear inquiry call-to-action instead of an add-to-cart button.

## Why No Payment Provider in V1

Direct payment adds complexity:

- Merchant account setup
- Payment API credentials
- Webhook handling
- Order state management
- Refund and cancellation handling
- Inventory locking
- Legal and accounting considerations

An inquiry-first flow lets the artist confirm availability, shipping, and payment method manually before money moves.

For v1, confirmed buyers receive an invoice outside the website with bank transfer, Vipps Business, and PayPal Business payment options. The website does not integrate these providers or create payment state.

## Future Payment Architecture

When direct purchase becomes useful, add a payment provider and database together.

```txt
Visitor
  -> Painting Detail
  -> Buy Button
  -> Server Function creates payment
  -> Vipps / Stripe
  -> Webhook
  -> Database updates painting/order status
  -> Confirmation email
```

Recommended future providers:

- **Vipps MobilePay:** best fit for Norway-first buyers.
- **Stripe Checkout:** good fit for international card payments.

Do not add both until there is a real business need.

## Future Database Model

Future entities:

```txt
Painting
Customer
Inquiry
Order
Payment
```

Recommended order of introduction:

1. `Painting` if content becomes too hard to manage in code.
2. `Inquiry` if the artist needs a dashboard/history of buyer messages.
3. `Order` and `Payment` when direct checkout is added.
4. `Customer` if repeat buyers, accounts, or purchase history become useful.

## Hosting

Use managed hosting for production. This avoids the operational risks of home hosting:

- Home internet downtime
- Router/firewall maintenance
- TLS certificate management
- Security updates
- Power outages
- Limited upload bandwidth

A Raspberry Pi can still be useful later as a learning/staging environment, but the public production site should start on managed hosting.

## Main Tradeoffs

### Benefits

- Simple v1 architecture
- Professional buyer experience
- Low operational burden
- Clear path to database/payment later
- Good learning value from TanStack Start server functions and routing

### Drawbacks

- No instant checkout
- No admin dashboard for the artist
- Content updates require developer involvement
- Inquiry follow-up is manual

These drawbacks are acceptable because they keep the first release small, understandable, and realistic for original artwork sales.
