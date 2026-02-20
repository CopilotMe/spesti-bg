const CACHE_NAME = "spesti-v5";
const OFFLINE_URL = "/";

// Pages to pre-cache
const PRECACHE_URLS = [
  "/",
  "/elektrichestvo",
  "/voda",
  "/gaz",
  "/internet",
  "/goriva",
  "/krediti",
  "/zastrahovki",
  "/budget",
  "/koshnitsa",
  "/bvp",
  "/inflacia",
  "/zaplati",
  "/kombiniran",
  "/evro-konvertor",
  "/bulgaria-vs-eu",
  "/mobilni-planove",
  "/kupuvatelna-sposobnost",
  "/kachestvo-na-vazduh",
  "/otoplenie",
  "/cena-na-truda",
  "/razbivka-smetka",
  "/slanchevi-paneli",
  "/kola",
  "/voda-sravnenie",
  "/blog",
];

// Install — pre-cache core pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, fallback to cache
self.addEventListener("fetch", (event) => {
  // Skip non-GET and external requests
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip API calls (live data should always be fresh)
  const url = new URL(event.request.url);
  if (
    url.hostname.includes("ecb.europa.eu") ||
    url.hostname.includes("eurostat") ||
    url.hostname.includes("open-meteo") ||
    url.pathname.startsWith("/api")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline — serve from cache
        return caches.match(event.request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});
