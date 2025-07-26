import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function BillingPage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className="space-y-8 text-gray-900">
			<div>
				<h1 className="font-bold text-3xl lg:text-4xl">Billing</h1>
				<p className="mt-2 text-gray-600">
					Manage your subscription and payment methods
				</p>
			</div>

			<div className="rounded-xl border border-gray-200 bg-[var(--color-main)]/20 p-6">
				<h2 className="mb-4 font-semibold text-xl">Subscription Status</h2>
				<p className="text-gray-600">
					Billing and subscription management will be available in Phase 5
				</p>
			</div>
		</div>
	);
}
