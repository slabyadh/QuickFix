// TestCollection.tsx
import React from "react";
import { db, collection, addDoc } from "./config/firebaseConfig";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

// Définition du type pour les données
interface TestData {
  name: string;
  description: string;
  createdAt: Date;
}

const TestCollection: React.FC = () => {
  // const addTestData = async () => {
  //   try {
  //     const newDoc: TestData = {
  //       name: "Exemple TypeScript",
  //       description: "Ceci est un test avec TSX",
  //       createdAt: new Date(),
  //     };

  //     const docRef = await addDoc(collection(db, "test"), newDoc);
  //     console.log("Document ajouté avec ID :", docRef.id);
  //   } catch (e) {
  //     console.error("Erreur lors de l'ajout :", e);
  //   }
  // };
  
  return (
    // <div>
    //   <h2>Ajouter un document dans la collection "test"</h2>
    //   <button onClick={addTestData}>Ajouter</button>
    // </div>
    <Form>
      <FormGroup>
        <Label for="exampleEmail" hidden>
          Email
        </Label>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Email"
          type="email"
        />
      </FormGroup>{" "}
      <FormGroup>
        <Label for="examplePassword" hidden>
          Password
        </Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Password"
          type="password"
        />
      </FormGroup>{" "}
      <Button>Submit</Button>
    </Form>
  );
};

export default TestCollection;
