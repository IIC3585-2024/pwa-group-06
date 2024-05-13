import { notepadsApi } from './api/client.js';

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

document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.querySelector('#notebook-submit');
  const inputField = document.querySelector('#notebook-input');


  submitButton.addEventListener('click', async () => {
    const notepadName = inputField.value;
    console.log(notepadName);

    if (notepadName) {
      try {
        await notepadsApi.create({ name: notepadName });
        alert('Notepad created successfully!');
        window.location.replace('/notebook.html?name=' + notepadName);
      } catch (error) {
        console.error('Failed to create notepad:', error);
      }
    }
  });
});
