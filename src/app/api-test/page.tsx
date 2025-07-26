"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { useState } from "react";

export default function ApiTest() {
	const [name, setName] = useState("");

	// Queries
	const session = api.auth.getSession.useQuery();
	const currentUser = api.auth.getCurrentUser.useQuery(undefined, {
		enabled: !!session.data?.user,
	});
	const healthCheck = api.health.check.useQuery();
	const userStats = api.user.getStats.useQuery(undefined, {
		enabled: !!session.data?.user,
	});

	// Mutations
	const updateProfile = api.user.updateProfile.useMutation({
		onSuccess: () => {
			currentUser.refetch();
			setName("");
		},
	});

	return (
		<main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white">
			<div className="container max-w-4xl">
				<h1 className="mb-8 font-extrabold text-4xl">
					tRPC API <span className="text-[hsl(280,100%,70%)]">Test Page</span>
				</h1>

				{/* Health Check */}
				<div className="mb-8 rounded-xl bg-white/10 p-6">
					<h2 className="mb-4 font-bold text-2xl">Health Check</h2>
					{healthCheck.isLoading ? (
						<p>Loading...</p>
					) : healthCheck.error ? (
						<p className="text-red-400">Error: {healthCheck.error.message}</p>
					) : (
						<div className="space-y-2">
							<p>
								Status:{" "}
								<span className="text-green-400">
									{healthCheck.data?.status}
								</span>
							</p>
							<p>
								Database:{" "}
								<span className="text-green-400">
									{healthCheck.data?.database}
								</span>
							</p>
							<p>Timestamp: {healthCheck.data?.timestamp}</p>
						</div>
					)}
				</div>

				{/* Session Info */}
				<div className="mb-8 rounded-xl bg-white/10 p-6">
					<h2 className="mb-4 font-bold text-2xl">Session Info</h2>
					{session.isLoading ? (
						<p>Loading...</p>
					) : session.data?.user ? (
						<div className="space-y-2">
							<p>
								Logged in as:{" "}
								<span className="font-semibold">{session.data.user.email}</span>
							</p>
							<p>User ID: {session.data.user.id}</p>
						</div>
					) : (
						<div>
							<p className="mb-4">Not logged in</p>
							<Link
								href="/auth/signin"
								className="inline-block rounded-lg bg-[hsl(280,100%,70%)] px-6 py-2 font-semibold text-white transition hover:bg-[hsl(280,100%,60%)]"
							>
								Sign In
							</Link>
						</div>
					)}
				</div>

				{/* User Profile (Protected) */}
				{session.data?.user && (
					<div className="mb-8 rounded-xl bg-white/10 p-6">
						<h2 className="mb-4 font-bold text-2xl">User Profile</h2>
						{currentUser.isLoading ? (
							<p>Loading...</p>
						) : currentUser.error ? (
							<p className="text-red-400">Error: {currentUser.error.message}</p>
						) : currentUser.data ? (
							<div className="space-y-4">
								<div className="space-y-2">
									<p>Email: {currentUser.data.email}</p>
									<p>Name: {currentUser.data.name || "Not set"}</p>
									<p>
										Verified: {currentUser.data.emailVerified ? "Yes" : "No"}
									</p>
								</div>

								<div className="flex items-end gap-2">
									<div className="flex-1">
										<label htmlFor="update-name" className="mb-1 block text-sm">
											Update Name:
										</label>
										<input
											id="update-name"
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="Enter new name"
											className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder:text-white/50"
										/>
									</div>
									<button
										type="button"
										onClick={() => updateProfile.mutate({ name })}
										disabled={!name || updateProfile.isPending}
										className="rounded-lg bg-[hsl(280,100%,70%)] px-6 py-2 font-semibold text-white transition hover:bg-[hsl(280,100%,60%)] disabled:opacity-50"
									>
										{updateProfile.isPending ? "Updating..." : "Update"}
									</button>
								</div>
							</div>
						) : null}
					</div>
				)}

				{/* User Stats (Protected) */}
				{session.data?.user && (
					<div className="mb-8 rounded-xl bg-white/10 p-6">
						<h2 className="mb-4 font-bold text-2xl">User Stats</h2>
						{userStats.isLoading ? (
							<p>Loading...</p>
						) : userStats.error ? (
							<p className="text-red-400">Error: {userStats.error.message}</p>
						) : userStats.data ? (
							<div className="space-y-2">
								<p>Active Sessions: {userStats.data.sessionCount}</p>
								<p>Posts Created: {userStats.data.postCount}</p>
								<p>
									Account Created:{" "}
									{new Date(userStats.data.accountCreated).toLocaleDateString()}
								</p>
							</div>
						) : null}
					</div>
				)}

				<Link
					href="/"
					className="inline-block rounded-full bg-white/10 px-8 py-3 font-semibold no-underline transition hover:bg-white/20"
				>
					Back to Home
				</Link>
			</div>
		</main>
	);
}
