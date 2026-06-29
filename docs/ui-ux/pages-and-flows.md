# Pages and Flows

## Required Pages

Each required page exists in both Norwegian and English under `/no/...` and `/en/...`.

Route segments can be translated, for example `/no/malerier/...` and `/en/paintings/...`, while each painting keeps the same language-neutral slug in both languages. The language switcher preserves the current painting and active gallery query state when moving to the equivalent page.

### Home

Purpose:

- Make a strong first impression.
- Show the artist identity.
- Show artwork immediately.
- Direct visitors to the gallery.

Required content:

- Artist name
- Short tagline or intro
- One manually selected seasonal hero painting
- Manually curated featured paintings selected for visual strength or seasonal mood
- Primary link to all paintings
- Secondary link to commission information
- Short about preview
- Concise testimonials section after artist-story content when approved reviews exist

Featured paintings may have any status. Their cards must clearly show whether they are available, reserved, or sold.

The hero uses one strong seasonal painting rather than a carousel. Pair it with the Engela Art wordmark, a short artist statement, and one primary action to the gallery. The selected hero painting remains developer-managed and displays its actual status when linked.

On larger screens, place hero copy and artwork side by side. On mobile, stack them with the artwork given enough height to remain legible. Preserve the full painting by default with `object-contain` inside a stable image container. Any cropped hero treatment requires a separate, intentionally approved crop rather than automatic responsive cropping.

### Paintings Gallery

Purpose:

- Let visitors browse available and past work.

Required content:

- Painting cards
- Artwork image
- Title
- Medium, technique, or dimensions
- Status
- Public or historical NOK price
- Status filters for available, reserved, and sold work
- Orientation filters for landscape, portrait, and square work
- Sorting by year, total area, and price

Every card shows title, status, medium, technique, dimensions, and NOK price. Sold cards label the amount as historical context, and reserved cards must not imply immediate availability.

Use a regular responsive grid with consistent card widths and stable image areas. Preserve varied painting orientations with `object-contain`; do not use masonry layout. Visual order must match DOM, keyboard, and selected sort order.

### Painting Detail

Purpose:

- Give buyers enough information to inquire confidently.

Required content:

- Large image or image gallery
- Accessible fullscreen image viewer
- Title
- Medium
- Dimensions
- Year if available
- Price in NOK if available
- Status
- Description
- Reusable care guidance card
- Inquiry call-to-action
- Clear action to view all paintings
- Notice that availability is confirmed by the artist before reservation
- Note that listed price excludes shipping
- Link or short guidance explaining pickup and shipping arrangements
- Norway shipping/pickup policy and case-by-case international inquiry guidance
- Tracked-shipping and coverage expectation

Clicking or activating a painting image opens an accessible fullscreen viewer using optimized web images. It supports previous/next navigation when multiple images exist, keyboard and touch input, captions, visible close controls, focus management, and escape-to-close.

Available paintings use a painting inquiry action. Reserved paintings use an interest-list inquiry action. Sold paintings use a similar-work inquiry action that carries the painting reference and prefilled interest text into the form.

On mobile, provide a compact sticky bottom action reflecting status:

- Available: inquire about this painting
- Reserved: join the interest list
- Sold: ask about similar work

Respect device safe areas and add sufficient page padding so the action never covers content. Desktop uses the action in the normal detail layout rather than a persistent bar.

Detail pages do not include automated related-painting recommendations in v1. Provide a clear “View all paintings” action for visitors arriving from shared or search links. When gallery query state is available, also provide a “Back to paintings” action that restores the visitor's filters and sorting.

The care card renders shared bilingual baseline guidance plus the painting's explicitly selected material/surface profiles and any exceptional note. It must not invent care advice from free-text medium or technique content.

### Commissions

Purpose:

- Explain how inspired-by commission inquiries work.
- Qualify requests before the visitor contacts the artist.

Required content:

- Requests must be inspired by the artist's existing body of work
- No promise of exact reproduction, unrelated styles, or automatic acceptance
- Size-based “from” pricing
- Approximate size-based timeline guidance
- Inquiry and artist-review process
- Written commission proposal
- 50% deposit and 50% final-payment default
- Concept confirmation and one progress update
- Major-change policy
- Delivery and portfolio-use expectations
- Commission inquiry action

### About

Purpose:

- Build trust and connection with the artist.
- Communicate a personal, genuine, and distinctive artistic story.

Required content:

