// Service Worker for Bart Warrior
// Provides offline functionality and caching strategy

const CACHE_VERSION = 'v2';
const SHELL_CACHE = `shell-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const NETWORK_TIMEOUT = 5000; // 5 seconds

// Assets to cache on install (app shell)
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css',
  'https://code.jquery.com/jquery-3.4.1.slim.min.js',
  'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js'
];

// Install event: Cache the app shell
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      console.log('[ServiceWorker] Caching shell assets');
      // Pre-cache only local assets, not CDN
      return cache.addAll([
        '/',
        '/style.css',
        '/app.js'
      ]).catch(err => {
        console.log('[ServiceWorker] Some assets failed to cache:', err);
      });
    })
  );
});

// Activate event: Clean up old cache versions
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== SHELL_CACHE && cacheName !== API_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Implement stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle API requests (/)
  if (url.pathname === '/' || url.pathname.match(/^\/?[a-z0-9]+\/?$/)) {
    event.respondWith(staleWhileRevalidate(event.request, API_CACHE));
    return;
  }

  // Handle other requests (CSS, JS, HTML)
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(event.request, SHELL_CACHE));
    return;
  }

  // For CDN/external requests, use network-first
  event.respondWith(networkFirst(event.request));
});

/**
 * Cache-first strategy: Check cache first, fall back to network
 * Used for app shell (HTML, CSS, JS)
 */
function cacheFirst(request, cacheName) {
  return caches
    .match(request)
    .then((response) => {
      if (response) {
        console.log('[ServiceWorker] Cache hit:', request.url);
        return response;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    })
    .catch(() => {
      // Return offline page if available
      return caches.match('/offline.html');
    });
}

/**
 * Stale-while-revalidate strategy: Return cached data immediately,
 * but fetch fresh data in background and update cache
 * Used for API calls
 */
function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then((cache) => {
    return cache.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        cache.put(request, responseToCache);
        return response;
      });

      // Return cached response immediately, or wait for network if not cached
      return cachedResponse || fetchPromise;
    });
  });
}

/**
 * Network-first strategy: Try network first, fall back to cache
 * Used for CDN/external resources
 */
function networkFirst(request) {
  return new Promise((resolve, reject) => {
    let timedOut = false;

    const timeoutId = setTimeout(() => {
      timedOut = true;
      // If network times out, try cache
      caches
        .match(request)
        .then((response) => {
          resolve(response || new Response('Network timeout', { status: 408 }));
        });
    }, NETWORK_TIMEOUT);

    fetch(request)
      .then((response) => {
        clearTimeout(timeoutId);
        if (!timedOut) {
          resolve(response);
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        if (!timedOut) {
          caches
            .match(request)
            .then((response) => {
              resolve(response || new Response('No cache available', { status: 503 }));
            });
        }
      });
  });
}
