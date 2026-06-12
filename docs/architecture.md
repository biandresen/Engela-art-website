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
- **Email:** transactional email provider for inquiry notifications

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

### Painting Data

V1 painting records should live in a structured TypeScript or JSON data file.

Suggested fields:

```ts
type Painting = {
  title: string
  slug: string
  medium: string
  dimensions: string
  year?: number
  priceNok?: number
  status: 'available' | 'reserved' | 'sold'
  description: string
  images: Array<{
    src: string
    alt: string
  }>
  featured: boolean
}
```

This is enough for a professional v1 without introducing database complexity too early.

## Environment Variables

Secrets and deployment-specific values should use environment variables.

Expected variables:

```txt
EMAIL_PROVIDER_API_KEY
INQUIRY_RECEIVER_EMAIL
INQUIRY_SENDER_EMAIL
SITE_URL
```

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
