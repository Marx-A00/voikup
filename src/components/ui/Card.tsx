import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	variant?: "default" | "hover" | "interactive";
	padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
	children,
	className = "",
	variant = "default",
	padding = "md",
	...props
}: CardProps) {
	const baseClasses = "rounded-xl backdrop-blur-sm border border-gray-200";

	const variantClasses = {
		default: "bg-[var(--color-main)]/20 text-gray-900",
		hover:
			"bg-[var(--color-main)]/20 text-gray-900 transition-all hover:bg-[var(--color-main)]/30",
		interactive:
			"bg-[var(--color-main)]/20 text-gray-900 transition-all hover:bg-[var(--color-main)]/30 hover:shadow-lg hover:shadow-black/10",
	};

	const paddingClasses = {
		none: "",
		sm: "p-4",
		md: "p-6",
		lg: "p-8",
	};

	return (
		<div
			className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}
