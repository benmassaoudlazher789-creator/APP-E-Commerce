import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../JS/actions/auth.action";
import { FIELD_INPUT_CLASS, messageClass } from "./shared";

function ProfileInfoForm({ user }) {
    const dispatch = useDispatch();
    const initialForm = { name: user.name || "", email: user.email || "", phone: user.phone || "", password: "" };
    const [form, setForm] = useState(initialForm);
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const isDirty =
        form.name !== initialForm.name ||
        form.email !== initialForm.email ||
        form.phone !== initialForm.phone ||
        form.password !== "";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(null);
        setIsSaving(true);

        const updates = {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
        };
        if (form.password) updates.password = form.password;

        const result = await dispatch(updateProfile(updates));
        setIsSaving(false);
        if (result.success) {
            setFeedback({ type: "success", message: "Profile updated successfully." });
            setForm((f) => ({ ...f, password: "" }));
        } else {
            setFeedback({ type: "error", message: result.error });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form" noValidate>
            <label className="profile-field">
                Full Name
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={FIELD_INPUT_CLASS}
                />
            </label>

            <label className="profile-field">
                Email Address
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={FIELD_INPUT_CLASS}
                />
            </label>

            <label className="profile-field">
                <span>
                    Phone Number <span className="profile-field__optional">(optional)</span>
                </span>
                <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Add a phone number"
                    className={FIELD_INPUT_CLASS}
                />
            </label>

            <label className="profile-field">
                New Password
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    minLength={6}
                    maxLength={32}
                    placeholder="Leave blank to keep your current password"
                    className={FIELD_INPUT_CLASS}
                />
            </label>

            {feedback && (
                <p role="alert" className={messageClass(feedback.type)}>
                    {feedback.message}
                </p>
            )}

            <button
                type="submit"
                disabled={!isDirty || isSaving}
                className="btn-primary profile-form__submit"
            >
                {isSaving ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}

export default ProfileInfoForm;
