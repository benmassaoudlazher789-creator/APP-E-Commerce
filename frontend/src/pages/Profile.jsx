import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { current, logout } from "../JS/actions/auth.action";
import store from "../JS/store/store";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ProfileOrders from "../components/profile/ProfileOrders";
import ProfileAddresses from "../components/profile/ProfileAddresses";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";
import "../styles/tailwind-scoped.css";

const TABS = [
    { id: "info", label: "Mes informations" },
    { id: "orders", label: "Mes commandes" },
    { id: "addresses", label: "Mes adresses" },
];

function Profile() {
    const user = useSelector((state) => state.authReducer.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("info");
    const token = localStorage.getItem("token");

    useEffect(() => {
        // Pas de token du tout : inutile d'attendre current(), on redirige direct.
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }
        // Re-fetch systematique au montage : le user en store peut venir de
        // register/login (qui ne renvoient pas phone/addresses), donc on
        // recharge la version complete depuis /current a chaque arrivee ici.
        // On lit le store directement (plutot que le "user"/"isLoad" du
        // useSelector) une fois la promesse resolue, pour eviter de rediriger
        // sur un instantane perime capture avant que le dispatch ne se termine.
        let cancelled = false;
        dispatch(current()).then(() => {
            if (cancelled) return;
            if (!store.getState().authReducer.user) {
                navigate("/login", { replace: true });
            }
        });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleLogout = () => {
        dispatch(logout(navigate));
    };

    if (!user) {
        return (
            <div className="tw-scope">
                <div className="min-h-[70vh] bg-neutral-50 px-4 py-10 lg:px-8">
                    <div className="mx-auto max-w-5xl">
                        <ProfileSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tw-scope">
            <div className="min-h-[70vh] bg-neutral-50 px-4 py-10 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <ProfileHeader user={user} onEdit={() => setActiveTab("info")} />

                    <div className="mt-8 grid grid-cols-[220px_1fr] gap-8 max-lg:grid-cols-1">
                        <nav className="flex h-fit flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-3 max-lg:flex-row max-lg:flex-wrap">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                                        activeTab === tab.id
                                            ? "bg-[#e63946] text-white"
                                            : "text-neutral-600 hover:bg-neutral-100"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-2 rounded-lg px-4 py-2.5 text-left text-sm font-semibold text-neutral-500 transition-colors hover:bg-red-50 hover:text-[#c1121f] max-lg:mt-0"
                            >
                                Déconnexion
                            </button>
                        </nav>

                        <section className="rounded-xl border border-neutral-200 bg-white p-6">
                            {activeTab === "info" && <ProfileInfoForm user={user} />}
                            {activeTab === "orders" && <ProfileOrders />}
                            {activeTab === "addresses" && <ProfileAddresses user={user} />}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
