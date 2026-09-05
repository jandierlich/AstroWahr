const CACHE_NAME = "astrowahr-v16";
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './astro.js',
  './tarot-cards.js',
  './tarot-art.js',
  './app.js',
  './no-zoom.js',
  './manifest.json',
  './impressum.html',
  './datenschutz.html',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      const fetchPromise = fetch(event.request).then(function (networkResp) {
        if (networkResp && networkResp.status === 200) {
          const clone = networkResp.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, clone); });
        }
        return networkResp;
      }).catch(function () { return cached; });
      return cached || fetchPromise;
    })
  );
});
