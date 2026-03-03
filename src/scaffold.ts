import { basename, join } from 'pathe'

import fs, { ignorePredicate } from './utils/fs'
import { cloneTemplate, resolveTemplate } from './utils/template'

export async function scaffold(root: string, template?: string) {
  await fs.exists(root)
    ? await fs.empty(root)
    : await fs.mkdir(root, { recursive: true })

  if (template) {
    const { url, subdir } = resolveTemplate(template)
    const tempDir = await cloneTemplate(url)

    try {
      const sourceDir = subdir ? join(tempDir, subdir) : tempDir
      await fs.cp(sourceDir, root, {
        recursive: true,
        filter: src => !ignorePredicate(basename(src)),
      })
    }
    finally {
      await fs.rm(tempDir, { recursive: true, force: true })
    }
  }
  else {
    await fs.cp(join(import.meta.dirname, '../template'), root, { recursive: true })
  }
}
