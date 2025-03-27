// src/components/Register.tsx
import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService"; // Service pour l'inscription

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password); // Appeler la fonction d'inscription
      navigate("/login"); // Rediriger vers la page de connexion après inscription
    } catch (err) {
      setError("Erreur d'inscription, veuillez réessayer.");
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
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
        <Button type="submit">S'inscrire</Button>
      </Form>
    </div>
  );
};

export default Register;
