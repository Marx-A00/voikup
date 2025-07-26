import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

import { ProfileWrapper } from "./_components/ProfileWrapper";

export default async function ProfilePage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<HydrateClient>
			<div className="space-y-8 text-gray-900">
				<div>
					<h1 className="font-bold text-3xl lg:text-4xl">Profile</h1>
					<p className="mt-2 text-gray-600">Manage your personal information</p>
				</div>

				<div className="rounded-xl border border-gray-200 bg-[var(--color-main)]/20 p-6 lg:p-8">
					<ProfileWrapper />
				</div>
			</div>
		</HydrateClient>
	);
}
