# Test Plan: TanStack Start V1

## Purpose

The v1 test plan verifies that buyers can browse paintings, understand availability, and send reliable inquiries. Testing should focus on the highest-risk flows first: painting data correctness, route behavior, inquiry form validation, responsive layout, accessibility, and SEO basics.

## Static Content Tests

Painting records should be validated because they drive multiple pages.

Test that:

- Every painting has a title.
- Every painting has a unique immutable ID matching `EA-YYYY-NNN`.
- Painting ID year agrees with the creation year.
- Every painting has a unique slug.
- Every painting has a valid status: `available`, `reserved`, or `sold`.
- Every painting has at least one image.
- Every launch painting has a straight-on main image and a room-context image.
- Every image has meaningful alt text.
- Every image path points to an existing file.
- Every painting has positive numeric width, height, and depth measurements.
- Every available painting has medium and a public price in NOK.
- Prices are positive whole-kroner integers and format correctly for Norwegian and English.
- Every painting has approved Norwegian and English medium text.
- Every painting has a valid public creation year and no required exact creation date.
- Medium text accurately names notable materials or uses mixed-media wording appropriately.
- Every painting selects valid care-profile keys.
- Care guidance is composed from approved bilingual profiles and optional reviewed notes, not inferred from medium text.
- Every painting has a bilingual visual summary.
- Artist notes are optional but bilingual when present.
- Sold paintings display their historical price with clear sold status and year context.
- Orientation is correctly derived from width and height.
- Featured paintings exist if the home page depends on featured work.
- Featured display order values are present and unique for featured paintings.

Why this matters: content errors often become broken pages, missing images, or confusing buyer information.

## Route and Page Tests

Test the main user-facing routes:

- Home page renders without errors.
- Home hero uses one configured seasonal painting and no carousel.
- Hero preserves the full artwork by default and uses a stable stacked mobile layout.
- Home page uses the manually curated featured selection and prioritizes the gallery action over the commission action.
- Featured paintings show their actual availability status.
- Paintings gallery renders all public paintings.
- Gallery distinguishes available, reserved, and sold paintings.
- Gallery cards show NOK price and enough status context to distinguish current offers from historical sold pricing.
- Gallery uses a stable regular grid; visual and keyboard order match the selected sort order.
- Gallery images preserve artwork without masonry reordering or aggressive cropping.
- Status uses localized text outside artwork images and never relies on color alone.
- Gallery can filter by available, reserved, and sold status.
- Gallery can filter by landscape, portrait, and square orientation.
- Status and orientation filters can be combined.
- Gallery can sort visible paintings by year, total area, and price in both directions.
- Gallery defaults to year descending with title as a deterministic tie-breaker.
- Homepage featured order does not affect gallery order.
- Active filters and sorting are represented in the URL.
- Shared filtered URLs restore the same gallery state.
- Browser back and forward navigation restores previous gallery states.
- Gallery discovery does not depend on a text-search feature in v1.
- Gallery renders all matching paintings without pagination or infinite scroll.
- Below-the-fold gallery images use appropriate lazy loading.
- Zero-result filter combinations show a localized empty state and clear-all action.
- Clearing filters restores the default gallery URL state without silently changing filters beforehand.
- Painting detail page works for every valid slug.
- Painting images open in a keyboard- and touch-operable fullscreen viewer.
- Each painting slug resolves in both languages.
- Switching language on a painting page preserves the same painting.
- Explicit language choice is remembered in a server-readable first-party cookie.
- Root requests use the preference cookie, then browser language, then Norwegian fallback.
- Direct language-prefixed URLs are never overridden by stored preference.
- Invalid painting slug shows a proper not-found state.
- Invalid painting and route URLs return HTTP 404 and offer localized gallery/home recovery actions.
- Invalid URLs are not silently redirected.
- Commission page explains qualification, process, pricing, timelines, feedback, and payment expectations.
- Contact and Sales/Returns render approved subsets from one bilingual FAQ source.
- FAQ disclosures work with keyboard input and without client JavaScript.
- Direct FAQ anchors can reveal the targeted answer.
- About page renders artist content.
- About copy uses specific personal/process details rather than generic unsupported marketing claims.
- Contact page renders contact options or form.

Acceptance criteria:

