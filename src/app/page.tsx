import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
	const session = await auth();

	// Redirect authenticated users to dashboard
	if (session) {
		redirect("/dashboard");
	}

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FEFEFE] to-[#E2E2E2] text-gray-900">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
						Welcome to <span className="text-black">Voikup</span>
					</h1>

					<div className="flex flex-col items-center gap-6">
						<p className="text-gray-700 text-xl">
							Your AI-powered accountability partner for better habits
						</p>
						<Link
							href="/auth/signin"
							className="rounded-full bg-[var(--color-accent-orange)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[var(--color-accent-orange-dark)]"
						>
							Get Started
						</Link>
					</div>

					<div className="mt-16 text-center text-gray-600">
						<p className="text-sm">
							Test the authentication by clicking "Get Started" above
						</p>
						<p className="text-sm">
							Magic link URLs will appear in your terminal console
						</p>
					</div>
				</div>
			</main>
		</HydrateClient>
	);
}
