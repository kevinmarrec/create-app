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
      drizzle: {
        config: 'src/database/drizzle/config.ts',
      },
      ignoreDependencies: ['pino-pretty'],
    },
    'template/frontend': {
      entry: ['src/main.ts'],
      ignoreDependencies: [
        '@vueuse/core',
        'uno.css',
      ],
    },
  },
} satisfies KnipConfig
