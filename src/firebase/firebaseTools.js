import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "./config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const isDocumentExistent = (snapshot) => snapshot.exists();
export const isCollectionExistent = (snapshot) => !snapshot.empty();
export const isDocumentExistentWithId = (col, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, col, id);
      const snapshot = await getDoc(docRef);

      resolve(isDocumentExistent(snapshot));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const parseDocumentData = (snapshot) => ({
  ...snapshot.data(),
  docId: snapshot.id,
});

export const parseCollectionData = (snapshot) => {
  const documents = [];
  snapshot.forEach((doc) => {
    documents.push({ ...doc.data(), docId: doc.id });
  });
  return documents;
};

export const getDocumentById = (collectionName, docId) =>
  new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const snapshot = await getDoc(docRef);
      resolve(parseDocumentData(snapshot));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

export const getCollectionByName = (collectionName) =>
  new Promise(async (resolve, reject) => {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      resolve(parseCollectionData(snapshot));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

export const addDocument = (collectionName, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await addDoc(colRef, data);
      resolve(snapshot.id);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

export const createDocument = (collectionName, documentName, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionName, documentName);
      const snapshot = await setDoc(docRef, data);
      resolve(snapshot);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const updateDocumentById = (collectionName, docId, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const snapshot = await updateDoc(docRef, data);
      resolve(snapshot);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

// export const uploadFile = (file, onProgress) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const fileName = `${generateRandomChars()}.${file.name.split(".").pop()}`;
//       const fileRef = ref(storage, fileName);
//       const uploadTask = uploadBytesResumable(fileRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           onProgress(progress);
//           console.log(`Upload is ${progress}% done`);
//           switch (snapshot.state) {
//             case "paused":
//               console.log("Upload is paused");
//               break;
//             case "running":
//               console.log("Upload is running");
//               break;
//           }
//         },
//         (error) => {
//           reject(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             resolve(downloadURL);
//           });
//         }
//       );
//     } catch (error) {
//       console.error(error);
//       reject(error);
//     }
//   });
// };

export const getCollectionByField = (collectionName, field, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const colRef = collection(db, collectionName);
      const q = query(
        colRef,
        where(field, "==", value),
        orderBy("createdAt", "desc")
      ); // Sort by createdAt in descending order
      const snapshot = await getDocs(q);
      resolve(parseCollectionData(snapshot));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const liveListen = async (collectionName, docId, cb) => {
  const docRef = doc(db, collectionName, docId);
  const listener = onSnapshot(docRef, (snapshot) => {
    cb(parseDocumentData(snapshot));
  });
};
