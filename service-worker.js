const build = [
  "/_app/start-4dac7ae6.js",
  "/_app/pages/__layout.svelte-b1cc2360.js",
  "/_app/assets/pages/__layout.svelte-fbb0d832.css",
  "/_app/pages/__error.svelte-729473b7.js",
  "/_app/assets/pages/__error.svelte-153d5994.css",
  "/_app/pages/docs.svelte-747ce929.js",
  "/_app/pages/full.svelte-ab1c302a.js",
  "/_app/pages/index.svelte-25de0384.js",
  "/_app/pages/repl.svelte-3398e74c.js",
  "/_app/pages/usage.svelte-cec594f5.js",
  "/_app/chunks/index-d3eca301.js",
  "/_app/chunks/index-cd1cbe0f.js",
  "/_app/chunks/singletons-d1fb5791.js",
  "/_app/chunks/preload-helper-e4860ae8.js",
  "/_app/chunks/ga-4f878969.js",
  "/_app/chunks/toast-35e741ba.js",
  "/_app/chunks/markmap-8ced2850.js",
  "/_app/chunks/footer-cd1a48c7.js",
  "/_app/chunks/loader-038ed9be.js",
  "/_app/assets/loader-c9b69ec1.css",
  "/_app/chunks/buttons.esm-d34d450f.js",
  "/_app/chunks/codemirror-2cfe4ae5.js",
  "/_app/assets/codemirror-ba3b7b73.css"
];
const files = [
  "/.nojekyll",
  "/demos/auto-loader.html",
  "/favicon.png",
  "/logo-192.png",
  "/logo-512.png",
  "/manifest.json"
];
const version = "1651845386627";
const ASSETS = `cache${version}`;
const to_cache = build.concat(files);
const cached = new Set(to_cache);
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(ASSETS).then((cache) => cache.addAll(to_cache)).then(() => {
    self.skipWaiting();
  }));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(async (keys) => {
    for (const key of keys) {
      if (key !== ASSETS)
        await caches.delete(key);
    }
    self.clients.claim();
  }));
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.headers.has("range"))
    return;
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith("http"))
    return;
  if (url.hostname === self.location.hostname && url.port !== self.location.port)
    return;
  if (url.host === self.location.host && cached.has(url.pathname)) {
    event.respondWith(caches.match(event.request, { ignoreSearch: true }));
    return;
  }
  if (event.request.cache === "only-if-cached")
    return;
  event.respondWith(caches.open(`offline${version}`).then(async (cache) => {
    try {
      const response = await fetch(event.request);
      cache.put(event.request, response.clone());
      return response;
    } catch (err) {
      const response = await cache.match(event.request);
      if (response)
        return response;
      throw err;
    }
  }));
});
