

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { login } from "../JS/actions/auth.action";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [userToConnect, setUserToConnect]= useState({
   email: "", password:""   

  })
  const dispatch = useDispatch() 
  const navigate = useNavigate(); 
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
    <div className="formLogin">
      <h2 className='m-3'>Login Page</h2>
      <Form onSubmit={handleSubmit}>       
        <Form.Group className="mb-3" controlId="formBasicEmail">

          <Form.Control type="email" placeholder="Enter email"  name='email' value={userToConnect.email} onChange={handleChange}/>  

        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">

          <Form.Control type="password" placeholder="Password" name='password' value={userToConnect.password} onChange={handleChange} /> 
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <FormGroup>
          <Form.Text className="text-muted">
            Utilisée uniquement pour la connexion à votre compte <a href="/register">Créer un compte</a>
          </Form.Text>
        </FormGroup>
        <Button variant="primary" type="submit" disabled = {!userToConnect.email || !userToConnect }>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Login;