- Artist bio
- Portrait or process image
- First-person motivation for painting
- Recurring inspiration, materials, and process
- Concrete background details that support credibility
- Contact link
- Optional Instagram text link
- Fuller testimonials section when approved reviews exist

Prioritize story and process over a résumé. Avoid generic unsupported claims; use specific details, honest language, and real images to communicate trust and uniqueness. Exhibitions or credentials are optional supporting evidence when meaningful.

Home and About use the same testimonial data and rendering rules. Home shows a concise selection; About can show the fuller approved collection. Both suppress the section entirely when no testimonials exist.

## Primary Navigation

```txt
Home
Paintings
Commissions
About
Contact
Language switcher
```

All navigation labels and route segments are localized while preserving equivalent destinations across languages.

Desktop displays the primary destinations horizontally. Mobile uses a compact menu button that opens a simple navigation panel. Keep the language switcher directly reachable outside the panel when space permits; otherwise place it prominently at the top of the panel rather than hiding it among secondary links.

Explicit language selection sets a strictly functional first-party preference cookie. Returning visits to `/` use that preference; direct language-prefixed links always preserve the requested language.

### Contact

Purpose:

- Give visitors a general way to reach the artist.

Required content:

- Contact form as the primary path
- Public email address as a fallback
- Expected response context
- Instagram text link as a secondary follow channel
- Concise frequently asked questions

Purchase-related copy should encourage the form or direct email rather than social messages because email provides a clearer record for both buyer and artist.

All inquiry actions route to this single form. URL query parameters can select inquiry type and painting reference; the form validates them, shows the resolved context clearly, and provides translated editable prefill text. Invalid or stale query values fall back safely to a general inquiry rather than sending misleading metadata.

Beside submit, show a concise localized notice explaining that Engela Art processes the submitted information to respond, with a link to the privacy page. Do not require a privacy-consent checkbox for the inquiry itself. Marketing consent is not present because marketing email is out of scope.

### Footer

The footer includes a persistent, accessible Instagram link on every page. V1 does not embed social feeds, add floating social buttons, or repeat social links beside individual paintings.

The contact flow can also start a commission inquiry for a new painting inspired by the artist's existing work. The copy must state that requests are subject to artist approval and do not guarantee acceptance or exact reproduction.

### Privacy

Purpose:

- Explain how inquiry and buyer data is handled by the artist's ENK.

Required content:

- Business identity and contact details
- Data collected through forms and email
- Strictly functional language-preference cookie and one-year lifetime
- Purposes and legal bases
- Email provider and other relevant processors
- Retention periods for inquiries and completed sales
- Visitor rights and how to exercise them
- Explanation that no consent banner is shown because v1 uses no non-essential cookies

### Sales and Returns

Purpose:

- Explain payment, delivery, withdrawal, complaints, returns, and condition documentation before purchase.

Required content:

- Prices exclude shipping
- Paintings are sold unframed
- Norway and international delivery scope
- Mandatory withdrawal and complaint guidance
- Return contact and packaging process
- Who normally pays return shipping
- Transit-damage reporting
- Artist and buyer photography checklist
- Statement that documentation guidance does not remove mandatory rights
- Full frequently asked questions

## Frequently Asked Questions

Use one centralized bilingual FAQ data source. Contact shows a concise relevant subset; Sales and Returns shows the fuller set.

Initial topics:

- Paintings are sold unframed
- Listed price excludes shipping
- Pickup in Nannestad by arrangement
- Reserved-painting interest list
- Case-by-case international shipping
- Inspired-by commission process
- Two-business-day response target
- Bank transfer, Vipps Business, and PayPal Business

Do not create a separate help center in v1.

Render questions as native disclosure rows using `details`/`summary` semantics or an equivalently accessible implementation. Questions are closed by default, remain usable without client JavaScript, and can open when targeted by a direct FAQ anchor.

### Not Found

Purpose:

- Recover gracefully from invalid URLs.

Required content:

- Clear message
- Primary link to all paintings
- Secondary link to home

Invalid painting and route URLs render the localized not-found page and return an HTTP 404 response. Do not automatically redirect invalid URLs, because that conceals broken links and produces misleading search behavior.

## Primary Buyer Flow

```txt
Home
  -> Paintings Gallery
  -> Painting Detail
  -> Inquiry Form
  -> Success Message
```

The buyer should never need to guess what to do next. Each page should provide one obvious next step.

## Painting Inquiry Flow

```txt
Painting Detail
  -> buyer clicks inquiry CTA
  -> form includes painting reference
  -> buyer enters name, email, optional phone, and message
  -> server validates submission
  -> artist receives email
  -> buyer sees confirmation
```

