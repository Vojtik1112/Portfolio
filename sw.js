const CACHE_NAME = 'portfolio-cache-v2';
const CORE_ASSETS = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'projects.json',
  'manifest.webmanifest',
  'offline.html',
  'robots.txt',
  'sitemap.xml'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.origin === location.origin) {
    if (req.mode === 'navigate') {
      e.respondWith(
        fetch(req).catch(()=> caches.match('offline.html'))
      );
      return;
    }
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(net => {
        const clone = net.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, clone));
        return net;
      }).catch(()=> caches.match('offline.html')))
    );
  }
});
