// Service Worker for Uomboni Secondary School PWA
// Optimized for Offline Student Results Access & Static Media Caching
// Does NOT cache JavaScript/TypeScript bundles to prevent React hook dispatcher desync

const RESULTS_CACHE = 'uomboni-sec-results-v10';
const FONTS_CACHE = 'uomboni-sec-fonts-v10';
const MEDIA_CACHE = 'uomboni-sec-media-v10';

const CRITICAL_MEDIA_ASSETS = [
  '/manifest.json',
  '/favicon.svg',
  '/pwa-icon.svg',
  '/uomboni_flyer_2026.jpg',
];

// Install Event - Precache media assets and initial student results
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // 1. Cache Critical Media Assets (images/icons)
      caches.open(MEDIA_CACHE).then((cache) => {
        return Promise.all(
          CRITICAL_MEDIA_ASSETS.map((asset) => {
            return cache.add(asset).catch((err) => {
              console.warn('SW: Precache media asset skipped:', asset, err?.message);
            });
          })
        );
      }),
      // 2. Pre-fetch student results API to ensure offline readiness from first load
      caches.open(RESULTS_CACHE).then(async (cache) => {
        try {
          const res = await fetch('/api/results');
          if (res && res.status === 200) {
            await cache.put('/api/results', res.clone());
            await cache.put('/api/results?cached=true', res.clone());
          }
        } catch (e) {
          // Server might be in dev startup, will populate on first request or client sync
        }
      }),
    ])
  );
  self.skipWaiting();
});

// Activate Event - Clean up ANY legacy or deprecated caches immediately
self.addEventListener('activate', (event) => {
  const activeCaches = [RESULTS_CACHE, FONTS_CACHE, MEDIA_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Aggressively delete any cache that has 'static' or isn't in activeCaches
            if (!activeCaches.includes(cacheName) || cacheName.includes('static')) {
              console.log('SW: Purging old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event - Strategic routing ONLY for Results Data, Fonts, and Media Assets
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests with HTTP/HTTPS schemes
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);

  // CRITICAL: Bypass dev tooling, Vite, modules, and all code scripts
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.includes('node_modules') ||
    url.pathname.includes('vite') ||
    url.pathname.includes('hot-update') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.jsx') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.mjs') ||
    url.pathname.endsWith('.css')
  ) {
    return;
  }

  // 1. SCHOOL DATABASE ENDPOINTS: Always bypass Service Worker to guarantee live backend data across all devices
  if (url.pathname.startsWith('/api/school-data')) {
    return;
  }

  // 2. RESULTS API: Network-first falling back to Results Cache
  if (url.pathname.startsWith('/api/results')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(RESULTS_CACHE).then((cache) => {
              cache.put(request, clone);
              if (url.pathname === '/api/results' && !url.search) {
                cache.put('/api/results', networkResponse.clone());
              }
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cache = await caches.open(RESULTS_CACHE);
          let cachedResponse = await cache.match(request);

          if (!cachedResponse) {
            cachedResponse = await cache.match(url.pathname);
          }

          if (cachedResponse) {
            const cachedData = await cachedResponse.json();
            return new Response(JSON.stringify(cachedData), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'X-Uomboni-Offline': 'true',
                'X-Cache-Status': 'HIT-OFFLINE-DATA',
              },
            });
          }

          return new Response(
            JSON.stringify({
              success: true,
              results: [],
              data: null,
              isOffline: true,
              message: 'Hali ya Nje ya Mtandao: Hakuna matokeo yaliyohifadhiwa bado kwenye kifaa hiki.',
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'X-Uomboni-Offline': 'true',
              },
            }
          );
        })
    );
    return;
  }

  // 2. AI ASSISTANT API: Offline Friendly Message
  if (url.pathname.startsWith('/api/ai-assistant')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            reply:
              'Uko nje ya mtandao kwa sasa (Offline). Unaweza kuangalia matokeo yaliyohifadhiwa, fomu za kujiunga na maelezo ya shule bila intaneti. Kuuliza maswali mapya kwa Msaidizi wa AI, tafadhali unganisha intaneti.',
            isOffline: true,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  }

  // 3. GOOGLE FONTS: Cache-first with long TTL
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(FONTS_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            return new Response('', { status: 408, headers: { 'Content-Type': 'text/css' } });
          });
      })
    );
    return;
  }

  // 4. STATIC MEDIA (Images, SVGs, Flyer, Icons, PDF): Stale-While-Revalidate
  const isMedia = url.pathname.match(/\.(jpg|jpeg|png|svg|webp|gif|ico|pdf)$/i);
  if (isMedia) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // For everything else (HTML, JS, CSS, navigation) - pass through to network natively!
});

// Message Event - Handle synchronization of student results from client
self.addEventListener('message', async (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === 'CACHE_STUDENT_RESULTS') {
    try {
      const { results, count, timestamp = Date.now() } = data.payload || {};
      if (Array.isArray(results)) {
        const cache = await caches.open(RESULTS_CACHE);

        const payload = {
          success: true,
          count: results.length,
          results,
          timestamp,
          source: 'uomboni-sw-message-cache',
        };

        const response = new Response(JSON.stringify(payload), {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
            'X-Uomboni-Offline': 'true',
            'X-Cache-Timestamp': String(timestamp),
          },
        });

        await cache.put('/api/results', response.clone());
        await cache.put('/api/results?cached=true', response.clone());

        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({
            success: true,
            count: results.length,
            timestamp,
          });
        }
      }
    } catch (err) {
      console.warn('SW: Error caching student results via message:', err);
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: false, error: String(err) });
      }
    }
  }

  if (data.type === 'GET_OFFLINE_STATUS') {
    try {
      const cache = await caches.open(RESULTS_CACHE);
      const match = await cache.match('/api/results');
      let cachedCount = 0;
      let lastSyncedAt = null;

      if (match) {
        const json = await match.json();
        cachedCount = Array.isArray(json.results) ? json.results.length : 0;
        lastSyncedAt = json.timestamp || null;
      }

      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({
          success: true,
          cachedCount,
          lastSyncedAt,
          isOffline: !navigator.onLine,
        });
      }
    } catch (e) {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: false, cachedCount: 0 });
      }
    }
  }
});
