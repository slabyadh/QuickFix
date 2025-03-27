// src/services/authService.ts
import { auth } from "../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addUserToFirestore } from "./firestoreService"; // Ajout de l'utilisateur à Firestore

// Inscription
export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Ajouter l'utilisateur à Firestore avec son uid
    await addUserToFirestore(user.uid, email);
  } catch (error) {
    throw new Error("Erreur lors de l'inscription.");
  }
};

// Connexion
export const login = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error("Erreur lors de la connexion.");
  }
};

// Déconnexion
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("Erreur lors de la déconnexion.");
  }
};
