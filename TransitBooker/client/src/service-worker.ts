/// <reference lib="WebWorker" />

// Declare type to ensure TS recognizes this as a service worker
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'travelease-v1';

// Assets to cache immediately when the service worker is installed
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/src/manifest.webmanifest',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css'
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Helper function to determine if a request should be cached
const shouldCache = (url: string): boolean => {
  const parsedUrl = new URL(url);
  
  // Never cache API requests
  if (parsedUrl.pathname.startsWith('/api/')) {
    return false;
  }
  
  // Cache static assets and HTML pages
  if (
    parsedUrl.pathname.endsWith('.css') ||
    parsedUrl.pathname.endsWith('.js') ||
    parsedUrl.pathname.endsWith('.html') ||
    parsedUrl.pathname.endsWith('.svg') ||
    parsedUrl.pathname.endsWith('.webmanifest') ||
    parsedUrl.pathname === '/' ||
    parsedUrl.pathname.startsWith('/booking/') ||
    parsedUrl.pathname.startsWith('/trip/') ||
    parsedUrl.pathname.startsWith('/payment/') ||
    parsedUrl.pathname.startsWith('/confirmation/')
  ) {
    return true;
  }
  
  // Cache font files from Google Fonts
  if (parsedUrl.hostname === 'fonts.googleapis.com' || 
      parsedUrl.hostname === 'fonts.gstatic.com') {
    return true;
  }
  
  // Cache Remix Icon files
  if (parsedUrl.hostname === 'cdn.jsdelivr.net' && parsedUrl.pathname.includes('remixicon')) {
    return true;
  }
  
  return false;
};

// Fetch event - network first, then cache for assets that should be cached
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = event.request.url;
  
  // For API requests or other non-cacheable requests, use network only
  if (!shouldCache(url)) {
    return;
  }
  
  // For assets that should be cached, use network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If we got a valid response, clone it and cache it
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request);
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  
  const title = data.title || 'TravelEase Update';
  const options = {
    body: data.body || 'New updates available',
    icon: data.icon || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' width=\'192\' height=\'192\' stroke=\'%231E40AF\' stroke-width=\'2\' fill=\'%23ffffff\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M8 7h8m-8.5 5h7M8 16h8M5 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z\'/%3E%3C/svg%3E',
    badge: data.badge || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' width=\'192\' height=\'192\' stroke=\'%231E40AF\' stroke-width=\'2\' fill=\'%23ffffff\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M8 7h8m-8.5 5h7M8 16h8M5 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z\'/%3E%3C/svg%3E',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // If a window client already exists, focus it
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
