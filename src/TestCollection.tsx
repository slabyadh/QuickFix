// TestCollection.tsx
import React from "react";
import { db, collection, addDoc } from "./firebaseConfig";

// Définition du type pour les données
interface TestData {
  name: string;
  description: string;
  createdAt: Date;
}

const TestCollection: React.FC = () => {
  const addTestData = async () => {
    try {
      const newDoc: TestData = {
        name: "Exemple TypeScript",
        description: "Ceci est un test avec TSX",
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "test"), newDoc);
      console.log("Document ajouté avec ID :", docRef.id);
    } catch (e) {
      console.error("Erreur lors de l'ajout :", e);
    }
  };

  return (
    <div>
      <h2>Ajouter un document dans la collection "test"</h2>
      <button onClick={addTestData}>Ajouter</button>
    </div>
  );
};

export default TestCollection;
