import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIbHw-_abCTDsbdlt2v9Oqf7HKFifakEI",
  authDomain: "trainingivi.firebaseapp.com",
  projectId: "trainingivi",
  storageBucket: "trainingivi.firebasestorage.app",
  messagingSenderId: "492922105550",
  appId: "1:492922105550:web:03e1348615271072056a9f"
};

let auth: Auth;
let db: Firestore;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('❌ Ошибка инициализации Firebase:', error);
  throw error;
}

export { auth, db };
