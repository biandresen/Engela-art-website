# Test Plan: TanStack Start V1

## Purpose

The v1 test plan verifies that buyers can browse paintings, understand availability, and send reliable inquiries. Testing should focus on the highest-risk flows first: painting data correctness, route behavior, inquiry form validation, responsive layout, accessibility, and SEO basics.

## Static Content Tests

Painting records should be validated because they drive multiple pages.

Test that:

- Every painting has a title.
- Every painting has a unique slug.
- Every painting has a valid status: `available`, `reserved`, or `sold`.
- Every painting has at least one image.
- Every image has meaningful alt text.
- Every image path points to an existing file.
- Available paintings have enough sales information: medium, dimensions, and price or inquiry text.
- Featured paintings exist if the home page depends on featured work.

Why this matters: content errors often become broken pages, missing images, or confusing buyer information.

## Route and Page Tests

Test the main user-facing routes:

- Home page renders without errors.
- Paintings gallery renders all public paintings.
- Gallery distinguishes available, reserved, and sold paintings.
- Painting detail page works for every valid slug.
- Invalid painting slug shows a proper not-found state.
- About page renders artist content.
- Contact page renders contact options or form.

Acceptance criteria:

- A buyer can navigate from home to gallery to detail page.
- A buyer can return to the gallery from a painting detail page.
- Sold paintings do not use the same purchase/inquiry treatment as available paintings.

## Inquiry Form Tests

The inquiry form is the most important interactive feature in v1.

Test that:

- Name is required.
- Email is required.
- Invalid email formats are rejected.
- Message is required.
- Painting-specific inquiries include the painting title or slug.
- A successful submission shows a clear success state.
- A failed email submission shows a safe, user-friendly error.
- The form does not expose internal error details or secrets.
- Duplicate rapid submissions are prevented or handled gracefully.

Acceptance criteria:

- The artist receives enough information to reply.
- The buyer knows whether the inquiry was sent.
- Validation errors are clear and attached to the relevant fields.

## UX and Responsive Tests

Test on at least:

- Small mobile viewport
- Large mobile viewport
- Tablet-width viewport
- Desktop viewport

Check that:

- Navigation is usable on mobile and desktop.
- Painting cards do not become cramped or unreadable.
- Artwork images keep stable dimensions while loading.
- Text does not overlap images, buttons, or neighboring content.
- Form controls are large enough to use on mobile.
- Primary calls-to-action remain visible and understandable.

Why this matters: art websites are image-heavy, and image-heavy layouts easily break on small screens without stable sizing.

## Accessibility Tests

Check that:

- Pages use one clear `h1`.
- Headings follow a logical order.
- Links and buttons have clear accessible names.
- Form inputs have labels.
- Error messages are readable by screen readers.
- Focus states are visible.
- The site can be navigated with a keyboard.
- Color contrast is sufficient for text, buttons, and status labels.
- Artwork images have alt text.

Accessibility is not only for screen readers. These practices also improve keyboard use, mobile usability, SEO, and general quality.

## SEO Tests

Check that:

- Home page has a useful title and description.
- Gallery page has a useful title and description.
- Painting detail pages include painting-specific metadata.
- Important pages have canonical URLs if the framework/deployment setup supports them.
- Open Graph metadata exists for sharing previews.
- Images have descriptive alt text.

SEO matters because buyers may discover the artist through search, social sharing, or direct links to individual paintings.

## Manual Acceptance Checklist

Before v1 release, manually confirm:

- A buyer can understand who the artist is.
- A buyer can browse available work.
- A buyer can tell whether a painting is available, reserved, or sold.
- A buyer can see title, medium, dimensions, and price or inquiry guidance.
- A buyer can send an inquiry from a painting detail page.
- The artist receives the inquiry by email.
- The inquiry email includes buyer contact information and painting reference.
- The site works on mobile and desktop.
- The site does not contain placeholder copy in production.
- The site does not expose secrets or private configuration.

## Suggested Test Tooling

Use a small, practical testing stack:

- Unit/content validation tests for painting records.
- Component or route tests for key rendering behavior.
- End-to-end tests for the inquiry flow if the project scope allows it.
- Manual visual checks before release.

Do not overbuild the test suite before the first UI exists. Start with content validation and the inquiry form, then add broader tests as the implementation grows.
