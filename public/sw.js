/**
 * PM33 Service Worker - Advanced Caching Strategy
 * Performance: Implements efficient caching with background sync
 * Offline-first approach with cache invalidation
 */

const CACHE_NAME = 'pm33-cache-v1';
const STATIC_CACHE_NAME = 'pm33-static-v1';
const DYNAMIC_CACHE_NAME = 'pm33-dynamic-v1';
const API_CACHE_NAME = 'pm33-api-v1';

// Performance: Cache different resource types with appropriate strategies
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/PM 33 New Logo Horizontal V1.2.png',
  '/_next/static/css/',
  '/_next/static/js/',
];

const DYNAMIC_PAGES = [
  '/pricing',
  '/features', 
  '/blog',
  '/about',
  '/contact',
  '/trial'
];

const API_PATTERNS = [
  /\/api\//,
  /\/velocity-calculator/,
  /\/signups/
];

// Performance: Cache-first strategy for static assets
const cacheFirst = async (request) => {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache-first failed:', error);
    return new Response('Offline', { status: 503 });
  }
};

// Performance: Network-first strategy for dynamic content
const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <html>
          <body style="font-family: system-ui; text-align: center; padding: 2rem;">
            <h1>You're Offline</h1>
            <p>PM33 will work again when you're back online.</p>
            <button onclick="window.location.reload()" 
                    style="padding: 1rem 2rem; border-radius: 8px; border: none; background: #667eea; color: white; cursor: pointer;">
              Try Again
            </button>
          </body>
        </html>
      `
    });
  }
};

// Performance: Stale-while-revalidate for API calls
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(API_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
};

// Install event: Cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        return cache.addAll(DYNAMIC_PAGES);
      })
    ]).then(() => {
      console.log('Service Worker installed successfully');
      return self.skipWaiting();
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const validCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, API_CACHE_NAME];
      
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!validCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event: Route requests to appropriate caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Performance: Route different request types to optimal strategies
  if (STATIC_ASSETS.some(asset => url.pathname.startsWith(asset))) {
    event.respondWith(cacheFirst(request));
  } 
  else if (API_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(staleWhileRevalidate(request));
  }
  else if (DYNAMIC_PAGES.includes(url.pathname) || url.pathname.startsWith('/_next/')) {
    event.respondWith(networkFirst(request));
  }
  else {
    // Default to network first for unknown resources
    event.respondWith(networkFirst(request));
  }
});

// Performance: Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'velocity-calculation') {
    event.waitUntil(syncVelocityCalculations());
  } else if (event.tag === 'signup-form') {
    event.waitUntil(syncSignupForms());
  }
});

// Performance: Handle background sync for velocity calculations
async function syncVelocityCalculations() {
  try {
    const pendingCalculations = await getStoredCalculations();
    
    for (const calculation of pendingCalculations) {
      try {
        const response = await fetch('/api/velocity-calculator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(calculation.data)
        });
        
        if (response.ok) {
          await removeStoredCalculation(calculation.id);
        }
      } catch (error) {
        console.log('Failed to sync calculation:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Performance: Handle background sync for signup forms
async function syncSignupForms() {
  try {
    const pendingSignups = await getStoredSignups();
    
    for (const signup of pendingSignups) {
      try {
        const response = await fetch('/api/signups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signup.data)
        });
        
        if (response.ok) {
          await removeStoredSignup(signup.id);
        }
      } catch (error) {
        console.log('Failed to sync signup:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Utility functions for IndexedDB operations
async function getStoredCalculations() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pm33-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['calculations'], 'readonly');
      const store = transaction.objectStore('calculations');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('calculations', { keyPath: 'id' });
      db.createObjectStore('signups', { keyPath: 'id' });
    };
  });
}

async function getStoredSignups() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pm33-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['signups'], 'readonly');
      const store = transaction.objectStore('signups');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

async function removeStoredCalculation(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pm33-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['calculations'], 'readwrite');
      const store = transaction.objectStore('calculations');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

async function removeStoredSignup(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pm33-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['signups'], 'readwrite');
      const store = transaction.objectStore('signups');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Performance: Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon.png',
    badge: '/favicon.png',
    data: data.url,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

console.log('PM33 Service Worker loaded successfully');