import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { forgotPassword } from "../JS/actions/auth.action";
import "./Auth.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState({ loading: false, message: null, error: null });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: null, error: null });
        const result = await forgotPassword(email.trim());
        setStatus(
            result.success
                ? { loading: false, message: result.message, error: null }
                : { loading: false, message: null, error: result.error }
        );
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-card__title">Forgot Password</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="auth-field" controlId="formForgotEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Form.Text>We'll send you a link to reset your password.</Form.Text>
                    </Form.Group>

                    {status.error && (
                        <p className="form-message form-message--error" role="alert">
                            {status.error}
                        </p>
                    )}
                    {status.message && (
                        <p className="form-message form-message--success" role="status">
                            {status.message}
                        </p>
                    )}

                    <p className="auth-switch">
                        Remembered your password? <Link to="/login">Back to login</Link>
                    </p>

                    <Button
                        variant="primary"
                        type="submit"
                        className="auth-submit"
                        disabled={!email || status.loading}
                    >
                        {status.loading ? "Sending…" : "Send reset link"}
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default ForgotPassword;
