// src/global.d.ts
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

declare module "react-simple-captcha";
declare module "localforage";

// Add Vite import.meta.env typings so TypeScript knows about VITE_ variables
interface ImportMetaEnv {
	readonly VITE_BASE_URL?: string;
	// add other VITE_ variables here as needed
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

