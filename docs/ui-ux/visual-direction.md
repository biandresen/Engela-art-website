# Visual Direction

## Default Direction

Use a quiet, gallery-like visual direction.

Recommended qualities:

- Calm
- Professional
- Warm
- Minimal
- Image-led
- Easy to scan

The paintings should carry the strongest visual expression. The interface should support the work rather than compete with it.

## Artwork-Led Brand Direction

The artist's body of work frequently uses warm brown, burnt orange, copper, ochre, peach, charcoal, and soft earth tones, often balanced by misty blue, turquoise, green, and violet accents. The work ranges from atmospheric landscapes to expressive abstraction and can be highly saturated.

The interface should borrow the collection's warmth at low intensity:

- Warm off-white or pale sand page background
- Deep brown-charcoal primary text
- Muted terracotta or copper primary accent
- Soft peach or clay supporting surfaces
- Restrained blue-green only as an occasional secondary accent

Do not reproduce the paintings' full saturation in navigation, cards, or large surfaces. Artwork remains the strongest source of color.

The default site theme is light. Warm sand and cream surfaces provide the main canvas, while dark autumn brown, burgundy, terracotta, and ochre appear selectively for contrast in the footer, primary actions, status treatments, and compact brand moments. Avoid large dark content backgrounds that compete with colorful artwork.

## Logo System Direction

The existing Engela Art logo establishes a dark brown, orange, ochre, burgundy, cream, and autumn-leaf identity with an artist palette motif. Preserve that recognizable warmth and handmade character while adapting it into a practical website logo system:

- Full illustrated logo for larger brand moments, footer, About, and social use
- Simplified Engela Art wordmark for the site header
- Compact palette or botanical mark for favicon and small avatars
- Light and dark variants
- Optimized raster exports and clean vector assets where appropriate

Do not use the detailed illustrated logo at sizes where its leaves, brush, or lettering become illegible. Logo recreation and export production are a separate visual-asset task after product decisions are complete.

## Decisions To Make Before Coding

### Brand Mood

Choose the main emotional direction:

- Gallery-like and restrained
- Warm and personal
- Premium and minimal
- Expressive and artistic

Default: gallery-like with warmth.

### Color Palette

Use restrained colors around the artwork.

Default:

- Light neutral background
- Dark readable text
- One muted accent color
- Subtle borders

Avoid a palette that dominates the paintings. Strong colors should only be used if they match the artist's identity and do not clash with the artwork.

### Typography

Typography should feel refined but readable.

Decide:

- Heading typeface
- Body typeface
- Font sizes
- Line height
- Button/link style

Default:

- Elegant headings
- Highly readable body text
- No overly decorative fonts for long text

### Image Treatment

Decide:

- Aspect ratios for painting cards
- Whether images are cropped or contained
- How sold/reserved paintings are visually marked
- Whether detail pages show one large image or a small gallery

Default:

- Preserve artwork integrity.
- Avoid aggressive cropping on detail pages.
- Use stable image containers to prevent layout shift.

### Spacing Density

Decide whether the site should feel:

- Spacious and gallery-like
- Compact and catalog-like

Default:

- Spacious on home/detail pages
- Efficient but not cramped in gallery

### Copy Tone

Decide the writing style:

- Norwegian, English, or bilingual
- Formal or personal
- Short and direct or more story-driven

Default:

- Clear, warm, and concise.

### Language

V1 is fully bilingual in Norwegian and English. Both languages must support the complete buyer journey rather than translating only navigation or selected pages.

Use explicit language-prefixed URLs:

- Norwegian: `/no/...`
- English: `/en/...`

The root URL directs first-time visitors according to browser language, with Norwegian as the fallback. Always provide a visible language switcher and preserve the equivalent page when switching languages.

## Supplied Brand Asset Roles

The supplied brand assets establish the approved visual source material:

- The artist portrait is the primary About-page portrait and may appear as a smaller trust image on Contact.
- The dark square palette-and-leaves logo is the source for the social avatar, compact brand mark, app icons, and favicon derivatives.
- The dark horizontal Engela Art banner is the default brand Open Graph/social-sharing image and may be used for occasional large brand treatments.
- The cream autumn art pattern is decorative source material for restrained certificate, social, or compact brand accents; do not use it as a full-page website wallpaper.
- The full logo with name is appropriate for larger footer/About brand moments after cleanup and optimization.

Do not replace the homepage's seasonal painting hero with the brand banner. The homepage remains artwork-led.

Several supplied files visually show a checkerboard but are RGB images without real transparency. Treat those as source material only. Produce genuinely transparent derivatives before using them over site surfaces; never ship the checkerboard as part of the visible logo.

Before launch, create and verify:

- Transparent header wordmark or simplified equivalent
- Transparent compact logo mark
- Light-on-dark and dark-on-light logo variants
- Favicon and manifest icon sizes
- Social avatar crop
- Default Open Graph image
- A simplified Engela Art artwork-watermark asset with light and dark variants
- Responsive portrait derivatives
- Appropriate PNG/WebP/AVIF outputs by use case

The artwork watermark should use a simplified brand mark or wordmark rather than the full illustrated logo. It must remain legible at small sizes and work over both light and dark painting areas.

## Visual Risks

- Too much decoration can compete with the paintings.
- Weak image quality can make the whole site feel less professional.
- Inconsistent image ratios can make the gallery feel messy.
- Low contrast text can look elegant but become hard to read.
- Large text can easily overpower artwork on mobile.

## Design Success Criteria

The UI succeeds when:

- The artwork is the first thing people notice.
- Navigation feels obvious.
- The site feels personal but professional.
- Buyers can find available works quickly.
- Mobile pages feel intentionally designed, not squeezed down from desktop.
