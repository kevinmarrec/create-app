interface ImportMetaEnv {
  readonly ALLOWED_ORIGINS: string
  readonly AUTH_SECRET: string
  readonly DATABASE_URL: string
  readonly LOG_LEVEL: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
