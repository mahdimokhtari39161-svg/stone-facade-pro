'use strict';
const CACHE='stone-facade-pro-v2';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/stonefacade.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin===self.location.origin && req.mode==='navigate'){
  event.respondWith(fetch(req).then(res=>{if(res.ok)caches.open(CACHE).then(c=>c.put('./index.html',res.clone()));return res;}).catch(()=>caches.match('./index.html')));
  return;
 }
 if(req.destination==='script'||req.destination==='style'||req.destination==='font'||(url.origin===self.location.origin&&req.destination==='image')){
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res&&(res.ok||res.type==='opaque'))caches.open(CACHE).then(c=>c.put(req,res.clone()));return res;})));
 }
});