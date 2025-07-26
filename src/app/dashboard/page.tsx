import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";

export default async function Dashboard() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
				<h1 className="font-extrabold text-5xl tracking-tight">
					<span className="text-[hsl(280,100%,70%)]">Dashboard</span>
				</h1>

				<div className="w-full max-w-2xl space-y-8">
					<div className="rounded-xl bg-white/10 p-6">
						<h2 className="mb-4 font-bold text-2xl">Account Information</h2>
						<div className="space-y-2 text-white/80">
							<p>
								<span className="font-semibold">Email:</span>{" "}
								{session.user?.email}
							</p>
							<p>
								<span className="font-semibold">User ID:</span>{" "}
								{session.user?.id}
							</p>
							<p>
								<span className="font-semibold">Name:</span>{" "}
								{session.user?.name || "Not set"}
							</p>
						</div>
					</div>

					<div className="rounded-xl bg-white/10 p-6">
						<h2 className="mb-4 font-bold text-2xl">Your Habits</h2>
						<p className="text-white/60">Habit tracking coming soon...</p>
					</div>

					<div className="flex justify-center gap-4">
						<Link
							href="/"
							className="rounded-full bg-white/10 px-8 py-3 font-semibold no-underline transition hover:bg-white/20"
						>
							Back to Home
						</Link>
						<Link
							href="/api/auth/signout"
							className="rounded-full bg-white/10 px-8 py-3 font-semibold no-underline transition hover:bg-white/20"
						>
							Sign out
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
