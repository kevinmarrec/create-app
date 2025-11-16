import type { KnipConfig } from 'knip'

// Required for Knip to pass
Object.assign(import.meta.env, {
  AUTH_SECRET: '',
  DATABASE_URL: '',
})

export default {
  stylelint: false,
  workspaces: {
    '.': {
      entry: ['*.config.ts'],
    },
    'api': {
      drizzle: {
        config: 'src/database/drizzle/config.ts',
      },
    },
    'app': {
      entry: ['src/main.ts'],
      ignoreDependencies: [
        '@vueuse/core',
      ],
    },
  },
} satisfies KnipConfig
