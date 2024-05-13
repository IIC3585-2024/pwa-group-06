window.addEventListener('load', async e => {
  if ('serviceWorker' in navigator) {
      try {
          navigator.serviceWorker.register('serviceWorker.js');
          console.log('SW registered');

      } catch (error) {
          console.log('SW failed');

      }
  }
});
