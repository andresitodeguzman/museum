'use strict';

let cn = '1.21';
let cacheWhiteList = ['1.21'];
let assetsList = [
    '/index.html',
    '/manifest.json',
    '/images/icons/128x128.png',
    '/images/icon/144x144.png',
    '/images/icon/152x152.png',
    '/images/icon/192x192.png',
    '/images/icon/384x384.png',
    '/images/icon/512x512.png',
    '/images/icon/72x72.png',
    '/images/icon/96x96.png',
    '/jquery.js',
    '/my_model/metadata.json',
    '/my_model/model.json',
    '/my_model/weights.bin',
    '/assets/images/bust-card.svg',
    '/assets/images/button.png',
    '/assets/images/Group 1.png',
    '/assets/images/Group 2.png',
    '/assets/images/hideinfo.svg',
    '/assets/images/learnmore.svg',
    '/assets/images/logo.png',
    '/assets/images/retablo-card.svg',
    '/assets/images/spoliarium-card.svg',
    '/assets/images/spoliarium-preview.png'
];

// Install Event
self.addEventListener('install', event=>{
    // Open the cache
    event.waitUntil(caches.open(cn)
        .then(cache=>{
            // Fetch all the assets from the array
            return cache.addAll(assetsList);
        }).then(()=>{
            console.log("done caching");
        })
    );
});


self.addEventListener('fetch', event=>{
    event.respondWith(
        caches.match(event.request)
            .then(response=>{
                //Fallback to network
                return response || fetch(event.request);
            })
            .catch(r=>{
                let method = event.request.method;

                if(method !== 'POST'){
                    return caches.match('index.html');
                }

            })
    );
});

// Remove Old Caches
self.addEventListener('activate', (event)=>{
    event.waitUntil(
        caches.keys().then((keyList)=>{
            return Promise.all(keyList.map((key)=>{
                if(cacheWhiteList.indexOf(key) === -1){
                    return caches.delete(key);
                }
            }));
        })
    );
});