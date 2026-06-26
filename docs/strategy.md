# Strategy: Business Model and Buyer Flow

## Site Purpose

The website should do three jobs:

1. Represent the artist professionally.
2. Show the portfolio clearly.
3. Make available paintings easy to inquire about.

The site should feel like an artist portfolio with a sales path, not like a generic webshop. Art buyers often care about the story, the work, the artist, and trust before they care about checkout speed.

The public brand name is **Engela Art**. Use it consistently across the website, ENK-facing customer materials where appropriate, Google Business Profile if eligible, and social channels.

The decided canonical domain is `engelaart.no`. The preferred public contact address is `kontakt@engelaart.no`, with an English alias such as `contact@engelaart.no` optionally delivering to the same inbox. If purchased, `engela-art.no` exists only as a defensive redirect to the canonical domain.

Launch requires a dedicated Engela Art mailbox. `kontakt@engelaart.no` is the primary inbox and public Norwegian address; `contact@engelaart.no` can be an alias to the same inbox for English visitors. Do not publish the artist's personal email address or use it as the automated sender identity.

Use Zoho Mail Free as the first mailbox choice, with Zoho Mail Lite as fallback. Do not use a public Gmail address as the customer-facing identity and do not self-host production mail at home.

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
  -> checks title, medium, technique, dimensions, status, and price
  -> sends inquiry
  -> artist follows up manually
