import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXKzH8KTvzxj_fzdqPjjafjXva7cdEGhY",
  authDomain: "bgmidb-b7052.firebaseapp.com",
  projectId: "bgmidb-b7052",
  storageBucket: "bgmidb-b7052.appspot.com",
  messagingSenderId: "375945347413",
  appId: "1:375945347413:web:3e28a9d1aec8fdafb42fdc",
  measurementId: "G-8CL6NSNKPG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };