import useAuth from '../contexts/auth';

const Home = () => {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      logout();
      // La redirection sera gérée par AuthProvider
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className="home-container">
      <h1>Bienvenue sur QuickFix</h1>
      <p>Votre solution pour des services de réparation rapides et efficaces.</p>
      <button onClick={handleLogout} className="logout-button">Déconnexion</button>
    </div>
  );
};

export default Home;