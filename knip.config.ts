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
    'template/client': {
      entry: ['src/main.ts'],
      ignoreDependencies: [
        '@vueuse/core',
      ],
    },
    'template/server': {
      drizzle: {
        config: 'src/database/drizzle/config.ts',
      },
      ignoreDependencies: [
        'pino-pretty',
      ],
    },
  },
} satisfies KnipConfig
