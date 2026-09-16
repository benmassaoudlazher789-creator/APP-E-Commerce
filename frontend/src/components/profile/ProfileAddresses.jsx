import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAddress, updateAddress, deleteAddress } from "../../JS/actions/auth.action";
import { FIELD_INPUT_CLASS, messageClass } from "./shared";

const emptyForm = { label: "Home", fullName: "", address: "", city: "", postalCode: "", phone: "" };

function AddressForm({ initial, onCancel, onSubmit, isSaving }) {
    const [form, setForm] = useState(initial);
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(form);
            }}
            className="profile-address-form"
        >
            <input
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="Label (Home, Work...)"
                className={`profile-address-form__full ${FIELD_INPUT_CLASS}`}
            />
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required className={FIELD_INPUT_CLASS} />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required className={FIELD_INPUT_CLASS} />
            <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                required
                className={`profile-address-form__full ${FIELD_INPUT_CLASS}`}
            />
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className={FIELD_INPUT_CLASS} />
            <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" required className={FIELD_INPUT_CLASS} />
            <div className="profile-address-form__actions">
                <button type="submit" disabled={isSaving} className="btn-primary profile-addresses__add">
                    {isSaving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={onCancel} className="btn-secondary">
                    Cancel
                </button>
            </div>
        </form>
    );
}

function ProfileAddresses({ user }) {
    const dispatch = useDispatch();
    const [mode, setMode] = useState(null); // null | "add" | addressId being edited
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const addresses = user.addresses || [];

    const handleAdd = async (form) => {
        setIsSaving(true);
        setError(null);
        const result = await dispatch(addAddress(form));
        setIsSaving(false);
        if (result.success) setMode(null);
        else setError(result.error);
    };

    const handleUpdate = async (addressId, form) => {
        setIsSaving(true);
        setError(null);
        const result = await dispatch(updateAddress(addressId, form));
        setIsSaving(false);
        if (result.success) setMode(null);
        else setError(result.error);
    };

    const handleDelete = async (addressId) => {
        setError(null);
        const result = await dispatch(deleteAddress(addressId));
        if (!result.success) setError(result.error);
    };

    return (
        <div className="profile-addresses">
            {mode !== "add" && (
                <div className="profile-addresses__header">
                    <button type="button" onClick={() => setMode("add")} className="btn-primary profile-addresses__add">
                        + Add Address
                    </button>
                </div>
            )}

            {error && (
                <p role="alert" className={messageClass("error")}>
                    {error}
                </p>
            )}

            {mode === "add" && (
                <AddressForm initial={emptyForm} isSaving={isSaving} onCancel={() => setMode(null)} onSubmit={handleAdd} />
            )}

            {addresses.length === 0 && mode !== "add" && (
                <div className="profile-empty">
                    <p className="profile-empty__text">No addresses saved yet.</p>
                </div>
            )}

            <div className="profile-addresses__list">
                {addresses.map((addr) =>
                    mode === addr._id ? (
                        <AddressForm
                            key={addr._id}
                            initial={addr}
                            isSaving={isSaving}
                            onCancel={() => setMode(null)}
                            onSubmit={(form) => handleUpdate(addr._id, form)}
                        />
                    ) : (
                        <div key={addr._id} className="profile-address-card">
                            <div>
                                <p className="profile-address-card__label">
                                    {addr.label}
                                    {addr.isDefault && <span className="profile-address-card__badge">Default</span>}
                                </p>
                                <p className="profile-address-card__detail">
                                    {addr.fullName} — {addr.phone}
                                </p>
                                <p className="profile-address-card__detail">
                                    {addr.address}, {addr.city} {addr.postalCode}
                                </p>
                            </div>
                            <div className="profile-address-card__actions">
                                <button type="button" onClick={() => setMode(addr._id)} className="btn-secondary">
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(addr._id)}
                                    className="btn-secondary profile-address-card__delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default ProfileAddresses;
