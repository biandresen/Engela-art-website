# Manual Sales Operating System

## Purpose

This guide turns Engela Art website inquiries into controlled manual sales
workflows without adding accounting, payment, shipping, mailbox, or certificate
features to the website.

Use this document with:

- `docs/business-and-family-workflows.md`
- `docs/deployment.md`
- `docs/adr/0007-use-zoho-for-the-business-mailbox.md`
- `docs/adr/0008-use-fiken-for-accounting-and-invoicing.md`

## Professional Review Boundary

This document is an operational checklist, not legal, accounting, tax, shipping,
insurance, or consumer-rights advice.

Before launch, the artist and bookkeeping helper should have a qualified
professional review:

- ENK business identity and invoice requirements.
- VAT, bookkeeping, and retention duties.
- Consumer cancellation, return, complaint, and damage wording.
- International shipping, customs, and import-tax wording.
- Commission deposit, cancellation, scope-change, and delivery terms.
- Certificate-of-authenticity wording.

Operational assumptions can be used for drafting and internal rehearsal, but
buyer-facing text should not be treated as final professional advice.

## Zoho Mailbox Setup Checklist

Target mailbox:

- Primary public address: `kontakt@engelaart.no`
- Optional English alias: `contact@engelaart.no`
- Mail hosting provider: Zoho Mail Free where available, otherwise Zoho Mail Lite
- DNS host: Cloudflare
- Transactional sender: Resend, using an authenticated `engelaart.no` sender

Checklist:

- Create the Zoho organization for the Engela Art domain.
- Create the `kontakt@engelaart.no` mailbox.
- Add `contact@engelaart.no` as an alias or forwarding address if English
  visitors should see a localized address.
- Give the artist primary mailbox access.
- Give any helper their own account if mailbox access is needed.
- Do not share one password between family members.
- Enable MFA for every Zoho user.
- Store backup codes in the private password manager or agreed secure location.
- Add Zoho MX records in Cloudflare.
- Add Zoho SPF authorization.
- Add Zoho DKIM records and verify signing.
- Add Resend SPF/DKIM records for website-generated transactional email.
- Publish one combined SPF record that authorizes both Zoho and Resend.
- Publish a DMARC record in monitoring mode first, then tighten after verified
  delivery is stable.
- Send test messages from Zoho to Gmail, Outlook, and another external mailbox.
- Submit a website inquiry in a safe environment and confirm the artist
  notification lands in the business inbox.
- Confirm replies to website inquiries use the buyer's address as reply-to, not
  a personal artist address.

Compatibility notes:

- A domain should have one SPF TXT record. Combine authorized senders instead of
  creating separate SPF records for Zoho and Resend.
- Zoho handles normal human email. Resend handles website-generated
  transactional email. They are separate senders sharing the same domain.
- Keep production email secrets in Netlify production environment variables, not
  in this repository.

## Fiken Trial Checklist

Trial goal:

Confirm that Fiken can handle Engela Art invoicing, bookkeeping support, payment
reconciliation, and records without any website integration in v1.

Checklist:

- Create or confirm the Engela Art ENK business profile.
- Confirm legal business name, organization number, business address handling,
  and contact details before issuing real invoices.
- Add the artist as the responsible owner user.
- Add the bookkeeping helper with separate user access and the least access that
  still lets them do their work.
- Enable MFA for all Fiken users if available.
- Confirm invoice numbering starts correctly and cannot be manually reused.
- Confirm invoice numbers meet Norwegian bookkeeping requirements.
- Create a draft invoice for one existing painting and check every visible field.
- Confirm the invoice can include painting title, painting ID, shipping, payment
  deadline, and agreed delivery terms.
- Confirm bank account, Vipps Business, and PayPal Business payment instructions
  can be represented without adding a method surcharge.
- Confirm payment reconciliation can be done manually from bank/Vipps/PayPal
  records.
- Confirm credit note or correction workflow before the first real sale.
- Confirm receipt and expense attachment workflow.
- Confirm export or backup options for accounting review.
- Document who checks reconciliation weekly while sales are active.

V1 boundary:

- Do not connect the website to the Fiken API.
- Do not store invoice state in the website.
- Do not let a website inquiry create an invoice automatically.
- Do not mark a painting as sold until full payment is confirmed manually.

## Private Operations Register Template

Keep this register in a private spreadsheet or equivalent tool. It must not be
stored in the public website repository.

Data-minimization rule:

Store enough information to run the sale and find the source email thread. Keep
long conversations, personal context, and buyer messages in the business inbox
instead of duplicating them into the register.

Recommended columns:

| Column                             | Purpose                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------- |
| Register row ID                    | Internal row reference, for example `OPS-2026-001`.                     |
| Painting ID                        | Public immutable painting reference, for example `EA-2026-001`.         |
| Painting title                     | Human-readable title.                                                   |
| Public slug                        | Website slug for quick lookup.                                          |
| Current public status              | `available`, `reserved`, or `sold`.                                     |
| Inquiry type                       | Painting, interest list, similar work, or commission.                   |
| Inquiry received at                | Server timestamp from the website email.                                |
| Interest order                     | Manual order for reserved-painting interest lists.                      |
| Buyer reference                    | Minimal identifier, such as name plus email-thread link.                |
| Email thread link                  | Link or mailbox search term for the authoritative conversation.         |
| Reservation confirmed at           | Date/time the artist confirmed the reservation by email.                |
| Reservation expires on             | Normal invoice deadline, usually three business days.                   |
| Reminder sent at                   | Date/time the single reminder was sent.                                 |
| Final extension expires on         | Final three-business-day extension deadline.                            |
| Release confirmed at               | Date/time the reservation was released, if unpaid.                      |
| Invoice number                     | Fiken invoice number.                                                   |
| Invoice sent at                    | Date invoice was sent.                                                  |
| Invoice due date                   | Payment due date from Fiken.                                            |
| Painting price NOK                 | Listed or agreed painting price.                                        |
| Shipping NOK                       | Agreed shipping charge, if any.                                         |
| Total invoice NOK                  | Total invoiced amount.                                                  |
| Payment method                     | Bank, Vipps Business, PayPal Business, or other approved method.        |
| Payment status                     | Not invoiced, invoiced, partially paid, fully paid, refunded, credited. |
| Full payment confirmed at          | Operational trigger for website status `sold`.                          |
| Fulfillment method                 | Nannestad pickup or tracked shipping.                                   |
| Carrier                            | Shipping provider, if used.                                             |
| Tracking reference                 | Tracking number or carrier reference.                                   |
| Condition photos complete          | Yes/no for pre-dispatch or pickup photos.                               |
| Tracking email sent at             | Date tracking details were emailed.                                     |
| Delivered/picked up at             | Completion date.                                                        |
| Return window/status               | Internal note for returns or complaints.                                |
| Certificate number                 | Matching physical/PDF certificate reference.                            |
| Physical certificate included      | Yes/no.                                                                 |
| PDF certificate sent at            | Date PDF certificate was emailed.                                       |
| Review request sent at             | Date neutral review request was sent.                                   |
| Website status update requested at | Date developer was asked to update status.                              |
| Website status updated at          | Date status was published.                                              |
| Notes                              | Short operational notes only. Avoid sensitive personal detail.          |

Suggested status values:

- Inquiry received
- Awaiting artist reply
- Awaiting buyer reply
- Reserved
- Invoice sent
- Reminder sent
- Final extension
- Released
- Paid
- Fulfillment in progress
- Completed
- Returned/refunded
- Closed without sale

## Reservation Workflow

An inquiry alone never reserves a painting. A reservation begins only after the
artist confirms it in writing with the buyer.

Default flow:

1. Artist receives the inquiry in the Engela Art mailbox.
2. Artist checks the physical painting's availability and condition.
3. Artist confirms pickup/shipping assumptions with the buyer.
4. Artist decides whether to reserve the painting.
5. Artist sends a reservation confirmation email.
6. Artist records the reservation in the private operations register.
7. Artist or bookkeeping helper creates and sends the Fiken invoice.
8. Developer is asked to update the website status to `reserved`.
9. Buyer has three business days to pay the invoice.
10. If unpaid, artist sends one standard reminder.
11. Buyer receives one final three-business-day extension.
12. If still unpaid and no written exception was agreed, artist releases the
    reservation.
13. Developer is asked to return the website status to `available`.
14. If full payment is received, artist confirms payment in the register.
15. Developer is asked to update the website status to `sold`.

Release rule:

- Full payment is the normal operational trigger for `sold`.
- Accepted terms, invoice issuance, partial payment, or verbal interest do not
  make the painting sold.
- A released reservation returns to `available` only after the artist confirms
  the painting is still available and in expected condition.

Interest-list rule for reserved paintings:

- Order is based on the server submission timestamp in the inquiry email.
- Joining the interest list does not reserve the painting.
- If the current reservation is released, the artist contacts the next person.
- The contacted person has 48 hours to respond before the artist may move to the
  next person.

## Invoice Template

Use Fiken as the source of truth for invoice numbers and accounting records.
This template describes the content to check before sending.

Required invoice content:

- Engela Art / ENK legal business identity.
- Organization number.
- Business contact email.
- Invoice number generated by Fiken.
- Invoice date.
- Buyer name and billing details needed for a compliant invoice.
- Painting title.
- Painting ID.
- Public website slug or URL, where useful.
- Medium and dimensions, if helpful for identification.
- Painting price in NOK.
- Shipping or pickup line.
- Total amount in NOK.
- Payment deadline, normally three business days for reservations unless another
  written agreement exists.
- Payment instructions.
- Delivery or pickup agreement.
- Short reservation terms.
- Consumer rights / return wording after professional review.

Payment methods:

- Bank transfer.
- Vipps Business.
- PayPal Business.

Payment-method rule:

- The buyer should normally pay the same invoice total regardless of payment
  method.
- Do not add a payment-method surcharge unless a professional confirms it is
  allowed and the buyer-facing wording is updated.

Example reservation terms for professional review:

```txt
This invoice concerns the original painting [Painting title] ([Painting ID]).
The painting is reserved until [date] while payment is pending. The reservation
is confirmed only for the buyer named on this invoice. If payment is not
received by the deadline, Engela Art may send one reminder and then release the
reservation after a final three-business-day extension unless another written
agreement is made.
```

## Proposal Template for Existing Paintings

Use this when the artist needs to summarize a sale before invoicing.

```txt
Subject: Proposal for [Painting title] ([Painting ID])

Hi [Buyer name],

Thank you for your interest in [Painting title].

Seller:
- Engela Art / [ENK legal name if different]
- Organization number: [Organization number]

Painting:
- Title: [Painting title]
- Reference: [Painting ID]
- Year: [Year]
- Medium/technique: [Medium and technique]
- Dimensions: [Width] x [Height] x [Depth] cm
- Status: Available, subject to confirmation

Price:
- Painting: NOK [amount]
- Shipping/pickup: [NOK amount or pickup by appointment in Nannestad]
- Total: NOK [amount]

Payment options:
- Bank transfer
- Vipps Business
- PayPal Business

The total is the same regardless of payment method.

Reservation:
If you want to continue, I will reserve the painting for you and send an invoice.
The normal invoice deadline is three business days. If payment is not received,
I send one reminder and then one final three-business-day extension before the
painting can be released.

Delivery:
[Pickup/shipping details, tracking, coverage, and expected timing.]

Best,
[Artist name]
Engela Art
```

## Shipping and Pickup Checklist

Pickup in Nannestad:

- Confirm pickup by appointment only.
- Do not publish the home address on the website.
- Share the exact pickup address privately after the buyer and appointment are
  confirmed.
- Photograph the painting condition before handover.
- Prepare the signed physical certificate.
- Ask the buyer to confirm receipt by email if practical.
- Update the register after pickup is complete.

Tracked shipping:

- Confirm destination country and full delivery address privately.
- Confirm whether shipping is domestic or international.
- Assess whether the painting's size, materials, value, and destination are
  suitable for shipping.
- Compare carrier tracking, coverage, declared-value, and packaging rules.
- For international shipments, assess customs forms, export restrictions,
  import duties, VAT, and buyer responsibility before accepting the shipment.
- Photograph the painting before packing.
- Photograph important details and existing condition notes.
- Photograph each packing stage.
- Photograph the sealed package.
- Keep shipping receipt and tracking reference.
- Email tracking information to the buyer.
- Include the signed physical certificate unless a safer certificate delivery
  plan is agreed.
- Email the PDF certificate.
- Update the operations register.

Return and condition handling:

- Ask the buyer to photograph the package before opening if damage is visible.
- Ask the buyer to photograph the painting and packaging before any return.
- Keep carrier claim deadlines in the register.
- Do not promise that internal photo rules override mandatory consumer rights.
- Have return, complaint, damage, and refund wording professionally reviewed.

## Commission Proposal Template

Use this only after the artist decides the request fits her artistic practice.
A commission inquiry does not create an accepted project.