- A buyer can navigate from home to gallery to detail page.
- A buyer can return to the gallery from a painting detail page.
- Direct/shared painting links provide a clear route to view all paintings.
- Returning from a detail page restores available gallery query state.
- Sold paintings do not use the same purchase/inquiry treatment as available paintings.
- Sold paintings can start a similar-work inquiry with the painting reference and translated prefilled text.
- Mobile detail pages show the correct status-aware sticky action without obscuring content.
- Reserved paintings can start an interest-list inquiry.
- Reserved painting pages explain ordering, lack of guarantee, and the 48-hour response rule.
- Painting inquiry areas explain that availability is confirmed before reservation and do not show stale update timestamps.

## Inquiry Form Tests

The inquiry form is the most important interactive feature in v1.

Test that:

- Name is required.
- Email is required.
- Invalid email formats are rejected.
- Message is required.
- Phone is optional.
- Postal address is not collected by the inquiry form.
- Submit area includes a localized privacy-processing notice and privacy-page link without a required consent checkbox.
- Painting-specific inquiries include the painting title or slug.
- Every inquiry action reaches the unified Contact-page form with the correct localized context.
- Invalid inquiry type or painting query values fall back safely.
- Server submission resolves trusted inquiry metadata rather than trusting hidden client fields.
- Similar-work inquiries identify the sold reference painting and remain editable before submission.
- Commission inquiries identify any reference painting and state that acceptance and exact reproduction are not guaranteed.
- Submitting a commission inquiry does not present an order, payment, or accepted-project state.
- Commission inquiries use a distinct inquiry type and email subject from existing-painting inquiries.
- Commission budget is optional and accepts preset ranges, “not sure yet,” or a valid custom range.
- Commission proposal templates use the default 50% deposit and 50% final-payment schedule.
- Commission work does not begin before proposal acceptance and cleared deposit payment.
- Final payment is required before shipping or pickup.
- Deposit cancellation language is reviewed before publication and does not override mandatory consumer rights.
- Commission proposals include one concept confirmation and one progress update.
- Major scope changes require a separately agreed price and timeline.
- Commission pages label size-tier pricing as “from” guidance rather than an automatic quote.
- The final commission proposal is presented as the authoritative price.
- Commission pages label timeline ranges as approximate and non-binding.
- The accepted proposal contains the actual estimated commission schedule.
- Commission proposal templates state the default portfolio-use policy and allow a written privacy exception.
- Public artwork pages include appropriate copyright guidance.
- Original-resolution artwork files are not shipped as public website assets.
- Every public painting derivative includes the approved Engela Art watermark.
- Watermarks are baked into public files rather than applied only as removable CSS overlays.
- Watermark placement, contrast, opacity, scale, and safe margin remain legible without obscuring important artwork details.
- Private master files remain unwatermarked and absent from the public asset tree.
- Brand graphics and the artist portrait are not incorrectly watermarked.
- Committed artwork assets are approved web derivatives with known dimensions.
- Image preparation can be repeated without requiring production infrastructure.
- Published testimonials have a real source and permission where required.
- The site does not imply a Google rating or profile that has not been verified.
- Review requests are neutral and are not tied to rewards or positive sentiment.
- An empty testimonials collection renders no public testimonials area.
- Adding an approved testimonial renders it through the same testimonials module without homepage structural changes.
- Home can show a concise testimonial selection while About uses the same data for a fuller section.
- Interest-list inquiry emails include a server-generated submission timestamp so manual ordering does not depend on the visitor's device clock.
- Submitting any inquiry does not automatically change painting status.
- Accepted terms, invoice issuance, and partial payment do not automatically create sold status.
- Full payment is the operational trigger for sold status.
- Released reservations return to available status.
- Painting data accepts only available, reserved, and sold as public statuses.
- A returned painting is not relisted until the artist confirms its condition.
- A successful submission shows a clear success state.
- A successful submission sends the interested buyer an acknowledgement email containing their message and painting reference.
- A successful submission sends one artist notification and one buyer acknowledgement through the email interface.
- Artist-notification failure reports submission failure and preserves the form.
- Buyer-acknowledgement failure after a successful artist notification still reports inquiry success with delayed-confirmation guidance.
- Success guidance explains spam checks and direct-email follow-up without encouraging duplicate form submissions.
- Success and acknowledgement copy does not claim that a reservation or sale exists.
- Success copy states the two-business-day human response target.
- A failed email submission shows a safe, user-friendly error.
- Validation and delivery failures preserve current form values for correction or retry.
- Form message contents are not persisted to local storage.
- Delivery failure offers the dedicated business email fallback.
- The form does not expose internal error details or secrets.
- Tests use a recording email adapter and never depend on live Resend delivery.
- Duplicate rapid submissions are prevented or handled gracefully.
- Successful submission clears the draft and prevents accidental resubmission.
- Honeypot submissions are rejected without sending email.
- Impossibly fast submissions are rejected safely.
- Rate limits reduce repeated abuse without exposing internal thresholds.
- All fields enforce server-side length limits.
- V1 does not require CAPTCHA unless production abuse demonstrates the need.

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

