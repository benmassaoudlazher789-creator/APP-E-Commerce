import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from "../JS/actions/auth.action";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import "../styles/tailwind-scoped.css";
import AnimatedInput from "@/components/ui/smoothui/animated-input";

function Register() {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    imageProfile: ''

  });
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const errors = useSelector(state => state.authReducer.errors)
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  }
  const handleSubmit = (e) => {
    e.preventDefault() // empécher le chargement du form
    const userToRegister = {

      name: newUser.name.trim(),
      email: newUser.email.trim(),
      password: newUser.password.trim(),
      imageProfile: newUser.imageProfile.trim()
    }

    // déclencher l'action

    dispatch(register(userToRegister, navigate));
    //page profile


  }

  return (
    <div className="auth-page tw-scope">
      <div className="auth-card">
        <h2 className="auth-card__title">Register</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="auth-field" controlId="formBasicName">
            <Form.Label>Nom</Form.Label>
            <Form.Control className="form-input" type="text" placeholder="Entrez votre nom" name="name" onChange={handleChange} value={newUser.name} required />
          </Form.Group>

          <div className="auth-field">
            <AnimatedInput
              label="Adresse email"
              value={newUser.email}
              onChange={(val) => setNewUser({ ...newUser, email: val })}
            />
            <Form.Text>
              Nous ne partagerons jamais votre email avec qui que ce soit.
            </Form.Text>
          </div>

          <Form.Group className="auth-field" controlId="formBasicPassword">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control className="form-input" type="password" placeholder="Mot de passe" name="password" onChange={handleChange} value={newUser.password} minLength={6} maxLength={32} required />
            <Form.Text>
              Entre 6 et 32 caractères.
            </Form.Text>
          </Form.Group>

          <Form.Group className="auth-field" controlId="formBasicImage">
            <Form.Label>Photo de profil (optionnel)</Form.Label>
            <Form.Control className="form-input" type="url" placeholder="Image Url" name="imageProfile" onChange={handleChange} value={newUser.imageProfile} />
          </Form.Group>

          {errors && errors.length > 0 && (
            <p className="form-message form-message--error" role="alert">{errors}</p>
          )}

          <p className="auth-switch">
            if you had an account, please login <a href="/login">Login</a>
          </p>

          <Button variant="primary" type="submit" className="auth-submit">
            submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Register;