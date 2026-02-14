/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASEURL : string
  readonly VITE_SOCKET_TOKEN_PREFIX: string;
  readonly VITE_SSE_VIDEO_EVENTS: string;
 readonly  VITE_SSE_NOTIFICATION_EVENTS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