## Similar-Work Inquiry Flow

```txt
Sold Painting Detail
  -> visitor clicks similar-work inquiry CTA
  -> form includes the sold painting reference
  -> form starts with translated text expressing interest in similar work
  -> visitor edits or adds context and submits
  -> artist receives the inquiry
  -> visitor sees confirmation
```

## Commission Inquiry Flow

```txt
Existing Painting or Contact Page
  -> visitor chooses to discuss an inspired-by painting
  -> form includes reference painting when applicable
  -> visitor explains the desired mood, subject, dimensions, context, and optional budget
  -> artist replies within the normal response target
  -> artist may decline, ask questions, or send a commission proposal
  -> buyer accepts or declines the written proposal
```

Submitting the form does not create a commission agreement.

Commission inquiries use a distinct inquiry type and email subject so they can be sorted separately from inquiries about existing paintings. The optional budget control offers preset NOK ranges, “not sure yet,” and a custom range.

## Reserved Painting Interest Flow

```txt
Reserved Painting Detail
  -> visitor reads the interest-list terms
  -> visitor submits a painting inquiry
  -> inquiry receives a server submission timestamp
  -> artist manages list order from timestamped emails
  -> if the painting becomes available, artist contacts the next person
  -> contacted person has 48 hours to respond
  -> if they do not respond, artist may contact the following person
```

The interface must state that joining the interest list does not reserve the painting or guarantee availability.

## Gallery Discovery Controls

Status is a filter: it narrows the gallery to available, reserved, sold, or all paintings.

Orientation is a filter derived from each painting's width and height. It narrows the gallery to landscape, portrait, square, or all paintings.

Status and orientation filters can be combined. A visitor can, for example, view available landscape paintings and then sort that result by lowest price. Each filter group is single-select in v1, with an “all” option to clear that group.

Year, total area, and price are sort options: they change the order of the visible paintings without excluding them. Each sort supports the relevant ascending and descending order, such as newest/oldest, smallest/largest, and lowest/highest price.

The default gallery order is newest first. In v1, sort by year descending and then title alphabetically as a deterministic tie-breaker. Homepage featured order does not affect gallery order.

Store active filters and sorting in URL query parameters, for example:

```txt
/en/paintings?status=available&orientation=landscape&sort=price-asc
```

The URL is the source of truth for gallery discovery state. Filtered views can be shared, refreshed, and restored through browser back/forward navigation. Filter query combinations are not separate canonical pages; the language-specific gallery URL remains canonical to avoid duplicate search-index entries.

V1 does not include text search. The expected collection is under roughly 50 paintings, so combined status and orientation filters plus sorting provide sufficient discovery without adding another control.

V1 also excludes subject and style filters. Discovery uses objective painting attributes until stable categories emerge from the actual body of work.

Render all paintings matching the active filters on one gallery page. V1 does not use pagination or infinite scroll. Use responsive images and lazy loading below the initial viewport; revisit pagination only when measured collection size or performance requires it.

If no paintings match, show a localized empty state explaining that the current filters produced no results and provide one clear-all action. Do not silently relax filters. Clearing filters updates the URL to the default gallery state.

## General Contact Flow

```txt
Contact Page
  -> buyer enters name, email, optional phone, and message
  -> server validates submission
  -> artist receives email
  -> buyer sees confirmation
```

## Artist Update Flow

```txt
Developer updates painting data and images
  -> commits change
  -> deploys site
  -> buyer-facing content is updated
```

This is intentionally simple for v1. If updates become frequent, revisit CMS or database-backed content management.

## Form States

The UI should include:

- Empty state
- Field validation errors
- Submitting state
- Success state
- Safe failure state

Failure messages should be helpful without exposing internal system details.

The success state confirms receipt, repeats that no reservation has been created, and states that the artist normally replies within two business days after checking the painting's condition and availability.

Validation and email-delivery failures preserve the visitor's entered values in the current form so they can correct or retry without retyping. Do not persist message contents to local storage. Delivery failures also provide the dedicated Engela Art email address as a fallback.

After a successful submission, clear the draft, prevent accidental duplicate resubmission, and require an explicit new-message action to start again.

Success guidance asks visitors to check spam if the automatic acknowledgement does not arrive within a few minutes. If no personal response arrives within two business days, they should check spam and then email `kontakt@engelaart.no` with the painting reference. Do not encourage repeated form submissions, because duplicates increase manual work and can confuse interest-list ordering.
