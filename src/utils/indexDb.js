import { generateUUID } from './uuid';

const DB_NAME = 'lic-store';
const STORE_NAME = 'Files';

// Function to open or create the IndexedDB database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Database error: ${event.target.error}`);
    };
  });
}

// Function to store a file with a generated ID
export async function storeFile(file) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Generate the ID (replace this with your ID generation logic)
    const id = generateUUID();

    const fileData = {
      id: id,
      file: file,
      timestamp: Date.now(),
    };

    const request = store.put(fileData);

    request.onsuccess = () => {
      resolve(id);
    };

    request.onerror = (event) => {
      reject(`Error storing file: ${event.target.error}`);
    };
  });
}

// Function to retrieve a file by ID
export async function getFile(id) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(`Error retrieving file: ${event.target.error}`);
    };
  });
}
