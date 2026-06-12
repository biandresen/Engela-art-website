# Design System: V1

## Purpose

This document defines the first design decisions for the artist website. The goal is not to create a large design system. The goal is to make enough visual decisions before coding so the first implementation feels intentional and consistent.

The default direction is a quiet, gallery-like website where the artwork is the visual focus.

## Design Principles

- Let the paintings carry the strongest color and expression.
- Use calm interface colors around the artwork.
- Prefer generous spacing over dense layouts.
- Keep navigation simple and predictable.
- Make buying interest obvious without making the site feel like a generic webshop.
- Design mobile layouts intentionally, not as an afterthought.

## Brand Mood

Default mood:

- Gallery-like
- Warm
- Minimal
- Personal
- Professional

Avoid:

- Heavy decoration
- Loud gradients
- Dashboard-like UI
- Overly playful interface elements
- Generic e-commerce styling

## Color Palette

Use a restrained neutral palette with one muted accent.

### Recommended V1 Palette

```txt
Background:       #F7F4EF
Surface:          #FFFFFF
Text primary:     #1F1D1A
Text secondary:   #6B6258
Border:           #DDD5CB
Accent:           #7A4E2D
Accent hover:     #5F3C22
Muted green:      #5F6F52
Muted red/brown:  #8A4B3A
```

Why:

- Warm neutral backgrounds feel more personal than pure white.
- Dark brown-black text is softer than pure black.
- The accent color is warm but not loud.
- The palette should not fight with colorful paintings.

### Tailwind Token Names

When implementing, map these colors to semantic names instead of using only raw hex values everywhere.

Suggested semantic names:

```txt
background
surface
foreground
muted
border
accent
accent-hover
available
sold
```

The important habit: name colors by their role, not by the exact color. That makes future palette changes easier.

## Typography

Use typography that feels refined but readable.

### Recommended Direction

- Headings: elegant serif or high-quality display serif.
- Body: readable sans-serif or quiet serif.
- UI labels/buttons: readable sans-serif.

Suggested pairing:

```txt
Headings: Cormorant Garamond, Playfair Display, or similar
Body/UI: Inter, Source Sans 3, or similar
```

If using external fonts, keep the number of font families low. Two families is enough.

### Type Scale

Use a modest scale:

```txt
Small text:       0.875rem
Body text:        1rem
Large body:       1.125rem
Section heading:  1.75rem - 2.25rem
Page heading:     2.5rem - 4rem depending on viewport
```

Do not scale text directly with viewport width. Use responsive breakpoint changes instead.

## Spacing

Use generous but controlled spacing.

Recommended Tailwind spacing rhythm:

```txt
Small gap:      0.5rem - 0.75rem
Component gap:  1rem - 1.5rem
Section gap:    3rem - 6rem
Page padding:   1rem mobile, 2rem tablet, 3rem desktop
```

Why:

- Art needs breathing room.
- Dense layouts make the site feel like a product catalog.
- Consistent spacing makes the interface look more professional.

## Border Radius

Use restrained radius.

Recommended:

```txt
Buttons:       0.375rem - 0.5rem
Inputs:        0.375rem - 0.5rem
Cards:         0.5rem maximum
Images:        0.25rem or none
```

Avoid very rounded cards or pill-heavy UI unless the final brand direction calls for it.

## Buttons and Links

### Primary Button

Use for the main action on a page:

- View paintings
- Inquire about this painting
- Send inquiry

Style:

- Accent background
- Light text
- Clear hover state
- Visible focus ring

### Secondary Button

Use for lower-priority actions:

- Read about the artist
- Back to gallery

Style:

- Transparent or surface background
- Border
- Dark text

### Text Links

Use for inline navigation and subtle actions.

Style:

- Underline or clear hover underline
- Sufficient contrast
- Visible focus state

## Cards and Artwork Treatment

Painting cards should be simple.

Include:

- Image
- Title
- Medium or dimensions
- Status
- Price if available

Avoid:

- Heavy shadows
- Decorative frames
- Large text overlays on artwork
- Cropping that hides important parts of the painting

Default card approach:

- Image first
- Metadata below
- Minimal border or no border
- Hover state that feels quiet, such as slight image opacity or subtle border change

## Image Aspect Ratios

The artwork itself may vary in shape, so use rules that preserve the work.

Gallery:

- Use consistent card containers for layout stability.
- Prefer `object-contain` if cropping would misrepresent the painting.
- Use subtle background behind contained images if needed.

Detail page:

- Preserve full artwork.
- Do not crop the primary image.
- Allow detail/crop images only as secondary images.

Recommended ratios:

```txt
Gallery card image area: 4:5 or 1:1 depending on real artwork
Detail primary image: natural ratio inside a max-width container
Hero artwork: selected image can be cropped only if the crop is intentional
```

## Status Badge Styles

Status must not rely on color alone. Include text labels.

```txt
Available
Reserved
Sold
```

Recommended treatment:

- Available: muted green text/border
- Reserved: neutral brown/amber text/border
- Sold: muted red-brown or neutral gray text/border

Do not make sold paintings disappear from the portfolio. They still help show the artist's body of work.

## Forms

Forms should feel calm and trustworthy.

Requirements:

- Visible labels
- Clear required fields
- Comfortable input height
- Helpful error messages
- Success message after submission
- No placeholder-only labels

Form visual style:

- White or surface background
- Clear border
- Strong focus state
- Minimal decoration

## Responsive Design Rules

Mobile:

- Single-column layout.
- Large tap targets.
- Artwork and text should not compete horizontally.
- Navigation must be simple.

Tablet:

- Two-column gallery can start if artwork still has room.
- Detail page can remain single-column if it feels cleaner.

Desktop:

- Gallery can use multiple columns.
- Painting detail can use image/content split layout if the image remains large.
- Hero should show artwork clearly in the first viewport.

## Accessibility Rules

- Text contrast must be readable.
- Every interactive element needs a visible focus state.
- Do not communicate status by color alone.
- Form fields need labels.
- Artwork images need meaningful alt text.
- The site must work with keyboard navigation.

## Design Decisions Still Needed

Before final UI polish, decide:

- Final artist name and site title.
- Final logo/wordmark treatment, if any.
- Final font choices.
- Whether the site is Norwegian-first or English-first.
- Whether painting prices are always visible or sometimes inquiry-only.
- Which real artwork image should lead the home page.

## Implementation Notes

Start with these components:

- Button
- Input
- Textarea
- Label
- Status badge
- Painting card
- Page heading
- Section container

Build the design system as the app needs it. Do not create unused components.
