"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthError() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FEFEFE] to-[#E2E2E2] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
				<h1 className="font-extrabold text-5xl tracking-tight">
					Authentication{" "}
					<span className="text-[var(--color-primary)]">Error</span>
				</h1>
				<div className="max-w-md space-y-4">
					<p className="text-xl">
						{error === "Verification"
							? "The sign in link is invalid or has expired."
							: "An error occurred during authentication."}
					</p>
					<Link
						href="/auth/signin"
						className="inline-block rounded-lg bg-white/10 px-6 py-3 font-semibold transition hover:bg-white/20"
					>
						Try Again
					</Link>
				</div>
			</div>
		</main>
	);
}
