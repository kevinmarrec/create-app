import type { KnipConfig } from 'knip'

// Required for Knip to pass
Object.assign(import.meta.env, {
  ALLOWED_ORIGINS: 'https://foo.bar',
  AUTH_SECRET: 'foo',
  DATABASE_URL: 'postgresql://foo:bar@localhost:5432/foo',
  SERVER_URL: 'https://foo.bar',
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
      // Remove this when using VueUse
      ignoreDependencies: ['@vueuse/core'],
    },
  },
} satisfies KnipConfig
