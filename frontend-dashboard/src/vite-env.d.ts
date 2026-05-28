/// <reference types="vite/client" />

declare module "*.png" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_INGESTION_API_URL: string;
  readonly VITE_ANALYSIS_API_URL: string;
  readonly VITE_USE_MOCK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
