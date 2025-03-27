// src/services/firestoreService.ts
import { db, collection, addDoc } from "../config/firebaseConfig";

// Ajouter un utilisateur à Firestore
export const addUserToFirestore = async (uid: string, email: string) => {
  try {
    await addDoc(collection(db, "users"), {
      uid,
      email,
    });
  } catch (error) {
    throw new Error("Erreur lors de l'ajout de l'utilisateur à Firestore.");
  }
};
