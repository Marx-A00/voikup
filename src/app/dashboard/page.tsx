import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function Dashboard() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	// Fetch user profile data
	const userProfile = await api.user.getProfile();

	return (
		<div className="space-y-8 text-white">
			{/* Welcome Section */}
			<div>
				<h1 className="font-bold text-3xl lg:text-4xl">
					Welcome back{userProfile?.name ? `, ${userProfile.name}` : ""}!
				</h1>
				<p className="mt-2 text-white/70">Here's your dashboard overview</p>
			</div>

			{/* Profile Completion Card */}
			<div className="rounded-xl bg-white/10 p-6">
				<h2 className="mb-4 font-semibold text-xl">Profile Completion</h2>
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-white/70">Email</span>
						<span className="font-medium">{userProfile?.email}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-white/70">Name</span>
						<span className="font-medium">
							{userProfile?.name || (
								<Link
									href="/dashboard/profile"
									className="text-[hsl(280,100%,70%)] hover:underline"
								>
									Add name
								</Link>
							)}
						</span>
					</div>
				</div>
				{!userProfile?.name && (
					<div className="mt-4 rounded-lg bg-[hsl(280,100%,70%)]/20 p-3">
						<p className="text-[hsl(280,100%,70%)] text-sm">
							Complete your profile to get the most out of Voikup
						</p>
					</div>
				)}
			</div>

			{/* Quick Links */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Link
					href="/dashboard/profile"
					className="rounded-xl bg-white/10 p-6 transition hover:bg-white/20"
				>
					<h3 className="mb-2 font-semibold">Edit Profile</h3>
					<p className="text-sm text-white/70">
						Update your personal information
					</p>
				</Link>
				<Link
					href="/dashboard/settings"
					className="rounded-xl bg-white/10 p-6 transition hover:bg-white/20"
				>
					<h3 className="mb-2 font-semibold">Settings</h3>
					<p className="text-sm text-white/70">Configure your preferences</p>
				</Link>
				<div className="rounded-xl bg-white/10 p-6 opacity-50">
					<h3 className="mb-2 font-semibold">Voice Calls</h3>
					<p className="text-sm text-white/70">Coming in Phase 3</p>
				</div>
			</div>

			{/* Future Features Placeholder */}
			<div className="rounded-xl bg-white/10 p-6">
				<h2 className="mb-4 font-semibold text-xl">Coming Soon</h2>
				<ul className="space-y-2 text-white/70">
					<li>• Schedule automated wake-up calls</li>
					<li>• Set gym reminder calls</li>
					<li>• Track your accountability streak</li>
					<li>• Customize your motivational messages</li>
				</ul>
			</div>
		</div>
	);
}
