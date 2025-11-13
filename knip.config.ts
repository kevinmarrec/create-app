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
      entry: [
        '.github/scripts/*.ts',
        '*.config.ts',
      ],
    },
    'template/api': {
      drizzle: {
        config: 'src/database/drizzle/config.ts',
      },
    },
    'template/app': {
      entry: ['src/main.ts'],
      ignoreDependencies: [
        '@vueuse/core',
      ],
    },
  },
} satisfies KnipConfig
