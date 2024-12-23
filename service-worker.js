self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-cache').then((cache) => {
      return cache.addAll([
        '/', // الصفحة الرئيسية
        '/index.html', 
        '/style.css', 
        '/script.js', 
        '/service-worker.js',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
        'https://api.mymemory.translated.net/get', // API الترجمة
        'https://api.streamelements.com/kappa/v2/speech' // API النطق
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
