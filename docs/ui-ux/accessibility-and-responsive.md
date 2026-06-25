# Accessibility and Responsive Requirements

## Responsive Requirements

Design mobile-first and then enhance for larger screens.

Check these viewport categories:

- Small mobile
- Large mobile
- Tablet
- Desktop

Requirements:

- Navigation works on mobile and desktop.
- Mobile navigation uses an accessible menu button and simple panel.
- Text stays readable without horizontal scrolling.
- Buttons and links are easy to tap.
- Painting cards do not become cramped.
- Hero artwork preserves the full painting by default and stacks cleanly on mobile.
- Detail page images remain inspectable.
- Form fields are comfortable to use on mobile.
- Text and UI elements do not overlap.
- Image containers have stable dimensions.
- Mobile sticky painting actions respect safe areas and do not cover content.

## Accessibility Requirements

The site should be usable by keyboard, screen reader, and touch users.

Target WCAG 2.2 AA for core user journeys.

Requirements:

- Each page has one clear `h1`.
- Heading order is logical.
- Links describe where they go.
- Buttons describe what they do.
- Form fields have labels.
- Validation errors are connected to their fields.
- Focus states are visible.
- Color contrast is sufficient.
- Artwork images have meaningful alt text.
- Decorative images use empty alt text when appropriate.
- Status information is not communicated by color alone.
- Motion respects `prefers-reduced-motion`.

The mobile menu must expose its expanded state, move focus predictably, close after navigation, support Escape to close, and restore focus to the menu button.

FAQ disclosures must be keyboard-operable, expose expanded state, and remain functional without client JavaScript.

## Form Accessibility

Forms should include:

- Visible labels
- Required field indication
- Clear validation messages
- Keyboard-submit support
- Submitting state
- Success state
- Failure state

Do not rely only on placeholder text. Placeholders disappear when users type and are not a replacement for labels.

## Image Accessibility

Artwork alt text should describe the work briefly and usefully.

Good example:

```txt
Abstract oil painting with layered blue and ochre forms
```

Avoid unhelpful alt text:

```txt
Painting
Image
Artwork
```

If the painting title already appears next to the image, the alt text can describe the visual content rather than repeat the title.

The fullscreen image viewer must:

- Open from a keyboard-operable control
- Move focus into the viewer and restore it on close
- Support Escape to close
- Provide accessible previous, next, and close names
- Keep captions available to assistive technology
- Avoid exposing original-resolution source files

## Visual Quality Checks

Before release, manually check:

- No text overlaps images.
- No button text overflows.
- Images do not jump the layout while loading.
- Gallery spacing feels intentional.
- Sold/reserved states are clear.
- The inquiry call-to-action is easy to find.
- The mobile layout feels designed, not accidental.

## Why This Matters

Accessibility and responsive design are production quality basics. They also help beginners build better habits: semantic HTML, clear forms, stable layouts, and readable interfaces.
