import initFirebase from "./firebase-init.js";

window.addEventListener('load', async e => {
  if ('serviceWorker' in navigator) {
      try {
          navigator.serviceWorker.register('serviceWorker.js');
          navigator.serviceWorker.register('firebase-messaging-sw.js')
          .then((registration) => {
            console.log('Registration:', registration);
            initFirebase(registration);
          })
          console.log('SW registered');

      } catch (error) {
          console.log('SW failed');

      }
  }
});
