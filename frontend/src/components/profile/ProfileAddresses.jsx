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
            className="grid grid-cols-2 gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 max-lg:grid-cols-1"
        >
            <input
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="Libellé (Domicile, Travail...)"
                className={`col-span-2 max-lg:col-span-1 ${FIELD_INPUT_CLASS}`}
            />
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nom complet" required className={FIELD_INPUT_CLASS} />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Téléphone" required className={FIELD_INPUT_CLASS} />
            <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Adresse"
                required
                className={`col-span-2 max-lg:col-span-1 ${FIELD_INPUT_CLASS}`}
            />
            <input name="city" value={form.city} onChange={handleChange} placeholder="Ville" required className={FIELD_INPUT_CLASS} />
            <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Code postal" required className={FIELD_INPUT_CLASS} />
            <div className="col-span-2 flex gap-2 max-lg:col-span-1">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-[#e63946] px-4 py-2 text-sm font-bold text-white hover:bg-[#c1121f] disabled:opacity-50"
                >
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100"
                >
                    Annuler
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
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-900">Mes adresses</h2>
                {mode !== "add" && (
                    <button
                        type="button"
                        onClick={() => setMode("add")}
                        className="rounded-lg bg-[#e63946] px-3 py-1.5 text-sm font-bold text-white hover:bg-[#c1121f]"
                    >
                        + Ajouter une adresse
                    </button>
                )}
            </div>

            {error && (
                <p role="alert" className={messageClass("error")}>
                    {error}
                </p>
            )}

            {mode === "add" && (
                <AddressForm initial={emptyForm} isSaving={isSaving} onCancel={() => setMode(null)} onSubmit={handleAdd} />
            )}

            {addresses.length === 0 && mode !== "add" && (
                <p className="py-6 text-center text-neutral-500">Aucune adresse enregistrée pour le moment.</p>
            )}

            <div className="flex flex-col gap-3">
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
                        <div
                            key={addr._id}
                            className="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 p-4 max-lg:flex-col"
                        >
                            <div>
                                <p className="font-semibold text-neutral-900">
                                    {addr.label}{" "}
                                    {addr.isDefault && (
                                        <span className="ml-2 rounded-full bg-[#e63946]/10 px-2 py-0.5 text-xs font-semibold text-[#e63946]">
                                            Par défaut
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-neutral-600">
                                    {addr.fullName} — {addr.phone}
                                </p>
                                <p className="text-sm text-neutral-600">
                                    {addr.address}, {addr.city} {addr.postalCode}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMode(addr._id)}
                                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:border-[#e63946] hover:text-[#e63946]"
                                >
                                    Modifier
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(addr._id)}
                                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:border-[#c1121f] hover:text-[#c1121f]"
                                >
                                    Supprimer
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
