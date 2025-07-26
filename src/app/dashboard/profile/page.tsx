import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className="space-y-8 text-white">
			<div>
				<h1 className="font-bold text-3xl lg:text-4xl">Profile</h1>
				<p className="mt-2 text-white/70">Manage your personal information</p>
			</div>

			<div className="rounded-xl bg-white/10 p-6">
				<p className="text-white/70">Profile management coming soon...</p>
			</div>
		</div>
	);
}
