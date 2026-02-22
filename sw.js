const CACHE_VERSION = 'v3';
const CACHE_NAME = `barber-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  '/',
  '/index.html',
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
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
      )
      .then(() => {
        // Forzar recarga de todos los tabs abiertos para mostrar la nueva versión
        return self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.navigate(client.url));
        });
      })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network-first para HTML: siempre intenta obtener la versión más nueva
  if (e.request.headers.get('Accept')?.includes('text/html')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache-first para el resto (JS, imágenes, etc.)
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
