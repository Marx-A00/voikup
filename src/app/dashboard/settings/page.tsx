import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className="space-y-8 text-gray-900">
			<div>
				<h1 className="font-bold text-3xl lg:text-4xl">Settings</h1>
				<p className="mt-2 text-gray-600">Configure your preferences</p>
			</div>

			<div className="space-y-6">
				<div className="rounded-xl border border-gray-200 bg-[var(--color-main)]/20 p-6">
					<h2 className="mb-4 font-semibold text-xl">Profile Settings</h2>
					<p className="text-gray-600">
						Manage your profile information in the Profile section
					</p>
				</div>

				<div className="rounded-xl border border-gray-200 bg-[var(--color-main)]/20 p-6 opacity-50">
					<h2 className="mb-4 font-semibold text-xl">Call Preferences</h2>
					<p className="text-gray-600">
						Voice call settings will be available in Phase 3
					</p>
				</div>

				<div className="rounded-xl border border-gray-200 bg-[var(--color-main)]/20 p-6 opacity-50">
					<h2 className="mb-4 font-semibold text-xl">Account Settings</h2>
					<p className="text-gray-600">
						Advanced account management coming soon
					</p>
				</div>
			</div>
		</div>
	);
}
