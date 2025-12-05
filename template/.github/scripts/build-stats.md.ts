import * as fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'

import { filesize } from 'filesize'
import { x } from 'tinyexec'
import { glob } from 'tinyglobby'

interface FileStat {
  file: string
  size: number
}

const FILE_PRIORITY_SCORE = {
  ASSETS_PREFIX: 2,
  JS_EXTENSION: 1,
} as const

function getFilePriority(file: string): number {
  let score = 0
  if (file.startsWith('assets/')) score += FILE_PRIORITY_SCORE.ASSETS_PREFIX
  if (file.endsWith('.js')) score += FILE_PRIORITY_SCORE.JS_EXTENSION
  return score
}

function normalizeAssetFilename(file: string): string {
  if (!file.startsWith('dist/assets/')) {
    return file
  }

  return file.replace(/-\S{8,}(\.[a-z]+)$/, '$1')
}

function sortFiles(files: string[]): string[] {
  return [...files].sort((a, b) => {
    const scoreDiff = getFilePriority(b) - getFilePriority(a)
    return scoreDiff !== 0 ? scoreDiff : a.localeCompare(b)
  })
}

async function getFileStats(directory: string): Promise<FileStat[]> {
  const files = await glob(['**/*'], { cwd: directory })

  const fileStats: FileStat[] = files.map(file => ({
    file: normalizeAssetFilename(`dist/${file}`),
    size: fs.statSync(path.join(directory, file)).size,
  }))

  fileStats.sort((a, b) => {
    const scoreDiff = getFilePriority(b.file) - getFilePriority(a.file)
    return scoreDiff !== 0 ? scoreDiff : a.file.localeCompare(b.file)
  })

  return fileStats
}

function loadCachedStats(cachePath: string): FileStat[] | null {
  if (!fs.existsSync(cachePath)) {
    return null
  }
  try {
    const content = fs.readFileSync(cachePath, 'utf-8')
    return JSON.parse(content)
  }
  catch {
    return null
  }
}

function saveStats(stats: FileStat[], cachePath: string): void {
  const dir = path.dirname(cachePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(cachePath, JSON.stringify(stats, null, 2))
}

function formatDiff(currentSize: number, cachedSize: number): string {
  if (cachedSize === 0) return '🆕'
  if (currentSize === 0) return '❌'

  const diffSize = currentSize - cachedSize
  if (diffSize === 0) return '—'

  const diffPercent = ((diffSize / cachedSize) * 100).toFixed(2)
  const sign = diffSize > 0 ? '+' : ''
  return `${sign}${filesize(diffSize)} (${sign}${diffPercent}%)`
}

function formatTotalRow(
  totalCurrent: number,
  totalCached: number,
  hasCache: boolean,
): string {
  if (!hasCache) {
    return `| **Total** | **${filesize(totalCurrent)}** |`
  }

  const totalDiff = totalCurrent - totalCached
  const diffDisplay = totalDiff === 0
    ? '—'
    : totalDiff > 0
      ? `+${filesize(totalDiff)}`
      : filesize(totalDiff)

  return `| **Total** | **${filesize(totalCurrent)}** | **${filesize(totalCached)}** | ${diffDisplay} |`
}

function generateDiffTable(
  current: FileStat[],
  cached: FileStat[] | null,
  showTotal: boolean,
): string {
  const hasCache = cached !== null
  const currentMap = new Map(current.map(s => [s.file, s.size]))
  const cachedMap = hasCache ? new Map(cached.map(s => [s.file, s.size])) : new Map()

  const allFiles = new Set([...currentMap.keys(), ...cachedMap.keys()])
  const sortedFiles = sortFiles(Array.from(allFiles))

  const rows: string[] = []
  let totalCurrent = 0
  let totalCached = 0

  for (const file of sortedFiles) {
    const currentSize = currentMap.get(file) ?? 0
    const cachedSize = cachedMap.get(file) ?? 0
    totalCurrent += currentSize
    totalCached += cachedSize

    if (hasCache) {
      const diff = formatDiff(currentSize, cachedSize)
      rows.push(`| ${file} | ${filesize(currentSize)} | ${filesize(cachedSize)} | ${diff} |`)
    }
    else {
      rows.push(`| ${file} | ${filesize(currentSize)} |`)
    }
  }

  const header = hasCache
    ? '| File | Current | Main | Diff |\n| :--- | ---: | ---: | ---: |'
    : '| File | Size |\n| :--- | ---: |'

  const table = [header, ...rows]

  if (showTotal) {
    table.push(formatTotalRow(totalCurrent, totalCached, hasCache))
  }

  return table.join('\n')
}

async function main() {
  const { positionals, values } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      cache: {
        type: 'string',
        short: 'c',
      },
      total: {
        type: 'boolean',
        short: 't',
      },
    },
  })

  const directory = positionals[0]
  const cachePath = values.cache
  const showTotal = values.total ?? false

  if (!directory) {
    process.stdout.write('Usage: analyze <directory> [--cache <path>] [--total]\n')
    process.exit(1)
  }

  await x('bun', ['run', 'build'], { nodeOptions: { cwd: directory } })

  const currentStats = await getFileStats(path.join(directory, 'dist'))
  const cachedStats = cachePath ? loadCachedStats(cachePath) : null

  if (cachePath) {
    saveStats(currentStats, cachePath)
  }

  const markdownTable = generateDiffTable(currentStats, cachedStats, showTotal)
  process.stdout.write(`${markdownTable}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
