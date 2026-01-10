import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
export default defineConfig({
    plugins: [react(), nodePolyfills()],
    define: {
        "process.env": {},
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
                secure: false,
                rewrite: function (path) { return path.replace(/^\/api/, ""); },
            },
        },
    },
});
