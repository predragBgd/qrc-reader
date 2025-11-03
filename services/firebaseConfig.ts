import { getApps, initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTRylV7alcGiL482KOV4K5nI_Uj7PkovM",
  authDomain: "qrc-reader.firebaseapp.com",
  projectId: "qrc-reader",
  storageBucket: "qrc-reader.firebasestorage.app",
  messagingSenderId: "730449373121",
  appId: "1:730449373121:web:197de7c360ac6946eab140",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = initializeAuth(app);

export const db = getFirestore(app);

export default app;
