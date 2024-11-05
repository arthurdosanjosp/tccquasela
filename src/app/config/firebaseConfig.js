import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYXQDgmIggNby4oIX2lwdBeCIp2t9yQNk",
  authDomain: "projeto-tcc-58b50.firebaseapp.com",
  projectId: "projeto-tcc-58b50",
  storageBucket: "projeto-tcc-58b50.appspot.com",
  messagingSenderId: "685795240236",
  appId: "1:685795240236:web:45aa1679e0523384c3a489",
  measurementId: "G-BR0MJQE4L2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app); 

export { app, db, getFirestore, collection, addDoc, deleteDoc, doc };
