/// <reference types="@kevinmarrec/cloudstack-vite-config/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
