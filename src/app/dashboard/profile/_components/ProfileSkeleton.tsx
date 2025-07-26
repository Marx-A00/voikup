export function ProfileSkeleton() {
	return (
		<div className="animate-pulse space-y-6">
			{/* Email field skeleton */}
			<div>
				<div className="mb-2 h-4 w-12 rounded bg-gray-300" />
				<div className="h-12 w-full rounded-lg bg-[var(--color-main)]/20" />
			</div>

			{/* Name field skeleton */}
			<div>
				<div className="mb-2 h-4 w-16 rounded bg-gray-300" />
				<div className="h-12 w-full rounded-lg bg-[var(--color-main)]/20" />
			</div>

			{/* Account created skeleton */}
			<div>
				<div className="mb-2 h-4 w-28 rounded bg-gray-300" />
				<div className="h-6 w-32 rounded bg-[var(--color-main)]/20" />
			</div>

			{/* Button skeleton */}
			<div className="h-10 w-28 rounded-lg bg-gray-300" />
		</div>
	);
}
