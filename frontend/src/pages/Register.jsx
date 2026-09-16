import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from "../JS/actions/auth.action";
import { validateRegister } from "../utils/validators";
import "./Auth.css";

const initialData = { name: "", email: "", password: "" };

function Register() {
  const [newUser, setNewUser] = useState(initialData);
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoad = useSelector((state) => state.authReducer.isLoad);
  const serverError = useSelector((state) => state.authReducer.errors);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateRegister(newUser);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    dispatch(
      register({
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
      }, navigate)
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-card__title">Create an account</h2>

        {serverError && serverError.length > 0 && (
          <p className="form-message form-message--error">{serverError}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            Full Name
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Your name"
              value={newUser.name}
              onChange={handleChange}
            />
            {fieldErrors.name && <span className="auth-field__error">{fieldErrors.name}</span>}
          </label>

          <label className="auth-field">
            Email Address
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={newUser.email}
              onChange={handleChange}
            />
            {fieldErrors.email && <span className="auth-field__error">{fieldErrors.email}</span>}
          </label>

          <label className="auth-field">
            Password
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={newUser.password}
              onChange={handleChange}
            />
            {fieldErrors.password && <span className="auth-field__error">{fieldErrors.password}</span>}
          </label>

          <button type="submit" className="auth-submit" disabled={isLoad}>
            {isLoad ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
