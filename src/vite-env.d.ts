/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  // 其他環境變數...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}