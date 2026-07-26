

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from "../JS/actions/auth.action";
import { useNavigate } from 'react-router-dom';
import "./Auth.css";
import "../styles/tailwind-scoped.css";
import AnimatedInput from "@/components/ui/smoothui/animated-input";

function Login() {
  const [userToConnect, setUserToConnect]= useState({
   email: "", password:""

  })
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const errors = useSelector(state => state.authReducer.errors)
  const handleChange = (e)=>{
     setUserToConnect({...userToConnect, [e.target.name]: e.target.value})

  }
  const handleSubmit = (e)=>{
   e.preventDefault();
   dispatch(
    login({
     email: userToConnect.email.trim(),
     password: userToConnect.password.trim(),

    }, navigate)

   )

  }
  return (
    <div className="auth-page tw-scope">
      <div className="auth-card">
        <h2 className="auth-card__title">Login</h2>
        <Form onSubmit={handleSubmit}>
          <div className="auth-field">
            <AnimatedInput
              label="Adresse email"
              value={userToConnect.email}
              onChange={(val) => setUserToConnect({ ...userToConnect, email: val })}
            />
          </div>

          <Form.Group className="auth-field" controlId="formBasicPassword">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control className="form-input" type="password" placeholder="Password" name='password' value={userToConnect.password} onChange={handleChange} required />
          </Form.Group>

          <p className="auth-switch">
            <a href="/forgot-password">Forgot password?</a>
          </p>

          {errors && errors.length > 0 && (
            <p className="form-message form-message--error" role="alert">{errors}</p>
          )}

          <p className="auth-switch">
            Utilisée uniquement pour la connexion à votre compte <a href="/register">Créer un compte</a>
          </p>

          <Button variant="primary" type="submit" className="auth-submit" disabled={!userToConnect.email || !userToConnect.password}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;