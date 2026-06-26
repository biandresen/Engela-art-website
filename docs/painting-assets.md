# Painting asset preparation

Run the deterministic painting image pipeline with:

```bash
npm run assets:paintings
```

The script reads the six temporary artist-supplied PNGs listed in
`scripts/painting-assets.config.mjs`, creates responsive AVIF, WebP, and JPEG
derivatives, and bakes the approved issue #4 watermark into every public
painting image. Watermark scale, opacity, margin, light/dark variant, and corner
placement are explicit configuration. A per-file SHA-256 manifest records the
generated output, and generation fails if the watermark does not produce a
verified pixel difference.

## Temporary source exception

The current inputs arrived under `public/`. They are explicitly ignored by Git
and must not be referenced by application code. They remain temporary local
preparation inputs only; runtime catalog records use
`/assets/paintings/...` derivatives.

The normal build command removes these exact temporary source filenames from
the generated deployment output. This preserves the supplied local inputs while
preventing Netlify from publishing them as public master-image URLs.

This is an exception for issue #5, not the intended operating model. Before
production deployment, replace these inputs with artist-approved private master
files stored outside the repository and outside the public asset tree. The
generated derivatives may remain in Git and in the deployed site.

The generated room-context images are neutral temporary visualizations. Their
catalog captions state that dimensions, frame, and furnishings are illustrative
and await artist approval.

## Temporary catalog metadata

All six records use `metadataApproval: "temporary"`. Their painting IDs, titles,
dimensions, years, prices, statuses, medium text, technique text, care profiles,
summaries, and alt text are implementation placeholders, not artist-approved
facts and not inferences from filenames or image appearance.

Before launch, the artist must approve or replace every temporary field. Change
`metadataApproval` to `"artist-approved"` only after that review; the marker is a
content workflow signal and does not make placeholder commercial data safe to
publish.

## Homepage approval requirements

Issue #6 uses `temporary-painting-04` as an explicitly configured temporary
seasonal hero and uses the catalog's temporary featured order for paintings
01–03. Before launch, the artist must approve or replace:

- the seasonal hero selection;
- the featured selection and editorial order;
- all temporary status and listed-price values;
- the Norwegian and English homepage introduction;
- the concise artist biography and process preview;
- every temporary painting title, medium, technique, dimension, year,
  description, and alternative text already listed above.

The runtime homepage deliberately labels unavailable content as temporary. Do
not remove those labels until the corresponding artist-owned facts and
developer-reviewed translations are approved.

## Painting-detail approval requirements

Issue #8 displays the same temporary catalog facts on every Norwegian and
English painting-detail route. Before launch, the artist must approve or
replace:

- each main image, room-context visualization, alternative text, and caption;
- every title, painting ID, medium, technique, dimension, year, status, listed
  price, visual summary, and optional artist note;
- each selected care profile and exceptional care note;
- the unframed, pickup, shipping, coverage, international-delivery,
  reservation, interest-list, and similar-work guidance;
- the Norwegian text and the factual basis for the developer-reviewed English
  translation.

The detail pages preserve the temporary metadata label and catalog notes.
Changing or removing those markers requires the same artist approval as the
underlying fields.

## Painting-status inquiry approval requirements

Issue #10 connects the temporary catalog statuses to public inquiry journeys:
available paintings use painting inquiries, reserved paintings use interest-list
inquiries, and sold paintings use similar-work inquiries. Before launch, the
artist must approve or replace:

- every temporary painting status used to choose the inquiry journey;
- the Norwegian action labels, editable prefill text, success/acknowledgement
  guidance, and mailbox category wording for painting, interest-list, and
  similar-work inquiries;
- the English translations after the Norwegian source wording is approved;
- the reserved-work explanation for submission ordering, lack of guarantee, and
  the 48-hour response rule;
- the sold-work explanation that similar-work inquiries do not promise exact
  reproduction or accepted commissions.

## About and testimonial approval requirements

Issue #12 uses the prepared portrait derivatives from `public/assets/portrait/`
and deliberately avoids publishing an official biography, credentials,
exhibition history, Google profile claims, ratings, or testimonials until they
are supported by artist-approved source material.

Before launch, the artist must approve or replace:

- the Norwegian first-person biography, motivation, inspiration, process, and
  background copy;
- the English translation after the Norwegian source wording is approved;
- the portrait crop, alternative text, and page placement;
- any exhibition, credential, education, or professional-history statement;
- every testimonial quote, display name, date, source label, source link when
  applicable, and written publication consent record;
- every customer-home photo, caption, painting reference, image alternative
  text, and written publication consent record.

The testimonials and customer-home photo collections may stay empty at launch.
When empty, the public site renders no social-proof heading, placeholder review,
rating, fake customer photo, or "coming soon" area. Adding the first testimonial
or customer-home photo is a content update through the shared testimonials module
rather than a homepage or About-page rewrite.
