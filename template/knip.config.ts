import type { KnipConfig } from 'knip'

Object.assign(import.meta.env, {
  DATABASE_URL: 'foo.db',
})

export default {
  stylelint: false,
  workspaces: {
    '.': {
      entry: ['*.config.ts'],
    },
    'backend': {
      drizzle: {
        config: ['src/config/drizzle.ts'],
      },
      ignoreDependencies: ['pino-pretty'],
    },
    'frontend': {
      entry: ['src/main.ts'],
      ignoreDependencies: ['uno.css'],
    },
  },
} satisfies KnipConfig
