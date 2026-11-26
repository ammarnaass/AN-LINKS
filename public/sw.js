// AN LINKS - Progressive Web App Service Worker (RFC PWA / Mobile Cache)
const CACHE_NAME = "an-links-cache-v1";
const PRECACHE_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/logo-icon.svg",
  "/og-image.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith("http")) return;

  // Cache-first strategy for static icons and webmanifest
  if (
    event.request.url.includes("/favicon.svg") ||
    event.request.url.includes("/logo-icon.svg") ||
    event.request.url.includes("/manifest.webmanifest")
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
        );
      })
    );
    return;
  }

  // Network-first with cache fallback for other requests
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
