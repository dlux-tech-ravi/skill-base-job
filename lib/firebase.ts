import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
} from "firebase/firestore";
import {
  getStorage,
  FirebaseStorage,
} from "firebase/storage";

// Client-side Firebase initialization shared across app

const firebaseConfig = {
  apiKey: "AIzaSyDkmFAr_7A1EKgUaZH5nBAfzJ1boLfs9_4",
  authDomain: "skill-base-job.firebaseapp.com",
  projectId: "skill-base-job",
  storageBucket: "skill-base-job.firebasestorage.app",
  messagingSenderId: "687540788622",
  appId: "1:687540788622:web:3838e0ab02ed6e558f58df",
  measurementId: "G-H5B6546Y8R",
};

function createFirebaseApp() {
  if (typeof window === "undefined") {
    // On the server we still use the regular app initialization;
    // getApps() works in both environments.
  }

  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

const app = createFirebaseApp();

export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

