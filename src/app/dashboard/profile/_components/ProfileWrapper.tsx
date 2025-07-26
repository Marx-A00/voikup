"use client";

import { api } from "@/trpc/react";

import { ProfileForm } from "./ProfileForm";
import { ProfileSkeleton } from "./ProfileSkeleton";

export function ProfileWrapper() {
	const {
		data: userProfile,
		isLoading,
		error,
	} = api.user.getProfile.useQuery();

	if (isLoading) {
		return <ProfileSkeleton />;
	}

	if (error) {
		return (
			<div className="rounded-lg bg-red-500/20 p-4 text-red-300">
				<p className="font-medium">Failed to load profile</p>
				<p className="mt-1 text-sm">{error.message}</p>
			</div>
		);
	}

	if (!userProfile) {
		return (
			<div className="text-gray-600">
				<p>No profile data available</p>
			</div>
		);
	}

	return <ProfileForm user={userProfile} />;
}
