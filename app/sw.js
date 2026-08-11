/* ===== Minha Vida — Service Worker mínimo =====
   Existe só para o navegador considerar o app "instalável" (PWA).
   Não guarda cache agressivo: sempre busca da rede, para nunca servir
   uma versão antiga do app por engano. */
self.addEventListener('install', ()=> self.skipWaiting());
self.addEventListener('activate', (e)=> e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e)=>{
  e.respondWith(fetch(e.request).catch(()=> caches.match(e.request)));
});
