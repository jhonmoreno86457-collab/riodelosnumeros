// Guarda el juego en el celular para que funcione sin internet.
// Cada vez que se publica una versión nueva, cambia VERSION y el juego avisa "Actualizar".
const VERSION = 'rio-20261031-2112';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './icono-192.png', './icono-512.png', './icono-192-maskable.png', './icono-512-maskable.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS))); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'actualizar') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => {
      const copia = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); return res;
    }).catch(() => caches.match('./index.html')))
  );
});
