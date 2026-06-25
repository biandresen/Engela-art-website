# Component Inventory

## Layout Components

- Site header
- Main navigation
- Mobile navigation
- Footer with accessible Instagram and Facebook links
- Page container
- Section layout

## Artwork Components

- Painting card
- Painting image
- Painting status badge
- Price display
- Artwork metadata list
- Painting care card
- Featured paintings section
- Image gallery or image detail layout

## Form Components

- Unified contact and inquiry form
- Text input
- Email input
- Optional phone input
- Textarea
- Field label
- Field error
- Submit button
- Success message
- Error message

## Navigation Components

- Text link
- Primary action link
- Back-to-gallery link
- Active navigation state

## Content Components

- Page heading
- Intro text block
- Artist bio block
- Commission process steps
- Commission pricing and timeline guidance
- Reusable FAQ section with contextual subsets
- Testimonials section with review cards, display-limit options, and empty-list suppression
- Empty state
- Not-found state

## Component Design Notes

Components should be reusable, but avoid abstracting too early. A component is useful when the same UI pattern appears in multiple places or when it makes a page easier to read.

Good early components:

- `PaintingCard`
- `StatusBadge`
- `PriceDisplay`
- `InquiryForm`
- `PageHeader`

Avoid creating a large design system before the first pages exist. Build the simple shared pieces first, then extract more only when repetition becomes real.
