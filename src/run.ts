import process from 'node:process'
import { parseArgs } from 'node:util'

import { cancel, confirm, intro, isCancel, log, note, outro, tasks, text } from '@clack/prompts'
import c from 'ansis'
import { resolve } from 'pathe'
import { x } from 'tinyexec'

import { version } from '../package.json'
import { scaffold } from './scaffold'
import fs from './utils/fs'

function maybeCancel<T>(value: T, options?: { strict?: boolean }): asserts value is Exclude<T, symbol> {
  if (isCancel(value) || (options?.strict && !value)) {
    cancel('Operation cancelled')
    process.exit(1)
  }
}

export async function run() {
  const { values: options, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      force: { type: 'boolean', short: 'f' },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
  })

  // Help
  if (options.help) {
    process.stdout.write(`\
Usage: create-app [OPTIONS...] [DIRECTORY]

Options:
  -f, --force     Create the project even if the directory is not empty.
  -h, --help      Display this help message.
  -v, --version       Display the version number of this CLI.
`)
    process.exit(0)
  }

  // Version
  if (options.version) {
    process.stdout.write(`${version}\n`)
    process.exit(0)
  }

  process.stdout.write('\n')

  intro(`create-app ${c.dim(`v${version}`)}`)

  // Project name

  let projectName = positionals[0] || await text({
    message: 'Project name',
    placeholder: 'my-app',
    validate: (value) => {
      if (!value.trim())
        return 'Project name cannot be empty'
    },
  })

  maybeCancel(projectName)

  projectName = projectName.trim()

  // Target directory

  const cwd = process.cwd()
  const targetDir = resolve(cwd, projectName)

  // Overwrite check
  const warnOverwrite = !(await fs.emptyCheck(targetDir) || options.force)

  if (warnOverwrite) {
    await log.warn(`${targetDir === cwd ? 'Current directory' : `Target directory ${c.blue(targetDir)}`} is not empty`)

    const shouldOverwrite = await confirm({
      message: 'Remove existing files and continue?',
      initialValue: true,
      active: 'Yes',
      inactive: 'No',
    })

    maybeCancel(shouldOverwrite, { strict: true })
  }

  // Scaffold project

  await tasks([{
    title: `Scaffolding project in ${c.blue(targetDir)}`,
    task: async () => {
      await scaffold(targetDir)
      return `Scaffolded project in ${c.blue(targetDir)}`
    },
  }])

  // Install dependencies

  const shouldInstall = await confirm({
    message: 'Install dependencies?',
    initialValue: true,
    active: 'Yes',
    inactive: 'No',
  })

  maybeCancel(shouldInstall)

  await tasks([{
    title: 'Installing with bun',
    enabled: shouldInstall,
    task: async () => {
      await x('bun', ['install', '--cwd', targetDir, '--force'])
      return 'Installed with bun'
    },
  }])

  await note([
    targetDir !== cwd && `cd ${c.reset.blue(projectName)}`,
    `bun run dev`,
  ].filter(Boolean).join('\n'), 'Next steps')

  await outro(`Problems? ${c.cyan('https://github.com/kevinmarrec/create-app/issues')}`)
}
