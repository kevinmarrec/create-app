import * as fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'

import { filesize } from 'filesize'
import { x } from 'tinyexec'
import { glob } from 'tinyglobby'

async function getFileStats(directory: string) {
  const fileStats = await Promise.all(
    (await glob(['**/*'], { cwd: directory })).map(async file => ({
      file,
      size: fs.statSync(path.join(directory, file)).size,
    })),
  )

  fileStats.sort((a, b) => {
    const scoreA = (a.file.startsWith('assets/') ? 2 : 0) + (a.file.endsWith('.js') ? 1 : 0)
    const scoreB = (b.file.startsWith('assets/') ? 2 : 0) + (b.file.endsWith('.js') ? 1 : 0)
    return scoreB - scoreA || a.file.localeCompare(b.file)
  })

  return fileStats
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

  const fileStats = await getFileStats(path.join(directory, 'dist'))
  const markdownTable = [
    '| File | Size |',
    '| :--- | ---: |',
    ...fileStats.map(file => `| ${file.file} | ${filesize(file.size)} |`),
  ].join('\n')
  process.stdout.write(`${markdownTable}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
