const dbPromise = new Promise((resolve, reject) => {
  const openRequest = indexedDB.open('NotepadsDB', 1);

  openRequest.onupgradeneeded = function(event) {
    let db = event.target.result;
    db.createObjectStore('notepads', { keyPath: 'id' });
    db.createObjectStore('notes', { keyPath: 'id' });
  };

  openRequest.onsuccess = function(event) {
    resolve(event.target.result);
  };

  openRequest.onerror = function(event) {
    reject(openRequest.error);
  };
});

const idbApi = {
  async get(storeName, id) {
    const db = await dbPromise;
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    return store.get(id);
  },
  async getAll(storeName) {
    const db = await dbPromise;
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    return store.getAll();
  },
  async set(storeName, value, overwrite = true) {
    const db = await dbPromise;
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    if (overwrite) {
      return store.put(value);
    } else {
      return store.add(value);
    }
  },
  async delete(storeName, id) {
    const db = await dbPromise;
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    return store.delete(id);
  }
};

export default idbApi;
