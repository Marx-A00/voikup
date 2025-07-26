"use client";

import {
	Bars3Icon,
	Cog6ToothIcon,
	CreditCardIcon,
	HomeIcon,
	UserIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
	name: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
	{ name: "Home", href: "/dashboard", icon: HomeIcon },
	{ name: "Profile", href: "/dashboard/profile", icon: UserIcon },
	{ name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
	{ name: "Billing", href: "/dashboard/billing", icon: CreditCardIcon },
];

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex min-h-screen bg-gradient-to-b from-[#FEFEFE] to-[#E2E2E2]">
			{/* Mobile sidebar backdrop */}
			{sidebarOpen && (
				<button
					type="button"
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
					aria-label="Close sidebar"
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 transform border-gray-200 border-r bg-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex h-full flex-col">
					{/* Logo/Title */}
					<div className="flex h-16 items-center justify-between px-6">
						<Link href="/dashboard" className="flex items-center">
							<span className="font-bold text-2xl text-black">Voikup</span>
						</Link>
						<button
							type="button"
							className="lg:hidden"
							onClick={() => setSidebarOpen(false)}
						>
							<XMarkIcon className="h-6 w-6 text-gray-600" />
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-1 px-3 py-4">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors ${
										isActive
											? "bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)]"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
									}`}
									onClick={() => setSidebarOpen(false)}
								>
									<item.icon className="h-5 w-5" />
									{item.name}
								</Link>
							);
						})}
					</nav>

					{/* Sign out link */}
					<div className="border-gray-200 border-t p-3">
						<Link
							href="/api/auth/signout"
							className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
						>
							Sign out
						</Link>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="flex flex-1 flex-col">
				{/* Mobile header */}
				<div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-gray-200 border-b bg-white px-4 lg:hidden">
					<button
						type="button"
						className="text-gray-600"
						onClick={() => setSidebarOpen(true)}
					>
						<Bars3Icon className="h-6 w-6" />
					</button>
					<div className="flex-1">
						<span className="font-bold text-black text-xl">Voikup</span>
					</div>
				</div>

				{/* Page content */}
				<main className="flex-1 p-4 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
