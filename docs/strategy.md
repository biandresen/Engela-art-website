# Strategy: Business Model and Buyer Flow

## Site Purpose

The website should do three jobs:

1. Represent the artist professionally.
2. Show the portfolio clearly.
3. Make available paintings easy to inquire about.

The site should feel like an artist portfolio with a sales path, not like a generic webshop. Art buyers often care about the story, the work, the artist, and trust before they care about checkout speed.

## V1 Business Model

V1 uses an inquiry-first sales model.

The buyer does not pay directly on the website. Instead, they send an inquiry about a painting, and the artist or site owner follows up manually.

This supports:

- Availability confirmation
- Pickup or shipping discussion
- Framing questions
- Commission or similar-work requests
- Manual payment agreement
- Personal buyer communication

This is a better first model for original paintings than a full cart and checkout system.

## Buyer Journey

```txt
Buyer lands on home page
  -> sees artist identity and artwork style
  -> browses paintings
  -> opens a painting detail page
  -> checks title, medium, dimensions, status, and price
  -> sends inquiry
  -> artist follows up manually
```

The buyer should always understand:

- Who made the work
- Whether the painting is available
- What the painting is made with
- How large it is
- What it costs or how to ask about price
- How to contact the artist

## Artist/Admin Workflow

V1 does not include an admin dashboard.

Workflow:

1. Developer updates painting records in the codebase.
2. Developer adds or replaces artwork images.
3. Developer commits the change.
4. Site is redeployed through the managed hosting provider.
5. Buyer inquiries arrive by email.
6. Artist replies manually.

This workflow is intentionally simple. It keeps the first version focused on launching a high-quality public site.

## Inquiry Flow

Painting-specific inquiry:

```txt
Painting Detail
  -> Inquiry Form
  -> Buyer submits name, email, optional phone, and message
  -> Server validates input
  -> Email is sent to artist/site owner
  -> Buyer sees success message
```

General contact inquiry:

```txt
Contact Page
  -> Contact Form
  -> Buyer submits name, email, and message
  -> Server validates input
  -> Email is sent to artist/site owner
  -> Buyer sees success message
```

Required inquiry fields:

- Name
- Email
- Message

Optional inquiry fields:

- Phone
- Painting reference, automatically included when inquiry starts from a painting detail page

## Why Inquiry-First

Benefits:

- Lower implementation complexity
- No payment provider setup for v1
- No order database needed
- Avoids selling a painting online that was already sold offline
- Better fit for personal, high-trust art sales
- Easier to handle shipping and pickup case by case

Drawbacks:

- Buyer cannot purchase instantly
- Sales depend on manual response time
- No automatic payment confirmation
- No built-in order history

The benefits are more important for v1 because the goal is to launch a trustworthy artist website, not a full online store.

## Future Monetization and Payment

Add direct payment only when the process is clear enough:

- Prices are fixed.
- Shipping or pickup rules are known.
- The artist wants instant purchases.
- There is enough sales volume to justify the complexity.

Future provider choices:

- **Vipps MobilePay:** best first option for Norway-first buyers.
- **Stripe Checkout:** good option if international card payments become important.

When direct checkout is added, also add:

- Database
- Order records
- Payment records
- Payment webhooks
- Sold/reserved status updates
- Confirmation emails

Do not add payment without order state. Payment systems need durable records so the site can recover from failed redirects, webhook delays, and support questions.

## Future Admin Options

If developer-managed content becomes annoying, choose one of these paths:

- **CMS:** best if the artist mainly needs to edit paintings and text.
- **Database + custom admin:** best if the goal is learning full-stack application development.
- **Hosted shop platform:** best only if the business becomes a real product catalog with frequent sales.

For this project, a CMS or database should come before a complex custom admin dashboard.

## Key Risks

- Content updates require developer time.
- Inquiry-first sales require manual follow-up.
- Poor artwork photography would weaken the site more than missing technical features.
- Unclear language choice can create copy and route rework later.
- Legal/privacy text is needed before collecting contact form data.

## Strategic Defaults

- Start with a focused v1.
- Make the artwork the main visual experience.
- Prefer buyer trust over checkout speed.
- Use manual sales until direct checkout is clearly needed.
- Keep future payment/database/admin work planned but out of v1.
