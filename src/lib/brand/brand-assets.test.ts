import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import sharp from 'sharp'

const root = process.cwd()

const expectedAssets = [
  'public/assets/brand/logo-header-dark.png',
  'public/assets/brand/footer-image.webp',
  'public/assets/brand/og-default.jpg',
  'public/assets/brand/icon-32.png',
  'public/assets/brand/icon-192.png',
  'public/assets/brand/icon-512.png',
  'public/assets/portrait/engela-480.avif',
  'public/assets/portrait/engela-480.webp',
  'public/assets/portrait/engela-768.avif',
  'public/assets/portrait/engela-768.webp',
  'public/assets/portrait/engela-960.avif',
  'public/assets/portrait/engela-960.webp',
] as const

describe('Engela Art brand asset contract', () => {
  it('provides every generated runtime derivative', async () => {
    await expect(
      Promise.all(expectedAssets.map((path) => stat(resolve(root, path)))),
    ).resolves.toHaveLength(expectedAssets.length)
  })

  it('provides transparent logo and watermark variants', async () => {
    for (const path of [
      'public/assets/brand/logo-header-dark.png',
      'public/assets/brand/footer-image.webp',
    ]) {
      const metadata = await sharp(resolve(root, path)).metadata()

      expect(metadata.hasAlpha, path).toBe(true)
    }
  })

  it('provides correctly sized social, app, and portrait assets', async () => {
    await expectDimensions('public/assets/brand/og-default.jpg', 1200, 630)
    await expectDimensions('public/assets/brand/footer-image.webp', 720, 240)
    await expectDimensions('public/assets/brand/icon-32.png', 32, 32)
    await expectDimensions('public/assets/brand/icon-192.png', 192, 192)
    await expectDimensions('public/assets/brand/icon-512.png', 512, 512)
    await expectDimensions('public/assets/portrait/engela-480.webp', 480, 600)
    await expectDimensions('public/assets/portrait/engela-768.webp', 768, 960)
    await expectDimensions('public/assets/portrait/engela-960.webp', 960, 1200)
  })

  it('keeps runtime derivatives materially smaller than source PNGs', async () => {
    const sourcePortrait = await stat(
      resolve(root, 'assets/brand-source/engela-art-profile-picture.png'),
    )
    const responsivePortrait = await stat(
      resolve(root, 'public/assets/portrait/engela-768.webp'),
    )
    const sourceBanner = await stat(
      resolve(
        root,
        'assets/brand-source/engela-art-banner-with-background.png',
      ),
    )
    const openGraphImage = await stat(
      resolve(root, 'public/assets/brand/og-default.jpg'),
    )
    const sourceFooterImage = await stat(
      resolve(root, 'assets/brand-source/footer-image.png'),
    )
    const footerImage = await stat(
      resolve(root, 'public/assets/brand/footer-image.webp'),
    )

    expect(responsivePortrait.size).toBeLessThan(sourcePortrait.size / 2)
    expect(openGraphImage.size).toBeLessThan(sourceBanner.size / 2)
    expect(footerImage.size).toBeLessThan(sourceFooterImage.size / 2)
  })

  it('references existing manifest icons and no checkerboard source assets', async () => {
    const manifest = JSON.parse(
      await readFile(resolve(root, 'public/manifest.json'), 'utf8'),
    ) as { icons: Array<{ src: string }> }

    for (const icon of manifest.icons) {
      await expect(
        stat(resolve(root, 'public', icon.src.replace(/^\//, ''))),
      ).resolves.toBeDefined()
    }

    const runtimeFiles = await Promise.all(
      [
        'src/components/Header.tsx',
        'src/components/Footer.tsx',
        'src/routes/__root.tsx',
        'src/styles.css',
        'public/manifest.json',
      ].map((path) => readFile(resolve(root, path), 'utf8')),
    )

    expect(runtimeFiles.join('\n')).not.toMatch(
      /engela-art-(?:logo|banner)(?:-with-name)?\.png/,
    )
  })

  it('uses the approved semantic palette and self-hosted Manrope font', async () => {
    const styles = await readFile(resolve(root, 'src/styles.css'), 'utf8')

    expect(styles).toContain('@font-face')
    expect(styles).toContain(
      '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
    )
    expect(styles).toContain('--background: #f7f1e8')
    expect(styles).toContain('--surface: #fffdfc')
    expect(styles).toContain('--primary: #a65332')
    expect(styles).toContain('--available: #4f6842')
    expect(styles).toContain('--reserved: #7a5a16')
    expect(styles).toContain('--sold: #8f3f37')
    expect(styles).not.toMatch(/fonts\.(?:googleapis|gstatic)\.com/)
    expect(styles).not.toMatch(/--(?:button|color)-?\d/)
  })
})

async function expectDimensions(path: string, width: number, height: number) {
  const metadata = await sharp(resolve(root, path)).metadata()

  expect(metadata.width, path).toBe(width)
  expect(metadata.height, path).toBe(height)
}
