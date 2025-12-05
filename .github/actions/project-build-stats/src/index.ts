import * as fs from 'node:fs'
import * as path from 'node:path'

import * as cache from '@actions/cache'
import * as core from '@actions/core'
import * as github from '@actions/github'
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

function formatDiffSize(currentSize: number, cachedSize: number): string {
  if (cachedSize === 0) return '➖'
  if (currentSize === 0) return '➖'

  const diffSize = currentSize - cachedSize
  if (diffSize === 0) return '➖'

  const diffPercent = ((diffSize / cachedSize) * 100).toFixed(2)
  const sign = diffSize > 0 ? '+' : ''
  return `${sign}${filesize(diffSize)} (${sign}${diffPercent}%)`
}

function formatDiffIndicator(currentSize: number, cachedSize: number): string {
  if (cachedSize === 0) return '🆕'
  if (currentSize === 0) return '❌'

  const diffSize = currentSize - cachedSize
  if (diffSize === 0) return '➖'

  return diffSize > 0 ? '🔺' : '✅'
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
  const diffSize = totalDiff === 0
    ? '➖'
    : totalDiff > 0
      ? `+${filesize(totalDiff)}`
      : filesize(totalDiff)
  const diffIndicator = totalDiff === 0
    ? '➖'
    : totalDiff > 0
      ? '🔺'
      : '✅'

  return `| **Total** | **${filesize(totalCached)}** | **${filesize(totalCurrent)}** | ${diffSize} | ${diffIndicator} |`
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
      const diffSize = formatDiffSize(currentSize, cachedSize)
      const diffIndicator = formatDiffIndicator(currentSize, cachedSize)
      rows.push(`| ${file} | ${filesize(cachedSize)} | ${filesize(currentSize)} | ${diffSize} | ${diffIndicator} |`)
    }
    else {
      rows.push(`| ${file} | ${filesize(currentSize)} |`)
    }
  }

  const header = hasCache
    ? `| File | \`main\` | Current | Diff (size) | Diff (indicator) |\n| :--- | ---: | ---: | ---: | ---: |`
    : '| File | Size |\n| :--- | ---: |'

  const table = [header, ...rows]

  if (showTotal) {
    table.push(formatTotalRow(totalCurrent, totalCached, hasCache))
  }

  return table.join('\n')
}

async function analyzeDirectory(
  directory: string,
  options: {
    cachePath: string
    showTotal: boolean
  },
): Promise<{ markdown: string, hasChanges: boolean }> {
  const { cachePath, showTotal } = options
  // Build the project
  await x('bun', ['run', 'build'], { nodeOptions: { cwd: directory } })

  const distPath = path.join(directory, 'dist')
  const currentStats = await getFileStats(distPath)

  // Load cached stats
  let cachedStats: FileStat[] | null = null
  let hasChanges = false

  if (fs.existsSync(cachePath)) {
    cachedStats = loadCachedStats(cachePath)
    if (cachedStats) {
      // Check if there are changes
      const currentMap = new Map(currentStats.map(s => [s.file, s.size]))
      const cachedMap = new Map(cachedStats.map(s => [s.file, s.size]))
      const allFiles = new Set([...currentMap.keys(), ...cachedMap.keys()])

      for (const file of allFiles) {
        const currentSize = currentMap.get(file) ?? 0
        const cachedSize = cachedMap.get(file) ?? 0
        if (currentSize !== cachedSize) {
          hasChanges = true
          break
        }
      }
    }
    else {
      hasChanges = true // New cache file means changes
    }
  }
  else {
    hasChanges = true // No cache means changes
  }

  // Save current stats
  saveStats(currentStats, cachePath)

  const markdown = generateDiffTable(currentStats, cachedStats, showTotal)
  return { markdown, hasChanges }
}

