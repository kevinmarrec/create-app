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
        config: 'src/database/drizzle/config.ts',
      },
      ignoreDependencies: ['pino-pretty'],
    },
    'frontend': {
      entry: ['src/main.ts'],
      ignoreDependencies: [
        '@vueuse/core',
        'uno.css',
      ],
    },
  },
} satisfies KnipConfig
