const CACHE_NAME = 'eccentric-circles-cache-v1';
const urlsToCache = [
  '/index.html',
  '/src/main.js',
  '/src/App.svelte',
  '/src/CommandPrompt.svelte',
  '/src/CircleGroup.svelte',
  '/src/Utils.js',
  '/vite.config.js',
  '/package.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
