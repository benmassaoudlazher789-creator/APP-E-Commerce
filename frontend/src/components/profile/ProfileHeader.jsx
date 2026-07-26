const getInitials = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

function ProfileHeader({ user, onEdit }) {
    const hasPhoto = typeof user.imageProfile === "string" && user.imageProfile.startsWith("http");

    return (
        <div className="flex items-center justify-between gap-6 rounded-xl border border-neutral-200 bg-white p-6 max-lg:flex-col max-lg:items-start">
            <div className="flex min-w-0 items-center gap-4 max-lg:w-full">
                {hasPhoto ? (
                    <img
                        src={user.imageProfile}
                        alt={user.name}
                        className="h-20 w-20 shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e63946] text-2xl font-bold text-white">
                        {getInitials(user.name) || "?"}
                    </div>
                )}
                <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold text-neutral-900">{user.name}</h1>
                    <p className="truncate text-neutral-500">{user.email}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onEdit}
                className="shrink-0 rounded-lg border border-[#e63946] px-4 py-2 text-sm font-semibold text-[#e63946] transition-colors hover:bg-[#e63946] hover:text-white"
            >
                Modifier le profil
            </button>
        </div>
    );
}

export default ProfileHeader;
