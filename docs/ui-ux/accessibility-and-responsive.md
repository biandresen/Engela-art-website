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
- Text stays readable without horizontal scrolling.
- Buttons and links are easy to tap.
- Painting cards do not become cramped.
- Detail page images remain inspectable.
- Form fields are comfortable to use on mobile.
- Text and UI elements do not overlap.
- Image containers have stable dimensions.

## Accessibility Requirements

The site should be usable by keyboard, screen reader, and touch users.

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
