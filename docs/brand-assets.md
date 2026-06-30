# Brand asset preparation

The original Engela Art PNG files in `assets/brand-source/` are preserved as
approved source media. Runtime pages use the optimized derivatives in
`public/assets/brand/` and `public/assets/portrait/`.

Regenerate the deterministic derivatives with:

```bash
npm run assets:brand
```

The script:

- removes the baked checkerboard only from source pixels connected to the image
  boundary;
- creates the transparent dark-on-light header logo variants;
- creates the footer WebP derivative from the approved source;
- creates favicon, manifest icon, and Open Graph derivatives;
- creates responsive AVIF/WebP portrait crops and a JPEG fallback;
