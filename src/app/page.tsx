import Link from "next/link";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
	const session = await auth();

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
						Welcome to <span className="text-[hsl(280,100%,70%)]">Voikup</span>
					</h1>

					{!session ? (
						<div className="flex flex-col items-center gap-6">
							<p className="text-white/80 text-xl">
								Your AI-powered accountability partner for better habits
							</p>
							<Link
								href="/auth/signin"
								className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[hsl(280,100%,60%)]"
							>
								Get Started
							</Link>
						</div>
					) : (
						<div className="flex flex-col items-center gap-6">
							<div className="text-center">
								<p className="mb-2 text-2xl text-white">
									Welcome back,{" "}
									<span className="font-bold">{session.user?.email}</span>!
								</p>
								<p className="text-white/60">User ID: {session.user?.id}</p>
							</div>

							<div className="flex flex-wrap justify-center gap-4">
								<Link
									href="/dashboard"
									className="rounded-full bg-[hsl(280,100%,70%)] px-8 py-3 font-semibold text-white no-underline transition hover:bg-[hsl(280,100%,60%)]"
								>
									Go to Dashboard
								</Link>
								<Link
									href="/api-test"
									className="rounded-full bg-[hsl(280,100%,70%)] px-8 py-3 font-semibold text-white no-underline transition hover:bg-[hsl(280,100%,60%)]"
								>
									Test API
								</Link>
								<Link
									href="/api/auth/signout"
									className="rounded-full bg-white/10 px-8 py-3 font-semibold no-underline transition hover:bg-white/20"
								>
									Sign out
								</Link>
							</div>
						</div>
					)}

					<div className="mt-16 text-center text-white/60">
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
