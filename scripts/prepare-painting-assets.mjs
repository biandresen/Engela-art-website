import { createHash } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'

import {
  paintingAssetConfig,
  paintingAssetDefaults,
} from './painting-assets.config.mjs'

const root = process.cwd()
const outputRoot = resolve(root, 'public/assets/paintings')

await rm(outputRoot, { recursive: true, force: true })
await mkdir(outputRoot, { recursive: true })

const paintings = []

for (const config of paintingAssetConfig) {
  paintings.push(await preparePainting(config))
}

await writeFile(
  resolve(outputRoot, 'manifest.generated.json'),
  `${JSON.stringify({ version: 1, paintings }, null, 2)}\n`,
)

console.log(
  `Prepared responsive watermarked derivatives for ${paintings.length} paintings.`,
)

async function preparePainting(config) {
  const watermark = paintingAssetDefaults.watermark
  const main = await prepareMainImage(config, watermark)
  const roomContext = await prepareRoomContextImage(config, watermark)

  return {
    slug: config.slug,
    watermark: {
      ...watermark,
      pixelDifferenceVerified:
        main.pixelDifferenceVerified && roomContext.pixelDifferenceVerified,
    },
    images: [
      { role: 'main', variants: main.variants },
      { role: 'room-context', variants: roomContext.variants },
    ],
  }
}

async function prepareMainImage(config, watermark) {
  const variants = []
  let pixelDifferenceVerified = true

  for (const width of paintingAssetDefaults.mainWidths) {
    const base = await sharp(resolve(root, config.source))
      .rotate()
      .resize({ width })
      .png()
      .toBuffer()
    const marked = await applyWatermark(base, watermark)

    pixelDifferenceVerified &&= marked.pixelDifferenceVerified
    variants.push(
      ...(await writeFormats(
        marked.buffer,
        config.slug,
        'main',
        marked.width,
        marked.height,
      )),
    )
  }

  return { variants, pixelDifferenceVerified }
}

async function prepareRoomContextImage(config, watermark) {
  const variants = []
  let pixelDifferenceVerified = true

  for (const width of paintingAssetDefaults.roomContextWidths) {
    const height = Math.round(width * 0.75)
    const sourceMetadata = await sharp(resolve(root, config.source)).metadata()
    const artworkWidth = Math.round(width * 0.34)
    const artworkHeight = Math.round(
      artworkWidth *
        ((sourceMetadata.height ?? 1) / (sourceMetadata.width ?? 1)),
    )
    const maxArtworkHeight = Math.round(height * 0.58)
    const baseArtwork = await sharp(resolve(root, config.source))
      .rotate()
      .resize({
        width: artworkWidth,
        height: Math.min(artworkHeight, maxArtworkHeight),
        fit: 'inside',
      })
      .png()
      .toBuffer()
    const markedArtwork = await applyWatermark(baseArtwork, watermark)
    const left = Math.round((width - markedArtwork.width) / 2)
    const top = Math.round(height * 0.12)
    const room = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: '#eee6d9',
      },
    })
      .composite([
        {
          input: Buffer.from(
            createRoomSvg(width, height, left, top, markedArtwork),
          ),
          top: 0,
          left: 0,
        },
        {
          input: markedArtwork.buffer,
          top,
          left,
        },
      ])
      .png()
      .toBuffer()

    pixelDifferenceVerified &&= markedArtwork.pixelDifferenceVerified
    variants.push(
      ...(await writeFormats(room, config.slug, 'room-context', width, height)),
    )
  }

  return { variants, pixelDifferenceVerified }
}

