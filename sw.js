const CACHE_NAME = "monopoli-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./game.js",
  "./manifest.json"
];

// Install
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        return response || fetch(event.request);
      })
  );
});