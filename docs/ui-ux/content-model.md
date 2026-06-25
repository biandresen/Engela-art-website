# UI/UX Content Model

## Artist Content

Collect this before building the final UI:

- Engela Art brand assets in full, wordmark, and compact variants
- Artist name
- Short tagline
- Short homepage introduction
- Full artist bio
- First-person artist story and motivation
- Concrete process and inspiration details
- Artist portrait
- Process or studio images
- Contact email
- Instagram and Facebook links
- Location or region, if public
- Exhibition/history notes, if relevant

Supplied launch media includes a professional artist portrait, square logo treatments, horizontal brand banners, a full logo treatment, and a decorative autumn pattern. Preserve originals as source assets until approved derivatives exist.

Optional trust content after real sales:

- Approved testimonial quote
- Approved reviewer display name
- Review date
- Original Google review link when applicable
- Written permission when republishing a review or email testimonial

The testimonials data source can be empty at launch. When empty, the testimonials module renders nothing; the site must not show placeholder reviews, an empty heading, or “reviews coming soon.”

## Painting Content

Each painting should have:

- Immutable painting ID in `EA-YYYY-NNN` format
- Title
- One stable language-neutral slug shared by both languages
- Bilingual descriptive medium
- Width, height, and depth in centimetres
- Year
- Price in NOK
- Status: `available`, `reserved`, or `sold`
- Description
- Images
- Alt text for each image
- Featured flag
- Featured display order when selected
- One or more approved care-profile keys

The featured flag is an editorial choice based on visual strength or seasonal mood, not availability. Featured work may be available, reserved, or sold.

Featured display order is explicit so homepage composition does not depend on source-file order. Non-featured paintings do not need an order.

V1 does not assign subject or style tags because the artist's work does not currently have stable, buyer-recognizable categories. Do not invent taxonomy solely to add filters.

Medium is approved descriptive text in Norwegian and English rather than a strict enum. Acrylic and texture paste on canvas is common, while individual works may also use oil, pastel, glitter, chalk, or other materials.

Name notable materials when practical, for example “Akryl, pastell og strukturpasta på lerret.” Use “mixed media on canvas” when a precise list would be unwieldy, but do not use it to conceal information material to care, appearance, or buyer expectations. Do not filter by medium in v1.

Care guidance uses explicit approved keys rather than parsing medium text. Initial reusable profiles:

- `acrylic`
- `textured-surface`
- `oil`
- `pastel-chalk`
- `glitter-delicate`

Every painting receives applicable profiles and can add an optional bilingual exceptional-care note. Profiles compose a reviewed baseline covering light, moisture, temperature, dusting, surface contact, and cleaning products.

Creation year is the only public artwork date. Do not add month or day fields in v1.

Painting IDs are unique and never reused. The year segment reflects the painting's creation year. Display the ID quietly on detail pages and include it in inquiries, invoices, condition-photo naming, and the private operations register. The slug remains a URL concern and is not the authoritative business reference.

Available paintings must have a public price in NOK. V1 does not use “price on request” or automatically converted currencies.

Store prices as positive whole-kroner integers. Format at display time:

- Norwegian: `3 000 kr`
- English: `NOK 3,000`

Do not store formatted strings or use decimal øre values in v1.

Sold paintings retain their historical listed price. Present the amount with the sold status and year so it cannot be mistaken for an available offer.

The painting record stores the public listed price, not the confidential invoice total. Do not add negotiated transaction values to public content.

Price copy must state that shipping is excluded. Site-wide purchase guidance should state that pickup in Nannestad and shipping are arranged by email.

Display dimensions as width × height × depth cm. All three values are required for launch paintings.

Derive orientation rather than storing it separately:

- **Landscape:** width is greater than height
- **Portrait:** height is greater than width
- **Square:** width and height are equal

Use width × height as the painting's total face area for smallest/largest sorting; depth does not affect orientation or gallery size order. Keeping numeric measurements as the source of truth avoids duplicated orientation or size data becoming inconsistent and supports later packaging decisions.

## Painting Status Meaning

Use clear status definitions:

- **Available:** buyer can inquire about purchasing.
- **Reserved:** another buyer currently has priority, but visitors can inquire to join the interest list.
- **Sold:** full payment has been received; the painting remains visible as portfolio work but should not use the same sales call-to-action.

Sold painting pages invite a similar-work inquiry. The form carries the painting reference and prefilled, editable text expressing interest in related work.

Reserved painting pages explain that interest-list position follows inquiry submission time, joining does not reserve or guarantee the painting, and the artist gives each contacted person 48 hours to respond before moving to the next person.

An inquiry never changes painting status automatically. The `reserved` status represents a reservation explicitly confirmed by the artist after direct communication with a buyer.

## Image Requirements

Artwork images should ideally include:

- Straight-on main image
- Room-context image showing the painting at accurate scale
- Detail/crop image if texture matters
- Consistent lighting
- Minimal glare
- Accurate color

Every launch painting requires at least:

1. One straight-on image showing only the painting as faithfully as possible.
2. One room-context image showing the painting on a wall with recognizable scale references.

Room-context images must preserve believable proportions and must not imply that pictured frames, furniture, or accessories are included unless explicitly stated.

All v1 paintings are sold unframed. State “Sold unframed” near price and delivery information. A room-context image may show a simple neutral frame for visualization, but its caption must state that the frame and furnishings are shown for illustration only.

Bad photography will weaken the site more than most missing features, so image quality is a core content requirement.

Use web-appropriate image sizes rather than publishing original-resolution files. Sold and commissioned works remain visible by default, with commissioned work excluded only when privacy was agreed before work began.

Every public painting derivative uses the approved Engela Art watermark. The watermark is baked into gallery, homepage, detail, fullscreen, room-context, and painting-specific social images during image preparation.

Keep the mark subtle and consistent. It must remain recognizable after ordinary sharing while preserving the buyer's ability to judge color, texture, and composition. Store private master files without a watermark outside the repository.

Do not watermark the artist portrait or general brand graphics. Certificate and private transaction imagery can use approved unwatermarked source files.

## Copy Requirements

The writing should be:

- Clear
- Warm
- Professional
- Specific
- Short enough to scan

Avoid vague filler copy. A buyer should quickly understand the artist, the work, and how to inquire.

Norwegian is the source language for content decisions. The artist and developer agree Norwegian copy together, and the developer approves the corresponding English translation before publication. Both language versions must be updated together when source meaning changes.

Painting titles are official artwork names and remain unchanged on Norwegian and English pages. When useful, the English description may include a short translation or explanation in parentheses, but the translated wording is not treated as a second title.

Contact copy should present the website form as the preferred route for painting inquiries, direct email as a valid fallback, and social media as a secondary channel.

Each painting has two bilingual description fields:

- **Visual summary:** required concise factual description used for previews, metadata source material, and accessibility context.
- **Artist note:** optional longer first-person or editorial text about inspiration, mood, process, or meaning on the detail page.

Do not force an artist note when the artist has nothing specific to add.

Inquiry forms require name, email, and message. Phone is optional. Painting reference, inquiry type, language, and submission timestamp are system metadata rather than fields the visitor must enter.

Commission inquiries additionally support optional desired dimensions and budget. Budget can use a preset NOK range, “not sure yet,” or a custom range.

Commission content includes editable size-based “from” prices. These are guidance only; the written commission proposal contains the final price.

Commission content includes editable approximate timeline ranges by size. The proposal contains the actual estimate, and public ranges must not be presented as guaranteed delivery dates.
