import React, { useState } from 'react';
import '../styles/AuthForms.css';
import '../styles/Tab.css';

// Types d'utilisateur
type Role = 'particulier' | 'artisan';
type StatutLogement = 'locataire' | 'proprietaire';

interface SignupFormProps {
  onSubmit: (userData: { 
    email: string; 
    password: string;
    confirmPassword: string;
    nomPrenom: string;
    adresse: string;
    telephone: string;
    role: Role;
    // Champs spécifiques aux artisans
    specialite?: string;
    siret?: string;
    // Champs spécifiques aux particuliers
    statutLogement?: StatutLogement;
  }) => void;
  onLoginClick: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, onLoginClick }) => {
  // Champs communs pour les deux types d'utilisateurs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nomPrenom, setNomPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // État pour suivre l'onglet actif
  const [activeTab, setActiveTab] = useState<Role>('particulier');
  
  // Champs spécifiques pour les artisans
  const [specialite, setSpecialite] = useState('');
  const [siret, setSiret] = useState('');
  
  // Champs spécifiques pour les particuliers
  const [statutLogement, setStatutLogement] = useState<StatutLogement>('locataire');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation des champs communs
    if (!nomPrenom.trim() || !email.trim() || !password || !confirmPassword || !adresse.trim() || !telephone.trim()) {
      setError('Tous les champs obligatoires doivent être remplis');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Validation du format de téléphone (simple)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(telephone.replace(/\s/g, ''))) {
      setError('Le numéro de téléphone doit contenir 10 chiffres');
      return;
    }
    
    // Validation spécifique pour les artisans
    if (activeTab === 'artisan') {
      if (!specialite.trim() || !siret.trim()) {
        setError('Tous les champs professionnels sont obligatoires');
        return;
      }
      
      // Validation simple du SIRET (14 chiffres)
      const siretRegex = /^[0-9]{14}$/;
      if (!siretRegex.test(siret.replace(/\s/g, ''))) {
        setError('Le numéro SIRET doit contenir 14 chiffres');
        return;
      }
    }
    
    try {
      // Préparation des données selon le type d'utilisateur
      const userData = {
        email,
        password,
        confirmPassword,
        nomPrenom,
        adresse,
        telephone,
        role: activeTab
      };
      
      // Ajout des champs spécifiques selon le type d'utilisateur
      if (activeTab === 'artisan') {
        Object.assign(userData, {
          specialite,
          siret: siret.replace(/\s/g, ''), // Supprimer les espaces éventuels
        });
      } else {
        Object.assign(userData, {
          statutLogement
        });
      }
      
      await onSubmit(userData);
    } catch (error) {
      setError('Erreur lors de l\'inscription');
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Créer un compte</h2>
        
        {/* Onglets */}
        <div className="tab-container">
          <div 
            className={`tab ${activeTab === 'particulier' ? 'active' : ''}`}
            onClick={() => setActiveTab('particulier')}
          >
            Particulier
          </div>
          <div 
            className={`tab ${activeTab === 'artisan' ? 'active' : ''}`}
            onClick={() => setActiveTab('artisan')}
          >
            Artisan
          </div>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Champs communs aux deux types d'utilisateurs */}
          <div className="form-group">
            <label htmlFor="email">Email *</label>
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
            <label htmlFor="password">Mot de passe *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Créez un mot de passe"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nomPrenom">Nom et prénom *</label>
            <input
              type="text"
              id="nomPrenom"
              value={nomPrenom}
              onChange={(e) => setNomPrenom(e.target.value)}
              placeholder="Votre nom et prénom"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="adresse">Adresse *</label>
            <input
              type="text"
              id="adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Votre adresse complète"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="telephone">Téléphone *</label>
            <input
              type="tel"
              id="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Votre numéro de téléphone"
              required
            />
          </div>
          
          {/* Champs spécifiques pour les artisans */}
          {activeTab === 'artisan' && (
            <>
              <div className="form-group">
                <label htmlFor="specialite">Spécialité *</label>
                <select
                  id="specialite"
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez votre spécialité</option>
                  <option value="plomberie">Plomberie</option>
                  <option value="electricite">Électricité</option>
                  <option value="menuiserie">Menuiserie</option>
                  <option value="maconnerie">Maçonnerie</option>
                  <option value="peinture">Peinture</option>
                  <option value="chauffage">Chauffage</option>
                  <option value="serrurerie">Serrurerie</option>
                  <option value="jardinage">Jardinage</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="siret">Numéro SIRET *</label>
                <input
                  type="text"
                  id="siret"
                  value={siret}
                  onChange={(e) => setSiret(e.target.value)}
                  placeholder="Votre numéro SIRET (14 chiffres)"
                  required
                />
              </div>
            </>
          )}
          
          {/* Champs spécifiques pour les particuliers */}
          {activeTab === 'particulier' && (
            <div className="form-group">
              <label>Statut *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="statutLogement"
                    value="locataire"
                    checked={statutLogement === 'locataire'}
                    onChange={() => setStatutLogement('locataire')}
                  />
                  Locataire
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="statutLogement"
                    value="proprietaire"
                    checked={statutLogement === 'proprietaire'}
                    onChange={() => setStatutLogement('proprietaire')}
                  />
                  Propriétaire
                </label>
              </div>
            </div>
          )}
          
          <button type="submit" className="auth-button">
            {activeTab === 'particulier' ? "S'inscrire comme particulier" : "S'inscrire comme artisan"}
          </button>
        </form>
        
        <div className="auth-switch">
          Déjà un compte ?{" "}
          <button className="auth-link" onClick={onLoginClick}>
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;