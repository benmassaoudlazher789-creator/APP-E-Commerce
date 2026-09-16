import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from "../JS/actions/auth.action";
import { validateLogin } from "../utils/validators";
import "./Auth.css";

const initialData = { email: "", password: "" };

function Login() {
  const [userToConnect, setUserToConnect] = useState(initialData);
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoad = useSelector((state) => state.authReducer.isLoad);
  const serverError = useSelector((state) => state.authReducer.errors);

  const handleChange = (e) => {
    setUserToConnect({ ...userToConnect, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateLogin(userToConnect);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    dispatch(
      login({
        email: userToConnect.email.trim(),
        password: userToConnect.password,
      }, navigate)
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-card__title">Log in</h2>

        {serverError && serverError.length > 0 && (
          <p className="form-message form-message--error">{serverError}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            Email Address
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={userToConnect.email}
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
              placeholder="Your password"
              value={userToConnect.password}
              onChange={handleChange}
            />
            {fieldErrors.password && <span className="auth-field__error">{fieldErrors.password}</span>}
          </label>

          <button type="submit" className="auth-submit" disabled={isLoad}>
            {isLoad ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/forgot-password">Forgot your password?</Link>
        </p>
        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
