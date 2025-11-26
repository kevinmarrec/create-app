import type { KnipConfig } from 'knip'

// Required for Knip to pass
Object.assign(import.meta.env, {
  ALLOWED_ORIGINS: 'https://foo.bar',
  AUTH_SECRET: 'foo',
  DATABASE_URL: 'postgresql://foo:bar@localhost:5432/foo',
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