```

The buyer should always understand:

- Who made the work
- Whether the painting is available
- What the painting is made with
- How large it is
- What it costs
- How to contact the artist

## Homepage Funnel

The homepage prioritizes existing available originals over commissioned work:

1. Artist identity and a strong artwork-led first impression
2. A manually curated selection of visually strong or seasonally appropriate paintings
3. Primary action to view all paintings
4. Secondary action to discuss an inspired-by commission
5. Artist story and trust-building content

Featured homepage work may be available, reserved, or sold because its purpose is to communicate the artist's quality and current mood. Every featured painting displays its actual status and uses the corresponding inquiry treatment. This keeps the site portfolio-led while the primary gallery action still directs buyers toward discoverable available work.

Homepage curation remains developer-managed in v1. The artist chooses the featured paintings and their intended order; the developer updates the painting records and redeploys the site.

## Funnel Analytics

V1 includes privacy-conscious analytics to understand which content and paths lead to inquiries. Measure:

- Language selection
- Gallery filter and sort usage
- Painting detail views
- Painting, interest-list, similar-work, and commission inquiry starts
- Successful inquiry submissions by inquiry type
- Outbound email, Instagram, and Facebook clicks

Analytics must never capture names, email addresses, phone numbers, message text, custom budget text, exact interest-list membership, or other buyer-identifying form data. Painting events may use the public painting slug.

Use cookieless, aggregate analytics at launch and exclude advertising or cross-site tracking. The intended first provider is PostHog Cloud's free tier in the EU region, configured only for allowlisted page and funnel events. Disable autocapture, session replay, surveys, user profiles, form capture, and unrelated product features. Plausible is the paid fallback if PostHog later becomes unsuitable.

Prefer free tiers for hosting, transactional email, monitoring, and analytics while usage remains low. The expected recurring launch costs are the domain and dedicated mailbox; upgrade services only when measured limits, reliability, or operational needs justify it.

## First Three-Month Success Review

Evaluate launch using qualified outcomes rather than traffic alone:

- Qualified existing-painting inquiries
- Interest-list and similar-work inquiries
- Commission inquiries
- Inquiry-to-reservation rate
- Reservation-to-sale rate
- Painting detail views and inquiries by public slug
- Form delivery success and failure
- Production error and accessibility findings

Anonymous analytics provides discovery and inquiry events. The private operations register provides reservation and sale outcomes. Do not attempt to join these sources using personal identifiers; manual aggregate review is sufficient for v1.

## Future Enhancements After Review

The following remain outside v1 and should be reconsidered only after launch data or repeated operational friction demonstrates value:

- CMS, database, or admin dashboard
- Cart, checkout, or website payment integration
- Customer accounts, order lookup, or tracking portal
- Automated invoicing
- Automated interest-list management
- Newsletter and subscriber management
- Embedded social feeds
- Gallery text search or subject/style tags
- Pagination or infinite scroll
- Safe mobile status-update automation
- Google review API integration
- Carrier or shipping integration

Technical interest alone is not sufficient justification. Use the three-month review, artist workload, buyer feedback, and observed errors to prioritize changes.

## No Newsletter in V1

V1 does not include a newsletter, mailing list, marketing email signup, or marketing consent flow. Contact and inquiry email addresses are used only for the conversation or transaction for which they were provided and are never added to a marketing list.

Email marketing can be reconsidered only as a separate feature with explicit opt-in, unsubscribe handling, a subscriber data store, and updated privacy documentation.

## Social Media Placement

V1 links to Instagram and Facebook through persistent footer icons, Contact-page text links, and an optional About-page Instagram link. It does not embed social feeds, add floating social buttons, or place social actions beside individual paintings.

## Language and Market Reach

V1 supports the complete buyer journey in Norwegian and English. Norway remains the primary market, while English removes an unnecessary barrier for residents and international buyers who do not speak Norwegian.

Use explicit `/no/...` and `/en/...` URLs. The root URL directs first-time visitors according to browser language with Norwegian as the fallback, and visitors can change language at any time without losing their current page.

Norwegian is the authoritative source copy. The artist and developer agree the Norwegian wording together; the developer prepares and approves the English translation against that source. Machine translation may assist drafting but is never published without human review.

## Price Visibility

Every available painting has a public price in NOK. V1 does not use “price on request” for available work.

English pages also show NOK rather than an estimated converted price. This keeps the displayed price authoritative and avoids maintaining exchange-rate logic.

Sold paintings retain their historical listed price in v1. Display it together with the sold status and painting year so visitors understand that it is pricing context, not a current offer. This supports trust and helps buyers evaluate similar-work and commission inquiries.

If the artist privately agrees a different transaction amount, the website continues to show the historical listed price. Negotiated painting amount, discount, shipping, fees, and actual paid total remain in Fiken and private records.

## Interest in Sold Work

Sold paintings remain visible as portfolio work. Their primary action invites the visitor to ask about similar work rather than implying that the original is still available.

The action opens the inquiry form with the sold painting attached as its reference and prefilled copy explaining that the visitor is interested in similar work. These inquiries help the artist identify styles and subjects with buyer interest. They are not automatically treated as commission requests.

Available, reserved, and sold painting pages remain publicly indexable. Sold and reserved work contributes to the artist's portfolio authority and can convert into similar-work or interest-list inquiries. A commission agreed as private receives no public painting page.

## Commission Inquiries

The artist is open to discussing new paintings inspired by her existing body of work. The site may accept commission inquiries with one or more existing paintings as references.

A commission inquiry creates no obligation to accept the work and no automatic agreement on subject, dimensions, price, revisions, deadline, or delivery. The artist does not promise exact reproductions or work in arbitrary styles unrelated to her own. Any commission becomes real only after direct discussion and explicit written agreement.

Commission inquiries are categorized separately from inquiries about existing paintings so their emails can be sorted and handled through a distinct workflow.

The commission form can collect an optional budget using these starting ranges:

- Under NOK 5,000
- NOK 5,000–10,000
- NOK 10,000–20,000
- Over NOK 20,000
- Not sure yet
- Custom range

After reviewing the request, the artist may decline it, ask follow-up questions, or send a commission proposal. A proposal defines the creative direction, dimensions, medium, price, estimated timeline, included feedback points, delivery arrangements, and payment terms. No painting work begins merely because an inquiry or proposal exists.

The default commission payment schedule is:

1. The buyer accepts the written commission proposal.
2. The artist issues an invoice for a 50% deposit.
3. Work begins only after the deposit is received.
4. The remaining 50% is invoiced after completion approval and must be paid before shipping or pickup.

The proposal explains what the deposit covers, including reserved studio time and initial material or work costs. Cancellation and refund language must comply with mandatory Norwegian consumer rights and receive legal/accounting review before launch; the site must not make an absolute “non-refundable in all circumstances” promise.

The default commission feedback process includes:

1. One concept confirmation before painting begins.
2. One progress update where the buyer may discuss minor direction within the accepted concept.
3. Completion approval before the final invoice.

The artist does not guarantee revisions after the physical painting is substantially complete. Requests that materially change the accepted subject, dimensions, composition, palette, or other scope require separate agreement on feasibility, price, and timeline.

Commission pages publish editable starting-price guidance:

- Small study, up to 30 × 30 cm: from NOK 1,000
- Medium, up to 50 × 50 cm: from NOK 3,000
- Large, up to 70 × 70 cm: from NOK 5,000
- Larger or unusual formats: individually quoted

These tiers are indicative starting prices rather than automatic quotes. The final commission proposal sets the authoritative price based on dimensions, medium, materials, subject, detail, complexity, composition, and delivery. Requests remain within the artist's existing artistic practice rather than treating arbitrary style as a price option.

Commission pages also publish editable, non-binding timeline guidance:

- Small study: approximately 2–4 weeks
- Medium: approximately 4–8 weeks
- Large: approximately 6–12 weeks
- Larger or unusual work: estimated individually

The accepted commission proposal provides the actual estimated schedule after considering current workload, materials, drying time, feedback, and delivery. Public ranges are planning guidance, not guaranteed completion dates.

## Artwork Copyright and Portfolio Visibility

The artist retains copyright in artwork images and the creative work when the physical painting is sold, unless a separate written agreement states otherwise.

Sold paintings remain visible in the public portfolio by default. Completed commissioned paintings may also be photographed and displayed in the artist's portfolio and social channels by default. A buyer who needs privacy must agree that exception in writing before commission work begins.

The website uses appropriately sized web images, provides no dedicated download action, and includes clear copyright guidance. Visitors may share links to public painting pages; commercial reuse, reproduction, or claims of ownership are not permitted without authorization.

Every public painting-image derivative carries a subtle Engela Art watermark. This includes gallery thumbnails, homepage painting images, detail and fullscreen-viewer images, room-context images, and painting-specific social previews.

The watermark must be visible enough to identify Engela Art after casual copying but must not cover important artwork details or materially distort color evaluation. Use a consistent corner placement, responsive scale, safe margin, and restrained opacity. If a chosen corner conflicts with important content, an approved alternate corner can be selected for that image.

Apply the watermark during the image-preparation process so the public image file itself is marked; a CSS-only overlay is insufficient because it leaves the downloaded asset unwatermarked.

Private master files remain unwatermarked and outside the public application. Brand graphics, the artist portrait, private condition photos, and buyer-facing certificate imagery do not require the public website watermark.

## Certificate of Authenticity

Every sold original includes:

- A signed physical certificate packed with or handed over alongside the painting
- A matching PDF emailed after full payment and before or at dispatch/pickup

Each certificate is bilingual in Norwegian and English within one document. It contains Engela Art and artist identity, certificate number, painting ID, official title, year, medium, technique, width × height × depth, a reference image, artist signature, and sale date. The invoice remains the financial record; the certificate identifies the original artwork.

V1 creates certificates manually from one controlled bilingual template. Website certificate generation and public verification are future enhancements, not launch scope.

## Reviews and Testimonials

After the ENK name and operating model are finalized, the artist may create a Google Business Profile only if the business qualifies under Google's current location and address rules. Pickup is available in Nannestad by appointment, but the business must not be misclassified as a service-area business merely to hide a residential address.

After each completed sale, every buyer receives the same neutral request for an honest Google review. Reviews are never purchased, rewarded, or limited to buyers expected to respond positively.

V1 does not integrate the Google Business Profile API. The site can link to the verified profile and, after receiving permission, manually display selected review excerpts with attribution and a link to the original review.

If a policy-compliant Google profile is unavailable, the artist can request permission-based testimonials by email. Store the approved quote, display name, date, and written publication consent. The site does not provide its own public review-submission system.

The codebase supports testimonials before launch, but the public site renders no testimonials section while there are no approved entries. Do not preserve commented-out UI. A single testimonials module owns rendering, attribution, source links, and empty-list behavior so publishing the first reviews is a content update rather than a homepage rewrite.

## Interest in Reserved Work

Visitors can inquire about reserved paintings and join an interest list ordered by submission time. Joining the list does not reserve the painting or guarantee that it will become available.

If the current reservation ends without a sale, the artist contacts the next person on the list. That person has 48 hours from contact to respond before the artist may contact the next person. V1 manages this process manually from timestamped inquiry emails rather than storing the list in a database.

## Reservation Workflow

Submitting an inquiry does not change a painting's status. A painting becomes reserved only after the artist and buyer have directly communicated and the artist explicitly grants temporary priority.

For v1, the artist tells the developer when a reservation is confirmed, completed as a sale, or released. The developer updates the painting record and redeploys the site. This manual transition avoids allowing spam, casual questions, or abandoned inquiries to change public availability.

The public status lifecycle is:

```txt
available
  -> artist confirms reservation
