import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging.js";
import { notepadsApi } from './api/client.js';

function initFirebase(registration) {
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
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  function requestNotificationPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('Welcome to Incognitto Ink!', { body: 'You will now receive notifications for new notes.' });
        console.log('Notification permission granted.');

        getToken(messaging, { 
            serviceWorkerRegistration: registration,
            vapidKey: 'BMySMG6-EBvorhfSsZEs2O2PBc3cS0W1r7o8e3PfKvvq22t7OtXQ14G_ZfZQtbmYOkb5K3gFBQOVTwbA0yY3jNw' 
          }).then((currentToken) => {
            if (currentToken) {
              console.log('FCM Token:', currentToken);
              notepadsApi.subscribeNotifications(currentToken);
            } else {
              console.log('No Instance ID token available. Request permission to generate one.');
            }
          }).catch((err) => {
            console.error('An error occurred while retrieving token. ', err);
          });
      } else {
        console.log('Unable to get permission to notify.');
      }
    });
  }

  requestNotificationPermission(messaging);

  // Foreground message handling
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    new Notification(payload.notification.title, payload.notification);
  });
}

export default initFirebase;