```txt
Subject: Commission proposal from Engela Art

Hi [Buyer name],

Thank you for discussing a possible commission inspired by [reference painting
or theme].

Seller:
- Engela Art / [ENK legal name if different]
- Organization number: [Organization number]

Scope:
- Working title / idea: [Short description]
- Format: [Width] x [Height] x [Depth] cm
- Medium/technique: [Description]
- Visual direction: [Subject, mood, colors, texture, and limits]
- Reference works: [Painting IDs/titles or "none"]
- Not included: Exact reproduction, unrelated styles, or major scope changes
  unless separately agreed.

Price and payment:
- Total price: NOK [amount]
- Deposit: 50% due after written acceptance and before work begins
- Final payment: 50% due after completion approval and before shipping or pickup
- Shipping/pickup: [Included / estimated / quoted separately]

Timeline:
- Estimated start: [Date or condition]
- Estimated completion: [Range]
- This estimate depends on materials, drying time, workload, feedback, and
  delivery arrangements.

Feedback process:
- One concept confirmation before painting begins
- One progress update where minor direction can be discussed within the accepted
  concept
- Completion approval before the final invoice

Change control:
Requested changes that materially alter the subject, dimensions, composition,
palette, medium, timeline, or complexity require a separate written agreement on
feasibility, price, and schedule.

Privacy and portfolio use:
Engela Art retains copyright in the artwork and images unless a separate written
agreement says otherwise. Completed commissioned paintings may be photographed
and shown in Engela Art's portfolio and social channels by default. If you need
privacy, we must agree that in writing before work begins.

Delivery:
[Pickup/shipping plan, tracking, coverage, and certificate plan.]

Professional review note:
Deposit, cancellation, return, and complaint wording must comply with mandatory
consumer rights and accounting requirements.

To accept:
Please reply confirming that you accept this proposal. I will then send the
deposit invoice. Work begins only after the deposit is received.

Best,
[Artist name]
Engela Art
```

## Neutral Review Request Template

Send only after the sale is completed and the buyer has received the painting.
Do not offer rewards, discounts, gifts, or pressure for a positive review.

```txt
Subject: Thank you from Engela Art

Hi [Buyer name],

Thank you again for buying [Painting title]. I hope the painting brings you joy
in its new home.

If you would like to share your honest experience, you can leave a review here:
[review link]

There is no obligation, and I appreciate your feedback either way.

Best,
[Artist name]
Engela Art
```

Website testimonial rule:

- Do not copy a private email onto the website without permission.
- Store the approved quote, display name, source, date, and publication
  permission privately.
- Do not imply a Google rating or Google profile before it is verified and
  policy-compliant.

## Certificate of Authenticity Template

Each sold original should receive a signed physical certificate and a matching
PDF certificate. The certificate identifies the artwork; the invoice remains the
financial record.

Recommended certificate number:

```txt
EA-COA-YYYY-NNN
```

Controlled bilingual template:

```txt
CERTIFICATE OF AUTHENTICITY / EKTHETSSERTIFIKAT

Certificate number / Sertifikatnummer:
[EA-COA-YYYY-NNN]

Artist / Kunstner:
[Artist legal/public name]

Business / Virksomhet:
Engela Art / [ENK legal name if different]

Artwork title / Tittel:
[Painting title]

Painting reference / Malerireferanse:
[Painting ID]

Year / År:
[Year]

Medium and technique / Medium og teknikk:
[English text]
[Norwegian text]

Dimensions / Mål:
[Width] x [Height] x [Depth] cm

Reference image / Referansebilde:
[Small image of the painting]

Statement / Erklæring:
This certificate identifies the original artwork listed above.
Dette sertifikatet identifiserer originalverket oppgitt ovenfor.

Copyright / Opphavsrett:
The artist retains copyright in the artwork and artwork images unless a separate
written agreement says otherwise.
Kunstneren beholder opphavsretten til kunstverket og bilder av kunstverket med
mindre en egen skriftlig avtale sier noe annet.

Sale date / Salgsdato:
[Date]

Artist signature / Kunstnerens signatur:
[Signature]
```

Certificate checklist:

- Certificate number is unique.
- Painting ID and title match the website record and invoice.
- Dimensions, medium, technique, and year match the approved painting data.
- Reference image is the sold painting.
- Physical certificate is signed.
- PDF certificate matches the physical certificate.
- PDF certificate is sent after full payment and before or at dispatch/pickup.
- Certificate status is recorded in the private operations register.

## Launch Readiness Checklist

Before the first real website inquiry can become a sale:

- Zoho mailbox receives and sends from `kontakt@engelaart.no`.
- Optional `contact@engelaart.no` alias is tested if used.
- SPF, DKIM, and DMARC are compatible across Zoho and Resend.
- Fiken trial invoice has been checked by the artist and bookkeeping helper.
- Separate user accounts exist for artist and helper where needed.
- Private operations register exists outside the repository.
- Reservation, reminder, release, paid, shipping, certificate, and review
  statuses can be tracked in the register.
- Existing-painting proposal template is approved for tone.
- Commission proposal template is professionally reviewed where needed.
- Shipping and pickup checklist is approved.
- Return, complaint, cancellation, and damage wording is professionally reviewed.
- Certificate template is approved.
- Review request is neutral and incentive-free.
- The developer knows who can request public painting status changes.
