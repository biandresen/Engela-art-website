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
dimensions, years, prices, statuses, medium text, care profiles, summaries, and
alt text are implementation placeholders, not artist-approved facts and not
inferences from filenames or image appearance.

Before launch, the artist must approve or replace every temporary field. Change
`metadataApproval` to `"artist-approved"` only after that review; the marker is a
content workflow signal and does not make placeholder commercial data safe to
publish.
