import { join } from 'pathe'

import fs from './utils/fs'

export async function scaffold(root: string) {
  await fs.exists(root)
    ? await fs.empty(root)
    : await fs.mkdir(root, { recursive: true })

  // Copy template
  await fs.cp(join(import.meta.dirname, '../template'), root, { recursive: true })

  // Add workspaces field to package.json (needed for final template but causes issues with Renovate)
  const packageJsonPath = join(root, 'package.json')
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)

  // Insert workspaces field before scripts by manipulating entries
  const entries = Object.entries(packageJson)
  entries.splice(
    entries.findIndex(([key]) => key === 'scripts'),
    0,
    ['workspaces', ['api', 'app']],
  )
  const updatedContent = `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`

  await fs.writeFile(packageJsonPath, updatedContent)
}
