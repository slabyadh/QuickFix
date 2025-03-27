
import { useAuth } from "../context/AuthContext"; 

const Home = () => {
  const { user } = useAuth(); 

  return (
    <div>
      <h1>Bienvenue, {user ? user.email : "utilisateur"}</h1>
      <p>Ceci est la page d'accueil après la connexion.</p>
    </div>
  );
};

export default Home;