function createRoomSvg(width, height, left, top, artwork) {
  const floorTop = Math.round(height * 0.72)
  const shadowX = left - Math.round(width * 0.012)
  const shadowY = top - Math.round(width * 0.012)
  const shadowWidth = artwork.width + Math.round(width * 0.024)
  const shadowHeight = artwork.height + Math.round(width * 0.024)
  const benchWidth = Math.round(width * 0.34)
  const benchX = Math.round((width - benchWidth) / 2)
  const benchY = Math.round(height * 0.78)

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#eee6d9"/>
      <rect y="${floorTop}" width="${width}" height="${height - floorTop}" fill="#c9b8a2"/>
      <line x1="0" y1="${floorTop}" x2="${width}" y2="${floorTop}" stroke="#b5a58f" stroke-width="2"/>
      <rect x="${shadowX}" y="${shadowY}" width="${shadowWidth}" height="${shadowHeight}" rx="2" fill="#6a5d50" opacity="0.2"/>
      <rect x="${benchX}" y="${benchY}" width="${benchWidth}" height="${Math.round(height * 0.07)}" rx="4" fill="#7d6651"/>
      <rect x="${benchX + Math.round(benchWidth * 0.08)}" y="${benchY}" width="${Math.round(width * 0.025)}" height="${Math.round(height * 0.16)}" fill="#695441"/>
      <rect x="${benchX + Math.round(benchWidth * 0.84)}" y="${benchY}" width="${Math.round(width * 0.025)}" height="${Math.round(height * 0.16)}" fill="#695441"/>
    </svg>
  `
}

async function applyWatermark(input, watermarkConfig) {
  const base = await sharp(input).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  })
  const watermark = createTextWatermarkSvg(
    base.info.width,
    base.info.height,
    watermarkConfig,
  )
  const basePng = await sharp(base.data, { raw: base.info }).png().toBuffer()
  const markedPng = await sharp(basePng)
    .composite([{ input: Buffer.from(watermark.svg), top: 0, left: 0 }])
    .png()
    .toBuffer()
  const marked = await sharp(markedPng).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  })

  let changedPixels = 0
  for (let index = 0; index < base.data.length; index += base.info.channels) {
    if (
      base.data[index] !== marked.data[index] ||
      base.data[index + 1] !== marked.data[index + 1] ||
      base.data[index + 2] !== marked.data[index + 2]
    ) {
      changedPixels += 1
    }
  }

  if (changedPixels < watermark.minimumChangedPixels) {
    throw new Error('Watermark pixel verification failed')
  }

  return {
    buffer: markedPng,
    width: marked.info.width,
    height: marked.info.height,
    pixelDifferenceVerified: true,
  }
}

function createTextWatermarkSvg(width, height, watermarkConfig) {
  const fontSize = clamp(
    Math.round(width * watermarkConfig.fontScale),
    watermarkConfig.minFontSize,
    watermarkConfig.maxFontSize,
  )
  const x = Math.round(width / 2)
  const y = Math.round(height * watermarkConfig.verticalPosition)
  const escapedText = escapeSvgText(watermarkConfig.text)
  const minimumChangedPixels = Math.max(48, Math.round(width * height * 0.001))

  return {
    minimumChangedPixels,
    svg: `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="watermark-shadow" x="-30%" y="-80%" width="160%" height="260%">
            <feDropShadow dx="0" dy="${Math.max(1, Math.round(fontSize * 0.04))}" stdDeviation="${Math.max(1, Math.round(fontSize * 0.06))}" flood-color="black" flood-opacity="0.45"/>
            <feDropShadow dx="0" dy="0" stdDeviation="${Math.max(2, Math.round(fontSize * 0.12))}" flood-color="black" flood-opacity="0.25"/>
          </filter>
        </defs>
        <text
          x="${x}"
          y="${y}"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="${fontSize}"
          font-weight="500"
          letter-spacing="${Math.round(fontSize * 0.03)}"
          fill="${watermarkConfig.color}"
          fill-opacity="${watermarkConfig.opacity}"
          stroke="black"
          stroke-opacity="0.18"
          stroke-width="${Math.max(0.7, fontSize * 0.035).toFixed(2)}"
          paint-order="stroke fill"
          filter="url(#watermark-shadow)"
        >${escapedText}</text>
      </svg>
    `,
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function escapeSvgText(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

async function writeFormats(input, slug, role, width, height) {
  const directory = resolve(outputRoot, slug)
  await mkdir(directory, { recursive: true })

  return Promise.all([
    writeVariant(input, directory, slug, role, width, height, 'avif'),
    writeVariant(input, directory, slug, role, width, height, 'webp'),
    writeVariant(input, directory, slug, role, width, height, 'jpeg'),
  ])
}

async function writeVariant(
  input,
  directory,
  slug,
  role,
  width,
  height,
  format,
) {
  const extension = format === 'jpeg' ? 'jpg' : format
  const filename = `${role}-${width}.${extension}`
  const absolutePath = resolve(directory, filename)
  const pipeline = sharp(input)

  if (format === 'avif') {
    pipeline.avif({ quality: 58, effort: 5 })
  } else if (format === 'webp') {
    pipeline.webp({ quality: 82, effort: 5 })
  } else {
    pipeline.jpeg({ quality: 86, mozjpeg: true })
  }

  const contents = await pipeline.toBuffer()
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, contents)

  return {
    path: `/assets/paintings/${slug}/${filename}`,
    format,
    width,
    height,
    sha256: createHash('sha256').update(contents).digest('hex'),
  }
}
