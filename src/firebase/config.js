// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDqwetKDPNi7McxTXnJqlgTqllOgYGAItw",
  authDomain: "gizmo-b884d.firebaseapp.com",
  projectId: "gizmo-b884d",
  storageBucket: "gizmo-b884d.firebasestorage.app",
  messagingSenderId: "480721623385",
  appId: "1:480721623385:web:a58df550b3938184ee5448",
  measurementId: "G-L9N42YQT77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const appForStorage = initializeApp(firebaseConfigForStorage);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