Browser compatibility target:

- Current and previous major Chrome
- Current and previous major Safari
- Current and previous major Firefox
- Current and previous major Edge
- Current iOS Safari
- Current Android Chrome

Internet Explorer is not supported. Core painting browsing and inquiry flows must remain usable if optional enhancements such as the fullscreen viewer fail.

## Performance Targets

On representative production-like mobile pages, target current good Core Web Vitals:

- Largest Contentful Paint: 2.5 seconds or less
- Interaction to Next Paint: 200 milliseconds or less
- Cumulative Layout Shift: 0.1 or less

Use Lighthouse as a regression signal, targeting 90 or better for performance and accessibility on representative Home, Gallery, Painting Detail, and Contact pages. Core Web Vitals and real usability take priority over optimizing a synthetic score.

Requirements:

- Every artwork image has explicit dimensions or aspect-ratio metadata.
- Responsive image sources avoid downloading oversized assets.
- Initial JavaScript remains small.
- Noncritical features such as the fullscreen viewer load on demand where practical.
- Fonts do not block readable content or cause disruptive layout movement.
- Manrope is self-hosted with an effective system-font fallback and no third-party font request.
- Header and surface logos use genuine transparency and do not display a baked checkerboard.
- The manifest, document metadata, and deployed files reference existing favicon/app-icon derivatives.
- Brand images have role-appropriate responsive dimensions and formats rather than shipping multi-megabyte source PNGs.
- The artist portrait uses responsive derivatives, meaningful bilingual alt text, and an approved crop.
- The default Open Graph image renders the Engela Art brand legibly at social-preview sizes.
- Decorative brand patterns remain subordinate to artwork and do not become full-page visual noise.

Check that:

- Navigation is usable on mobile and desktop.
- Mobile menu keyboard, focus, expanded-state, navigation-close, and Escape behavior work correctly.
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
- UI colors resolve through semantic CSS variables rather than repeated raw palette values.
- Motion remains lightweight, avoids autoplay/parallax, and respects reduced-motion preferences.
- Artwork images have alt text.
- Fullscreen viewer focus, keyboard navigation, captions, and close behavior are accessible.
- Room-context images use credible scale and do not imply included furnishings or frames.
- Painting pages state that v1 paintings are sold unframed.
- Staged-image captions state that frames and furnishings are illustrative only.

Accessibility is not only for screen readers. These practices also improve keyboard use, mobile usability, SEO, and general quality.

Target WCAG 2.2 AA for core browsing, filtering, language switching, image viewing, and inquiry flows. Use automated checks as a baseline and manual keyboard, screen-reader spot checks, zoom, and reduced-motion verification before launch.

## SEO Tests

Check that:

- Home page has a useful title and description.
- Gallery page has a useful title and description.
- Painting detail pages include painting-specific metadata.
- Available, reserved, and sold public paintings are indexable and included in language-specific discovery metadata.
- Private commissions produce no public or indexable painting page.
- Important pages have canonical URLs if the framework/deployment setup supports them.
- Every equivalent Norwegian and English page has reciprocal `hreflang` links.
- `x-default` points to the root language entry.
- The generated sitemap includes canonical language pages and excludes gallery query combinations.
- Open Graph metadata exists for sharing previews.
- Images have descriptive alt text.
- Public painting pages emit `VisualArtwork` structured data.
- Available paintings can emit an `Offer` with the real NOK price; reserved and sold paintings do not advertise an available offer.
- Engela Art business identity structured data is published only after ENK details are confirmed.
- Aggregate ratings or review structured data are not fabricated or published before eligible genuine reviews exist.

SEO matters because buyers may discover the artist through search, social sharing, or direct links to individual paintings.

## Privacy and Legal Content Tests

Check that:

