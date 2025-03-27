// src/components/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Pour la navigation après la connexion
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { login } from "../services/authService"; // Service pour l'authentification

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password); // Appeler la fonction d'authentification
      navigate("/"); // Rediriger vers la page d'accueil après connexion
    } catch (err) {
      setError("Erreur de connexion, veuillez réessayer.");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      {error && <p>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email"
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Mot de passe</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
          />
        </FormGroup>
        <Button type="submit">Se connecter</Button>
      </Form>
    </div>
  );
};

export default Login;
