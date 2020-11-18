//import WORKBOX
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox ? console.log(`Workbox berhasil dimuat`) :  console.log(`Workbox gagal dimuat`);


workbox.precaching.precacheAndRoute([
  //=======================//
  {url:'/', revision : '1'},
  //======================//
  {url:'/nav.html', revision:'1'},
  {url:'/index.html', revision:'1'},
  {url:'/desc.html', revision:'1'},
  {url:'/manifest.json',revision: '1'},
  //======================//
  {url:'/css/materialize.min.css', revision:'1'},
  {url:'/css/style.css', revision:'1'},
  //======================//
  {url:'/js/materialize.min.js', revision:'1'},
  {url:'/js/nav.js', revision:'1'},
  {url:'/js/api.js', revision:'1'},
  {url:'/js/sw-utama.js', revision:'1'},
  {url:'js/sw-desc.js', revision:'1'},
  {url:'js/idb.js', revision:'1'},
  {url:'js/db.js', revision:'1'},
  {url:'js/key.js', revision:'1'},
   //======================//
  {url:'/assets/img/icon.png', revision:'1'},
  {url:'/assets/img/icon192.png', revision:'1'},
  {url:'/assets/img/icon144.png', revision:'1'},
  {url:'/assets/img/icon16.png', revision:'1'},
  //=======================//
  {url:'https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js', revision:'1'},
  {url:'https://fonts.googleapis.com/icon?family=Material+Icons', revision:'1'},
  {url:'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap', revision:'1'},
],{
ignoreUrlParametersMatching: [/.*/],
});


//Route Ke API
workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://api.football-data.org",
  workbox.strategies.staleWhileRevalidate({
      cacheName: "football-api",
      plugins: [
          new workbox.expiration.Plugin({
              maxAgeSeconds: 60 * 30,
          }),
      ],
  })
);

//nyimpen Halaman di cache bernama page
workbox.routing.registerRoute(
  new RegExp("/pages/"),
  workbox.strategies.staleWhileRevalidate({
      cacheName: "pages",
  })
);

//Menyimpan Cache dari google Font
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

//Simpan selama setahun
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);


self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