- The privacy page exists in Norwegian and English.
- Sales and returns terms exist in Norwegian and English and receive legal review before launch.
- Published business identity and contact details match the registered ENK.
- The privacy page distinguishes unsuccessful inquiries from completed-sale records.
- Retention periods match the approved operational policy.
- No marketing consent is requested unless marketing is actually introduced.
- Inquiry details are not added to a newsletter or marketing list.
- No home address is exposed publicly.
- Return guidance includes mutual before/after shipping photographs without claiming that missing photos remove mandatory rights.
- The site directs post-sale evidence to the business mailbox and exposes no file-upload control.
- Analytics events contain no form values or direct personal identifiers.
- Inquiry success analytics distinguish inquiry type without identifying the sender.
- Three-month reporting can compare aggregate inquiry events with manually recorded reservation and sale totals without joining personal identifiers.
- V1 loads no advertising or cross-site tracking scripts.
- Language cookie contains only the locale, lasts one year, and uses appropriate first-party security attributes.
- No cookie banner appears while the deployed site uses only necessary cookies and cookieless analytics.
- Analytics calls pass through the local analytics interface rather than direct provider calls across routes.
- Production analytics uses the EU region and only allowlisted events.
- PostHog autocapture, session replay, surveys, persistent user profiles, and form capture are disabled.
- Error events pass through the local monitoring interface.
- Monitoring strips form contents, direct identifiers, cookies, authorization data, and sensitive inquiry query values.
- Social links have accessible names and do not load embedded social feeds.

## Manual Sales Process Checks

Before launch, confirm that:

- The ENK can issue compliant sequential invoices.
- Fiken trial access works for both the artist and bookkeeping helper before the first sale.
- Bank transfer, Vipps Business, and PayPal Business instructions use business accounts controlled by the artist.
- The invoice total matches the agreed painting price and shipping cost.
- Invoices and commission proposals reference or include the applicable transaction terms and retain written acceptance.
- No separate payment-method surcharge is added.
- Payment is verified before shipping or handover.
- Dispatch communication includes carrier, tracking information, and dispatch date by email.
- Every completed original sale has a matching signed physical certificate and emailed PDF using the correct painting ID and details.
- Each certificate presents Norwegian and English in one document rather than separate language versions.
- The private operations register is accessible only to the artist and bookkeeping helper and is not stored in Git.
- The invoice states an exact due date three business days after issue.
- The reminder template grants one final three-business-day extension and states the final date.
- Unpaid reservations are released after the final date unless the artist explicitly agreed otherwise.

## Manual Acceptance Checklist

Before v1 release, manually confirm:

- A buyer can understand who the artist is.
- A buyer can browse available work.
- A buyer can tell whether a painting is available, reserved, or sold.
- A buyer can see title, medium, dimensions, and price or inquiry guidance.
- A buyer can see that shipping is excluded and that pickup in Nannestad or shipping is arranged by email.
- International copy states that delivery availability and total cost are confirmed case by case.
- Shipping copy states that dispatched paintings use tracked delivery and appropriate available coverage.
- Invoice preparation verifies carrier eligibility and artwork coverage instead of assuming one fixed provider.
- The public site does not expose the artist's home address.
- The public site and email templates do not expose the artist's personal email address.
- Norwegian and English public email aliases deliver to the dedicated Engela Art inbox.
- A buyer can send an inquiry from a painting detail page.
- The artist receives the inquiry by email.
- The inquiry email includes buyer contact information and painting reference.
- The site works on mobile and desktop.
- The site consistently uses the approved light warm theme without an unused dark-mode control.
- The site does not contain placeholder copy in production.
- The site does not expose secrets or private configuration.
- At least six paintings satisfy every required content field in both languages.
- At least three featured paintings have an explicit display order.
- A real inquiry reaches the artist and its acknowledgement reaches the sender.
- Pull requests produce a Netlify deploy preview with non-production integrations.
- Pull requests and pushes to `main` run `npm run verify` in GitHub Actions on Node 22.12.0.
- The CI workflow installs dependencies with `npm ci`.
- Preview forms cannot send through production email configuration.
- Preview URLs are not indexable.
- Artist-owned content and developer-owned technical/translation checks are both approved before production launch.
- Confirmed painting status changes are normally published within one business day.
- Every published English content field has an approved Norwegian source.
- Translation changes do not leave either language missing or semantically stale.
- Painting titles remain identical across languages.
- Any English title explanation appears only in descriptive copy, not as a second canonical title.

## Suggested Test Tooling

Use a small, practical testing stack:

- Unit/content validation tests for painting records.
- Component or route tests for key rendering behavior.
- End-to-end tests for the inquiry flow if the project scope allows it.
- Manual visual checks before release.

Do not overbuild the test suite before the first UI exists. Start with content validation and the inquiry form, then add broader tests as the implementation grows.
