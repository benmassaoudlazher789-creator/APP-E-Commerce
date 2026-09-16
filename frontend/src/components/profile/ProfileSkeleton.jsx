function ProfileSkeleton() {
    return (
        <div className="profile-card" aria-hidden="true">
            <div className="profile-skeleton__header">
                <div className="profile-skeleton__avatar" />
                <div className="profile-skeleton__lines">
                    <div className="profile-skeleton__line profile-skeleton__line--name" />
                    <div className="profile-skeleton__line profile-skeleton__line--email" />
                </div>
            </div>
            <div className="profile-skeleton__tabs" />
            <div className="profile-skeleton__body" />
        </div>
    );
}

export default ProfileSkeleton;
