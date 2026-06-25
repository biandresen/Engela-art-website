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

The visual identity is grounded in the artist's recurring warm brown, orange, copper, ochre, and peach tones, balanced by occasional muted blue-green. Use these colors as quiet interface references rather than matching the artwork's saturation.

Use a light warm theme for primary content surfaces. Reserve dark brown and richer autumn colors for secondary or tertiary contrast, especially the footer, selected actions, and brand details. Do not apply a site-wide dark theme in v1.

V1 does not include a dark-mode preference or theme toggle. A light-on-dark logo treatment may be used inside intentionally dark sections such as the footer without creating a second site theme.

## Color Palette

Use a restrained neutral palette with one muted accent.

### Recommended V1 Palette

```txt
Background:       #F7F1E8
Surface:          #FFFDFC
Text primary:     #2A211D
Text secondary:   #706159
Border:           #DDCFC3
Accent:           #A65332
Accent hover:     #7E3D26
Soft peach:       #E8C2AA
Muted blue-green: #557A78
Available:        #5F6F52
Sold:             #8A5547
```

Why:

- Warm sand and peach tones reflect recurring colors in the artwork without becoming decorative.
- Deep brown-charcoal text is softer and more aligned with the work than pure black.
- Terracotta provides a distinctive action color while remaining quieter than the paintings.
- Blue-green offers controlled contrast for occasional secondary details.
- The palette remains restrained enough to support highly colorful and varied artwork.

### Tailwind Token Names

Implement the palette as CSS custom properties exposed to Tailwind through semantic token names. Components consume roles rather than raw hex values or numbered names such as `button1`.

Required semantic roles:

```txt
background
surface
foreground
muted-foreground
border
input
ring
primary
primary-foreground
primary-hover
secondary
secondary-foreground
accent
accent-foreground
available
reserved
sold
```

Buttons use variants such as `primary`, `secondary`, and `text`, but their colors resolve through the semantic roles above. Do not create `button1`, `button2`, or color-specific tokens; those names obscure purpose and make later changes harder.

Keep the token interface centralized in the global stylesheet so a palette adjustment does not require editing individual route or component classes. Raw color values should be exceptional and documented.

## Typography

Use one type family across headings, body, navigation, forms, and buttons.

### Primary Font

Use **Manrope**, self-hosted as a variable WOFF2 font under the SIL Open Font License. It is readable at body and interface sizes, modern, and has enough soft geometric character to complement the warm organic visual identity without competing with artwork.

Runtime stack:

```css
font-family: 'Manrope', system-ui, sans-serif;
```

Use weight, size, spacing, and line height—not a second family—to distinguish headings from body and UI text.

### Approved Backups

If visual testing rejects Manrope:

1. Instrument Sans — cleaner and more editorial
2. Nunito Sans — softer and friendlier
3. Lora — more artistic, but less suitable as the only form/UI face

All selected fonts must remain free for commercial use and be self-hosted. Do not load fonts from a third-party CDN.

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

## Motion

Use smooth, lightweight motion only where it clarifies interaction:

- Short color, opacity, and small transform transitions
- Restrained mobile-menu and fullscreen-viewer transitions
- No parallax, autoplay animation, or scroll-triggered spectacle
- No animation library unless a concrete interaction cannot be handled cleanly with CSS

Respect `prefers-reduced-motion` by removing nonessential movement and shortening necessary state transitions.

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

Place status badges in card metadata rather than overlaying artwork images. On detail pages, show status beside title and price. Always include localized text; color is supplementary.

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
