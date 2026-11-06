const CACHE_NAME = 'zidong-core-v2-installable';
const APP_SHELL = [
    './',
    './index.html',
    './style.css',
    './audio.js',
    './navigation.js',
    './hanzi-lab.js',
    './mock-data.js',
    './app.js',
    './critical-fail.js',
    './manifest.json',
    './icon.svg'
];

self.addEventListener('install', event => { 
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // Se usa map individual para que si falta un archivo opcional no rompa la instalación
            return Promise.allSettled(
                APP_SHELL.map(url => cache.add(url))
            );
        })
    ); 
    self.skipWaiting(); 
});

self.addEventListener('activate', event => { 
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        ))
    ); 
    self.clients.claim(); 
});

self.addEventListener('fetch', event => { 
    if (event.request.method !== 'GET') return; 
    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request))
    ); 
});
