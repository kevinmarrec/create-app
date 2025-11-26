/// <reference types="vite/client" />

interface ImportMetaEnv extends ViteConfigEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
