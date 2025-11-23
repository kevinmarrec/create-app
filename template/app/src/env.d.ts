/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ANALYTICS_URL: string
  readonly VITE_ANALYTICS_WEBSITE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
