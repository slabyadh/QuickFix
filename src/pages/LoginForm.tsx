import React, { useState } from 'react';
import '../styles/AuthForms.css';

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void;
  onSignupClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !password.trim()) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    
    try {
      await onSubmit({ email, password });
    } catch {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Connexion</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            Se connecter
          </button>
        </form>
        
        <div className="auth-switch">
          Pas encore de compte ?{" "}
          <button className="auth-link" onClick={onSignupClick}>
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;