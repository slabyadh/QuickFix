import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestFirestore from './TestFirestore';

// Mock complet des modules Firebase
jest.mock('../firebaseConfig', () => ({
  db: {}
}));

// Mock firebase/firestore sans référence externe
jest.mock('firebase/firestore', () => {
  return {
    collection: jest.fn(),
    getDocs: jest.fn(),
    addDoc: jest.fn()
  };
});

// Import après les mocks pour utiliser les versions mockées
import { addDoc, collection, getDocs } from 'firebase/firestore';

describe('TestFirestore Component', () => {
  // Création de la référence mock dans le beforeEach
  const mockCollectionRef = {};
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Configuration des retours des fonctions mockées
    (collection as jest.Mock).mockReturnValue(mockCollectionRef);
    (getDocs as jest.Mock).mockResolvedValue({
      docs: []
    });
    (addDoc as jest.Mock).mockResolvedValue({ id: 'test-id' });
  });

  test('appelle addDoc lorsque le bouton Ajouter est cliqué', async () => {
    render(<TestFirestore />);

    // Vérifie que le formulaire est rendu
    const input = screen.getByPlaceholderText('Entrez un nom');
    const addButton = screen.getByText('Ajouter');

    // Simule l'entrée utilisateur
    await userEvent.type(input, 'Nouveau Nom Test');

    // Simule le clic sur le bouton Ajouter
    fireEvent.click(addButton);

    // Vérifie que addDoc a été appelé avec les bons paramètres
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, { name: 'Nouveau Nom Test' });
    });
  });
});