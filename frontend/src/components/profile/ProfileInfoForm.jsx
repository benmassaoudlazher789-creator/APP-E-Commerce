import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../JS/actions/auth.action";
import { FIELD_INPUT_CLASS, messageClass } from "./shared";

function ProfileInfoForm({ user }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState(null);

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
            setFeedback({ type: "success", message: "Profil mis à jour avec succès." });
            setForm((f) => ({ ...f, password: "" }));
        } else {
            setFeedback({ type: "error", message: result.error });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
            <h2 className="text-lg font-bold text-neutral-900">Mes informations</h2>

            <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-700">
                Nom
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={FIELD_INPUT_CLASS}
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-700">
                Email
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={FIELD_INPUT_CLASS}
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-700">
                Téléphone
                <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Optionnel"
                    className={FIELD_INPUT_CLASS}
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-700">
                Nouveau mot de passe
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    minLength={6}
                    maxLength={32}
                    placeholder="Laisser vide pour ne pas changer"
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
                disabled={isSaving}
                className="mt-2 rounded-lg bg-[#e63946] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#c1121f] disabled:opacity-50"
            >
                {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
        </form>
    );
}

export default ProfileInfoForm;
