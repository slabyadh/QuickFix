/*
  Firebase Auth context anonymous or email login
  with Loading screen

  Usage:
  - Wrap your app with AuthProvider (router should be inside)
*/

import { createContext, useContext, useReducer, useEffect, useState, ReactNode } from "react";
import '../firebaseConfig';
import { 
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

// Définir les types
interface AuthState {
  user: (User & UserData) | null;
  userDataLoaded: boolean; // To track if user data has been loaded
}

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    nomPrenom: string;
    adresse: string;
    telephone: string;
    role: 'particulier' | 'artisan';
    specialite?: string;
    siret?: string;
    statutLogement?: 'locataire' | 'proprietaire';
  }) => Promise<void>;
  logout: () => void;
  isLogin: () => boolean;
}

interface AuthAction {
  type: string;
  payload?: User | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Initialisation Firebase
const db = getFirestore();
const auth = getAuth();

// Création du contexte avec un type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Définition d'une interface pour les données utilisateur étendues
interface UserData {
  role?: 'particulier' | 'artisan';
  nomPrenom?: string;
  adresse?: string;
  telephone?: string;
  specialite?: string;
  siret?: string;
  statutLogement?: 'locataire' | 'proprietaire';
  // autres champs personnalisés
}

// État combinant l'utilisateur Firebase et les données Firestore
interface AuthState {
  user: (User & UserData) | null;
  userDataLoaded: boolean; // Pour suivre si les données ont été chargées
}

// Valeur initiale
const DefaultState: AuthState = {
  user: null,
  userDataLoaded: false
};

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload ?? null,
      };
    default:
      return state;
  }
};


const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => { 
    const [loading, setLoading] = useState<boolean>(true);
    const [state, dispatch] = useReducer(AuthReducer, DefaultState);
  
    const login = async (email: string, password: string): Promise<void> => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // La gestion de l'état utilisateur se fait via onAuthStateChanged
      } catch (e) {
        console.error(e);
        throw e;
      }
    };
  
    // Importez cette fonction depuis firebase/auth
    const register = async (userData: {
        email: string;
        password: string;
        nomPrenom: string;  // Changé de name à nomPrenom
        adresse: string;    // Ajouté
        telephone: string;  // Ajouté
        role: 'particulier' | 'artisan';
        specialite?: string;  // Changé de specialty à specialite
        siret?: string;
        statutLogement?: 'locataire' | 'proprietaire';  // Ajouté
      }): Promise<void> => {
      try {
        // Utiliser createUserWithEmailAndPassword au lieu de linkWithCredential
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        
        await setDoc(doc(db, "users", userCredential.user.uid), {
            nomPrenom: userData.nomPrenom,
            email: userData.email,
            adresse: userData.adresse,
            telephone: userData.telephone,
            role: userData.role,
            createdAt: new Date(),
            // Ajouter les champs spécifiques selon le type d'utilisateur
            ...(userData.role === 'artisan' ? {
                specialite: userData.specialite,
                siret: userData.siret
            } : {
                statutLogement: userData.statutLogement
            })
        });
        
        // La mise à jour de l'état sera gérée par onAuthStateChanged
      } catch (e) {
        console.error(e);
        throw e;
      }
    };
  
    const logout = (): void => {
      setLoading(true);
      signOut(auth)
        .then(() => {
          dispatch({ type: "LOGIN", payload: null });
          setLoading(false);
        })
        .catch(e => {
          console.error(e);
          setLoading(false);
        });
    };
  
    const isLogin = (): boolean => {
      return !!state?.user?.email;
    };
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Récupérer les données supplémentaires depuis Firestore
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              // Combiner l'utilisateur Firebase avec les données Firestore
              const userData = userDocSnap.data() as UserData;
              const enrichedUser = {
                ...firebaseUser,
                ...userData
              };
              
              dispatch({ 
                type: "LOGIN", 
                payload: enrichedUser as (User & UserData)
              });
            } else {
              // Si pas de document, utiliser juste l'utilisateur Firebase
              dispatch({ type: "LOGIN", payload: firebaseUser as (User & UserData) });
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des données utilisateur:", error);
            dispatch({ type: "LOGIN", payload: firebaseUser as (User & UserData) });
          } finally {
            setLoading(false);
          }
        } else {
          dispatch({ type: "LOGIN", payload: null });
          setLoading(false);
        }
      });
      
      return () => unsubscribe();
    }, []);
  
    return (
      <AuthContext.Provider value={{ 
        auth: state, 
        login, 
        register, 
        logout, 
        isLogin 
      }}>
        {loading ? (
          <div className="h-screen w-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-slate-700"></div>
          </div>
        ) : (
          children
        )}
      </AuthContext.Provider>
    );
  };

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthReducer, AuthProvider };
export default useAuth;