async function commentOnPR(body: string): Promise<void> {
  const token = core.getInput('github-token', { required: true })
  const octokit = github.getOctokit(token)
  const context = github.context

  if (context.eventName !== 'pull_request') {
    return
  }

  const prNumber = context.issue.number
  if (!prNumber) {
    core.warning('Could not determine PR number')
    return
  }

  // Add a hint identifier to the comment body for detection
  const COMMENT_HINT = '<!-- project-build-stats-action -->'
  const commentBody = `${COMMENT_HINT}\n\n${body}`

  try {
    // Find existing comment by looking for the hint
    const { data: comments } = await octokit.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: prNumber,
    })

    const botComment = comments.find(
      comment => comment.user?.type === 'Bot' && comment.body?.includes(COMMENT_HINT),
    )

    if (botComment) {
      // Update existing comment
      await octokit.rest.issues.updateComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: botComment.id,
        body: commentBody,
      })
      core.info('Updated existing PR comment')
    }
    else {
      // Create new comment
      await octokit.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        body: commentBody,
      })
      core.info('Created new PR comment')
    }
  }
  catch (error) {
    core.warning(`Failed to comment on PR: ${error}`)
  }
}

async function main(): Promise<void> {
  try {
    const directoriesInput = core.getInput('directories', { required: true })
    const cachePathBase = core.getInput('cache-path') || '.github/cache/build-stats'
    const cacheKey = core.getInput('cache-key') || 'build-stats-main'
    const showTotal = core.getBooleanInput('show-total', { required: false }) ?? true
    const prComment = core.getBooleanInput('comment-on-pr', { required: false }) ?? true

    const directories = directoriesInput.split(',').map(d => d.trim()).filter(Boolean)

    if (directories.length === 0) {
      core.setFailed('At least one directory must be provided')
      return
    }

    // Restore cache
    core.info(`Restoring cache with key: ${cacheKey}`)
    const cacheHit = await cache.restoreCache([cachePathBase], cacheKey)
    if (cacheHit) {
      core.info(`Cache restored from key: ${cacheHit}`)
    }
    else {
      core.info('No cache found')
    }

    const summaryParts: string[] = []
    let overallHasChanges = false

    for (const directory of directories) {
      const dirName = path.basename(directory)
      const cachePath = path.join(cachePathBase, `${dirName}.json`)

      core.info(`Analyzing ${directory}...`)

      const { markdown, hasChanges } = await analyzeDirectory(directory, {
        cachePath,
        showTotal,
      })

      if (hasChanges) {
        overallHasChanges = true
      }

      summaryParts.push(`## ${dirName.charAt(0).toUpperCase() + dirName.slice(1)}\n\n${markdown}`)
    }

    const fullSummary = summaryParts.join('\n\n')

    // Write to step summary
    core.summary.addRaw(fullSummary)
    await core.summary.write()

    core.startGroup('Full summary')
    core.info(fullSummary)
    core.endGroup()

    // Set output
    core.setOutput('has-changes', overallHasChanges.toString())

    core.info(`Detected changes ? ${overallHasChanges ? 'yes' : 'no'}`)

    // Comment on PR if there are changes and comment-on-pr is enabled
    if (overallHasChanges && github.context.eventName === 'pull_request' && prComment) {
      await commentOnPR(fullSummary)
    }

    // Save cache (only on main branch)
    if (github.context.ref === 'refs/heads/main') {
      core.info(`Saving cache with key: ${cacheKey}`)
      try {
        await cache.saveCache([cachePathBase], cacheKey)
        core.info('Cache saved successfully')
      }
      catch (error) {
        // Cache save failures shouldn't fail the action
        if (error instanceof Error) {
          core.warning(`Failed to save cache: ${error.message}`)
        }
        else {
          core.warning(`Failed to save cache: ${String(error)}`)
        }
      }
    }
    else {
      core.info('Skipping cache save (not on main branch)')
    }
  }
  catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
    else {
      core.setFailed(String(error))
    }
  }
}

main()
