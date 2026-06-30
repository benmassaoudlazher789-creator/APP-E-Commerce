

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../JS/actions/auth.action';
import { useNavigate } from 'react-router-dom';


function BarNav() {
    const user = useSelector(state => state.authReducer.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">E-Commerce App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        {(user) ?
                            (
                                <>
                                    <Nav.Link href="/profile">Profile</Nav.Link>
                                    <Nav.Link href="#" onClick={() => dispatch(logout(navigate))}>Logout</Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link href="/register">Register</Nav.Link>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                </>
                            )}
                    </Nav>
                    {user && (
                        <div>
                            <h4> {user.name}</h4>

                            <img src={`http://localhost:1980/${user.imageProfile.replace('../', '')}`} alt="image profile" />
                        </div>


                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}



export default BarNav