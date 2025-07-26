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
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
				<h1 className="font-extrabold text-5xl tracking-tight">
					Sign in to <span className="text-[hsl(280,100%,70%)]">Voikup</span>
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
						className="rounded-lg bg-white/10 px-4 py-3 text-white placeholder:text-white/50"
					/>
					<button
						type="submit"
						disabled={loading}
						className="rounded-lg bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
					>
						{loading ? "Sending..." : "Send Magic Link"}
					</button>
				</form>
			</div>
		</main>
	);
}
