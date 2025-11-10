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
