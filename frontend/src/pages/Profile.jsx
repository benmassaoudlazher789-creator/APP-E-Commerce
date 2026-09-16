import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { current, logout } from "../JS/actions/auth.action";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ProfileOrders from "../components/profile/ProfileOrders";
import ProfileAddresses from "../components/profile/ProfileAddresses";
import Reveal from "../components/Reveal";
import "../components/profile/Profile.css";

const TABS = [
    { key: "info", label: "My Information" },
    { key: "orders", label: "My Orders" },
    { key: "addresses", label: "My Addresses" },
];

function Profile() {
    const user = useSelector((state) => state.authReducer.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [activeTab, setActiveTab] = useState("info");

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }
        dispatch(current()).then(() => {
            if (!user) {
                navigate("/login", { replace: true });
            }
        });
    }, [token]);

    const handleLogout = () => {
        dispatch(logout(navigate));
    };

    return (
        <div className="profile-page">
            {!user ? (
                <ProfileSkeleton />
            ) : (
                <Reveal className="profile-card">
                    <ProfileHeader user={user} onLogout={handleLogout} />

                    <div className="profile-tabs" role="tablist">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.key}
                                className={`profile-tab${activeTab === tab.key ? " profile-tab--active" : ""}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="profile-tab-panel" role="tabpanel">
                        {activeTab === "info" && <ProfileInfoForm user={user} />}
                        {activeTab === "orders" && <ProfileOrders />}
                        {activeTab === "addresses" && <ProfileAddresses user={user} />}
                    </div>
                </Reveal>
            )}
        </div>
    );
}

export default Profile;
