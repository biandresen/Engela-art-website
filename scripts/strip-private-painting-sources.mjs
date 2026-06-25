import { readdir, rm } from 'node:fs/promises'
import { basename, resolve } from 'node:path'

import { paintingAssetConfig } from './painting-assets.config.mjs'

const root = process.cwd()
const privateSourceNames = new Set(
  paintingAssetConfig.map(({ source }) => basename(source)),
)
const outputRoots = [resolve(root, 'dist'), resolve(root, '.output/public')]
let removedCount = 0

for (const outputRoot of outputRoots) {
  await removePrivateSources(outputRoot)
}

console.log(
  `Excluded ${removedCount} temporary painting source file(s) from build output.`,
)

async function removePrivateSources(directory) {
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') {
      return
    }
    throw error
  }

  for (const entry of entries) {
    const path = resolve(directory, entry.name)

    if (entry.isDirectory()) {
      await removePrivateSources(path)
    } else if (privateSourceNames.has(entry.name)) {
      await rm(path)
      removedCount += 1
    }
  }
}
