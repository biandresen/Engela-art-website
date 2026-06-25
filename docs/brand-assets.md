# Brand asset preparation

The original Engela Art PNG files in `public/` are preserved as approved source
media. Runtime pages use the optimized derivatives in `public/assets/brand/` and
`public/assets/portrait/`.

Regenerate the deterministic derivatives with:

```bash
npm run assets:brand
```

The script:

- removes the baked checkerboard only from source pixels connected to the image
  boundary;
- creates transparent dark-on-light and light-on-dark logo variants;
- creates favicon, manifest, avatar, and Open Graph derivatives;
- creates responsive AVIF/WebP portrait crops and a JPEG fallback;
- creates light and dark variants from the simplified watermark master.

The watermark master in `assets/brand-source/watermark-master.png` was generated
from the supplied palette-and-brush identity using the built-in image generation
tool, then converted from a chroma-key background to genuine transparency. Its
prompt requested a flat, text-free palette-and-brush silhouette with no leaves,
gradients, shadows, or fine decoration so it remains legible at small sizes.
