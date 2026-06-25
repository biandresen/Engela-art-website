# Engela Art: Business and Family Workflows

## Overview

Engela Art will use a simple, personal sales process.

The website helps buyers discover paintings and send formal inquiries. The artist, bookkeeping helper, and developer then handle the sale through email, invoices, a private register, and website updates.

The website does not replace human communication. It supports it.

## Business Model

Engela Art sells:

- Original paintings
- Possible new paintings inspired by the artist's existing work

The main sales model is **inquiry first**.

This means:

1. A visitor finds a painting.
2. The visitor sends an inquiry.
3. The artist confirms condition and availability.
4. The artist and buyer agree on pickup or shipping.
5. The buyer receives an invoice.
6. Payment is received.
7. The painting is handed over or shipped.

The website does not accept direct payment.

## The Buyer's Flow

### Buying an Available Painting

1. The buyer finds a painting on the website.
2. The buyer checks title, images, materials, dimensions, price, and status.
3. The buyer submits the inquiry form.
4. The buyer receives an acknowledgement email when possible.
5. The artist replies personally within two business days.
6. The artist confirms that the painting is still available and in the expected condition.
7. Pickup or shipping is discussed.
8. The artist reserves the painting for the buyer.
9. The buyer receives an invoice.
10. The buyer pays.
11. The painting becomes sold after full payment.
12. The artist arranges pickup or tracked shipping.
13. The buyer receives a physical and PDF certificate of authenticity.
14. After the completed sale, the buyer may receive a neutral request for a review.

### Asking About a Reserved Painting

1. The buyer sees that another person currently has priority.
2. The buyer can still submit an inquiry.
3. The buyer joins the interest list based on submission time.
4. Joining the list does not reserve or guarantee the painting.
5. If the current reservation ends, the artist contacts the next person.
6. That person has 48 hours to respond before the artist may contact the next person.

### Asking About a Sold Painting

1. The buyer views the sold painting as part of the portfolio.
2. The buyer can ask about similar work.
3. The sold painting is included as a reference.
4. The inquiry does not promise an exact copy or accepted commission.

### Asking About a Commission

1. The buyer reads the Commissions page.
2. The buyer submits an idea inspired by the artist's existing work.
3. The buyer can include preferred dimensions and an optional budget.
4. The artist reviews the request.
5. The artist may decline, ask questions, or send a written proposal.
6. The proposal explains the idea, size, medium, price, timeline, feedback points, delivery, and payment.
7. If accepted, the buyer pays a 50% deposit.
8. The artist confirms the concept and begins work.
9. The buyer receives one progress update for minor direction.
10. Major changes require a new agreement.
11. The buyer approves completion.
12. The remaining 50% is paid before delivery.

## The Artist's Flow

The artist is responsible for the artistic and commercial decisions.

### Before a Painting Is Published

The artist provides or approves:

- Official title
- Creation year
- Materials
- Width, height, and depth
- Public price
- Status
- Description
- Optional artist note
- Care needs
- Main painting photo
- Room-context photo
- Featured or seasonal placement

The artist approves the Norwegian wording.

### When an Inquiry Arrives

The artist:

1. Reads the inquiry in the Engela Art mailbox.
2. Checks the physical painting.
3. Confirms current availability and condition.
4. Replies personally within two business days.
5. Discusses pickup, shipping, and buyer questions.
6. Decides whether to reserve the painting.
7. Tells the developer when the public status must change.

An inquiry alone never changes the painting's status.

### When Reserving a Painting

The artist:

1. Confirms the reservation directly with the buyer.
2. Records the buyer and reservation in the private operations register.
3. Asks the developer to mark the painting as reserved.
4. Sends or creates the invoice through Fiken.

The normal invoice deadline is three business days.

If the invoice remains unpaid:

1. The artist sends one standard reminder.
2. The buyer receives one final three-business-day extension.
3. If payment still does not arrive and no exception was agreed, the reservation is released.

### After Full Payment

The artist:

1. Confirms payment.
2. Asks the developer to mark the painting as sold.
3. Photographs the painting and packaging before dispatch.
4. Arranges pickup or tracked shipping.
5. Emails tracking information when shipped.
6. Includes the signed physical certificate.
7. Emails the PDF certificate.
8. Updates the private operations register.
9. Sends a neutral review request after completion.

### For Commissions

The artist:

1. Reviews whether the request fits her artistic practice.
2. Decides whether to accept the discussion.
3. Creates a written commission proposal.
4. Waits for written acceptance and the 50% deposit.
5. Confirms the concept.
6. Creates the painting.
7. Provides one progress update.
8. Handles major requested changes as a new agreement.
9. Requests final payment after completion approval.
10. Delivers only after final payment.

## The Bookkeeping Helper's Flow

The bookkeeping helper supports the artist but does not replace her legal responsibility as the ENK owner.

The bookkeeping helper can:

- Help configure Fiken
- Check invoices
- Help record income and expenses
- Help reconcile payments
- Help keep receipts and documentation
- Help maintain the private operations register
- Help prepare tax and accounting information

Both the artist and bookkeeping helper should have their own secure account access.

They should not share one password.

Multi-factor authentication should be enabled where available.

## The Developer's Flow

The developer manages the website and technical systems.

### Adding or Updating a Painting

The developer:

1. Receives approved information and images from the artist.
2. Keeps private master images outside Git.
3. Creates responsive public image versions.
4. Adds the approved Engela Art watermark to every public painting derivative.
5. Checks image quality, file size, dimensions, and watermark placement.
6. Updates the painting record.
7. Runs automated verification.
8. Reviews a deploy preview.
9. Publishes the change after approval.

### Updating Status

When the artist confirms a change, the developer updates:

- Available to reserved
- Reserved to sold after full payment
- Reserved back to available if released
- Sold back to available only after a returned painting is inspected and approved

The target is to publish confirmed status changes within one business day.

### Maintaining the Website

The developer is responsible for:

- Norwegian and English routes
- Approved English translations
- Accessibility
- Performance
- Security and secrets
- Inquiry-form operation
- Transactional email integration
- Analytics and error monitoring
- Domain and deployment configuration
- Tests and verification
- Backups of code and configuration

The developer does not manage:

- Buyer negotiations
- Artistic decisions
- Final pricing decisions
- Accounting
- Legal advice
- Shipping-provider decisions

### Publishing Changes

The normal technical workflow is:

1. Create or select a GitHub issue.
2. Work on a separate branch.
3. Run tests and verification.
4. Open a pull request.
5. Review the Netlify preview.
6. Get the required artist approval for content.
7. Merge to `main`.
8. Netlify deploys production.

## The Private Operations Register

The artist and bookkeeping helper will share a private spreadsheet or similar tool.

It can contain:

- Painting title and reference number
- Current status
- Interested buyers or email-thread references
- Reserved buyer reference
- Invoice number
- Invoice and reminder deadlines
- Payment status
- Pickup or shipping status
- Carrier and tracking reference
- Sale-completion date
- Certificate status
- Review-request status

Only necessary personal information should be stored.

Detailed conversations remain in the business mailbox.

The register must not be stored in the public website repository.

## Email and Communication

The public business address will be:

- `kontakt@engelaart.no`
- Optional English alias: `contact@engelaart.no`

The website form is the preferred route for purchase-related inquiries.

Instagram and Facebook are secondary channels.

The artist should keep important sale agreements in email so both parties have a written record.

## Invoices and Payment

Fiken is the preferred system to trial for invoicing and accounting.

The invoice should include:

- Engela Art / ENK information
- Organization number
- Invoice number and date
- Buyer information
- Painting title and reference number
- Painting price
- Shipping cost
- Total
- Payment deadline
- Payment instructions
- Agreed delivery and reservation terms

Payment alternatives:

- Bank transfer
- Vipps Business
- PayPal Business

The buyer should normally pay the same invoice total regardless of payment method.

## Shipping and Pickup

### Pickup

- Pickup is available in Nannestad by arrangement.
- The home address is not published.
- The exact address is shared privately after confirmation.

### Shipping

- Shipping is agreed by email.
- Shipping is not included in the listed painting price.
- All shipped paintings use tracking.
- Suitable insurance or declared-value coverage should be checked.
- The carrier is chosen based on destination, size, value, coverage, and price.
- International shipping is considered individually.

### Condition Photographs

Before dispatch, the artist photographs:

- Painting
- Important details
- Packing stages
- Sealed package

The buyer is asked to photograph:

- Package before opening
- Painting after opening
- Painting and packing before any return

These photographs help with condition questions and carrier claims. They do not remove mandatory consumer rights.

## Reviews

After a successful completed sale:

1. The artist sends the same neutral review request to buyers.
2. No reward is offered for a positive review.
3. Google reviews can be linked when a valid Google Business Profile exists.
4. A review can be republished on the website only with the required permission.

## Information Retention

Planned normal periods:

- Unsuccessful inquiries: delete or anonymize after 12 months from last contact
- Interest-list information: remove when no longer needed, normally after sale or 12 months
- Completed-sale records: keep for approximately five years when required for accounting, complaints, or legal claims
- Active disputes: keep relevant information until resolved

Final retention and legal wording should be reviewed before launch.

## Who Approves What

### The Artist Approves

- Paintings and images
- Norwegian text
- Prices
- Statuses
- Featured paintings
- Sales policies
- Commission decisions
- Public business details

### The Developer Approves

- English translations
- Technical quality
- Accessibility
- Performance
- Security
- Tests
- Deployment readiness

### The Bookkeeping Helper Supports

- Accounting
- Invoices
- Receipts
- Payment reconciliation
- Financial records

Public launch requires both artist approval and developer technical approval.

## First Three-Month Review

After launch, the family should review:

- Number of serious painting inquiries
- Number of commission inquiries
- Inquiries that become reservations
- Reservations that become sales
- Paintings receiving the most interest
- Email delivery problems
- Website errors
- Accessibility feedback
- Manual work that is taking too much time

Future features should be added only when this experience shows they are useful.
