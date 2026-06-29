import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import pngToIco from 'png-to-ico'
import sharp from 'sharp'

const root = process.cwd()
const brandOutput = resolve(root, 'public/assets/brand')
const portraitOutput = resolve(root, 'public/assets/portrait')

const colors = {
  burgundy: '#4a0f22',
  cream: '#fff7e8',
}

await Promise.all([
  mkdir(brandOutput, { recursive: true }),
  mkdir(portraitOutput, { recursive: true }),
])

const transparentMark = await removeConnectedLightBackground(
  resolve(root, 'public/engela-art-logo.png'),
)
const transparentWordmark = await removeConnectedLightBackground(
  resolve(root, 'public/engela-art-banner.png'),
)

await Promise.all([
  sharp(transparentMark)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 })
    .resize({ width: 512, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(resolve(brandOutput, 'mark-compact.png')),
  sharp(transparentWordmark)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 })
    .resize({ width: 720, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(resolve(brandOutput, 'logo-header-dark.png')),
  sharp(transparentWordmark)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 })
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 100, effort: 5 })
    .toFile(resolve(brandOutput, 'logo-header-dark.webp')),
  createMonochromeAsset(
    transparentWordmark,
    colors.cream,
    resolve(brandOutput, 'logo-footer-light.png'),
    720,
  ),
])

await sharp(resolve(brandOutput, 'logo-footer-light.png'))
  .webp({ quality: 88, alphaQuality: 100, effort: 5 })
  .toFile(resolve(brandOutput, 'logo-footer-light.webp'))

await createTransparentFooterAsset(
  resolve(root, 'assets/brand-source/footer-image.png'),
  resolve(brandOutput, 'footer-image.webp'),
)

await createAppIdentityAssets()
await createSocialAssets()
await createWatermarks()
await createPortraitAssets()

console.log('Prepared Engela Art brand and portrait derivatives.')

async function createAppIdentityAssets() {
  const source = resolve(root, 'public/engela-art-logo-with-background.png')
  const iconSizes = [16, 32, 48, 192, 512]

  await Promise.all(
    iconSizes.map((size) =>
      sharp(source)
        .resize(size, size, { fit: 'cover', position: 'centre' })
        .sharpen({ sigma: size <= 48 ? 1 : 0.5 })
        .png({ compressionLevel: 9, palette: size <= 48 })
        .toFile(resolve(brandOutput, `icon-${size}.png`)),
    ),
  )

  const favicon = await pngToIco(
    [16, 32, 48].map((size) => resolve(brandOutput, `icon-${size}.png`)),
  )

  await writeFile(resolve(root, 'public/favicon.ico'), favicon)
}

async function createSocialAssets() {
  await Promise.all([
    sharp(resolve(root, 'public/engela-art-logo-with-background.png'))
      .resize(512, 512, { fit: 'cover', position: 'centre' })
      .png({ compressionLevel: 9 })
      .toFile(resolve(brandOutput, 'social-avatar.png')),
    sharp(resolve(root, 'public/engela-art-banner-with-background.png'))
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(resolve(brandOutput, 'og-default.jpg')),
    sharp(resolve(root, 'public/engela-art-background.png'))
      .resize(640, 640, { fit: 'cover', position: 'centre' })
      .webp({ quality: 78, effort: 5 })
      .toFile(resolve(brandOutput, 'pattern-accent.webp')),
  ])
}

async function createWatermarks() {
  const source = resolve(root, 'assets/brand-source/watermark-master.png')

  await Promise.all([
    createMonochromeAsset(
      source,
      colors.burgundy,
      resolve(brandOutput, 'watermark-dark.png'),
      420,
    ),
    createMonochromeAsset(
      source,
      colors.cream,
      resolve(brandOutput, 'watermark-light.png'),
      420,
    ),
  ])
}

async function createTransparentFooterAsset(input, output) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const { r, g, b } = parseHex(colors.cream)

  for (let pixelIndex = 0; pixelIndex < width * height; pixelIndex += 1) {
    const offset = pixelIndex * channels
    const luminance =
      0.2126 * data[offset] +
      0.7152 * data[offset + 1] +
      0.0722 * data[offset + 2]

    data[offset] = r
    data[offset + 1] = g
    data[offset + 2] = b
    data[offset + 3] = luminance < 236 ? 230 : 0
  }

  await sharp(data, {
    raw: {
      width,
      height,
      channels,
    },
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 })
    .resize(720, 240, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 88, alphaQuality: 100, effort: 5 })
    .toFile(output)
}

async function createPortraitAssets() {
  const source = resolve(root, 'public/engela-art-profile-picture.png')
  const widths = [480, 768, 960]

  for (const width of widths) {
    const height = Math.round(width * 1.25)
    const prepared = sharp(source).resize(width, height, {
      fit: 'cover',
      position: sharp.strategy.attention,
    })

    await Promise.all([
      prepared
        .clone()
        .avif({ quality: 58, effort: 5 })
        .toFile(resolve(portraitOutput, `engela-${width}.avif`)),
      prepared
        .clone()
        .webp({ quality: 82, effort: 5 })
        .toFile(resolve(portraitOutput, `engela-${width}.webp`)),
    ])
  }

  await sharp(source)
    .resize(960, 1200, {
      fit: 'cover',
      position: sharp.strategy.attention,
    })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(resolve(portraitOutput, 'engela-960.jpg'))
}

async function createMonochromeAsset(input, color, output, width) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { r, g, b } = parseHex(color)

  for (let index = 0; index < data.length; index += info.channels) {
    data[index] = r
    data[index + 1] = g
    data[index + 2] = b
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 })
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(output)
}

async function removeConnectedLightBackground(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const visited = new Uint8Array(width * height)
  const queue = new Uint32Array(width * height)
  let queueStart = 0
  let queueEnd = 0

  function enqueue(pixelIndex) {
    if (visited[pixelIndex] || !isLightNeutral(pixelIndex)) {
      return
    }

    visited[pixelIndex] = 1
    queue[queueEnd] = pixelIndex
    queueEnd += 1
  }

  function isLightNeutral(pixelIndex) {
    const offset = pixelIndex * channels
    const red = data[offset]
    const green = data[offset + 1]
    const blue = data[offset + 2]
    const minimum = Math.min(red, green, blue)
    const maximum = Math.max(red, green, blue)

    return minimum >= 210 && maximum - minimum <= 28
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x)
    enqueue((height - 1) * width + x)
  }

  for (let y = 0; y < height; y += 1) {
    enqueue(y * width)
    enqueue(y * width + width - 1)
  }

  while (queueStart < queueEnd) {
    const pixelIndex = queue[queueStart]
    queueStart += 1
    const x = pixelIndex % width
    const y = Math.floor(pixelIndex / width)

    if (x > 0) enqueue(pixelIndex - 1)
    if (x + 1 < width) enqueue(pixelIndex + 1)
    if (y > 0) enqueue(pixelIndex - width)
    if (y + 1 < height) enqueue(pixelIndex + width)
  }

  for (let pixelIndex = 0; pixelIndex < visited.length; pixelIndex += 1) {
    if (visited[pixelIndex]) {
      data[pixelIndex * channels + 3] = 0
    }
  }

  return sharp(data, {
    raw: { width, height, channels },
  })
    .png()
    .toBuffer()
}

function parseHex(hex) {
  const value = Number.parseInt(hex.slice(1), 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}
