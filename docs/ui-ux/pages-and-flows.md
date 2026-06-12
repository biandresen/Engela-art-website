# Pages and Flows

## Required Pages

### Home

Purpose:

- Make a strong first impression.
- Show the artist identity.
- Show artwork immediately.
- Direct visitors to the gallery.

Required content:

- Artist name
- Short tagline or intro
- Featured artwork
- Link to paintings
- Short about preview

### Paintings Gallery

Purpose:

- Let visitors browse available and past work.

Required content:

- Painting cards
- Artwork image
- Title
- Medium or dimensions
- Status
- Price if available

### Painting Detail

Purpose:

- Give buyers enough information to inquire confidently.

Required content:

- Large image or image gallery
- Title
- Medium
- Dimensions
- Year if available
- Price in NOK if available
- Status
- Description
- Inquiry call-to-action

### About

Purpose:

- Build trust and connection with the artist.

Required content:

- Artist bio
- Portrait or process image
- Artistic background or motivation
- Contact link

### Contact

Purpose:

- Give visitors a general way to reach the artist.

Required content:

- Contact form or email path
- Expected response context
- Optional social links

### Not Found

Purpose:

- Recover gracefully from invalid URLs.

Required content:

- Clear message
- Link back to paintings or home

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
