import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCes7CMjX2KVA-tpIoZrAofn_H1orN_lhk",
  authDomain: "todolistfirebase-e74cb.firebaseapp.com",
  databaseURL: "https://todolistfirebase-e74cb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "todolistfirebase-e74cb",
  storageBucket: "todolistfirebase-e74cb.firebasestorage.app",
  messagingSenderId: "622547788017",
  appId: "1:622547788017:web:bc5b215a40453895f5c950"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
