function ProfileSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-6">
                <div className="h-20 w-20 rounded-full bg-neutral-200" />
                <div className="flex flex-col gap-2">
                    <div className="h-5 w-40 rounded bg-neutral-200" />
                    <div className="h-4 w-56 rounded bg-neutral-200" />
                </div>
            </div>
            <div className="mt-8 grid grid-cols-[220px_1fr] gap-8 max-lg:grid-cols-1">
                <div className="h-40 rounded-xl border border-neutral-200 bg-white" />
                <div className="h-64 rounded-xl border border-neutral-200 bg-white" />
            </div>
        </div>
    );
}

export default ProfileSkeleton;
