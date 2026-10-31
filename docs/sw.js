/* V11.7 GitHub Pages: jediný offline snapshot hry, všechny soubory relativně
   vůči podadresáři repozitáře. Žádné přenosy uložených her na server. */
const CACHE_NAME = 'last-light-github-pages-v117-20261031';
const CACHE_PREFIX = 'last-light-github-pages-';
const FILES = [
  './', './index.html', './HRA.html', './hra.css', './hra.js', './prostor_v117.js',
  './jazyk.js', './reakce.js', './havran_dialogy.js',
  './havran_v116.js', './carodej_dialogy.js', './zvuk.js', './mapa.js',
  './pwa.js', './manifest.webmanifest', './icon.svg',
  './assets/dalekohled_vyhled.png',
  './assets/krypta_otevrena_klic.png',
  './assets/krypta_otevrena_prazdna.png',
  './assets/mapa_udoli.png',
  './assets/mlyn_cisty.png',
  './assets/mlyn_zavreny.png',
  './assets/most_lano.png',
  './assets/predmety.png',
  './assets/rytir.png',
  './assets/svet.png',
  './assets/vez_zavrena.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then(cache => cache.addAll(FILES))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)
    .catch(async () => (event.request.mode === 'navigate' && await caches.match('./HRA.html')) || Response.error())));
});
