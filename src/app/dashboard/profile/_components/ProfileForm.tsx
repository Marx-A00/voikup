"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/trpc/react";

const profileSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(50, "Name must be 50 characters or less")
		.trim(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
	user: {
		id: string;
		email: string | null;
		name: string | null;
		image: string | null;
		emailVerified: Date | null;
	};
}

export function ProfileForm({ user }: ProfileFormProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const utils = api.useUtils();

	const { mutate: updateProfile, isPending } =
		api.user.updateProfile.useMutation({
			onSuccess: async () => {
				setMessage({ type: "success", text: "Profile updated successfully!" });
				setIsEditing(false);
				await utils.user.getProfile.invalidate();
				setTimeout(() => setMessage(null), 3000);
			},
			onError: (error) => {
				setMessage({
					type: "error",
					text: error.message || "Failed to update profile",
				});
				setTimeout(() => setMessage(null), 5000);
			},
		});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user.name || "",
		},
	});

	const onSubmit = (data: ProfileFormData) => {
		updateProfile(data);
	};

	const handleCancel = () => {
		reset({ name: user.name || "" });
		setIsEditing(false);
		setMessage(null);
	};

	return (
		<div className="space-y-6">
			{/* Success/Error Message */}
			{message && (
				<div
					className={`rounded-lg p-4 ${
						message.type === "success"
							? "bg-green-500/20 text-green-300"
							: "bg-red-500/20 text-red-300"
					}`}
				>
					{message.text}
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Email (read-only) */}
				<div>
					<label
						htmlFor="email"
						className="mb-2 block font-medium text-gray-900/90 text-sm"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						value={user.email || ""}
						readOnly
						className="w-full rounded-lg border border-gray-200 bg-[var(--color-main)]/20 px-4 py-3 text-gray-600"
					/>
					<p className="mt-1 text-gray-900/50 text-sm">
						Email cannot be changed for security reasons
					</p>
				</div>

				{/* Name */}
				<div>
					<label
						htmlFor="name"
						className="mb-2 block font-medium text-gray-900/90 text-sm"
					>
						Name
					</label>
					<input
						id="name"
						type="text"
						{...register("name")}
						disabled={!isEditing || isPending}
						className="w-full rounded-lg border border-gray-200 bg-[var(--color-main)]/20 px-4 py-3 text-gray-900 placeholder:text-gray-500 disabled:bg-[var(--color-main)]/20 disabled:text-gray-400"
						placeholder="Enter your name"
					/>
					{errors.name && (
						<p className="mt-1 text-red-400 text-sm">{errors.name.message}</p>
					)}
				</div>

				{/* Account Created */}
				<div>
					<p className="mb-2 font-medium text-gray-900/90 text-sm">
						Account Created
					</p>
					<p className="text-gray-600">
						{user.emailVerified
							? format(new Date(user.emailVerified), "MMMM d, yyyy")
							: "Not verified"}
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3">
					{!isEditing ? (
						<button
							type="button"
							onClick={() => setIsEditing(true)}
							className="rounded-lg bg-[var(--color-accent-orange)] px-6 py-2 font-medium text-white transition hover:bg-[var(--color-accent-orange-dark)]"
						>
							Edit Profile
						</button>
					) : (
						<>
							<button
								type="submit"
								disabled={isPending}
								className="rounded-lg bg-[var(--color-accent-orange)] px-6 py-2 font-medium text-white transition hover:bg-[var(--color-accent-orange-dark)] disabled:opacity-50"
							>
								{isPending ? "Saving..." : "Save Changes"}
							</button>
							<button
								type="button"
								onClick={handleCancel}
								disabled={isPending}
								className="rounded-lg bg-[var(--color-main)]/20 px-6 py-2 font-medium text-gray-900 transition hover:bg-[var(--color-main)]/30 disabled:opacity-50"
							>
								Cancel
							</button>
						</>
					)}
				</div>
			</form>
		</div>
	);
}