reserved
  -> full payment received
sold
```

An expired, declined, or released reservation returns to `available`. Inquiry submission, proposal acceptance, invoice issuance, or partial payment alone does not produce `sold`.

V1 has no additional public statuses. If a completed sale is refunded and the painting returns, it changes back to `available` only after the artist receives it, checks its condition, and confirms that it can be sold again.

Do not display public “last updated” or availability timestamps in v1. Near inquiry actions, state that availability is confirmed by the artist before reservation. Git history provides sufficient internal traceability while content remains developer-managed.

## Invoice and Payment

After the artist confirms availability, condition, delivery arrangements, and the reservation directly with the interested buyer, the ENK sends a formal invoice. V1 does not collect payment through the website.

The invoice offers:

- Bank transfer as the preferred, lowest-cost method
- Vipps Business as a convenient Norwegian alternative
- PayPal Business as an international alternative

The buyer pays the same agreed invoice total regardless of payment method. Payment-provider transaction fees are treated as business costs and considered in general pricing rather than added as buyer-facing payment surcharges. Private Vipps transfers and PayPal “friends and family” are not used for business sales.

The invoice includes the ENK identity and organization number, sequential invoice number, issue date, buyer details, painting reference, painting price, shipping cost, total, payment deadline, payment instructions, and agreed reservation or delivery terms. Payment must be received before shipping or handover unless the artist explicitly agrees otherwise.

Website sales and commission terms are informational. Formal acceptance happens in the transaction-specific written email, invoice, or commission proposal after final price, delivery, and scope are known. The record should reference the applicable terms or include them directly; v1 does not use a generic website terms checkbox as proof of the final agreement.

The standard payment and reservation timeline is:

1. The invoice is due within three business days.
2. If unpaid, the artist sends one standard follow-up email.
3. The follow-up grants one final extension of three business days.
4. If payment is still missing and no alternative arrangement was agreed, the reservation is released without further reminders.

The invoice and reminder state exact calendar due dates. The artist can explicitly agree to a different deadline for exceptional circumstances, such as international transfer delays.

## Artist/Admin Workflow

V1 does not include an admin dashboard.

The operating assumption is that recurring painting sales run through the artist's enkeltpersonforetak (ENK), subject to registration and confirmation before public launch.

Workflow:

1. Developer updates painting records in the codebase.
2. Developer adds or replaces artwork images.
3. Developer commits the change.
4. Site is redeployed through the managed hosting provider.
5. Buyer inquiries arrive by email.
6. Artist replies manually.

The artist remains responsible for the ENK's bookkeeping and reporting even if a family member helps perform the accounting work. Income, material costs, website costs, shipping costs, and other relevant documentation should be retained from the beginning.

Eligible business expenses reduce taxable profit; they are not automatically tax-free purchases. Sales of original art made and owned by the artist are generally exempt from VAT, which also generally means VAT on materials for that exempt activity cannot be reclaimed. Tax and VAT treatment must be checked against the artist's actual activities before launch, especially if the business later sells other goods or services.

This workflow is intentionally simple. It keeps the first version focused on launching a high-quality public site.

## Inquiry Flow

The website form is the primary channel for purchase-related inquiries. It gives the artist a consistent email record containing the visitor's contact details, language, inquiry type, message, and painting reference.

The site also displays a direct email address as a fallback. Instagram and Facebook links are available for general contact and following the artist, but the interface encourages buyers to use the form or email for purchase discussions so both parties retain a clearer, more formal record.

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

The system automatically attaches inquiry type, language, painting reference when applicable, and a server-generated submission timestamp. Postal address and other fulfillment details are not collected before the artist confirms that they are needed.

## Inquiry Acknowledgement and Human Response

A successful form submission immediately shows an on-page acknowledgement and sends an automatic confirmation email containing the visitor's message and painting reference. Both must say that the inquiry was received, not that the painting is reserved.

The artist checks the painting's current condition and availability before replying personally. The stated response target is within two business days. Until the artist directly confirms a reservation, the sender remains an interested buyer and the painting's public status does not change.

Use Resend's free transactional-email tier for the artist notification and buyer acknowledgement. Each successful inquiry consumes two sends. Review current limits and delivery terms before launch, and move providers or plans only when actual traffic or reliability requires it.

## Pickup and Shipping

Listed painting prices exclude shipping. Pickup and shipping arrangements, including any shipping cost, are agreed through email after an inquiry.

The public site states “Pickup in Nannestad by arrangement” but never publishes the artist's home address. The exact pickup address is shared privately only after the artist confirms the buyer and pickup plan.

All v1 paintings are sold unframed. This is a site-wide sales rule rather than duplicated per-painting data. If framed sales are introduced later, framing can become an explicit painting attribute.

Norway is the standard launch market: buyers can arrange pickup in Nannestad or domestic shipping. International inquiries are welcome, but shipping is assessed individually before reservation or invoicing. The artist does not promise delivery to every destination.

For international requests, confirm destination eligibility, packaging, carrier availability, insurance, customs documentation, taxes or import charges, delivery estimate, and total cost before the buyer accepts. Buyers are informed that destination-country import charges may be their responsibility where legally applicable.

All shipped paintings use tracked delivery and appropriate insurance or declared-value coverage where available. Tracking and coverage protect both buyer and artist by documenting carrier handoff, transit, and delivery.

V1 does not prescribe one carrier. Before invoicing, the artist selects an eligible service based on parcel dimensions, destination, painting value, tracking, insurance limits, exclusions for artwork, delivery estimate, and price. Do not assume ordinary parcel coverage is sufficient for every painting.

After dispatch, the artist emails the buyer the carrier name, tracking number or link, dispatch date, and relevant delivery instructions. V1 has no customer account, order lookup, or tracking portal.

## Private Operations Register

The artist and bookkeeping helper share a private spreadsheet or equivalent operations register. It provides one-row-per-painting oversight while email remains the detailed communication record.

Track only what is operationally necessary:

- Painting title and slug
- Public status
- Interest-list order or email-thread references
- Reserved buyer reference
- Invoice number and due dates
- Payment state
- Pickup or shipping state
- Carrier and tracking reference
- Sale completion date
- Review request state

Restrict access to the artist and bookkeeping helper, require multi-factor authentication where available, and avoid duplicating unnecessary personal data from email. This register is private and never stored in Git or exposed through the website.

## Accounting and Invoicing

Use a 30-day Fiken trial as the preferred starting point for ENK bookkeeping and compliant invoice numbering. Both the artist and bookkeeping helper have individual access.

Start with:

- Base accounting and invoicing
- Manual bank reconciliation at low volume
- No KID, bank integration, or API integration
- Optional ENK tax-return assistance only if useful

The private operations register supports sales workflow, while Fiken remains the authoritative accounting and invoice record. Reassess the provider after the trial before committing long term.

## Status Update Target

After the artist confirms a reservation, payment, release, refund, or return condition, the developer publishes the corresponding website status within one business day. Same-day updates are preferred but not promised.

Initial updates use the normal code-review workflow. A future operational enhancement may provide a manually triggered GitHub Actions form that validates a selected painting and status and opens a pull request, allowing safer phone-based updates without directly editing TypeScript.

## Returns, Complaints, and Condition Records

For non-commissioned distance sales, Engela Art follows mandatory withdrawal, complaint, and refund rights. Final legal wording must be reviewed before launch.

The intended operational policy is:

- The buyer contacts the artist before returning a painting.
- The painting is safely repackaged for return.
- The buyer normally pays withdrawal-related return shipping unless law or the agreed terms require otherwise.
- Engela Art covers appropriate remedies for paintings that are faulty, damaged in transit, or materially different from their description, subject to the applicable facts and law.
- Refunds are handled after the returned painting is received and inspected, within mandatory legal deadlines.
- Transit damage should be reported promptly with photographs so the artist can pursue a carrier or insurance claim.

Both parties create condition records:

- Before dispatch, the artist photographs the painting, relevant details, packaging stages, and sealed parcel.
- On receipt, the buyer is asked to photograph the parcel before opening and the painting promptly after unpacking.
- Before a return, the buyer photographs the painting, packaging stages, and sealed parcel.
- On returned receipt, the artist photographs the parcel and painting promptly.

Photographs support condition assessment and shipping claims. Missing or imperfect photographs do not automatically remove mandatory consumer rights.

Post-sale photographs and claim documentation are exchanged through the dedicated Engela Art mailbox. V1 does not accept file uploads or store return/complaint attachments on the website.

## Personal Data Retention

The planned retention schedule is:

- Unsuccessful inquiries: delete or anonymize 12 months after the last contact.
- Interest-list entries: delete when the painting is sold or 12 months after the last contact, whichever is appropriate first unless an active conversation continues.
- Completed-sale correspondence and documentation: retain for five years when needed for accounting, complaint handling, or establishing legal claims.
- Active complaints or disputes: retain relevant records until the matter is resolved, even if the normal period has passed.

The privacy notice must distinguish inquiry records from completed-sale and accounting records. This schedule must receive a final legal/accounting review before launch.

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

## Launch Content Gate

Do not launch publicly until the site has:

- At least six fully documented paintings
- At least three manually curated featured paintings
- Accurate status, numeric dimensions, year, price, and images for every included painting
- Official painting title plus complete Norwegian and English summaries, medium text, technique text, optional artist notes, and image alt text for every included painting
- Final artist biography and introductory copy in both languages
- Working contact email plus Instagram and Facebook links
- Confirmed ENK identity details or a documented registration completion step before sales
- Reviewed privacy, sales, cancellation, and commission terms
- A real end-to-end inquiry email test

Six paintings is the minimum viable collection, not a maximum. Additional complete paintings can be included without delaying launch for incomplete work.

The artist owns approval of commercial and artistic truth: artwork, images, status, pricing, Norwegian copy, sales policies, and public business details. The developer owns English translation approval and technical release readiness. Public launch requires both approvals.
