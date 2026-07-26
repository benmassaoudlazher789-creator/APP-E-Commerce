import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { resetPassword } from "../JS/actions/auth.action";
import "./Auth.css";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ password: "", confirm: "" });
    const [status, setStatus] = useState({ loading: false, error: null });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.password !== passwords.confirm) {
            setStatus({ loading: false, error: "Passwords do not match" });
            return;
        }
        setStatus({ loading: true, error: null });
        const result = await resetPassword(token, passwords.password);
        if (result.success) {
            navigate("/login");
        } else {
            setStatus({ loading: false, error: result.error });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-card__title">Reset Password</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="auth-field" controlId="formResetPassword">
                        <Form.Label>New password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="New password"
                            value={passwords.password}
                            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="auth-field" controlId="formResetConfirm">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            required
                        />
                    </Form.Group>

                    {status.error && (
                        <p className="form-message form-message--error" role="alert">
                            {status.error}
                        </p>
                    )}

                    <p className="auth-switch">
                        <Link to="/login">Back to login</Link>
                    </p>

                    <Button
                        variant="primary"
                        type="submit"
                        className="auth-submit"
                        disabled={!passwords.password || !passwords.confirm || status.loading}
                    >
                        {status.loading ? "Resetting…" : "Reset password"}
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default ResetPassword;
