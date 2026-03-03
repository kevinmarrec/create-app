import fs from 'node:fs/promises'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { cloneTemplate, resolveTemplate } from '../src/utils/template'

const mocks = vi.hoisted(() => ({
  x: vi.fn(),
}))

vi.mock('tinyexec', () => ({ x: mocks.x }))

describe('resolveTemplate', () => {
  it.each([
    'https://github.com/user/repo.git',
    'https://github.com/user/repo',
    'git@github.com:user/repo.git',
    'git@github.com:user/repo',
  ])('accepts %s as a valid URL', (url) => {
    expect(resolveTemplate(url)).toEqual({ url, subdir: undefined })
  })

  it('resolves shorthand user/repo to GitHub HTTPS URL', () => {
    expect(resolveTemplate('user/repo'))
      .toEqual({ url: 'https://github.com/user/repo.git', subdir: undefined })
  })

  it('extracts subdir from #fragment', () => {
    expect(resolveTemplate('user/repo#src/template'))
      .toEqual({ url: 'https://github.com/user/repo.git', subdir: 'src/template' })
    expect(resolveTemplate('https://github.com/user/repo.git#my-template'))
      .toEqual({ url: 'https://github.com/user/repo.git', subdir: 'my-template' })
    expect(resolveTemplate('git@github.com:user/repo.git#nested/path'))
      .toEqual({ url: 'git@github.com:user/repo.git', subdir: 'nested/path' })
  })

  it('throws for invalid template format', () => {
    expect(() => resolveTemplate('foo')).toThrow('Invalid template format: "foo"')
    expect(() => resolveTemplate('a/b/c')).toThrow('Invalid template format: "a/b/c"')
    expect(() => resolveTemplate('')).toThrow('Invalid template format: ""')
    expect(() => resolveTemplate('user/ repo')).toThrow('Invalid template format: "user/ repo"')
  })
})

describe('cloneTemplate', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
  })

  it('clones to a temp directory and returns its path', async () => {
    mocks.x.mockResolvedValueOnce(undefined)

    const tempDir = await cloneTemplate('https://github.com/user/repo.git')

    expect(mocks.x).toHaveBeenCalledWith('git', [
      'clone',
      '--depth',
      '1',
      'https://github.com/user/repo.git',
      tempDir,
    ])

    await fs.rm(tempDir, { recursive: true, force: true })
  })

  it('cleans up temp dir and throws on clone failure', async () => {
    mocks.x.mockRejectedValueOnce(new Error('git clone failed'))

    await expect(cloneTemplate('https://github.com/user/repo.git'))
      .rejects
      .toThrow('Failed to clone template from "https://github.com/user/repo.git"')
  })
})
