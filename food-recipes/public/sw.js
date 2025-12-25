const CACHE_NAME = "app-cache-v6";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/assets/index-XXXXX.css", // replace with build file names
  "/assets/index-XXXXX.js",
  "/vite.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Navigation request (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Assets (JS/CSS/images)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).catch(() =>
        new Response("Offline", { status: 503, statusText: "Offline" })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Ignore Vite internal URLs in dev mode
  if (url.includes("/@vite") || url.includes("/@react-refresh") || url.includes("/src/")) {
    return;
  }

  // Normal fetch handling
});