
// self.addEventListener("install", e => {
//     e.waitUntil(
//         caches.open("static").then(cache => {
//             return cache.addAll([
//                 "./"
//             ])
//         })
//     )
// })

// self.addEventListener("fetch", e=>{
//     e.respondWith(
//         caches.match(e.request).then(res => {
//             return res || fetch(e.request)
//         })
//     )
// })
