import { LogOut } from "lucide-react";

const getInitials = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

function ProfileHeader({ user, onLogout }) {
    const hasPhoto = typeof user.imageProfile === "string" && user.imageProfile.startsWith("http");

    return (
        <div className="profile-header">
            <div className="profile-header__identity">
                {hasPhoto ? (
                    <img src={user.imageProfile} alt={user.name} className="profile-avatar profile-avatar--photo" />
                ) : (
                    <div className="profile-avatar" aria-hidden="true">
                        {getInitials(user.name) || "?"}
                    </div>
                )}
                <div className="profile-header__text">
                    <h1 className="profile-header__name">{user.name}</h1>
                    <p className="profile-header__email">{user.email}</p>
                </div>
            </div>
            <button type="button" onClick={onLogout} className="profile-logout">
                <LogOut size={18} strokeWidth={2.25} />
                Log out
            </button>
        </div>
    );
}

export default ProfileHeader;
