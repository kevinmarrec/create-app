import * as fs from 'node:fs'
import process from 'node:process'
import { parseArgs } from 'node:util'

import { filesize } from 'filesize'
import path from 'pathe'
import { x } from 'tinyexec'
import { glob } from 'tinyglobby'

interface FileStats {
  file: string
  size: number
}

async function getFileStats(directory: string) {
  const fileStats: FileStats[] = []

  for (const file of await glob(['**/*'], { cwd: directory })) {
    const size = fs.statSync(path.join(directory, file)).size
    fileStats.push({
      file,
      size,
    })
  }

  fileStats.sort((a, b) => {
    // Sort so that files starting with 'assets/' come first
    if (a.file.startsWith('assets/') && !b.file.startsWith('assets/')) return -1
    if (!a.file.startsWith('assets/') && b.file.startsWith('assets/')) return 1

    // Within that, files ending with '.js' come first
    if (a.file.endsWith('.js') && !b.file.endsWith('.js')) return -1
    if (!a.file.endsWith('.js') && b.file.endsWith('.js')) return 1

    // Otherwise sort alphabetically
    return a.file.localeCompare(b.file)
  })

  return fileStats
}

async function generateFileStatsMarkdown(directory: string) {
  const fileStats = await getFileStats(directory)
  return [
    '| File | Size |',
    '| :--- | ---: |',
    ...fileStats.map(file => `| ${file.file} | ${filesize(file.size)} |`),
  ].join('\n')
}

async function main() {
  const { positionals: [directory] } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
  })

  if (!directory) {
    process.stdout.write('Usage: analyze <directory>\n')
    process.exit(1)
  }

  await x('bun', ['run', 'build'], { nodeOptions: { cwd: directory } })

  const markdownTable = await generateFileStatsMarkdown(path.join(directory, 'dist'))
  process.stdout.write(`${markdownTable}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
