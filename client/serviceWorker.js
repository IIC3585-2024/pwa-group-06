importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  const CORE_STATIC_FILES = [
    '/',
    '/index.html'
  ];

  workbox.precaching.precacheAndRoute(CORE_STATIC_FILES);

  workbox.routing.registerNavigationRoute(
    workbox.precaching.getCacheKeyForURL('/index.html'), {
      whitelist: ['^/notebooks', '^/notes'],
    }
  );

  workbox.routing.registerRoute(
		new RegExp('.*\.js'),
		new workbox.strategies.StaleWhileRevalidate({
			cacheName: 'javascript',
		})
	);

  workbox.routing.registerRoute(
		new RegExp('.*\.css'),
		new workbox.strategies.StaleWhileRevalidate({
			cacheName: 'css',
		})
	);

  workbox.routing.registerRoute(
		/\.(?:png|gif|jpg|jpeg|svg)$/,
		new workbox.strategies.CacheFirst({
			cacheName: 'images',
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 60,
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
				}),
			],
		})
	);
};
