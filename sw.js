const CACHE_VERSION = 'v4';
const CACHE_NAME = `barber-${CACHE_VERSION}`;

// index.html NO se cachea: siempre viene de la red para que las actualizaciones sean inmediatas
const STATIC_ASSETS = [
  '/manifest.json',
  '/firebase-config.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // HTML: siempre red, nunca cache
  if (e.request.headers.get('Accept')?.includes('text/html')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Resto: cache-first
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
