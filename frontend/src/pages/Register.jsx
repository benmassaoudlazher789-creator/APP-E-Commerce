import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import FormText from 'react-bootstrap/esm/FormText';
import { useDispatch } from 'react-redux';
import { register } from "../JS/actions/auth.action";
import { useNavigate } from "react-router-dom";

function Register() {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    imageProfile: ''

  });
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
    console.log("userToRegister:", userToRegister)


    // déclencher l'action 

    dispatch(register(userToRegister, navigate));
    //page profile 
  

  }

  return (
    <div className="formLogin">
      <h2 className='m-3'> Register Page</h2>
      <Form onSubmit={handleSubmit} >
        <Form.Group className="mb-3" controlId="formBasicName">

          <Form.Control type="text" placeholder="Entrez votre nom" name="name" onChange={handleChange} value={newUser.name} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Adresse email</Form.Label>
          <Form.Control type="email" placeholder="Entrez votre email" name="email" onChange={handleChange} value={newUser.email} />
          <Form.Text className="text-muted">
            Nous ne partagerons jamais votre email avec qui que ce soit.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control type="password" placeholder="Mot de passe" name="password" onChange={handleChange} value={newUser.password} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicImage">
          <Form.Control type="url" placeholder="Image Url" name="imageProfile" onChange={handleChange} value={newUser.imageProfile} />

        </Form.Group>

        <FormGroup>
          {" "}
          <FormText className="text-muted">
            if you had an account, please login {" "} <a href="/login">Login</a>
          </FormText>
        </FormGroup>
        <Button variant="primary" type="submit">
          submit
        </Button>
      </Form>
    </div>
  );
}

export default Register; 