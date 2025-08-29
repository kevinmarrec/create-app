interface ImportMetaEnv {
  readonly DATABASE_URL: string
  readonly LOG_LEVEL: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
