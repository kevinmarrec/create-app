import fs from 'node:fs/promises'
import os from 'node:os'

import type { TextOptions } from '@clack/prompts'
import { faker } from '@faker-js/faker'
import { join } from 'pathe'
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'

import { version } from '../package.json'
import { run } from '../src/run'
import { exists } from '../src/utils/fs'

const mocks = vi.hoisted(() => ({
  x: vi.fn(),
  prompts: {
    confirm: vi.fn(() => Promise.resolve(false)),
    text: vi.fn<(_options: TextOptions) => Promise<string>>(),
  },
}))

vi.mock('tinyexec', () => ({ x: mocks.x }))
vi.mock('@clack/prompts', async () => ({
  ...await vi.importActual('@clack/prompts'),
  text: mocks.prompts.text,
  confirm: mocks.prompts.confirm,
}))

describe('run', () => {
  let projectName: string
  let tmpDir: string
  let resolveProjectPath: (filename: string) => string
  let stdoutSpy: MockInstance

  beforeEach(async () => {
    process.argv = ['node', 'create-app']
    projectName = `${faker.word.adjective()}-${faker.animal.type()}`
    tmpDir = await fs.mkdtemp(join(os.tmpdir(), 'create-app-'))
    resolveProjectPath = (...paths: string[]) => join(tmpDir, projectName, ...paths)

    // Spies
    stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
    vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit(${code})`)
    })
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  it('create-app (no directory given, simulate projectName answer, install dependencies)', async () => {
    mocks.prompts.text.mockImplementationOnce(async (options) => {
      expect(options.validate?.('   ')).toBe('Project name cannot be empty')
      expect(options.validate?.(projectName)).toBeUndefined()
      return projectName
    })

    mocks.prompts.confirm.mockResolvedValueOnce(true)

    await run()

    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Scaffolded project'))
    expect(await exists(resolveProjectPath('package.json'))).toBe(true)
    expect(await exists(resolveProjectPath('.gitignore'))).toBe(true)
  })

  it('create-app [DIRECTORY] (directory does not exist)', async () => {
    process.argv[2] = projectName

    await run()

    expect(await exists(resolveProjectPath('package.json'))).toBe(true)
  })

  it('create-app [DIRECTORY] (directory exists and is empty)', async () => {
    process.argv[2] = projectName

    await fs.mkdir(resolveProjectPath(''))

    await run()

    expect(await exists(resolveProjectPath('package.json'))).toBe(true)
  })

  it('create-app [DIRECTORY] (directory exists and only contains .git folder)', async () => {
    process.argv[2] = projectName

    await fs.mkdir(resolveProjectPath('.git'), { recursive: true })

    await run()

    expect(await exists(resolveProjectPath('.git'))).toBe(true)
    expect(await exists(resolveProjectPath('package.json'))).toBe(true)
  })

  it.each([
    { isCurrentDirectory: true, shouldOverwrite: true },
    { isCurrentDirectory: false, shouldOverwrite: true },
    { isCurrentDirectory: false, shouldOverwrite: false },
  ])('create-app [DIRECTORY] (directory exists and contains files, %o)', async ({ isCurrentDirectory, shouldOverwrite }) => {
    process.argv[2] = isCurrentDirectory ? '.' : projectName
    projectName = isCurrentDirectory ? '.' : projectName

    mocks.prompts.confirm.mockResolvedValueOnce(shouldOverwrite)

    await fs.mkdir(resolveProjectPath('src'), { recursive: true })
    await fs.writeFile(resolveProjectPath('src/index.ts'), '')

    if (shouldOverwrite) {
      await run()
      expect(await exists(resolveProjectPath('package.json'))).toBe(true)
    }
    else {
      await expect(run()).rejects.toThrowError('process.exit(1)')
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Operation cancelled'))
      expect(await exists(resolveProjectPath('src'))).toBe(true)
      expect(await exists(resolveProjectPath('package.json'))).toBe(false)
    }
  })

  it('create-app --force [DIRECTORY] (directory exists and contains files)', async () => {
    process.argv[2] = projectName
    process.argv[3] = '--force'

    await fs.mkdir(resolveProjectPath('src'), { recursive: true })
    await fs.writeFile(resolveProjectPath('src/index.ts'), '')

    await run()

    expect(await exists(resolveProjectPath('package.json'))).toBe(true)
  })

  it('create-app --help', async () => {
    process.argv[2] = '--help'

    await expect(run()).rejects.toThrowError('process.exit(0)')

    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Usage: create-app'))
  })

  it('create-app --version', async () => {
    process.argv[2] = '--version'

    await expect(run()).rejects.toThrowError('process.exit(0)')

    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining(version))
  })
})
