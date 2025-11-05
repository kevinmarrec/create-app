import { join } from 'pathe'

import fs from './utils/fs'

export async function scaffold(root: string) {
  await fs.exists(root)
    ? await fs.empty(root)
    : await fs.mkdir(root)

  // Copy template
  await fs.cp(join(import.meta.dirname, '../template'), root, { recursive: true })
}
