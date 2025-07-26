"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await signIn("email", { email, callbackUrl: "/dashboard" });
		} catch (error) {
			console.error("Sign in error:", error);
			setLoading(false);
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FEFEFE] to-[#E2E2E2] text-gray-900">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
				<h1 className="font-extrabold text-5xl tracking-tight">
					Sign in to <span className="text-black">Voikup</span>
				</h1>
				<form
					onSubmit={handleSubmit}
					className="flex w-full max-w-md flex-col gap-4"
				>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
						required
						className="rounded-lg border border-gray-200 bg-[var(--color-main)]/20 px-4 py-3 text-gray-900 placeholder:text-gray-500"
					/>
					<button
						type="submit"
						disabled={loading}
						className="rounded-lg bg-[var(--color-accent-orange)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-accent-orange-dark)] disabled:opacity-50"
					>
						{loading ? "Sending..." : "Send Magic Link"}
					</button>
				</form>
			</div>
		</main>
	);
}
