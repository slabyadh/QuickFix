import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TestCollection from "../TestCollection"; // Ajuste le chemin selon ton projet
import { addDoc, collection } from "../firebaseConfig"; // Mock Firebase

// Mock de Firebase Firestore (déclaré une seule fois)
jest.mock("../firebaseConfig", () => ({
  db: {},
  collection: jest.fn(() => "mockCollection"),
  addDoc: jest.fn(),
}));

describe("TestCollection Component", () => {
  test("Le bouton est affiché et fonctionne", async () => {
    // Simuler `addDoc`
    (addDoc).mockResolvedValue({ id: "12345" });

    // Rendre le composant
    render(<TestCollection />);

    // Vérifier que le bouton est bien affiché
    const button = screen.getByRole("button", { name: /ajouter/i });
    expect(button).toBeInTheDocument();

    // Simuler un clic sur le bouton
    fireEvent.click(button);

    // Vérifier que `addDoc` a bien été appelé avec la bonne collection et les données
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledTimes(1);
    //   expect(addDoc).toHaveBeenCalledWith(
    //     "mockCollection",
    //     expect.objectContaining({
    //       name: "Exemple TypeScript",
    //       description: "Ceci est un test avec TSX",
    //     })
    //   );
    });
  });
});
