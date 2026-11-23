import { createHash } from 'node:crypto'
import { relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdir, readFile, writeFile } from 'node:fs/promises'

const dist = new URL('../dist/', import.meta.url)
const files = (await readdir(dist, { recursive: true, withFileTypes: true }))
  .filter(file => file.isFile() && file.name !== 'sw.js')
  .map(file => './' + relative(fileURLToPath(dist), resolve(file.parentPath, file.name)).split('\\').join('/')).sort()
const version = createHash('sha256')
for (const file of files) {
  version.update(file)
  version.update(await readFile(new URL(file, dist)))
}
await writeFile(new URL('sw.js', dist), `
const prefix = 'budapest-navi:' + self.registration.scope + ':';
const cacheName = prefix + '${version.digest('hex').slice(0, 16)}';
const files = ${JSON.stringify(files)};
const shell = new URL('index.html', self.registration.scope);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(files.map(file =>
    new Request(new URL(file, self.registration.scope), { cache: 'reload' })
  ))));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(names => Promise.all(names
    .filter(name => name.startsWith(prefix) && name !== cacheName)
    .map(name => caches.delete(name)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith(caches.open(cacheName).then(cache => cache.match(shell)).then(cached => cached || fetch(request)));
    return;
  }
  if (files.some(file => new URL(file, self.registration.scope).href === request.url)) {
    event.respondWith(caches.open(cacheName).then(cache => cache.match(request, { ignoreVary: true })).then(cached => cached || fetch(request)));
  }
});
`)
