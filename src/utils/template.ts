import os from 'node:os'

import { join } from 'pathe'
import { x } from 'tinyexec'

import fs from './fs'

const GITHUB_SHORTHAND_RE = /^[^/\s]+\/[^/\s]+$/

interface TemplateInfo {
  url: string
  subdir?: string
}

export function resolveTemplate(template: string): TemplateInfo {
  const [repo, ...rest] = template.split('#')
  const subdir = rest.join('#') || undefined

  const url = resolveTemplateUrl(repo)

  return { url, subdir }
}

function resolveTemplateUrl(repo: string): string {
  if (repo.startsWith('https://')) {
    return repo
  }

  if (repo.startsWith('git@')) {
    return repo
  }

  if (GITHUB_SHORTHAND_RE.test(repo)) {
    return `https://github.com/${repo}.git`
  }

  throw new Error(`Invalid template format: "${repo}"`)
}

export async function cloneTemplate(url: string): Promise<string> {
  const tempDir = await fs.mkdtemp(join(os.tmpdir(), 'create-app-template-'))

  try {
    await x('git', ['clone', '--depth', '1', url, tempDir])
  }
  catch (error) {
    await fs.rm(tempDir, { recursive: true, force: true })
    throw new Error(`Failed to clone template from "${url}"`, { cause: error })
  }

  return tempDir
}
