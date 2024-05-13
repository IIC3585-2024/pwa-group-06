importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js")

const firebaseConfig = {
	apiKey: "AIzaSyBQZwh45n-M3ATt-53KCdERgxRLABLq8Ao",
	authDomain: "incognitto-ink.firebaseapp.com",
	projectId: "incognitto-ink",
	storageBucket: "incognitto-ink.appspot.com",
	messagingSenderId: "796884157899",
	appId: "1:796884157899:web:cb41bdb2333ae76f8b224e",
	measurementId: "G-2S02DLYSPR"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || payload.data.title;
  const notificationOptions = {
    body: payload.notification.body || payload.data.body,
    icon: './assets/icon512_maskable.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
