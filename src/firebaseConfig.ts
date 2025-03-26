// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy-pTCliy5_ZiNMlvhwDPVXs3PveB1f6E",
  authDomain: "quickfix-7f066.firebaseapp.com",
  projectId: "quickfix-7f066",
  storageBucket: "quickfix-7f066.firebasestorage.app",
  messagingSenderId: "189420719327",
  appId: "1:189420719327:web:86abdd798e4f197d006d6a",
  measurementId: "G-MLCMJNJ00N"
};
 
// Initialize Firebase test
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };