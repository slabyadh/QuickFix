import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import useAuth from './contexts/auth'; 
import Home from './pages/Home'; 

const Router = () => {
  const { auth, login, register } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si l'authentification est déjà gérée par AuthProvider, on peut simplifier
    setLoading(false);
  }, [auth.user]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await login(credentials.email, credentials.password);
      // La redirection est gérée automatiquement
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert("Erreur de connexion: email ou mot de passe incorrect");
    }
  };

  const handleSignup = async (userData: { 
    email: string; 
    password: string;
    confirmPassword: string;
    nomPrenom: string;
    adresse: string;
    telephone: string;
    role: 'particulier' | 'artisan';
    specialite?: string;
    siret?: string;
    statutLogement?: 'locataire' | 'proprietaire';
  }): Promise<void> => {
    try {
      if (userData.password !== userData.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas.");
      }
      const {...registerData } = userData;
      await register(registerData);
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      alert("Erreur d'inscription: " + (error instanceof Error ? error.message : "Erreur inconnue"));
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          {/* Rediriger vers login si non connecté, vers home si connecté */}
          <Route path="/" element={
            auth.user ? <Home /> : <Navigate to="/login" replace />
          } />
          
          {/* Route de login - redirige vers home si déjà connecté */}
          <Route path="/login" element={
            auth.user ? <Navigate to="/" replace /> : 
            <LoginForm onSubmit={handleLogin} onSignupClick={() => window.location.href = '/signup'} />
          } />
          
          {/* Route d'inscription - redirige vers home si déjà connecté */}
          <Route path="/signup" element={
            auth.user ? <Navigate to="/" replace /> :
            <SignupForm onSubmit={handleSignup} onLoginClick={() => window.location.href = '/login'} />
          } />
          
          {/* Redirection par défaut si aucune route ne correspond */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Router;