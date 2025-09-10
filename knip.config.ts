import type { KnipConfig } from 'knip'

// Required for Knip to pass
Object.assign(import.meta.env, {
  DATABASE_URL: 'foo.db',
})

export default {
  stylelint: false,
  workspaces: {
    '.': {
      entry: ['*.config.ts'],
    },
    'template': {
      entry: ['*.config.ts'],
    },
    'template/backend': {
      ignoreDependencies: ['pino-pretty'],
    },
    'template/frontend': {
      entry: ['src/main.ts'],
      ignoreDependencies: ['uno.css'],
    },
  },
} satisfies KnipConfig
